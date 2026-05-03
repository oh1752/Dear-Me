/**
 * Dear Me V2: Future Self Time Capsule
 * Role: 10-year experienced life planner and emotional therapist.
 * Tone: Professional, warm, encouraging, and sophisticated.
 */

// Firebase Configuration (Placeholder - User should replace with their own)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
if (typeof firebase !== 'undefined') {
  firebase.initializeApp(firebaseConfig);
  var db = firebase.firestore();
}

class DearMeApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.applyAdaptiveGreeting();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          max-width: 600px;
          width: 90%;
          margin: 40px auto;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 30px;
          padding: 60px 40px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.05);
          text-align: center;
          font-family: 'Noto Sans KR', sans-serif;
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.3);
          animation: fadeIn 1s ease-out;
        }

        /* Vibe-driven Background Texture */
        :host::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-image: url("https://www.transparenttextures.com/patterns/natural-paper.png");
          opacity: 0.03;
          pointer-events: none;
          border-radius: 30px;
        }

        .header {
          margin-bottom: 40px;
        }

        .icon {
          font-size: 3.5rem;
          margin-bottom: 20px;
          filter: drop-shadow(0 5px 15px rgba(140, 122, 107, 0.2));
          display: inline-block;
          animation: float 4s ease-in-out infinite;
        }

        h1 {
          font-family: 'Noto Serif KR', serif;
          color: #4a4a4a;
          font-size: 2.2rem;
          margin: 0 0 10px 0;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .greeting {
          font-family: 'Noto Serif KR', serif;
          font-size: 1.15rem;
          line-height: 1.6;
          color: #8c7a6b;
          margin-bottom: 40px;
          padding: 0 20px;
        }

        .workspace {
          display: flex;
          flex-direction: column;
          gap: 25px;
          text-align: left;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        label {
          font-family: 'Noto Serif KR', serif;
          font-weight: 500;
          color: #555;
          font-size: 1rem;
          margin-left: 5px;
        }

        textarea {
          width: 100%;
          min-height: 200px;
          padding: 25px;
          border: none;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.8);
          font-family: 'Noto Sans KR', sans-serif;
          font-size: 1.05rem;
          line-height: 1.8;
          resize: none;
          box-sizing: border-box;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          box-shadow: inset 0 2px 10px rgba(0,0,0,0.02);
          color: #333;
        }

        textarea:focus {
          outline: none;
          background: #fff;
          box-shadow: 0 10px 30px rgba(140, 122, 107, 0.1);
          transform: translateY(-2px);
        }

        textarea::placeholder {
          color: #bbb;
          font-style: italic;
        }

        .date-input-wrapper {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 10px;
        }

        input[type="date"] {
          padding: 15px 20px;
          border-radius: 15px;
          border: 1px solid rgba(140, 122, 107, 0.2);
          background: rgba(255, 255, 255, 0.6);
          font-family: 'Noto Sans KR', sans-serif;
          font-size: 1rem;
          color: #555;
          cursor: pointer;
          transition: all 0.3s;
        }

        input[type="date"]:focus {
          outline: none;
          border-color: #8c7a6b;
          background: #fff;
        }

        .action-button {
          background-color: #8c7a6b;
          color: white;
          border: none;
          padding: 20px 40px;
          font-size: 1.15rem;
          border-radius: 40px;
          cursor: pointer;
          font-family: 'Noto Serif KR', serif;
          font-weight: 500;
          transition: all 0.4s;
          box-shadow: 0 10px 25px rgba(140, 122, 107, 0.3);
          margin-top: 20px;
          position: relative;
          overflow: hidden;
        }

        .action-button:hover {
          background-color: #7a6859;
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(140, 122, 107, 0.4);
        }

        .action-button:active {
          transform: translateY(0);
        }

        .success-state {
          display: none;
          animation: fadeIn 1s ease-out;
        }

        .success-icon {
          font-size: 4rem;
          margin-bottom: 20px;
          display: block;
        }

        .success-title {
          font-family: 'Noto Serif KR', serif;
          font-size: 1.8rem;
          color: #4a4a4a;
          margin-bottom: 15px;
        }

        .success-text {
          color: #8c7a6b;
          line-height: 1.8;
          font-size: 1.1rem;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }

        .hidden {
          display: none;
        }

        /* Suggestions box */
        #suggestion-area {
          margin-bottom: 20px;
        }
        
        .suggestion-box {
          background: rgba(140, 122, 107, 0.05);
          padding: 20px;
          border-radius: 20px;
          border: 1px solid rgba(140, 122, 107, 0.1);
          text-align: left;
        }

        .suggestion-box h4 {
          margin: 0 0 15px 0;
          font-family: 'Noto Serif KR', serif;
          font-size: 1rem;
          color: #8c7a6b;
        }

        .suggestion-item {
          font-size: 0.95rem;
          color: #666;
          padding: 10px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          line-height: 1.5;
        }

        .suggestion-item:hover {
          background: #fff;
          color: #8c7a6b;
          transform: translateX(5px);
        }
      </style>

      <div id="main-content">
        <div class="header">
          <div class="icon">✉️✨</div>
          <h1>Dear Me</h1>
        </div>

        <div class="greeting" id="greeting-text">
          당신의 개인 플래너가 소중한 기록을 위해 기다리고 있습니다.
        </div>

        <div id="suggestion-area"></div>

        <div class="workspace">
          <div class="input-group">
            <label for="gift-message">미래의 나에게 줄 선물</label>
            <textarea id="gift-message" placeholder="오늘의 마음, 혹은 다짐을 사랑을 담아 적어보세요."></textarea>
          </div>

          <div class="input-group">
            <label for="unlock-date">이 선물을 언제 열어 볼까요?</label>
            <div class="date-input-wrapper">
              <input type="date" id="unlock-date" />
            </div>
          </div>

          <button class="action-button" id="seal-btn">
            사랑을 담아 밀봉하기
          </button>
        </div>
      </div>

      <div class="success-state" id="success-state">
        <span class="success-icon">🕯️📜</span>
        <div class="success-title">순간이 밀봉되었습니다.</div>
        <div class="success-text">
          당신이 보낸 따뜻한 마음은Firestore에 안전하게 보관되었습니다.<br>
          약속한 시간이 되면 과거의 당신으로부터 선물이 도착할 것입니다.
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    const sealBtn = this.shadowRoot.getElementById('seal-btn');
    const msgInput = this.shadowRoot.getElementById('gift-message');
    const unlockInput = this.shadowRoot.getElementById('unlock-date');
    const mainContent = this.shadowRoot.getElementById('main-content');
    const successState = this.shadowRoot.getElementById('success-state');
    const suggestionArea = this.shadowRoot.getElementById('suggestion-area');

    sealBtn.addEventListener('click', async () => {
      const message = msgInput.value.trim();
      const unlockDate = unlockInput.value;

      if (!message) {
        alert("미래의 나에게 보낼 메시지를 입력해주세요.");
        return;
      }
      if (!unlockDate) {
        alert("선물을 열어볼 날짜를 선택해주세요.");
        return;
      }

      const capsule = {
        uid: "anonymous", // Placeholder for actual auth
        content: message,
        created_at: new Date(),
        unlock_date: new Date(unlockDate),
        is_opened: false
      };

      try {
        console.log("Sealing capsule:", capsule);
        
        // Firestore Save Logic
        if (typeof db !== 'undefined') {
          await db.collection("capsules").add(capsule);
        } else {
          console.warn("Firebase not initialized. Simulating save...");
        }

        // Show Success UI
        mainContent.style.display = 'none';
        successState.style.display = 'block';

      } catch (error) {
        console.error("Error sealing capsule:", error);
        alert("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    });

    // Handle suggested clicks
    this.shadowRoot.addEventListener('click', (e) => {
      const item = e.target.closest('.suggestion-item');
      if (item) {
        msgInput.value = item.textContent;
        msgInput.focus();
      }
    });
  }

  applyAdaptiveGreeting() {
    const greetingEl = this.shadowRoot.getElementById('greeting-text');
    const suggestionArea = this.shadowRoot.getElementById('suggestion-area');
    const now = new Date();
    const day = now.getDay(); // 0: Sun, 1: Mon...
    const hours = now.getHours();
    const date = now.getDate();

    // 1st Day of Month
    if (date === 1) {
      greetingEl.textContent = "새로운 달이 시작되었습니다. 이번 달에 당신이 피워낼 꽃은 어떤 향기를 담고 있을까요? 새달의 목표를 미래로 보내보세요.";
      this.renderSuggestions(suggestionArea, "새로운 시작의 제안", [
        "이번 달에는 평소보다 조금 더 나 자신을 사랑해보기",
        "새로운 계절을 맞이하며 꼭 이루고 싶은 [작은 목표] 하나 기록하기",
        "한 달 뒤의 내가 웃으며 읽을 수 있는 오늘의 설렘 기록하기"
      ]);
      return;
    }

    // Sunday Evening (after 5 PM)
    if (day === 0 && hours >= 17) {
      greetingEl.textContent = "일요일 저녁은 온전한 쉼을 위한 시간입니다. 월요병이 걱정된다면, 미래의 나에게 가벼운 위로와 다음 주의 작은 기쁨을 선물해보세요.";
      this.renderSuggestions(suggestionArea, "평온한 한 주를 위한 제안", [
        "내일 아침 나를 미소 짓게 할 아주 작은 보상 하나 정해두기",
        "이번 주 수요일, 나를 위해 준비할 작은 선물 미리 기록하기",
        "충분한 휴식을 취하고 있는 나에게 보내는 따뜻한 응원"
      ]);
      return;
    }

    // Default
    greetingEl.textContent = "안녕하세요, 당신의 감성 테라피스트입니다. 미래의 당신은 어떤 모습인가요? 지금의 진심을 담아 선물을 보내보세요.";
  }

  renderSuggestions(area, title, phrases) {
    area.innerHTML = `
      <div class="suggestion-box">
        <h4>✨ ${title}</h4>
        ${phrases.map(p => `<div class="suggestion-item">${p}</div>`).join('')}
      </div>
    `;
  }
}

customElements.define('dear-me-app', DearMeApp);
