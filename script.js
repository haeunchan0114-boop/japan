// Firebase SDK 라이브러리 불러오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyCSUDQw6FZKxE3xp2E6YsTDgSSB3P3Pbx0",
  authDomain: "japan-77f1a.firebaseapp.com",
  projectId: "japan-77f1a",
  storageBucket: "japan-77f1a.firebasestorage.app",
  messagingSenderId: "645381397732",
  appId: "1:645381397732:web:440834484cbd55051aa0f1"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// DOM 요소 가져오기
const loginSection = document.getElementById('loginSection');
const signupSection = document.getElementById('signupSection');
const quizSection = document.getElementById('quizSection');

const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const googleLoginBtn = document.getElementById('googleLoginBtn');

const toSignup = document.getElementById('toSignup');
const toLogin = document.getElementById('toLogin');

// 1. 화면 전환 (로그인 <-> 회원가입)
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

// 2. 구글 로그인 처리
googleLoginBtn.addEventListener('click', async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    alert(`반갑습니다, ${user.displayName || '사용자'}님!`);
    startQuiz();
  } catch (error) {
    alert('구글 로그인 실패: ' + error.message);
  }
});

// 3. 일반 아이디 회원가입 처리 (내부적으로 가상 이메일 생성)
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('signupId').value.trim();
  const password = document.getElementById('signupPassword').value;

  // 아이디 뒤에 서비스 전용 가상 이메일 주소를 자동 연결
  const fakeEmail = `${username}@japan.com`;

  try {
    await createUserWithEmailAndPassword(auth, fakeEmail, password);
    alert('회원가입 완료! 퀴즈를 시작합니다.');
    startQuiz();
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      alert('이미 사용 중인 아이디입니다.');
    } else if (error.code === 'auth/weak-password') {
      alert('비밀번호는 최소 6자 이상이어야 합니다.');
    } else if (error.code === 'auth/invalid-email') {
      alert('아이디에 공백이나 특수문자는 넣을 수 없습니다.');
    } else {
      alert('회원가입 실패: ' + error.message);
    }
  }
});

// 4. 일반 아이디 로그인 처리
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('loginId').value.trim();
  const password = document.getElementById('loginPassword').value;

  const fakeEmail = `${username}@japan.com`;

  try {
    await signInWithEmailAndPassword(auth, fakeEmail, password);
    alert(`${username}님, 로그인 성공!`);
    startQuiz();
  } catch (error) {
    alert('로그인 실패: 아이디 또는 비밀번호를 확인해주세요.');
  }
});

// 5. 퀴즈 실행 함수
function startQuiz() {
  loginSection.classList.add('hidden');
  signupSection.classList.add('hidden');
  quizSection.classList.remove('hidden');
  loadQuiz();
}

// --- 6. 퀴즈 데이터 및 로직 ---
const quizData = [
  {
    question: "일본의 수도가 위치한 도도부현은 어디일까요?",
    options: ["도쿄도", "오사카부", "교토부", "홋카이도"],
    answer: 0
  },
  {
    question: "일본 최북단에 위치한 넓은 섬 지형의 지역은?",
    options: ["오키나와현", "후쿠오카현", "홋카이도", "아오모리현"],
    answer: 2
  },
  {
    question: "유명한 '타코야키'와 '글리코상'으로 잘 알려진 지역은?",
    options: ["히로시마현", "오사카부", "나라현", "아이치현"],
    answer: 1
  }
];

let currentIdx = 0;
let score = 0;

const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const currentNum = document.getElementById('currentNum');
const totalNum = document.getElementById('totalNum');

totalNum.innerText = quizData.length;

function loadQuiz() {
  const currentQuiz = quizData[currentIdx];
  currentNum.innerText = currentIdx + 1;
  questionText.innerText = currentQuiz.question;
  
  optionsContainer.innerHTML = '';
  currentQuiz.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.classList.add('option-btn');
    button.innerText = option;
    button.onclick = () => checkAnswer(index);
    optionsContainer.appendChild(button);
  });
}

function checkAnswer(selectedIdx) {
  if (selectedIdx === quizData[currentIdx].answer) {
    score++;
    alert("정답입니다! 🎉");
  } else {
    alert("아쉽네요, 오답입니다! 😅");
  }

  currentIdx++;

  if (currentIdx < quizData.length) {
    loadQuiz();
  } else {
    showResult();
  }
}

function showResult() {
  quizSection.innerHTML = `
    <div class="score-box">
      <h2>퀴즈 완료! 👏</h2>
      <p style="margin: 15px 0;">총 ${quizData.length}문제 중 <strong>${score}</strong>문제를 맞추셨습니다!</p>
      <button class="btn-primary" onclick="location.reload()">처음으로 돌아가기</button>
    </div>
  `;
}
