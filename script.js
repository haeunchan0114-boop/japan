// 1. 필요한 Firebase SDK 모듈 불러오기 (v10 버전 표준 방식)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// 2. 제공해주신 정확한 파이어베이스 설정값 적용
const firebaseConfig = {
  apiKey: "AIzaSyCSUDQw6FZKxE3xp2E6YsTDgSSB3P3Pbx0",
  authDomain: "japan-77f1a.firebaseapp.com",
  projectId: "japan-77f1a",
  storageBucket: "japan-77f1a.firebasestorage.app",
  messagingSenderId: "645381397732",
  appId: "1:645381397732:web:440834484cbd55051aa0f1"
};

// 3. Firebase 및 Auth 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM 요소 선택
const loginSection = document.getElementById('loginSection');
const signupSection = document.getElementById('signupSection');
const quizSection = document.getElementById('quizSection');

const toSignup = document.getElementById('toSignup');
const toLogin = document.getElementById('toLogin');

const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

// 화면 전환 이벤트 (회원가입/로그인 창 오가기)
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

// 회원가입 처리
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('signupId').value.trim();
  const password = document.getElementById('signupPassword').value;
  const email = `${id}@japanquiz.com`; // Firebase 이메일 규칙 대응을 위한 가상 주소 생성

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert('회원가입이 완료되었습니다! 로그인해주세요.');
    signupSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
  } catch (error) {
    alert('회원가입 실패: ' + error.message);
  }
});

// 로그인 처리
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('loginId').value.trim();
  const password = document.getElementById('loginPassword').value;
  const email = `${id}@japanquiz.com`;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert('로그인 성공!');
    startQuiz();
  } catch (error) {
    alert('로그인 실패: 아이디 또는 비밀번호를 확인해주세요.');
  }
});

// 퀴즈 시작 함수
function startQuiz() {
  loginSection.classList.add('hidden');
  signupSection.classList.add('hidden');
  quizSection.classList.remove('hidden');
  loadQuestion();
}

// 퀴즈 데이터 및 로직
const quizData = [
  { question: "도쿄가 위치한 일본의 전통 지역 구분은?", options: ["간토", "간사이", "규슈", "도호쿠"], answer: 0 },
  { question: "오사카와 교토가 속해 있는 지역은?", options: ["홋카이도", "간사이", "시코쿠", "주고쿠"], answer: 1 },
  { question: "일본의 4대 섬 중 가장 북쪽에 있는 섬은?", options: ["혼슈", "시코쿠", "규슈", "홋카이도"], answer: 3 }
];

let currentIndex = 0;

function loadQuestion() {
  if (currentIndex >= quizData.length) {
    alert('모든 퀴즈를 완료했습니다!');
    quizSection.innerHTML = `<h2>🎉 퀴즈 완료! 수고하셨습니다.</h2>`;
    return;
  }

  const q = quizData[currentIndex];
  document.getElementById('currentNum').textContent = currentIndex + 1;
  document.getElementById('totalNum').textContent = quizData.length;
  document.getElementById('questionText').textContent = q.question;

  const optionsContainer = document.getElementById('optionsContainer');
  optionsContainer.innerHTML = '';

  q.options.forEach((opt, index) => {
    const btn = document.createElement('button');
    btn.className = 'btn-option';
    btn.textContent = opt;
    btn.addEventListener('click', () => {
      if (index === q.answer) {
        alert('정답입니다! 👏');
      } else {
        alert('틀렸습니다! 🥲');
      }
      currentIndex++;
      loadQuestion();
    });
    optionsContainer.appendChild(btn);
  });
}
