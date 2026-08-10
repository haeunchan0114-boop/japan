import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCSUDQw6FZKxE3xp2E6YsTDgSSB3P3Pbx0",
  authDomain: "japan-77f1a.firebaseapp.com",
  projectId: "japan-77f1a",
  storageBucket: "japan-77f1a.firebasestorage.app",
  messagingSenderId: "645381397732",
  appId: "1:645381397732:web:440834484cbd55051aa0f1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginSection = document.getElementById('loginSection');
const signupSection = document.getElementById('signupSection');
const modeSection = document.getElementById('modeSection');
const quizSection = document.getElementById('quizSection');

const toSignup = document.getElementById('toSignup');
const toLogin = document.getElementById('toLogin');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

const langKoBtn = document.getElementById('langKoBtn');
const langJpBtn = document.getElementById('langJpBtn');

let currentLang = 'ko';

toSignup.addEventListener('click', (e) => {
  e.preventDefault();
  loginSection.classList.add('hidden');
  signupSection.classList.remove('hidden');
});

toLogin.addEventListener('click', (e) => {
  e.preventDefault();
  signupSection.classList.add('hidden');
  loginSection.classList.remove('hidden');
});

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('signupId').value.trim();
  const password = document.getElementById('signupPassword').value;
  const email = `${id}@japanquiz.com`;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert('회원가입이 완료되었습니다! 로그인해주세요.');
    signupSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
  } catch (error) {
    alert('회원가입 실패: ' + error.message);
  }
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('loginId').value.trim();
  const password = document.getElementById('loginPassword').value;
  const email = `${id}@japanquiz.com`;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert('로그인 성공!');
    loginSection.classList.add('hidden');
    signupSection.classList.add('hidden');
    modeSection.classList.remove('hidden');
  } catch (error) {
    alert('로그인 실패: 아이디 또는 비밀번호를 확인해주세요.');
  }
});

langKoBtn.addEventListener('click', () => {
  currentLang = 'ko';
  startQuiz();
});

langJpBtn.addEventListener('click', () => {
  currentLang = 'jp';
  startQuiz();
});

function startQuiz() {
  modeSection.classList.add('hidden');
  quizSection.classList.remove('hidden');
  currentIndex = 0;
  loadQuestion();
}

// 현 모양 실루엣 퀴즈 데이터 (type에 따라 Canvas에 독특한 도형을 그려줌)
const quizData = [
  {
    type: "hokkaido", // 북해도 형태 (다각형 형태)
    ko: { question: "이 독특한 모양의 북쪽 섬/지역은 어디일까요?", options: ["오키나와현", "홋카이도", "도쿄도", "후쿠오카현"], answer: 1 },
    jp: { question: "この特徴的な形の北方の地域はどこですか？", options: ["沖縄県", "北海道", "東京都", "福岡県"], answer: 1 }
  },
  {
    type: "tokyo", // 도쿄 형태 (가로로 긴 뾰족한 반도 형태)
    ko: { question: "이 길쭉하고 태평양 쪽으로 뻗은 모양의 지역은?", options: ["오사카부", "교토부", "도쿄도", "아이치현"], answer: 2 },
    jp: { question: "この細長く太平洋側に伸びる形の地域は？", options: ["大阪府", "京都府", "東京都", "愛知県"], answer: 2 }
  },
  {
    type: "osaka", // 오사카 형태 (만(灣)을 품은 삼각형 형태)
    ko: { question: "오사카만(灣)을 품고 있는 이 컴팩트한 지역은?", options: ["오사카부", "가나가와현", "효고현", "후쿠오카현"], answer: 0 },
    jp: { question: "大阪湾を抱くこのコンパクトな地域は？", options: ["大阪府", "神奈川県", "兵庫県", "福岡県"], answer: 0 }
  }
];

let currentIndex = 0;

function loadQuestion() {
  if (currentIndex >= quizData.length) {
    alert(currentLang === 'ko' ? '모든 퀴즈를 완료했습니다!' : 'すべてのクイズが終了しました！');
    quizSection.innerHTML = `<h2>${currentLang === 'ko' ? '🎉 퀴즈 완료! 수고하셨습니다.' : '🎉 クイズ完了！お疲れ様でした。'}</h2>`;
    return;
  }

  const data = quizData[currentIndex];
  const q = data[currentLang];

  document.getElementById('currentNum').textContent = currentIndex + 1;
  document.getElementById('totalNum').textContent = quizData.length;
  document.getElementById('questionText').textContent = q.question;

  // 캔버스에 해당 현 모양 실루엣 그리기
  drawPrefectureShape(data.type);

  const optionsContainer = document.getElementById('optionsContainer');
  optionsContainer.innerHTML = '';

  q.options.forEach((opt, index) => {
    const btn = document.createElement('button');
    btn.className = 'btn-option';
    btn.textContent = opt;
    btn.style.cssText = "display: block; width: 100%; margin: 8px 0; padding: 12px; cursor: pointer; border: 1px solid #ccc; border-radius: 6px; background: #fff; font-size: 1rem;";
    
    btn.addEventListener('click', () => {
      if (index === q.answer) {
        alert(currentLang === 'ko' ? '정답입니다! 👏' : '正解です！👏');
      } else {
        alert(currentLang === 'ko' ? '틀렸습니다! 🥲' : '不正解です！🥲');
      }
      currentIndex++;
      loadQuestion();
    });
    optionsContainer.appendChild(btn);
  });
}

// 실루엣을 그려주는 함수 (HTML5 Canvas API 사용)
function drawPrefectureShape(type) {
  const canvas = document.getElementById('shapeCanvas');
  const ctx = canvas.getContext('2d');
  
  // 캔버스 초기화
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = '#3b82f6'; // 파란색 실루엣 채우기
  ctx.strokeStyle = '#1e3a8a';
  ctx.lineWidth = 2;

  ctx.beginPath();

  if (type === 'hokkaido') {
    // 홋카이도의 대략적인 마름모/곰돌이 형태 실루엣
    ctx.moveTo(100, 20);
    ctx.lineTo(150, 40);
    ctx.lineTo(170, 90);
    ctx.lineTo(130, 140);
    ctx.lineTo(70, 130);
    ctx.lineTo(40, 80);
    ctx.lineTo(70, 30);
  } else if (type === 'tokyo') {
    // 도쿄의 가로로 길쭉한 형태 (이즈 반도 및 도심부 포함)
    ctx.moveTo(40, 80);
    ctx.lineTo(140, 70);
    ctx.lineTo(170, 90);
    ctx.lineTo(150, 110);
    ctx.lineTo(50, 100);
  } else if (type === 'osaka') {
    // 오사카의 오사카만을 감싸는 부채꼴 형태
    ctx.moveTo(70, 40);
    ctx.lineTo(130, 50);
    ctx.lineTo(150, 120);
    ctx.lineTo(90, 140);
    ctx.lineTo(50, 90);
  }

  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}
