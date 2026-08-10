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

// 지도 이미지 오류 걱정 없는 직관적인 퀴즈 데이터
const quizData = [
  {
    hintKo: "일본의 수도이자 중심지 (간토 지방)",
    hintJp: "日本の首都であり中心地（関東地方）",
    ko: { question: "이 지역은 어디일까요?", options: ["도쿄도", "오사카부", "홋카이도", "후쿠오카현"], answer: 0 },
    jp: { question: "この地域はどこですか？", options: ["東京都", "大阪府", "北海道", "福岡県"], answer: 0 }
  },
  {
    hintKo: "가장 북쪽에 위치한 넓은 섬 (겨울 축제로 유명)",
    hintJp: "最北端に位置する広い島（雪まつりで有名）",
    ko: { question: "이 지역은 어디일까요?", options: ["오키나와현", "홋카이도", "교토부", "아이치현"], answer: 1 },
    jp: { question: "この地域はどこですか？", options: ["沖縄県", "北海道", "京都府", "愛知県"], answer: 1 }
  },
  {
    hintKo: "서일본의 중심 상업 도시 (간사이 지방)",
    hintJp: "西日本の中心商業都市（関西地方）",
    ko: { question: "이 지역은 어디일까요?", options: ["도쿄도", "가나가와현", "오사카부", "효고현"], answer: 2 },
    jp: { question: "この地域はどこですか？", options: ["東京都", "神奈川県", "大阪府", "兵庫県"], answer: 2 }
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
  document.getElementById('regionHint').textContent = currentLang === 'ko' ? data.hintKo : data.hintJp;
  document.getElementById('questionText').textContent = q.question;

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
