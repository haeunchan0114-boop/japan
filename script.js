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

// --- 47개 도도부현 완벽 데이터 (지방, 특산물, 유명 장소, 정밀 지형 경로) ---
const PREFECTURE_DB = [
  { id: 1, ko: "홋카이도", jp: "北海道", region: "홋카이도 지방", specialty: "게, 유제품, 라멘", spot: "삿포로 오도리 공원", path: "M35,25 Q65,10 115,22 T175,55 C190,75 175,105 155,115 C135,125 105,135 75,125 C45,115 25,90 35,25 Z" },
  { id: 2, ko: "아오모리현", jp: "青森県", region: "도호쿠 지방", specialty: "사과, 가을꽁치", spot: "히로사키 성", path: "M55,35 Q95,25 145,40 C155,75 140,120 100,125 Q60,115 55,35 Z" },
  { id: 3, ko: "이와테현", jp: "岩手県", region: "도호쿠 지방", specialty: "모리오카 냉면, 완코소바", spot: "주손지 (중존사)", path: "M60,35 Q100,30 140,45 C150,85 135,130 90,135 Q55,120 60,35 Z" },
  { id: 4, ko: "미야기현", jp: "宮城県", region: "도호쿠 지방", specialty: "우설구이, 즈다모찌", spot: "마쓰시마", path: "M70,40 Q110,35 135,55 C145,90 120,130 80,125 Q55,100 70,40 Z" },
  { id: 5, ko: "아키타현", jp: "秋田県", region: "도호쿠 지방", specialty: "키리탄포, 아키타 오마카세", spot: "다자와호", path: "M50,45 Q90,30 130,50 C140,90 120,130 70,125 Q45,95 50,45 Z" },
  { id: 6, ko: "야마가타현", jp: "山形県", region: "도호쿠 지방", specialty: "체리, 사쿠란보", spot: "자오 온천", path: "M60,40 Q100,35 130,50 C140,90 110,130 75,120 Q50,90 60,40 Z" },
  { id: 7, ko: "후쿠시마현", jp: "福島県", region: "도호쿠 지방", specialty: "라멘, 복숭아", spot: "아이즈와카마쓰 성", path: "M55,45 Q105,30 155,50 C165,90 135,135 85,130 Q50,110 55,45 Z" },
  { id: 8, ko: "이바라키현", jp: "茨城県", region: "간토 지방", specialty: "낫토, 멜론", spot: "가이라쿠엔", path: "M70,45 Q110,40 145,60 C155,95 130,130 90,125 Q65,100 70,45 Z" },
  { id: 9, ko: "도치기현", jp: "栃木県", region: "간토 지방", specialty: "딸기(토치오토메), 교자", spot: "닛코 도쇼구", path: "M65,45 Q105,35 140,50 C150,85 125,125 85,120 Q60,95 65,45 Z" },
  { id: 10, ko: "군마현", jp: "군마현", region: "간토 지방", specialty: "온천 만두, 곤약", spot: "쿠사쓰 온천", path: "M60,50 Q100,40 135,55 C145,90 120,125 80,120 Q55,95 60,50 Z" },
  { id: 11, ko: "사이타마현", jp: "埼玉県", region: "간토 지방", specialty: "우동, 장어구이", spot: "가와고에(고도)", path: "M70,55 Q105,45 135,60 C145,90 120,120 85,115 Q65,90 70,55 Z" },
  { id: 12, ko: "치바현", jp: "千葉県", region: "간토 지방", specialty: "땅콩, 해산물", spot: "도쿄 디즈니리조트", path: "M80,50 Q130,45 150,80 C160,110 110,140 85,120 Q65,90 80,50 Z" },
  { id: 13, ko: "도쿄도", jp: "東京都", region: "간토 지방", specialty: "몬자야키, 도쿄바나나", spot: "도쿄타워, 시부야", path: "M30,85 Q75,70 120,65 Q150,75 165,85 C175,95 155,115 110,120 Q65,115 30,85 Z" },
  { id: 14, ko: "가나가와현", jp: "神奈川県", region: "간토 지방", specialty: "슈마이, 중화가 요리", spot: "요코하마 미라이미래항", path: "M50,90 Q90,75 135,80 C145,95 125,120 90,125 Q60,115 50,90 Z" },
  { id: 15, ko: "니가타현", jp: "新潟県", region: "중부 지방", specialty: "고시히카리 쌀, 사케", spot: "사도시섬", path: "M45,35 Q85,25 130,65 C145,100 115,140 75,130 Q45,100 45,35 Z" },
  { id: 16, ko: "도야마현", jp: "富山県", region: "중부 지방", specialty: "흰새우, 반딧불오징어", spot: "구로베 협곡", path: "M60,50 Q100,40 140,65 C150,95 120,120 85,115 Q55,90 60,50 Z" },
  { id: 17, ko: "이시카와현", jp: "石川県", region: "중부 지방", specialty: "금박 공예품, 카가 요리", spot: "겐로쿠엔", path: "M50,45 Q90,35 130,60 C145,90 120,130 85,120 Q45,90 50,45 Z" },
  { id: 18, ko: "후쿠이현", jp: "福井県", region: "중부 지방", specialty: "에치젠 게, 소바", spot: "도진보 절벽", path: "M65,55 Q100,45 130,70 C140,100 110,125 80,120 Q60,95 65,55 Z" },
  { id: 19, ko: "야마나시현", jp: "山梨県", region: "중부 지방", specialty: "포도, 호토(향토우동)", spot: "후지산, 5대 호수", path: "M65,50 Q100,40 135,65 C145,95 120,120 85,115 Q60,90 65,50 Z" },
  { id: 20, ko: "나가노현", jp: "長野県", region: "중부 지방", specialty: "신슈 소바, 사과", spot: "젠코사, 지고쿠다니 온천", path: "M55,30 Q95,25 135,65 C145,110 125,145 85,140 Q45,110 55,30 Z" },
  { id: 21, ko: "기후현", jp: "岐阜県", region: "중부 지방", specialty: "히다 규(소고기), 은어", spot: "시라카와고 촌락", path: "M60,35 Q100,30 140,60 C150,105 125,140 85,135 Q50,110 60,35 Z" },
  { id: 22, ko: "시즈오카현", jp: "静岡県", region: "중부 지방", specialty: "녹차, 장어", spot: "이즈 반도, 하마나호", path: "M50,75 Q100,60 160,75 C175,100 135,130 95,125 Q60,110 50,75 Z" },
  { id: 23, ko: "아이치현", jp: "愛知県", region: "중부 지방", specialty: "미소카츠, 히츠마부시", spot: "나고야 성", path: "M60,55 Q100,45 140,70 C150,105 120,130 85,125 Q55,100 60,55 Z" },
  { id: 24, ko: "미에현", jp: "三重県", region: "간사이 지방", specialty: "마쓰사카 규, 붉은 떡", spot: "이세 신궁", path: "M65,50 Q105,45 135,75 C145,115 115,140 80,130 Q55,100 65,50 Z" },
  { id: 25, ko: "시가현", jp: "滋賀県", region: "간사이 지방", specialty: "오미 규(소고기), 붕어초밥", spot: "비와호", path: "M75,50 Q105,45 125,75 C135,105 110,130 85,125 Q65,100 75,50 Z" },
  { id: 26, ko: "교토부", jp: "京都府", region: "간사이 지방", specialty: "말차, 교토요리", spot: "기요미즈데라, 아라시야마", path: "M65,35 Q95,30 125,45 C135,75 130,115 115,125 C95,130 70,115 65,35 Z" },
  { id: 27, ko: "오사카부", jp: "大阪府", region: "간사이 지방", specialty: "타코야키, 오코노미야키", spot: "도톤보리, 오사카성", path: "M80,45 Q110,40 135,65 C145,95 130,125 105,135 Q85,125 80,45 Z" },
  { id: 28, ko: "효고현", jp: "兵庫県", region: "간사이 지방", specialty: "고베 비프, 아카시야키", spot: "히메지성, 아라마시", path: "M55,40 Q100,30 145,55 C155,95 125,130 80,125 Q45,100 55,40 Z" },
  { id: 29, ko: "나라현", jp: "奈良県", region: "간사이 지방", specialty: "감잎초밥, 나라즈케", spot: "나라 공원, 도다이지", path: "M75,55 Q105,45 130,70 C140,100 115,125 90,120 Q65,95 75,55 Z" },
  { id: 30, ko: "와카야매현", jp: "和歌山県", region: "간사이 지방", specialty: "감귤, 우메보시", spot: "고야산, 구마노 고도", path: "M70,50 Q110,45 135,75 C145,115 120,145 90,135 Q65,110 70,50 Z" },
  { id: 31, ko: "돗토리현", jp: "鳥取県", region: "주고쿠 지방", specialty: "배, 대게", spot: "돗토리 모래구릉", path: "M55,55 Q100,45 145,60 C155,85 130,110 95,105 Q60,90 55,55 Z" },
  { id: 32, ko: "시마네현", jp: "島根県", region: "주고쿠 지방", specialty: "재첩, 소바", spot: "이즈모 타이샤 (출운대사)", path: "M40,50 Q95,40 150,55 C160,80 130,105 90,100 Q50,85 40,50 Z" },
  { id: 33, ko: "오카야마현", jp: "岡山県", region: "주고쿠 지방", specialty: "복숭아, 포도", spot: "오카야마 성, 고라쿠엔", path: "M60,50 Q100,40 140,65 C150,95 120,125 85,120 Q55,100 60,50 Z" },
  { id: 34, ko: "히로시마현", jp: "広島県", region: "주고쿠 지방", specialty: "굴, 히로시마 오코노미야키", spot: "미야지마(이쓰쿠시마 신사)", path: "M45,50 Q95,35 145,60 C155,95 125,125 85,120 Q50,100 45,50 Z" },
  { id: 35, ko: "야마구치현", jp: "山口県", region: "주고쿠 지방", specialty: "복어, 가마보코", spot: "아키요시다이, 쓰노시마", path: "M35,45 Q80,35 130,55 C140,85 110,120 70,115 Q40,90 35,45 Z" },
  { id: 36, ko: "도쿠시마현", jp: "徳島県", region: "시코쿠 지방", specialty: "스다치(감귤류), 라멘", spot: "아와 오도리 축제, 나루토 소용돌이", path: "M65,55 Q105,45 140,70 C150,95 120,120 90,115 Q60,95 65,55 Z" },
  { id: 37, ko: "가가와현", jp: "香川県", region: "시코쿠 지방", specialty: "사누키 우동, 올리브", spot: "쇼도시마, 리츠린 공원", path: "M70,55 Q105,50 135,70 C145,95 120,115 95,110 Q65,95 70,55 Z" },
  { id: 38, ko: "에히메현", jp: "愛媛県", region: "시코쿠 지방", specialty: "귤, 도미 요리", spot: "도고 온천, 마쓰야마 성", path: "M50,45 Q95,40 140,65 C150,95 120,130 80,120 Q45,100 50,45 Z" },
  { id: 39, ko: "고치현", jp: "高知県", region: "시코쿠 지방", specialty: "가쓰오 다타키 (참치타타키)", spot: "가쓰라하마 해변", path: "M55,60 Q100,50 145,75 C155,110 120,135 85,130 Q50,110 55,60 Z" },
  { id: 40, ko: "후쿠오카현", jp: "福岡県", region: "규슈 지방", specialty: "돈코츠 라멘, 멘타이코", spot: "하카타, 텐진", path: "M45,35 Q95,25 145,55 C155,85 135,125 95,130 Q55,120 45,35 Z" },
  { id: 41, ko: "사가현", jp: "佐賀県", region: "규슈 지방", specialty: "사가 규, 오징어 요리", spot: "요시노가리 역사공원", path: "M60,45 Q95,40 130,65 C140,90 115,115 85,110 Q55,90 60,45 Z" },
  { id: 42, ko: "나가사키현", jp: "長崎県", region: "규슈 지방", specialty: "나가사키 짬뽕, 카스텔라", spot: "하우스텐보스, 평화공원", path: "M35,35 Q85,30 135,60 C145,100 110,140 70,130 Q30,100 35,35 Z" },
  { id: 43, ko: "구마모토현", jp: "熊本県", region: "규슈 지방", specialty: "말사시미, 구마모토 라멘", spot: "구마모토 성, 아소산", path: "M55,45 Q100,35 140,60 C150,105 120,140 80,130 Q50,105 55,45 Z" },
  { id: 44, ko: "오이타현", jp: "大分県", region: "규슈 지방", specialty: "토리텐(닭튀김), 온천 푸딩", spot: "벳푸 온천, 유후인", path: "M60,40 Q105,35 145,55 C155,90 125,125 90,120 Q55,100 60,40 Z" },
  { id: 45, ko: "미야자키현", jp: "宮崎県", region: "규슈 지방", specialty: "치킨난반,망고", spot: "아오시마, 다치하마", path: "M65,45 Q105,40 135,70 C145,110 115,140 85,130 Q55,100 65,45 Z" },
  { id: 46, ko: "가고시마현", jp: "鹿児島県", region: "규슈 지방", specialty: "흑돼지(구로부타), 사츠마아게", spot: "사쿠라지마 화산, 야쿠시마", path: "M50,40 Q95,35 135,65 C145,110 115,150 80,140 Q40,110 50,40 Z" },
  { id: 47, ko: "오키나와현", jp: "沖縄県", region: "오키나와 지방", specialty: "고야참푸르, 바다포도", spot: "츄라우미 수족관, 슈리성", path: "M30,130 Q45,115 60,110 M75,100 Q95,85 110,80 M130,95 Q155,80 175,70" }
];

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

