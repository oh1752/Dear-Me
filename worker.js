export default {
  async scheduled(event, env, ctx) {
    console.log("Starting scheduled capsule check...");
    await processCapsules(env);
  },

  // Also allow manual trigger via HTTP for testing
  async fetch(request, env, ctx) {
    if (request.url.endsWith("/test-mail")) {
      console.log("Manual trigger: Processing capsules...");
      const result = await processCapsules(env);
      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response("Dear Me Worker is running.");
  }
};

async function processCapsules(env) {
  const { FIREBASE_PROJECT_ID, RESEND_API_KEY, APP_URL } = env;
  const now = new Date().toISOString();

  // 1. Query Firestore for due and unsent capsules
  // Using structuredQuery via REST API
  const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents:runQuery`;
  
  const query = {
    structuredQuery: {
      from: [{ collectionId: "capsules" }],
      where: {
        compositeFilter: {
          op: "AND",
          filters: [
            {
              fieldFilter: {
                field: { fieldPath: "is_sent" },
                op: "EQUAL",
                value: { booleanValue: false }
              }
            },
            {
              fieldFilter: {
                field: { fieldPath: "unlock_date" },
                op: "LESS_THAN_OR_EQUAL",
                value: { timestampValue: now }
              }
            }
          ]
        }
      }
    }
  };

  try {
    const response = await fetch(firestoreUrl, {
      method: "POST",
      body: JSON.stringify(query),
    });

    const results = await response.json();
    console.log(`Found ${results.length} potential capsules to send.`);

    let sentCount = 0;
    for (const res of results) {
      if (!res.document) continue;

      const doc = res.document;
      const docId = doc.name.split("/").pop();
      const fields = doc.fields;
      
      const email = fields.email.stringValue;
      const unlockDate = fields.unlock_date.timestampValue;
      
      // 2. Send Email via Resend
      const emailRes = await sendEmail(email, docId, RESEND_API_KEY, APP_URL);
      
      if (emailRes.ok) {
        // 3. Update is_sent to true in Firestore
        await updateSentStatus(FIREBASE_PROJECT_ID, docId);
        sentCount++;
        console.log(`Successfully sent capsule ${docId} to ${email}`);
      } else {
        console.error(`Failed to send email for ${docId}:`, await emailRes.text());
      }
    }

    return { status: "success", sentCount };
  } catch (error) {
    console.error("Error processing capsules:", error);
    return { status: "error", error: error.message };
  }
}

async function sendEmail(email, docId, apiKey, appUrl) {
  const resendUrl = "https://api.resend.com/emails";
  const capsuleUrl = `${appUrl || "https://dear-me.pages.dev"}/?id=${docId}`;

  return await fetch(resendUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "Dear Me <onboarding@resend.dev>", // Replace with your verified domain
      to: [email],
      subject: "[Dear Me] 과거의 당신으로부터 도착한 선물입니다.",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #5d4037;">과거의 진심이 도착했습니다.</h2>
          <p>안녕하세요, 약속한 날짜가 되어 당신이 과거에 밀봉했던 편지가 열렸습니다.</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${capsuleUrl}" style="background-color: #8c7a6b; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">편지 확인하러 가기</a>
          </div>
          <p style="color: #888; font-size: 0.9em;">이 링크는 본인만 확인할 수 있도록 소중히 보관해 주세요.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 0.8em; color: #aaa;">Dear Me - 당신의 오늘을 미래로 보냅니다.</p>
        </div>
      `
    })
  });
}

async function updateSentStatus(projectId, docId) {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/capsules/${docId}?updateMask.fieldPaths=is_sent`;
  
  await fetch(url, {
    method: "PATCH",
    body: JSON.stringify({
      fields: {
        is_sent: { booleanValue: true }
      }
    })
  });
}
