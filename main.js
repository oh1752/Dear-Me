class DearMeApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          max-width: 600px;
          width: 90%;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          text-align: center;
          font-family: 'Noto Sans KR', sans-serif;
        }

        .header {
          margin-bottom: 30px;
        }

        .icon {
          font-size: 3rem;
          margin-bottom: 10px;
        }

        h1 {
          font-family: 'Noto Serif KR', serif;
          color: #4a4a4a;
          font-size: 2rem;
          margin: 0 0 10px 0;
          font-weight: 700;
        }

        .greeting {
          font-family: 'Noto Serif KR', serif;
          font-size: 1.2rem;
          color: #8c7a6b;
          margin-bottom: 30px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-bottom: 30px;
          text-align: left;
        }

        label {
          font-weight: 500;
          color: #555;
          font-size: 0.95rem;
        }

        textarea {
          width: 100%;
          min-height: 150px;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 12px;
          background: rgba(255,255,255,0.9);
          font-family: 'Noto Sans KR', sans-serif;
          font-size: 1rem;
          resize: vertical;
          box-sizing: border-box;
          transition: border-color 0.3s;
        }

        textarea:focus {
          outline: none;
          border-color: #8c7a6b;
          box-shadow: 0 0 0 2px rgba(140, 122, 107, 0.2);
        }

        .action-button {
          background-color: #8c7a6b;
          color: white;
          border: none;
          padding: 15px 30px;
          font-size: 1.1rem;
          border-radius: 30px;
          cursor: pointer;
          font-family: 'Noto Sans KR', sans-serif;
          font-weight: 500;
          transition: background-color 0.3s, transform 0.1s, box-shadow 0.3s;
          box-shadow: 0 4px 15px rgba(140, 122, 107, 0.3);
        }

        .action-button:hover {
          background-color: #7a6859;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(140, 122, 107, 0.4);
        }

        .action-button:active {
          transform: translateY(0);
        }
        
        .success-message {
            display: none;
            margin-top: 20px;
            color: #4a4a4a;
            font-family: 'Noto Serif KR', serif;
            font-size: 1.1rem;
            animation: fadeIn 0.5s ease-in;
        }

        .tomorrow-calc {
          margin-top: 40px;
          padding-top: 40px;
          border-top: 1px solid #eee;
        }

        .tomorrow-calc h3 {
          font-family: 'Noto Serif KR', serif;
          font-size: 1.2rem;
          color: #4a4a4a;
          margin-bottom: 10px;
        }

        .tomorrow-calc p {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 15px;
        }

        .tomorrow-calc input {
          padding: 12px 15px;
          border-radius: 12px;
          border: 1px solid #ddd;
          font-family: 'Noto Sans KR', sans-serif;
          width: 100%;
          max-width: 250px;
          margin-bottom: 10px;
          transition: border-color 0.3s;
        }

        .tomorrow-calc input:focus {
          outline: none;
          border-color: #8c7a6b;
        }

        .tomorrow-result {
          margin-top: 15px;
          font-weight: 500;
          color: #8c7a6b;
          font-size: 1.1rem;
          min-height: 1.5rem;
        }
      </style>

      <div class="header">
        <div class="icon">🕰️✉️</div>
        <h1>Dear Me</h1>
      </div>

      <div class="greeting">
        안녕하세요, 미래의 당신은 어떤 모습인가요?
      </div>

      <div class="input-group">
        <label for="gift-message">미래의 나에게 줄 선물 (목표나 다짐)</label>
        <textarea id="gift-message" placeholder="예: 6개월 동안 꾸준히 운동하는 습관을 선물할게."></textarea>
      </div>

      <div class="input-group">
        <label for="unlock-date">이 선물을 언제 열어볼까요?</label>
        <input type="date" id="unlock-date" />
      </div>

      <button class="action-button" id="send-btn">
        미래의 나에게 선물 보내기
      </button>

      <div class="success-message" id="success-msg">
        성공적으로 미래로 편지를 보냈습니다. <br>
        시간이 되면 과거의 당신으로부터 응원이 도착할 것입니다.
      </div>

      <div class="tomorrow-calc">
        <h3>📅 내일은 무슨 요일일까요?</h3>
        <p>오늘 날짜를 선택하시면 내일의 요일을 미리 알려드립니다.</p>
        <input type="date" id="today-date">
        <div class="tomorrow-result" id="tomorrow-result"></div>
      </div>
    `;
  }

  setupEventListeners() {
    const sendBtn = this.shadowRoot.getElementById('send-btn');
    const msgInput = this.shadowRoot.getElementById('gift-message');
    const successMsg = this.shadowRoot.getElementById('success-msg');
    const todayInput = this.shadowRoot.getElementById('today-date');
    const tomorrowResult = this.shadowRoot.getElementById('tomorrow-result');

    sendBtn.addEventListener('click', () => {
      const message = msgInput.value.trim();
      if (message) {
        console.log("Capsule sealed for future:", message);
        sendBtn.style.display = 'none';
        msgInput.disabled = true;
        successMsg.style.display = 'block';
      } else {
        alert("미래의 나에게 보낼 메시지를 입력해주세요.");
      }
    });

    todayInput.addEventListener('change', () => {
      const selectedDate = new Date(todayInput.value);
      if (!isNaN(selectedDate.getTime())) {
        const tomorrow = new Date(selectedDate);
        tomorrow.setDate(selectedDate.getDate() + 1);
        
        const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
        const tomorrowDay = days[tomorrow.getDay()];
        
        tomorrowResult.innerHTML = `내일은 <strong>${tomorrowDay}</strong> 입니다. ✨`;
      } else {
        tomorrowResult.textContent = '';
      }
    });
  }
}

customElements.define('dear-me-app', DearMeApp);