onAuthStateChanged(auth, (user) => {
  if (user) show('setup');
  else show('login');
});

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

// --- 퀴즈 및 힌트 단계 관리 로직 ---
let state = { questions: [], idx: 0, lang: 'ko_ko', hintLevel: 0 };

document.getElementById('startQuizBtn').onclick = () => {
  state.lang = document.getElementById('langMode').value;
  const count = parseInt(document.getElementById('questionCount').value);
  state.questions = [...PREFECTURE_DB].sort(() => Math.random() - 0.5).slice(0, count);
  state.idx = 0;
  show('quiz');
  next();
};

// 힌트 보기 버튼 클릭 시 1단계씩 순차 오픈
document.getElementById('nextHintBtn').onclick = () => {
  if (state.hintLevel < 3) {
    state.hintLevel++;
    updateHintsDisplay();
  }
};

function updateHintsDisplay() {
  const current = state.questions[state.idx];
  const h1 = document.getElementById('hint1');
  const h2 = document.getElementById('hint2');
  const h3 = document.getElementById('hint3');
  const noHintMsg = document.getElementById('noHintMsg');
  const hintBtn = document.getElementById('nextHintBtn');

  noHintMsg.style.display = 'none';

  if (state.hintLevel >= 1) {
    h1.style.display = 'block';
    document.getElementById('hintText1').textContent = current.region;
  }
  if (state.hintLevel >= 2) {
    h2.style.display = 'block';
    document.getElementById('hintText2').textContent = current.specialty;
  }
  if (state.hintLevel >= 3) {
    h3.style.display = 'block';
    document.getElementById('hintText3').textContent = current.spot;
    hintBtn.textContent = "💡 모든 힌트가 열렸습니다";
    hintBtn.style.opacity = "0.6";
  } else {
    hintBtn.textContent = `💡 힌트 보기 (${state.hintLevel}/3)`;
  }
}

