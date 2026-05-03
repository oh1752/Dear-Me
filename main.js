class DearMeApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.quotes = [
      "미래의 당신은 지금의 당신에게 어떤 말을 해주고 싶을까요?",
      "오늘의 가장 빛나는 순간을 적어보세요.",
      "내일의 나를 위해 오늘 할 수 있는 작은 배려는 무엇인가요?"
    ];
    this.quoteInterval = null;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.applyAdaptiveGreeting();
    this.setupQuoteGuide();
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

        /* Menu Styles - Restored */
        .menu-container {
          position: absolute;
          top: 25px;
          left: 25px;
          z-index: 100;
        }

        .menu-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #8c7a6b;
          padding: 10px;
          border-radius: 50%;
          transition: background-color 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .menu-btn:hover {
          background-color: rgba(140, 122, 107, 0.1);
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          margin-top: 10px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          width: 200px;
          padding: 10px 0;
          display: none;
          flex-direction: column;
          text-align: left;
          border: 1px solid rgba(140, 122, 107, 0.1);
          animation: slideDownMenu 0.3s ease-out;
        }

        .dropdown-menu.show {
          display: flex;
        }

        .menu-item {
          padding: 12px 20px;
          font-size: 0.95rem;
          color: #555;
          cursor: pointer;
          transition: background-color 0.2s, color 0.2s;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .menu-item:hover {
          background-color: #f9f7f5;
          color: #8c7a6b;
        }

        .menu-item span {
          font-size: 1.1rem;
        }

        @keyframes slideDownMenu {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
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

        /* Toggle Button - Restored */
        .toggle-btn {
          background: none;
          border: 1px solid #d1c4b9;
          color: #8c7a6b;
          padding: 10px 20px;
          border-radius: 20px;
          cursor: pointer;
          font-family: 'Noto Sans KR', sans-serif;
          font-size: 0.9rem;
          transition: all 0.3s;
          margin-bottom: 20px;
        }

        .toggle-btn:hover {
          background-color: rgba(140, 122, 107, 0.05);
          border-color: #8c7a6b;
        }

        .date-input-section {
          margin-bottom: 30px;
          animation: fadeIn 0.5s ease-out;
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

        textarea, input[type="email"], input[type="date"] {
          width: 100%;
          padding: 15px 20px;
          border: none;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.8);
          font-family: 'Noto Sans KR', sans-serif;
          font-size: 1.05rem;
          box-sizing: border-box;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          box-shadow: inset 0 2px 10px rgba(0,0,0,0.02);
          color: #333;
        }

        textarea {
          min-height: 150px;
          resize: none;
          line-height: 1.8;
        }

        textarea:focus, input:focus {
          outline: none;
          background: #fff;
          box-shadow: 0 10px 30px rgba(140, 122, 107, 0.1);
          transform: translateY(-2px);
        }

        /* Cinematic Quote Guide Styles */
        .textarea-container {
          position: relative;
          width: 100%;
        }

        .quote-guide {
          position: absolute;
          top: 25px;
          left: 25px;
          right: 25px;
          pointer-events: none;
          font-family: 'Noto Serif KR', serif;
          font-style: italic;
          font-size: 1.05rem;
          color: rgba(140, 122, 107, 0.4);
          line-height: 1.8;
          opacity: 0;
          text-align: left;
        }

        .quote-guide.active {
          animation: subtitleEffect 6s infinite;
        }

        @keyframes subtitleEffect {
          0% { opacity: 0; transform: translateY(5px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-5px); }
        }

        input[type="date"] {
          border: 1px solid rgba(140, 122, 107, 0.2);
          cursor: pointer;
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
        }

        .action-button:hover {
          background-color: #7a6859;
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(140, 122, 107, 0.4);
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

        .suggestion-box {
          background: rgba(140, 122, 107, 0.05);
          padding: 20px;
          border-radius: 20px;
          border: 1px solid rgba(140, 122, 107, 0.1);
          text-align: left;
          margin-bottom: 20px;
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

      <div class="menu-container">
        <button class="menu-btn" id="menu-toggle-btn">☰</button>
        <div class="dropdown-menu" id="side-menu">
          <div class="menu-item"><span>🎨</span> 테마</div>
          <div class="menu-item"><span>🔒</span> 기념일 잠금</div>
          <div class="menu-item"><span>💾</span> 백업 및 복원</div>
          <div class="menu-item"><span>📤</span> 공유 하기</div>
        </div>
      </div>

      <div id="main-content">
        <div class="header">
          <div class="icon">✉️✨</div>
          <h1>Dear Me</h1>
        </div>

        <div class="greeting" id="greeting-text">
          안녕하세요, 미래의 당신은 어떤 모습인가요?
        </div>

        <div style="text-align: center;">
          <button class="toggle-btn" id="toggle-date-btn">📅 오늘 요일 입력하기</button>
        </div>

        <div class="date-input-section hidden" id="date-section">
          <input type="date" id="input-date">
        </div>

        <div id="suggestion-area"></div>

        <div class="workspace">
          <div class="input-group">
            <label for="gift-message">미래의 나에게 줄 선물</label>
            <div class="textarea-container">
              <div class="quote-guide" id="quote-guide"></div>
              <textarea id="gift-message" placeholder="오늘의 마음, 혹은 다짐을 사랑을 담아 적어보세요."></textarea>
            </div>
          </div>

          <div class="input-group">
            <label for="recipient-email">이메일 주소</label>
            <input type="email" id="recipient-email" placeholder="미래의 나에게 보낼 메일 주소를 입력해 주세요." />
          </div>

          <div class="input-group">
            <label for="unlock-date">이 선물을 언제 열어 볼까요?</label>
            <input type="date" id="unlock-date" />
          </div>

          <button class="action-button" id="seal-btn">
            밀봉해 드립니다
          </button>
        </div>
      </div>

      <div class="success-state" id="success-state">
        <span class="success-icon">🕯️📜</span>
        <div class="success-title">순간이 밀봉되었습니다.</div>
        <div class="success-text">
          당신이 보낸 따뜻한 마음은 Firestore에 안전하게 보관되었습니다.<br>
          약속한 날짜에 입력하신 이메일로 특별한 링크가 도착할 것입니다.
        </div>
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
    const suggestionArea = this.shadowRoot.getElementById('suggestion-area');
    const menuToggleBtn = this.shadowRoot.getElementById('menu-toggle-btn');
    const sideMenu = this.shadowRoot.getElementById('side-menu');
    const toggleDateBtn = this.shadowRoot.getElementById('toggle-date-btn');
    const dateSection = this.shadowRoot.getElementById('date-section');
    const inputDate = this.shadowRoot.getElementById('input-date');

    // Menu Toggle
    menuToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sideMenu.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      if (sideMenu.classList.contains('show')) {
        sideMenu.classList.remove('show');
      }
    });

    sideMenu.addEventListener('click', (e) => e.stopPropagation());

    // Today Date Toggle
    toggleDateBtn.addEventListener('click', () => {
      const isHidden = dateSection.classList.contains('hidden');
      if (isHidden) {
        dateSection.classList.remove('hidden');
        toggleDateBtn.textContent = '닫기';
        setTimeout(() => {
          if (inputDate.showPicker) inputDate.showPicker();
          else inputDate.focus();
        }, 100);
      } else {
        dateSection.classList.add('hidden');
        toggleDateBtn.textContent = '📅 오늘 요일 입력하기';
      }
    });

    inputDate.addEventListener('change', () => {
      const selectedDate = new Date(inputDate.value);
      if (isNaN(selectedDate.getTime())) {
        suggestionArea.innerHTML = '';
        return;
      }
      this.handleDateSuggestions(selectedDate);
    });

    // Sealing
    sealBtn.addEventListener('click', async () => {
      const message = msgInput.value.trim();
      const email = emailInput.value.trim();
      const unlockDate = unlockInput.value;

      if (!message || !email || !unlockDate) {
        alert("모든 필드를 입력해 주세요.");
        return;
      }

      const capsule = {
        uid: "anonymous",
        content: message,
        email: email,
        created_at: new Date(),
        unlock_date: new Date(unlockDate),
        is_opened: false
      };

      try {
        if (typeof db !== 'undefined') {
          await db.collection("capsules").add(capsule);
        }
        mainContent.style.display = 'none';
        successState.style.display = 'block';
      } catch (error) {
        console.error("Error:", error);
        alert("오류가 발생했습니다.");
      }
    });

    this.shadowRoot.addEventListener('click', (e) => {
      const item = e.target.closest('.suggestion-item');
      if (item) {
        msgInput.value = item.textContent;
        msgInput.focus();
      }
    });
  }

  handleDateSuggestions(selectedDate) {
    const suggestionArea = this.shadowRoot.getElementById('suggestion-area');
    const isSunday = selectedDate.getDay() === 0;
    const isFirstDay = selectedDate.getDate() === 1;
    
    const tomorrow = new Date(selectedDate);
    tomorrow.setDate(selectedDate.getDate() + 1);
    const isTomorrowFirstDay = tomorrow.getDate() === 1;

    suggestionArea.innerHTML = '';

    if (isSunday) {
      this.renderSuggestions(suggestionArea, '월요병 방지 및 주간 설계 제안', [
        "내일이 벌써 월요일이라니, 마음이 조금 무거우신가요? 이번 주 나를 위한 작은 목표 하나를 기록해 볼까요?",
        "일요일 밤, 다가올 월요일이 걱정된다면 미래의 나에게 따뜻한 위로의 선물을 남겨보세요.",
        "새로운 한 주의 시작을 앞둔 당신에게 응원을 보냅니다. 지금의 마음을 한 줄 기록해보는 건 어떨까요?"
      ]);
    } else if (isFirstDay || isTomorrowFirstDay) {
      if (isFirstDay) {
        this.renderSuggestions(suggestionArea, '새로운 시작과 계절감 제안', [
          "새로운 달이 시작되었습니다. 지난달의 수고는 뒤로하고, 이번 달에 이루고 싶은 목표를 기록해보세요.",
          "1일, 새로운 페이지를 넘기는 날입니다. 미래의 당신이 이 선물을 열어볼 때 얼마나 뿌듯해할지 기대됩니다.",
          "새달의 첫 단추를 끼우는 오늘, 당신의 마음가짐을 따뜻한 격려와 함께 보내보세요."
        ]);
      } else {
        this.renderSuggestions(suggestionArea, '새로운 달을 맞이하는 설렘 제안', [
          "내일이면 새로운 달이 시작됩니다. 한 달을 마무리하며 다가올 새달의 기대를 미리 인사를 건네보세요.",
          "이번 달의 마지막 페이지를 넘기는 오늘, 수고한 당신에게 박수를 보냅니다. 내일의 기대를 기록해 보세요.",
          "새로운 달의 문턱에 서 있는 당신, 내일 아침의 당신이 더 기분 좋게 시작할 수 있도록 다짐을 남겨주세요."
        ]);
      }
    }
  }

  applyAdaptiveGreeting() {
    const greetingEl = this.shadowRoot.getElementById('greeting-text');
    const now = new Date();
    const day = now.getDay();
    const hours = now.getHours();
    const date = now.getDate();

    if (date === 1) {
      greetingEl.textContent = "새로운 달이 시작되었습니다. 이번 달의 목표를 미래로 보내보세요.";
    } else if (day === 0 && hours >= 17) {
      greetingEl.textContent = "일요일 저녁, 평온한 한 주를 위해 미래의 나에게 작은 응원을 남겨보세요.";
    } else {
      greetingEl.textContent = "안녕하세요, 미래의 당신은 어떤 모습인가요? 지금의 진심을 담아 선물을 보내보세요.";
    }
  }

  setupQuoteGuide() {
    const msgInput = this.shadowRoot.getElementById('gift-message');
    const quoteGuide = this.shadowRoot.getElementById('quote-guide');
    let quoteIndex = 0;

    const updateQuote = () => {
      quoteGuide.textContent = this.quotes[quoteIndex];
      quoteIndex = (quoteIndex + 1) % this.quotes.length;
    };

    msgInput.addEventListener('focus', () => {
      if (!msgInput.value.trim()) {
        updateQuote();
        quoteGuide.classList.add('active');
        this.quoteInterval = setInterval(updateQuote, 6000);
      }
    });

    msgInput.addEventListener('blur', () => {
      quoteGuide.classList.remove('active');
      clearInterval(this.quoteInterval);
    });

    msgInput.addEventListener('input', () => {
      if (msgInput.value.trim()) {
        quoteGuide.classList.remove('active');
        clearInterval(this.quoteInterval);
      } else if (document.activeElement === msgInput) {
        updateQuote();
        quoteGuide.classList.add('active');
        this.quoteInterval = setInterval(updateQuote, 6000);
      }
    });
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
