import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

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

// 47개 데이터 DB (Path 데이터 정교화 가이드)
const PREFECTURE_DB = [
  { id: 1, ko: "홋카이도", jp: "北海道", path: "M40,30 Q60,10 100,20 T160,35 L190,70 L160,110 L120,130 L60,135 Q30,110 30,90 Z" },
  { id: 13, ko: "도쿄도", jp: "東京都", path: "M20,90 L80,85 Q120,80 140,70 L180,85 L160,105 Q100,120 40,110 Z" },
  { id: 27, ko: "오사카부", jp: "大阪府", path: "M100,40 C140,40 160,70 150,100 C140,140 100,150 80,130 C60,100 70,40 100,40 Z" },
  { id: 40, ko: "후쿠오카현", jp: "福岡県", path: "M40,40 L110,35 L160,60 L150,115 L80,125 L35,85 Z" },
  { id: 47, ko: "오키나와현", jp: "沖縄県", path: "M30,130 L60,110 M90,100 L120,80 M150,90 L180,70" }
];
// 47개 확장 (더미)
for(let i=PREFECTURE_DB.length+1; i<=47; i++) {
  PREFECTURE_DB.push({ id: i, ko: `현 ${i}`, jp: `県 ${i}`, path: "M50,50 L150,50 L150,150 L50,150 Z" });
}

const ui = {
  loading: document.getElementById('loadingSection'),
  login: document.getElementById('loginSection'),
  signup: document.getElementById('signupSection'),
  setup: document.getElementById('setupSection'),
  quiz: document.getElementById('quizSection')
};

function show(name) {
  Object.values(ui).forEach(div => div.classList.add('hidden'));
  ui[name].classList.remove('hidden');
}

// --- 로그인 상태 감시 (핵심: 자동 로그인) ---
onAuthStateChanged(auth, (user) => {
  if (user) show('setup');
  else show('login');
});

// --- 회원가입/로그인/로그아웃 ---
document.getElementById('signupForm').onsubmit = async (e) => {
  e.preventDefault();
  const id = document.getElementById('signupId').value;
  const pw = document.getElementById('signupPassword').value;
  try {
    await createUserWithEmailAndPassword(auth, `${id}@japan.com`, pw);
    alert('가입 성공!');
  } catch (err) { alert('가입 실패 (6자 이상 입력)'); }
};

document.getElementById('loginForm').onsubmit = async (e) => {
  e.preventDefault();
  const id = document.getElementById('loginId').value;
  const pw = document.getElementById('loginPassword').value;
  try { await signInWithEmailAndPassword(auth, `${id}@japan.com`, pw); } 
  catch (err) { alert('정보를 확인하세요.'); }
};

document.getElementById('logoutBtn').onclick = () => signOut(auth);
document.getElementById('toSignup').onclick = () => show('signup');
document.getElementById('toLogin').onclick = () => show('login');

// --- 게임 로직 ---
let state = { questions: [], idx: 0, lang: 'ko_ko' };

document.getElementById('startQuizBtn').onclick = () => {
  state.lang = document.getElementById('langMode').value;
  const count = parseInt(document.getElementById('questionCount').value);
  state.questions = [...PREFECTURE_DB].sort(() => Math.random() - 0.5).slice(0, count);
  state.idx = 0;
  show('quiz');
  next();
};

function next() {
  if (state.idx >= state.questions.length) {
    alert('완료!'); show('setup'); return;
  }
  const q = state.questions[state.idx];
  document.getElementById('currentNum').textContent = state.idx + 1;
  document.getElementById('totalNum').textContent = state.questions.length;
  
  // 실루엣 그리기
  const canvas = document.getElementById('shapeCanvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 240, 200);
  const path = new Path2D(q.path);
  ctx.fillStyle = "#2d3436";
  ctx.fill(path);
  ctx.strokeStyle = "#4834d4";
  ctx.lineWidth = 3;
  ctx.stroke(path);

  // 문제 언어 설정
  document.getElementById('questionText').textContent = (state.lang === 'jp_jp') ? "ここはどこですか？" : "이곳은 어디일까요?";

  // 보기 생성
  const container = document.getElementById('optionsContainer');
  container.innerHTML = '';
  let opts = [q];
  while(opts.length < 4) {
    let r = PREFECTURE_DB[Math.floor(Math.random()*47)];
    if(!opts.includes(r)) opts.push(r);
  }
  opts.sort(() => Math.random()-0.5).forEach(o => {
    const b = document.createElement('button');
    b.className = 'btn-option';
    b.textContent = (state.lang === 'ko_ko') ? o.ko : o.jp;
    b.onclick = () => {
      if(o.id === q.id) alert('정답!');
      else alert(`틀렸습니다. 정답: ${(state.lang === 'ko_ko') ? q.ko : q.jp}`);
      state.idx++; next();
    };
    container.appendChild(b);
  });
}
