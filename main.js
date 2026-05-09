// Firebase Configuration - Replace with your actual project config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "jason-text-1-44153374-26bf1",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
let db;
try {
  if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
  }
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

class DearMeApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.quotes = [
      "자, 레디... 액션! 미래의 당신이 보며 미소 지을 수 있도록, 오늘의 진심을 '테이크 1'에 담아보세요.",
      "인생이라는 대작에 NG란 없습니다. 지금 이 서툰 문장조차 훗날 가장 아름다운 미장센이 될 거예요.",
      "세상이라는 거친 현장에서 잠시 내려와, 오직 당신만을 위한 '디렉터스 컷'을 기록할 시간입니다.",
      "어제는 역사이고 내일은 미스터리이며, 오늘은 선물입니다. 그래서 'Present'라고 부르죠.",
      "미래를 예측하는 가장 좋은 방법은 미래를 직접 창조하는 것입니다.",
      "가장 개인적인 것이 가장 창의적인 것입니다. 당신의 오늘을 영화의 한 장면처럼 기록해볼까요?",
      "오늘 당신이 심은 작은 다짐이, 10년 뒤 숲을 이룰 마스터피스의 시작이 됩니다."
    ];
    this.quoteInterval = null;
    
    this.categories = [
      {
        id: 'warm',
        name: '🌅 따뜻한 느낌',
        images: [
          "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=800&q=80", 
          "https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=800&q=80", 
          "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80", 
          "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80", 
          "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=800&q=80"
        ]
      },
      {
        id: 'anime',
        name: '🎨 애니메이션 느낌',
        images: [
          "https://images.unsplash.com/photo-1578632738908-45244a39fe9e?auto=format&fit=crop&w=800&q=80", 
          "https://images.unsplash.com/photo-1528164344705-47542687990d?auto=format&fit=crop&w=800&q=80", 
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", 
          "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80", 
          "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=800&q=80"
        ]
      },
      {
        id: 'bright',
        name: '✨ 밝은색 느낌',
        images: [
          "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&q=80", 
          "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80", 
          "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80", 
          "https://images.unsplash.com/photo-1554034483-04fda0d3507b?auto=format&fit=crop&w=800&q=80", 
          "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80"
        ]
      }
    ];

    this.selectedImageUrl = this.categories[0].images[0];
  }

  connectedCallback() {
    this.render();
    this.updateTheme();
    this.setupEventListeners();
    this.applyAdaptiveGreeting();
    this.setupQuoteGuide();
    this.handleUrlParams();
  }

  async handleUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const capsuleId = params.get('id');
    if (capsuleId) {
      this.showLoadingState();
      try {
        if (typeof db !== 'undefined') {
          const doc = await db.collection("capsules").doc(capsuleId).get();
          if (doc.exists) {
            const data = doc.data();
            this.displayCapsule(data);
          } else {
            alert("캡슐을 찾을 수 없습니다.");
            window.history.replaceState({}, '', window.location.pathname);
            window.location.reload();
          }
        } else {
          setTimeout(() => {
            this.displayCapsule({
              content: "이것은 미래의 당신에게 도착한 따뜻한 진심입니다.\n\n파이어베이스 연동 후에는 실제 작성하신 내용이 이곳에 아름답게 표시됩니다.",
              unlock_date: { toDate: () => new Date(Date.now() - 1000) },
              created_at: { toDate: () => new Date() },
              bg_image: this.categories[1].images[1]
            });
          }, 1500);
        }
      } catch (error) {
        console.error("Error fetching capsule:", error);
      }
    }
  }

  showLoadingState() {
    const mainContent = this.shadowRoot.getElementById('main-content');
    mainContent.innerHTML = `
      <div style="padding: 100px 0; text-align: center;">
        <div class="icon" style="font-size: 4rem;">⏳</div>
        <p style="color: var(--theme-muted); font-family: 'Noto Serif KR', serif; font-size: 1.2rem; margin-top: 20px;">진심을 불러오는 중입니다...</p>
      </div>
    `;
  }

  displayCapsule(data) {
    if (data.bg_image) {
      this.selectedImageUrl = data.bg_image;
      this.updateTheme();
    }
    const unlockDate = data.unlock_date.toDate ? data.unlock_date.toDate() : new Date(data.unlock_date);
    const now = new Date();
    if (now >= unlockDate) {
      this.renderOpenedLetter(data);
    } else {
      this.renderLockedLetter(unlockDate);
    }
  }

  renderOpenedLetter(data) {
    const mainContent = this.shadowRoot.getElementById('main-content');
    const createdAt = data.created_at.toDate ? data.created_at.toDate() : new Date(data.created_at);
    mainContent.innerHTML = `
      <div class="header" style="margin-top: 20px;">
        <div class="icon">📜✨</div>
        <h1>도착한 선물</h1>
      </div>
      <div class="greeting" style="font-style: italic; opacity: 0.7; margin-bottom: 30px;">
        ${createdAt.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}에 당신이 보낸 마음입니다.
      </div>
      <div class="opened-letter-container" style="
        background: rgba(255, 255, 255, 0.5);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        padding: 50px 40px;
        border-radius: 25px;
        border: 1px solid rgba(255, 255, 255, 0.4);
        text-align: left;
        line-height: 2.2;
        font-family: 'Noto Serif KR', serif;
        color: #2c2c2c;
        white-space: pre-wrap;
        margin-bottom: 50px;
        font-size: 1.15rem;
        box-shadow: 0 15px 40px rgba(0,0,0,0.08);
        animation: fadeIn 1.5s ease-out;
      ">
        ${data.content}
      </div>
      <button class="action-button" id="back-to-write-btn" style="margin-bottom: 40px;">
        나에게 새로운 편지 쓰기
      </button>
    `;
    this.shadowRoot.getElementById('back-to-write-btn').onclick = () => {
      window.history.replaceState({}, '', window.location.pathname);
      window.location.reload();
    };
  }

  renderLockedLetter(unlockDate) {
    const mainContent = this.shadowRoot.getElementById('main-content');
    const diff = unlockDate - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    mainContent.innerHTML = `
      <div class="header">
        <div class="icon">🔒🛡️</div>
        <h1>아직 밀봉되어 있습니다</h1>
      </div>
      <div class="greeting">
        이 선물은 <strong>${unlockDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>에 열어볼 수 있습니다.
      </div>
      <div style="margin: 60px 0;">
        <div style="font-size: 4rem; color: var(--theme-accent); font-weight: 700; letter-spacing: -2px;">D-${days}</div>
        <p style="color: var(--theme-muted); margin-top: 20px; font-size: 1.1rem;">조금만 더 기다려 주세요. 시간이 당신의 진심을 더 깊게 만들어 줄 거예요.</p>
      </div>
      <button class="action-button" id="back-to-write-locked-btn">
        돌아가기
      </button>
    `;
    this.shadowRoot.getElementById('back-to-write-locked-btn').onclick = () => {
      window.history.replaceState({}, '', window.location.pathname);
      window.location.reload();
    };
  }

  updateTheme() {
    const body = document.body;
    body.style.backgroundImage = `url('${this.selectedImageUrl}')`;
    body.style.backgroundSize = 'cover';
    body.style.backgroundPosition = 'center';
    body.style.backgroundAttachment = 'fixed';
    body.style.transition = 'background-image 0.8s ease-in-out';
    const host = this.shadowRoot.host;
    host.style.setProperty('--theme-bg', 'rgba(255, 255, 255, 0.75)');
    host.style.setProperty('--theme-text', '#333');
    host.style.setProperty('--theme-accent', '#5d4037');
    host.style.setProperty('--theme-muted', '#8c7a6b');
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --theme-bg: rgba(255, 255, 255, 0.75);
          --theme-accent: #8c7a6b;
          --theme-text: #333;
          --theme-muted: #8c7a6b;
          display: block;
          max-width: 600px; width: 90%;
          margin: 40px auto;
          background: var(--theme-bg);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border-radius: 35px;
          padding: 70px 50px;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.12);
          text-align: center;
          font-family: 'Noto Sans KR', sans-serif;
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.4);
          animation: fadeIn 1s ease-out;
          transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .menu-container { position: absolute; top: 30px; left: 30px; z-index: 100; }
        .menu-btn {
          background: white; border: none; font-size: 1.4rem; cursor: pointer; color: var(--theme-accent);
          width: 50px; height: 50px; border-radius: 50%; box-shadow: 0 8px 20px rgba(0,0,0,0.08);
          display: flex; align-items: center; justify-content: center; transition: all 0.3s;
        }
        .dropdown-menu {
          position: absolute; top: 110%; left: 0; background: white; border-radius: 20px;
          box-shadow: 0 15px 45px rgba(0,0,0,0.18); width: 280px; padding: 20px 0;
          display: none; flex-direction: column; text-align: left; border: 1px solid rgba(0,0,0,0.05); z-index: 1000;
        }
        .dropdown-menu.show { display: flex; }
        .menu-item { padding: 12px 25px; font-size: 0.95rem; color: #444; cursor: pointer; display: flex; align-items: center; gap: 12px; font-weight: 500; }
        .category-title { padding: 15px 25px 8px 25px; font-size: 0.8rem; color: #999; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; }
        .image-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; padding: 0 25px 15px 25px; }
        .image-option { aspect-ratio: 1; border-radius: 8px; background-size: cover; background-position: center; cursor: pointer; border: 2px solid transparent; transition: all 0.3s; }
        .image-option.active { border-color: var(--theme-accent); box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
        .header { margin-bottom: 50px; }
        .icon { font-size: 4rem; margin-bottom: 25px; animation: float 4s ease-in-out infinite; display: inline-block; }
        h1 { font-family: 'Noto Serif KR', serif; color: var(--theme-text); font-size: 2.5rem; margin: 0; font-weight: 700; }
        .greeting { font-family: 'Noto Serif KR', serif; font-size: 1.2rem; line-height: 1.7; color: var(--theme-text); opacity: 0.8; margin-bottom: 50px; padding: 0 20px; }
        .workspace { display: flex; flex-direction: column; gap: 30px; text-align: left; }
        .input-group { display: flex; flex-direction: column; gap: 12px; position: relative; }
        label { font-family: 'Noto Serif KR', serif; font-weight: 600; color: var(--theme-text); font-size: 1.05rem; }
        textarea, input[type="email"], input[type="date"], input[type="datetime-local"] { width: 100%; padding: 20px 25px; border: 1px solid rgba(0,0,0,0.05); border-radius: 20px; background: rgba(255, 255, 255, 0.9); font-family: 'Noto Sans KR', sans-serif; font-size: 1.1rem; box-sizing: border-box; color: #333; }
        textarea { min-height: 200px; resize: none; line-height: 1.9; }
        .action-button { background: var(--theme-accent); color: white; border: none; padding: 22px 50px; font-size: 1.2rem; border-radius: 50px; cursor: pointer; font-family: 'Noto Serif KR', serif; font-weight: 700; transition: all 0.4s; box-shadow: 0 15px 40px rgba(0,0,0,0.2); margin-top: 30px; }
        
        #quote-guide {
          position: absolute; top: 60px; left: 25px; right: 25px; pointer-events: none;
          color: #aaa; font-style: italic; line-height: 1.9; font-size: 1.1rem;
          opacity: 0; transition: opacity 0.5s;
        }
        #quote-guide.active { opacity: 1; }

        /* Modal Styles */
        .modal-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);
          display: none; align-items: center; justify-content: center; z-index: 2000;
        }
        .modal-overlay.show { display: flex; }
        .modal-content {
          background: white; padding: 40px; border-radius: 30px; max-width: 400px; width: 85%;
          text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.2);
          border: 1px solid rgba(255,255,255,0.8);
          animation: modalPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes modalPop { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .modal-content h3 { margin-bottom: 20px; color: var(--theme-accent); font-family: 'Noto Serif KR', serif; }
        .modal-content p { color: #555; line-height: 1.8; margin-bottom: 30px; font-size: 1.05rem; }
        .modal-btns { display: flex; gap: 15px; justify-content: center; }
        .modal-btn { 
          padding: 15px 30px; border-radius: 25px; border: none; cursor: pointer; 
          font-family: 'Noto Serif KR', serif; font-weight: 700; transition: 0.3s;
        }
        .confirm-btn { background: var(--theme-accent); color: white; }
        .cancel-btn { background: #f0f0f0; color: #777; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
        .hidden { display: none; }
        .success-state { display: none; }
      </style>
      <div class="menu-container">
        <button class="menu-btn" id="menu-toggle-btn">☰</button>
        <div class="dropdown-menu" id="side-menu">
          <div class="menu-item" style="border-bottom: 1px solid #eee; margin-bottom: 10px;"><span>🎨</span> 배경 테마 선택</div>
          ${this.categories.map(cat => `
            <div class="category-title">${cat.name}</div>
            <div class="image-grid">
              ${cat.images.map(img => `
                <div class="image-option ${this.selectedImageUrl === img ? 'active' : ''}" data-image="${img}" style="background-image: url('${img}')"></div>
              `).join('')}
            </div>
          `).join('')}
          <div class="menu-item" style="border-top: 1px solid #eee; margin-top: 10px;"><span>🔒</span> 기념일 잠금</div>
          <div class="menu-item"><span>💾</span> 백업 및 복원</div>
        </div>
      </div>
      <div id="main-content">
        <div class="header">
          <div class="icon">✉️✨</div>
          <h1>Dear Me</h1>
        </div>
        <div class="greeting" id="greeting-text">안녕하세요, 미래의 당신은 어떤 모습인가요?</div>
        <div style="text-align: center; margin-bottom: 30px;"><button class="toggle-btn" id="toggle-date-btn" style="background:none; border: 1px solid #ccc; padding: 10px 20px; border-radius: 20px; cursor:pointer; color:#888;">📅 오늘 요일 입력하기</button></div>
        <div class="date-input-section hidden" id="date-section" style="margin-bottom: 30px;"><input type="date" id="input-date"></div>
        <div class="workspace">
          <div class="input-group">
            <label for="gift-message">미래의 나에게 줄 선물</label>
            <div id="quote-guide"></div>
            <textarea id="gift-message" placeholder=""></textarea>
          </div>
          <div class="input-group"><label for="recipient-email">이메일 주소</label><input type="email" id="recipient-email" placeholder="메일 주소를 입력해 주세요." /></div>
          <div class="input-group"><label for="unlock-date">이 선물을 언제 열어 볼까요?</label><input type="datetime-local" id="unlock-date" /></div>
          <button class="action-button" id="seal-btn">편지를 보냅니다</button>
        </div>
      </div>

      <!-- Confirmation Modal -->
      <div class="modal-overlay" id="confirm-modal">
        <div class="modal-content">
          <div style="font-size: 3rem; margin-bottom: 15px;">🔒</div>
          <h3 id="modal-title">편지를 보냅니다</h3>
          <p id="modal-message"></p>
          <div class="modal-btns">
            <button class="modal-btn cancel-btn" id="modal-cancel">취소</button>
            <button class="modal-btn confirm-btn" id="modal-confirm">밀봉하기</button>
          </div>
        </div>
      </div>

      <div class="success-state" id="success-state">
        <span class="success-icon" style="font-size: 5rem;">🕯️📜</span>
        <h2 style="font-family: 'Noto Serif KR', serif; font-size: 2rem; margin: 30px 0 20px 0;">순간이 저장되었습니다.</h2>
        <p style="color: #666; line-height: 1.8;">작성하신 마음은 안전하게 보관되었습니다.<br>약속한 날짜에 입력하신 이메일로 링크가 도착할 것입니다.</p>
        <div style="margin-top: 40px;"><button class="action-button" id="copy-link-btn" style="width: 100%; max-width: 320px;">🔗 캡슐 링크 복사하기</button></div>
        <div style="margin-top: 25px;"><button class="action-button" id="reset-app-btn" style="background: none; color: #8c7a6b; border: 2px solid #8c7a6b; box-shadow: none;">처음으로 돌아가기</button></div>
      </div>
    `;
  }

  setupEventListeners() {
    const sealBtn = this.shadowRoot.getElementById('seal-btn');
    const msgInput = this.shadowRoot.getElementById('gift-message');
    const emailInput = this.shadowRoot.getElementById('recipient-email');
    const unlockInput = this.shadowRoot.getElementById('unlock-date');
    const mainContent = this.shadowRoot.getElementById('main-content');
    const successState = this.shadowRoot.getElementById('success-state');
    const menuToggleBtn = this.shadowRoot.getElementById('menu-toggle-btn');
    const sideMenu = this.shadowRoot.getElementById('side-menu');
    const toggleDateBtn = this.shadowRoot.getElementById('toggle-date-btn');
    const dateSection = this.shadowRoot.getElementById('date-section');

    const confirmModal = this.shadowRoot.getElementById('confirm-modal');
    const modalMessage = this.shadowRoot.getElementById('modal-message');
    const modalConfirm = this.shadowRoot.getElementById('modal-confirm');
    const modalCancel = this.shadowRoot.getElementById('modal-cancel');

    menuToggleBtn.addEventListener('click', (e) => { e.stopPropagation(); sideMenu.classList.toggle('show'); });
    document.addEventListener('click', () => sideMenu.classList.remove('show'));
    sideMenu.addEventListener('click', (e) => e.stopPropagation());

    this.shadowRoot.querySelectorAll('.image-option').forEach(opt => {
      opt.addEventListener('click', () => {
        this.selectedImageUrl = opt.dataset.image;
        this.updateTheme();
        this.shadowRoot.querySelectorAll('.image-option').forEach(i => i.classList.remove('active'));
        opt.classList.add('active');
      });
    });

    toggleDateBtn.addEventListener('click', () => {
      const isHidden = dateSection.classList.contains('hidden');
      dateSection.classList.toggle('hidden');
      toggleDateBtn.textContent = isHidden ? '닫기' : '📅 오늘 요일 입력하기';
    });

    sealBtn.addEventListener('click', () => {
      const message = msgInput.value.trim();
      const email = emailInput.value.trim();
      const unlockDateVal = unlockInput.value;

      if (!message || !email || !unlockDateVal) {
        alert("모든 필드를 입력해 주세요.");
        return;
      }

      alert("위에 입력한 날짜에 맞추어서 메일이 전달됩니다.");

      const dateObj = new Date(unlockDateVal);
      const year = dateObj.getFullYear();
      const month = dateObj.getMonth() + 1;
      const day = dateObj.getDate();
      const hour = dateObj.getHours();
      const minute = dateObj.getMinutes();

      modalMessage.innerHTML = `버튼을 누르면, <strong>${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분</strong>에<br><strong>${email}</strong> 주소로 메일이 전송됩니다.`;
      confirmModal.classList.add('show');
    });

    modalCancel.addEventListener('click', () => confirmModal.classList.remove('show'));

    modalConfirm.addEventListener('click', async () => {
      confirmModal.classList.remove('show');
      const message = msgInput.value.trim();
      const email = emailInput.value.trim();
      const unlockDate = unlockInput.value;

      const capsule = { 
        uid: "anonymous", 
        content: message, 
        email: email, 
        created_at: new Date(), 
        unlock_date: new Date(unlockDate), 
        is_opened: false, 
        is_sent: false, 
        bg_image: this.selectedImageUrl 
      };

      try {
        let docId = "test-capsule-id";
        if (typeof db !== 'undefined') { 
          const docRef = await db.collection("capsules").add(capsule); 
          docId = docRef.id; 
        }
        
        // --- Added: Call Worker to send confirmation email ---
        try {
          // Replace with your actual worker URL if different
          const workerUrl = "https://dear-me.pages.dev"; 
          await fetch(`${workerUrl}/api/confirm`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, unlockDate, docId })
          });
          console.log("Confirmation email requested.");
        } catch (emailError) {
          console.error("Failed to send confirmation email:", emailError);
          // Don't block the UI if email fails, but log it
        }
        // -----------------------------------------------------

        this.shadowRoot.getElementById('copy-link-btn').onclick = () => {
          navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?id=${docId}`);
          alert("링크가 복사되었습니다.");
        };
        
        this.shadowRoot.getElementById('reset-app-btn').onclick = () => window.location.reload();
        
        mainContent.style.display = 'none';
        successState.style.display = 'block';
      } catch (error) { 
        console.error("Error:", error); 
        alert("오류가 발생했습니다."); 
      }
    });
  }

  applyAdaptiveGreeting() {
    const greetingEl = this.shadowRoot.getElementById('greeting-text');
    const now = new Date();
    if (now.getDate() === 1) greetingEl.textContent = "새로운 달이 시작되었습니다. 이번 달의 목표를 미래로 보내보세요.";
    else greetingEl.textContent = "안녕하세요, 미래의 당신은 어떤 모습인가요? 지금의 진심을 담아 선물을 보내보세요.";
  }

  setupQuoteGuide() {
    const msgInput = this.shadowRoot.getElementById('gift-message');
    const quoteGuide = this.shadowRoot.getElementById('quote-guide');
    let quoteIndex = 0;
    const updateQuote = () => {
      quoteGuide.textContent = this.quotes[quoteIndex];
      quoteIndex = (quoteIndex + 1) % this.quotes.length;
    };
    if (!msgInput.value.trim()) {
      updateQuote();
      quoteGuide.classList.add('active');
      this.quoteInterval = setInterval(updateQuote, 6000);
    }
    msgInput.addEventListener('input', () => {
      if (msgInput.value.trim()) {
        quoteGuide.classList.remove('active');
        if (this.quoteInterval) {
          clearInterval(this.quoteInterval);
          this.quoteInterval = null;
        }
      } else if (!this.quoteInterval) {
        updateQuote();
        quoteGuide.classList.add('active');
        this.quoteInterval = setInterval(updateQuote, 6000);
      }
    });
  }
}
customElements.define('dear-me-app', DearMeApp);