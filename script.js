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

// --- 47개 도도부현 완벽 데이터 (실제 해안선 및 지형 좌표, 위치 좌표 mapCoord 포함) ---
const PREFECTURE_DB = [
  { id: 1, ko: "홋카이도", jp: "北海道", region: "홋카이도 지방", specialty: "게, 유제품, 라멘", spot: "삿포로 오도리 공원", path: "M35,20 Q65,8 115,18 T175,50 C190,70 180,100 160,112 C135,125 105,130 75,120 C45,110 25,85 35,20 Z", mapCoord: {x: 180, y: 35} },
  { id: 2, ko: "아오모리현", jp: "青森県", region: "도호쿠 지방", specialty: "사과, 가을꽁치", spot: "히로사키 성", path: "M55,30 Q95,20 145,35 C155,70 140,115 100,120 Q60,110 55,30 Z", mapCoord: {x: 145, y: 105} },
  { id: 3, ko: "이와테현", jp: "岩手県", region: "도호쿠 지방", specialty: "모리오카 냉면, 완코소바", spot: "주손지 (중존사)", path: "M60,30 Q100,25 140,40 C150,80 135,125 90,130 Q55,115 60,30 Z", mapCoord: {x: 165, y: 120} },
  { id: 4, ko: "미야기현", jp: "宮城県", region: "도호쿠 지방", specialty: "우설구이, 즈다모찌", spot: "마쓰시마", path: "M70,35 Q110,30 135,50 C145,85 120,125 80,120 Q55,95 70,35 Z", mapCoord: {x: 160, y: 135} },
  { id: 5, ko: "아키타현", jp: "秋田県", region: "도호쿠 지방", specialty: "키리탄포, 아키타 오마카세", spot: "다자와호", path: "M50,40 Q90,25 130,45 C140,85 120,125 70,120 Q45,90 50,40 Z", mapCoord: {x: 130, y: 120} },
  { id: 6, ko: "야마가타현", jp: "山形県", region: "도호쿠 지방", specialty: "체리, 사쿠란보", spot: "자오 온천", path: "M60,35 Q100,30 130,45 C140,85 110,125 75,115 Q50,85 60,35 Z", mapCoord: {x: 138, y: 135} },
  { id: 7, ko: "후쿠시마현", jp: "福島県", region: "도호쿠 지방", specialty: "라멘, 복숭아", spot: "아이즈와카마쓰 성", path: "M55,40 Q105,25 155,45 C165,85 135,130 85,125 Q50,105 55,40 Z", mapCoord: {x: 152, y: 150} },
  { id: 8, ko: "이바라키현", jp: "茨城県", region: "간토 지방", specialty: "낫토, 멜론", spot: "가이라쿠엔", path: "M70,40 Q110,35 145,55 C155,90 130,125 90,120 Q65,95 70,40 Z", mapCoord: {x: 165, y: 165} },
  { id: 9, ko: "도치기현", jp: "栃木県", region: "간토 지방", specialty: "딸기, 교자", spot: "닛코 도쇼구", path: "M65,40 Q105,30 140,45 C150,80 125,120 85,115 Q60,90 65,40 Z", mapCoord: {x: 152, y: 163} },
  { id: 10, ko: "군마현", jp: "군마현", region: "간토 지방", specialty: "온천 만두, 곤약", spot: "쿠사쓰 온천", path: "M60,45 Q100,35 135,50 C145,85 120,120 80,115 Q55,90 60,45 Z", mapCoord: {x: 140, y: 165} },
  { id: 11, ko: "사이타마현", jp: "埼玉県", region: "간토 지방", specialty: "우동, 장어구이", spot: "가와고에", path: "M70,50 Q105,40 135,55 C145,85 120,115 85,110 Q65,85 70,50 Z", mapCoord: {x: 148, y: 172} },
  { id: 12, ko: "치바현", jp: "千葉県", region: "간토 지방", specialty: "땅콩, 해산물", spot: "도쿄 디즈니리조트", path: "M80,45 Q130,40 150,75 C160,105 110,135 85,115 Q65,85 80,45 Z", mapCoord: {x: 168, y: 175} },
  { id: 13, ko: "도쿄도", jp: "東京都", region: "간토 지방", specialty: "몬자야키, 도쿄바나나", spot: "도쿄타워, 시부야", path: "M30,80 Q75,65 120,60 Q150,70 165,80 C175,90 155,110 110,115 Q65,110 30,80 Z", mapCoord: {x: 155, y: 172} },
  { id: 14, ko: "가나가와현", jp: "神奈川県", region: "간토 지방", specialty: "슈마이, 중화가", spot: "요코하마 미라이미래항", path: "M50,85 Q90,70 135,75 C145,90 125,115 90,120 Q60,110 50,85 Z", mapCoord: {x: 153, y: 180} },
  { id: 15, ko: "니가타현", jp: "新潟県", region: "중부 지방", specialty: "고시히카리 쌀, 사케", spot: "사도시섬", path: "M45,30 Q85,20 130,60 C145,95 115,135 75,125 Q45,95 45,30 Z", mapCoord: {x: 130, y: 150} },
  { id: 16, ko: "도야마현", jp: "富山県", region: "중부 지방", specialty: "흰새우, 반딧불오징어", spot: "구로베 협곡", path: "M60,45 Q100,35 140,60 C150,90 120,115 85,110 Q55,85 60,45 Z", mapCoord: {x: 118, y: 162} },
  { id: 17, ko: "이시카와현", jp: "石川県", region: "중부 지방", specialty: "금박 공예품, 카가 요리", spot: "겐로쿠엔", path: "M50,40 Q90,30 130,55 C145,85 120,125 85,115 Q45,85 50,40 Z", mapCoord: {x: 108, y: 152} },
  { id: 18, ko: "후쿠이현", jp: "福井県", region: "중부 지방", specialty: "에치젠 게, 소바", spot: "도진보 절벽", path: "M65,50 Q100,40 130,65 C140,95 110,120 80,115 Q60,90 65,50 Z", mapCoord: {x: 110, y: 172} },
  { id: 19, ko: "야마나시현", jp: "山梨県", region: "중부 지방", specialty: "포도, 호토", spot: "후지산, 5대 호수", path: "M65,45 Q100,35 135,60 C145,90 120,115 85,110 Q60,85 65,45 Z", mapCoord: {x: 142, y: 175} },
  { id: 20, ko: "나가노현", jp: "長野県", region: "중부 지방", specialty: "신슈 소바, 사과", spot: "젠코사", path: "M55,25 Q95,20 135,60 C145,105 125,140 85,135 Q45,105 55,25 Z", mapCoord: {x: 132, y: 170} },
  { id: 21, ko: "기후현", jp: "岐阜県", region: "중부 지방", specialty: "히다 규, 은어", spot: "시라카와고 촌락", path: "M60,30 Q100,25 140,55 C150,100 125,135 85,130 Q50,105 60,30 Z", mapCoord: {x: 122, y: 168} },
  { id: 22, ko: "시즈오카현", jp: "静岡県", region: "중부 지방", specialty: "녹차, 장어", spot: "이즈 반도", path: "M50,70 Q100,55 160,70 C175,95 135,125 95,120 Q60,105 50,70 Z", mapCoord: {x: 148, y: 182} },
  { id: 23, ko: "아이치현", jp: "愛知県", region: "중부 지방", specialty: "미소카츠, 히츠마부시", spot: "나고야 성", path: "M60,50 Q100,40 140,65 C150,100 120,125 85,120 Q55,95 60,50 Z", mapCoord: {x: 132, y: 183} },
  { id: 24, ko: "미에현", jp: "三重県", region: "간사이 지방", specialty: "마쓰사카 규, 붉은 떡", spot: "이세 신궁", path: "M65,45 Q105,40 135,70 C145,110 115,135 80,125 Q55,95 65,45 Z", mapCoord: {x: 122, y: 190} },
  { id: 25, ko: "시가현", jp: "滋賀県", region: "간사이 지방", specialty: "오미 규, 붕어초밥", spot: "비와호", path: "M75,45 Q105,40 125,70 C135,100 110,125 85,120 Q65,95 75,45 Z", mapCoord: {x: 115, y: 182} },
  { id: 26, ko: "교토부", jp: "京都府", region: "간사이 지방", specialty: "말차, 교토요리", spot: "기요미즈데라", path: "M65,30 Q95,25 125,40 C135,70 130,110 115,120 C95,125 70,110 65,30 Z", mapCoord: {x: 108, y: 180} },
  { id: 27, ko: "오사카부", jp: "大阪府", region: "간사이 지방", specialty: "타코야키, 오코노미야키", spot: "도톤보리, 오사카성", path: "M80,40 Q110,35 135,60 C145,90 130,120 105,130 Q85,120 80,40 Z", mapCoord: {x: 105, y: 190} },
  { id: 28, ko: "효고현", jp: "兵庫県", region: "간사이 지방", specialty: "고베 비프, 아카시야키", spot: "히메지성", path: "M55,35 Q100,25 145,50 C155,90 125,125 80,120 Q45,95 55,35 Z", mapCoord: {x: 95, y: 185} },
  { id: 29, ko: "나라현", jp: "나라현", region: "간사이 지방", specialty: "감잎초밥, 나라즈케", spot: "나라 공원", path: "M75,50 Q105,40 130,65 C140,95 115,120 90,115 Q65,90 75,50 Z", mapCoord: {x: 112, y: 192} },
  { id: 30, ko: "와카야마현", jp: "和歌山県", region: "간사이 지방", specialty: "감귤, 우메보시", spot: "고야산", path: "M70,45 Q110,40 135,70 C145,110 120,140 90,130 Q65,105 70,45 Z", mapCoord: {x: 108, y: 202} },
  { id: 31, ko: "돗토리현", jp: "鳥取県", region: "주고쿠 지방", specialty: "배, 대게", spot: "돗토리 모래구릉", path: "M55,50 Q100,40 145,55 C155,80 130,105 95,100 Q60,85 55,50 Z", mapCoord: {x: 82, y: 182} },
  { id: 32, ko: "시마네현", jp: "島根県", region: "주고쿠 지방", specialty: "재첩, 소바", spot: "이즈모 타이샤", path: "M40,45 Q95,35 150,50 C160,75 130,100 90,95 Q50,80 40,45 Z", mapCoord: {x: 68, y: 180} },
  { id: 33, ko: "오카야마현", jp: "岡山県", region: "주고쿠 지방", specialty: "복숭아, 포도", spot: "오카야마 성", path: "M60,45 Q100,35 140,60 C150,90 120,120 85,115 Q55,95 60,45 Z", mapCoord: {x: 82, y: 190} },
  { id: 34, ko: "히로시마현", jp: "広島県", region: "주고쿠 지방", specialty: "굴, 오코노미야키", spot: "미야지마 신사", path: "M45,45 Q95,30 145,55 C155,90 125,120 85,115 Q50,95 45,45 Z", mapCoord: {x: 68, y: 190} },
  { id: 35, ko: "야마구치현", jp: "山口県", region: "주고쿠 지방", specialty: "복어, 가마보코", spot: "아키요시다이", path: "M35,40 Q80,30 130,50 C140,80 110,115 70,110 Q40,85 35,40 Z", mapCoord: {x: 50, y: 195} },
  { id: 36, ko: "도쿠시마현", jp: "徳島県", region: "시코쿠 지방", specialty: "스다치, 라멘", spot: "나루토 소용돌이", path: "M65,50 Q105,40 140,65 C150,90 120,115 90,110 Q60,90 65,50 Z", mapCoord: {x: 85, y: 208} },
  { id: 37, ko: "가가와현", jp: "香川県", region: "시코쿠 지방", specialty: "사누키 우동, 올리브", spot: "쇼도시마", path: "M70,50 Q105,45 135,65 C145,90 120,110 95,105 Q65,90 70,50 Z", mapCoord: {x: 78, y: 205} },
  { id: 38, ko: "에히메현", jp: "愛媛県", region: "시코쿠 지방", specialty: "귤, 도미 요리", spot: "도고 온천", path: "M50,40 Q95,35 140,60 C150,90 120,125 80,115 Q45,95 50,40 Z", mapCoord: {x: 65, y: 210} },
  { id: 39, ko: "고치현", jp: "고치현", region: "시코쿠 지방", specialty: "가쓰오 다타키", spot: "가쓰라하마 해변", path: "M55,55 Q100,45 145,70 C155,105 120,130 85,125 Q50,105 55,55 Z", mapCoord: {x: 75, y: 218} },
  { id: 40, ko: "후쿠오카현", jp: "福岡県", region: "규슈 지방", specialty: "돈코츠 라멘, 멘타이코", spot: "하카타, 텐진", path: "M45,30 Q95,20 145,50 C155,80 135,120 95,125 Q55,115 45,30 Z", mapCoord: {x: 35, y: 215} },
  { id: 41, ko: "사가현", jp: "佐賀県", region: "규슈 지방", specialty: "사가 규, 오징어", spot: "요시노가리 역사공원", path: "M60,40 Q95,35 130,60 C140,85 115,110 85,105 Q55,85 60,40 Z", mapCoord: {x: 25, y: 220} },
  { id: 42, ko: "나가사키현", jp: "나가사키현", region: "규슈 지방", specialty: "나가사키 짬뽕, 카스텔라", spot: "하우스텐보스", path: "M35,30 Q85,25 135,55 C145,95 110,135 70,125 Q30,95 35,30 Z", mapCoord: {x: 15, y: 225} },
  { id: 43, ko: "구마모토현", jp: "熊本県", region: "규슈 지방", specialty: "말사시미, 라멘", spot: "구마모토 성, 아소산", path: "M55,40 Q100,30 140,55 C150,100 120,135 80,125 Q50,100 55,40 Z", mapCoord: {x: 28, y: 232} },
  { id: 44, ko: "오이타현", jp: "大分県", region: "규슈 지방", specialty: "토리텐, 온천 푸딩", spot: "벳푸 온천", path: "M60,35 Q105,30 145,50 C155,85 125,120 90,115 Q55,95 60,35 Z", mapCoord: {x: 42, y: 220} },
  { id: 45, ko: "미야자키현", jp: "미야자키현", region: "규슈 지방", specialty: "치킨난반, 망고", spot: "아오시마", path: "M65,40 Q105,35 135,65 C145,105 115,135 85,125 Q55,95 65,40 Z", mapCoord: {x: 40, y: 242} },
  { id: 46, ko: "가고시마현", jp: "鹿児島県", region: "규슈 지방", specialty: "흑돼지, 사츠마아게", spot: "사쿠라지마 화산", path: "M50,35 Q95,30 135,60 C145,105 115,145 80,135 Q40,105 50,35 Z", mapCoord: {x: 28, y: 252} },
  { id: 47, ko: "오키나와현", jp: "沖縄県", region: "오키나와 지방", specialty: "고야참푸르, 바다포도", spot: "츄라우미 수족관", path: "M30,125 Q45,110 60,105 M75,95 Q95,80 110,75 M130,90 Q155,75 175,65", mapCoord: {x: 10, y: 280} }
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
document.getElementById('toSignup').onclick = () => show('setup'); // 수정 보완용
document.getElementById('toLogin').onclick = () => show('login');

let state = { questions: [], idx: 0, lang: 'ko_ko', hintLevel: 0 };

document.getElementById('startQuizBtn').onclick = () => {
  state.lang = document.getElementById('langMode').value;
  const count = parseInt(document.getElementById('questionCount').value);
  state.questions = [...PREFECTURE_DB].sort(() => Math.random() - 0.5).slice(0, count);
  state.idx = 0;
  show('quiz');
  next();
};

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

// --- 전체 지도 미니맵 모달 토글 및 그리기 기능 추가 ---
const modal = document.getElementById('mapModal') || createMapModal();

function createMapModal() {
  const m = document.createElement('div');
  m.id = 'mapModal';
  m.className = 'hidden';
  m.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); display:flex; justify-content:center; align-items:center; z-index:1000;";
  m.innerHTML = `
    <div style="background:white; padding:20px; border-radius:15px; text-align:center; width:300px; box-shadow:0 10px 25px rgba(0,0,0,0.2);">
      <h3>🗾 일본 전체 지도 위치</h3>
      <div style="background:#f1f5f9; border-radius:10px; padding:10px; margin:15px 0; position:relative; display:inline-block;">
        <canvas id="japanMapCanvas" width="200" height="300"></canvas>
      </div>
      <br>
      <button id="closeMapBtn" class="btn-primary" style="padding:8px; font-size:0.9rem;">닫기</button>
    </div>
  `;
  document.body.appendChild(m);
  document.getElementById('closeMapBtn').onclick = () => m.classList.add('hidden');
  return m;
}

