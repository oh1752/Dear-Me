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

        .suggestion-box {
          margin-top: 20px;
          padding: 20px;
          background: rgba(140, 122, 107, 0.08);
          border-radius: 16px;
          text-align: left;
          animation: fadeIn 0.5s ease-out;
        }

        .suggestion-box h4 {
          font-family: 'Noto Serif KR', serif;
          font-size: 1rem;
          color: #4a4a4a;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .suggestion-item {
          font-size: 0.9rem;
          color: #555;
          line-height: 1.6;
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid rgba(140, 122, 107, 0.1);
          cursor: pointer;
          transition: color 0.2s;
        }

        .suggestion-item:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }

        .suggestion-item:hover {
          color: #8c7a6b;
        }

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
          margin-top: 20px;
        }

        .toggle-btn:hover {
          background-color: rgba(140, 122, 107, 0.05);
          border-color: #8c7a6b;
        }

        .hidden {
          display: none;
        }
      </style>

      <div class="header">
        <div class="icon">🕰️✉️</div>
        <h1>Dear Me</h1>
      </div>

      <div class="greeting">
        안녕하세요, 미래의 당신은 어떤 모습인가요?
      </div>

      <div style="text-align: center; margin-bottom: 30px;">
        <button class="toggle-btn" id="toggle-calc-btn">📅 오늘 요일 입력하기</button>
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

      <div class="tomorrow-calc hidden" id="tomorrow-calc-section">
        <h3>📅 내일은 무슨 요일일까요?</h3>
        <p>오늘 날짜를 선택하시면 내일의 요일을 미리 알려드립니다.</p>
        <input type="date" id="today-date">
        <div class="tomorrow-result" id="tomorrow-result"></div>
        <div id="suggestion-area"></div>
      </div>
    `;
  }

  setupEventListeners() {
    const sendBtn = this.shadowRoot.getElementById('send-btn');
    const msgInput = this.shadowRoot.getElementById('gift-message');
    const successMsg = this.shadowRoot.getElementById('success-msg');
    const todayInput = this.shadowRoot.getElementById('today-date');
    const tomorrowResult = this.shadowRoot.getElementById('tomorrow-result');
    const toggleBtn = this.shadowRoot.getElementById('toggle-calc-btn');
    const calcSection = this.shadowRoot.getElementById('tomorrow-calc-section');
    const suggestionArea = this.shadowRoot.getElementById('suggestion-area');

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

    toggleBtn.addEventListener('click', () => {
      const isHidden = calcSection.classList.contains('hidden');
      if (isHidden) {
        calcSection.classList.remove('hidden');
        toggleBtn.textContent = '닫기';
      } else {
        calcSection.classList.add('hidden');
        toggleBtn.textContent = '📅 오늘 요일 입력하기';
      }
    });

    todayInput.addEventListener('change', () => {
      const selectedDate = new Date(todayInput.value);
      if (isNaN(selectedDate.getTime())) {
        tomorrowResult.textContent = '';
        suggestionArea.innerHTML = '';
        return;
      }

      // Calculate tomorrow's day
      const tomorrow = new Date(selectedDate);
      tomorrow.setDate(selectedDate.getDate() + 1);
      const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
      const tomorrowDay = days[tomorrow.getDay()];
      tomorrowResult.innerHTML = `내일은 <strong>${tomorrowDay}</strong> 입니다. ✨`;

      // Intelligent Suggestions
      const isSunday = selectedDate.getDay() === 0;
      const isFirstDay = selectedDate.getDate() === 1;
      
      suggestionArea.innerHTML = ''; // Clear previous suggestions

      if (isSunday) {
        this.renderSuggestions('월요병 방지 및 주간 설계 제안', [
          "내일이 벌써 월요일이라니, 마음이 조금 무거우신가요? 하지만 5일 뒤면 다시 당신만의 온전한 주말이 기다리고 있어요. 이번 한 주, [성취하고 싶은 작은 목표] 하나만 기록해 볼까요? 미래의 당신이 훨씬 가벼운 마음으로 주말을 맞이할 수 있도록요.",
          "일요일 밤, 다가올 월요일이 걱정된다면 미래의 나에게 작은 선물을 남겨보세요. '이번 주는 평소보다 조금 더 여유롭게' 같은 다짐만으로도 내일 아침이 조금은 더 가벼워질 거예요.",
          "새로운 한 주의 시작을 앞둔 당신에게 응원을 보냅니다. 거창한 계획이 아니어도 좋아요. 월요일의 내가 웃을 수 있게, 지금의 마음을 한 줄 기록해보는 건 어떨까요?"
        ]);
      } else if (isFirstDay) {
        this.renderSuggestions('새로운 시작과 계절감 제안', [
          "새로운 달이 시작되었습니다. 지난달의 수고는 뒤로하고, 이번 달에 꼭 이루고 싶은 '나만의 계절'은 어떤 모습인가요? 한 달 뒤의 당신이 미소 지을 수 있도록 새로운 시작을 기록해보세요.",
          "1일, 새로운 페이지를 넘기는 날입니다. 계절의 변화와 함께 이번 달에 채워나갈 행복한 순간들을 미리 상상해볼까요? 미래의 당신이 이 선물을 열어볼 때 얼마나 뿌듯해할지 기대됩니다.",
          "새달의 첫 단추를 끼우는 오늘, 당신의 마음가짐은 무엇인가요? 새로운 시작이 주는 설렘을 담아 미래의 나에게 따뜻한 격려 한 마디를 보내보세요."
        ]);
      }
    });
  }

  renderSuggestions(title, phrases) {
    const suggestionArea = this.shadowRoot.getElementById('suggestion-area');
    const msgInput = this.shadowRoot.getElementById('gift-message');

    const box = document.createElement('div');
    box.className = 'suggestion-box';
    
    let html = `<h4>✨ ${title}</h4>`;
    phrases.forEach(phrase => {
      html += `<div class="suggestion-item">${phrase}</div>`;
    });
    
    box.innerHTML = html;
    
    // Add click event to copy phrase to textarea
    box.querySelectorAll('.suggestion-item').forEach(item => {
      item.addEventListener('click', () => {
        msgInput.value = item.textContent;
        msgInput.focus();
        // Scroll back to message input
        msgInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });

    suggestionArea.appendChild(box);
  }
}

customElements.define('dear-me-app', DearMeApp);
