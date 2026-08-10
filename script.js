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

// DOM 요소
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

let currentLang = 'ko'; // 기본값 한국어

// 화면 전환
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

// 회원가입
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

// 로그인 성공 시 -> 언어 선택 화면으로 이동
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
    modeSection.classList.remove('hidden'); // 언어 선택창 띄우기
  } catch (error) {
    alert('로그인 실패: 아이디 또는 비밀번호를 확인해주세요.');
  }
});

// 언어 선택 버튼 이벤트
langKoBtn.addEventListener('click', () => {
  currentLang = 'ko';
  startQuiz();
});

langJpBtn.addEventListener('click', () => {
  currentLang = 'jp';
  startQuiz();
});

// 퀴즈 시작
function startQuiz() {
  modeSection.classList.add('hidden');
  quizSection.classList.remove('hidden');
  currentIndex = 0;
  loadQuestion();
}

// 지도 퀴즈 데이터 (한국어 / 일본어 분기)
const quizData = [
  {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Tokyo_in_Japan_%28translucent%29.svg/200px-Tokyo_in_Japan_%28translucent%29.svg.png",
    ko: { question: "지도에 빨갛게 표시된 이 지역은 어디일까요?", options: ["도쿄도", "오사카부", "홋카이도", "후쿠오카현"], answer: 0 },
    jp: { question: "地図で赤く示されているこの地域はどこですか？", options: ["東京都", "大阪府", "北海道", "福岡県"], answer: 0 }
  },
  {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Hokkaido_in_Japan_%28translucent%29.svg/200px-Hokkaido_in_Japan_%28translucent%29.svg.png",
    ko: { question: "지도에 표시된 가장 북쪽에 있는 이 섬/지역은?", options: ["오키나와현", "홋카이도", "교토부", "아이치현"], answer: 1 },
    jp: { question: "地図に示されている最北端のこの地域は？", options: ["沖縄県", "北海道", "京都府", "愛知県"], answer: 1 }
  },
  {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Osaka_in_Japan_%28translucent%29.svg/200px-Osaka_in_Japan_%28translucent%29.svg.png",
    ko: { question: "간사이 지방의 중심이자 지도에 표시된 이곳은?", options: ["도쿄도", "가나가와현", "오사카부", "효고현"], answer: 2 },
    jp: { question: "関西地方の中心であり、地図に示されたここは？", options: ["東京都", "神奈川県", "大阪府", "兵庫県"], answer: 2 }
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
  const q = data[currentLang]; // 선택한 언어(ko 또는 jp) 데이터 가져오기

  document.getElementById('currentNum').textContent = currentIndex + 1;
  document.getElementById('totalNum').textContent = quizData.length;
  document.getElementById('mapImage').src = data.image;
  document.getElementById('questionText').textContent = q.question;

  const optionsContainer = document.getElementById('optionsContainer');
  optionsContainer.innerHTML = '';

  q.options.forEach((opt, index) => {
    const btn = document.createElement('button');
    btn.className = 'btn-option';
    btn.textContent = opt;
    btn.style.cssText = "display: block; width: 100%; margin: 8px 0; padding: 10px; cursor: pointer; border: 1px solid #ccc; border-radius: 5px; background: #fff;";
    
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