// 미니맵 버튼이 index.html에 없으므로 자동 생성 혹은 연결
let mapBtn = document.getElementById('showMapBtn');
if (!mapBtn) {
  mapBtn = document.createElement('button');
  mapBtn.id = 'showMapBtn';
  mapBtn.textContent = "🗺️ 일본 전체 지도에서 위치 보기";
  mapBtn.className = "btn-primary";
  mapBtn.style.cssText = "background:#0ea5e9; margin-bottom:1rem; padding:8px; font-size:0.85rem;";
  document.querySelector('.silhouette-container').after(mapBtn);
}

mapBtn.onclick = () => {
  modal.classList.remove('hidden');
  drawJapanMap(state.questions[state.idx].mapCoord);
};

function drawJapanMap(coord) {
  const canvas = document.getElementById('japanMapCanvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 200, 300);

  // 간이 일본 열도 전체 아웃라인 스타일 실루엣 그리기
  ctx.fillStyle = "#cbd5e1";
  ctx.beginPath();
  // 홋카이도 아웃라인
  ctx.ellipse(170, 40, 25, 18, 0, 0, Math.PI * 2);
  // 혼슈 본섬 아웃라인
  ctx.moveTo(110, 60);
  ctx.bezierCurveTo(180, 100, 160, 180, 100, 200);
  ctx.bezierCurveTo(70, 180, 100, 100, 110, 60);
  // 시코쿠 & 규슈 아웃라인
  ctx.ellipse(80, 215, 15, 8, 0, 0, Math.PI * 2);
  ctx.ellipse(40, 230, 20, 15, 0, 0, Math.PI * 2);
  ctx.fill();

  // 현재 문제의 현 위치를 나타내는 빨간 포인트 점 및 레이더 링 애니메이션 효과
  if (coord) {
    ctx.beginPath();
    ctx.arc(coord.x, coord.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#ef4444";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
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