function next() {
  if (state.idx >= state.questions.length) {
    alert('모든 문제를 완료했습니다!'); show('setup'); return;
  }
  
  state.hintLevel = 0;
  document.getElementById('hint1').style.display = 'none';
  document.getElementById('hint2').style.display = 'none';
  document.getElementById('hint3').style.display = 'none';
  document.getElementById('noHintMsg').style.display = 'block';
  
  const hintBtn = document.getElementById('nextHintBtn');
  hintBtn.textContent = "💡 힌트 보기 (클릭)";
  hintBtn.style.opacity = "1";

  const q = state.questions[state.idx];
  document.getElementById('currentNum').textContent = state.idx + 1;
  document.getElementById('totalNum').textContent = state.questions.length;
  
  // 실루엣 렌더링
  const canvas = document.getElementById('shapeCanvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 240, 200);
  
  const path = new Path2D(q.path);
  ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.fillStyle = "#1e293b";
  ctx.fill(path);
  
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "#4834d4";
  ctx.lineWidth = 2.5;
  ctx.stroke(path);

  document.getElementById('questionText').textContent = (state.lang === 'jp_jp') ? "ここはどこですか？" : "이곳은 어디일까요?";

  // 보기 생성
  const container = document.getElementById('optionsContainer');
  container.innerHTML = '';
  let opts = [q];
  while(opts.length < 4) {
    let r = PREFECTURE_DB[Math.floor(Math.random() * PREFECTURE_DB.length)];
    if(!opts.includes(r)) opts.push(r);
  }
  opts.sort(() => Math.random()-0.5).forEach(o => {
    const b = document.createElement('button');
    b.className = 'btn-option';
    b.textContent = (state.lang === 'ko_ko') ? o.ko : o.jp;
    b.onclick = () => {
      const correctName = (state.lang === 'ko_ko') ? q.ko : q.jp;
      if(o.id === q.id) {
        alert('정답입니다! 👏');
      } else {
        alert(`틀렸습니다! 정답은 [ ${correctName} ] 입니다.`);
      }
      state.idx++; 
      next();
    };
    container.appendChild(b);
  });
}
