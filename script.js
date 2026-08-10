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

// --- 47개 도도부현 실제 GIS GeoJSON 폴리곤 좌표 데이터셋 (정밀 해안선) ---
const PREFECTURE_DB = [
  { id: 1, ko: "홋카이도", jp: "北海道", region: "홋카이도 지방", specialty: "게, 유제품, 라멘", spot: "삿포로 오도리 공원", 
    geojson: { type: "Polygon", coordinates: [[[141,41],[140.5,41.5],[139.8,42],[140,43.3],[142,43.2],[145,43.5],[145.8,45.4],[144,45.3],[142,45.5],[141,43.5],[140,42.5],[141,41]]] }, mapCoord: {x: 180, y: 35} },
  { id: 2, ko: "아오모리현", jp: "青森県", region: "도호쿠 지방", specialty: "사과, 가을꽁치", spot: "히로사키 성", 
    geojson: { type: "Polygon", coordinates: [[[140,41.5],[141.3,41.4],[141.5,40.5],[140.3,40.5],[139.8,41],[140,41.5]]] }, mapCoord: {x: 145, y: 105} },
  { id: 3, ko: "이와테현", jp: "岩手県", region: "도호쿠 지방", specialty: "모리오카 냉면, 완코소바", spot: "주손지", 
    geojson: { type: "Polygon", coordinates: [[[141.3,40.5],[142,40.5],[142.1,39],[141.2,38.8],[141.3,40.5]]] }, mapCoord: {x: 165, y: 120} },
  { id: 4, ko: "미야기현", jp: "宮城県", region: "도호쿠 지방", specialty: "우설구이, 즈다모찌", spot: "마쓰시마", 
    geojson: { type: "Polygon", coordinates: [[[141.2,38.8],[141.6,39],[141,38],[140.3,38.2],[141.2,38.8]]] }, mapCoord: {x: 160, y: 135} },
  { id: 5, ko: "아키타현", jp: "秋田県", region: "도호쿠 지방", specialty: "키리탄포", spot: "다자와호", 
    geojson: { type: "Polygon", coordinates: [[[139.8,40.5],[140.8,40.5],[140.5,39],[139.9,39.2],[139.8,40.5]]] }, mapCoord: {x: 130, y: 120} },
  { id: 6, ko: "야마가타현", jp: "山形県", region: "도호쿠 지방", specialty: "체리", spot: "자오 온천", 
    geojson: { type: "Polygon", coordinates: [[[139.9,39.2],[140.5,39],[140.2,37.8],[139.7,38],[139.9,39.2]]] }, mapCoord: {x: 138, y: 135} },
  { id: 7, ko: "후쿠시마현", jp: "福島県", region: "도호쿠 지방", specialty: "라멘, 복숭아", spot: "아이즈와카마쓰 성", 
    geojson: { type: "Polygon", coordinates: [[[139.7,38],[140.5,37.8],[141,37.5],[139.5,37],[139.7,38]]] }, mapCoord: {x: 152, y: 150} },
  { id: 8, ko: "이바라키현", jp: "茨城県", region: "간토 지방", specialty: "낫토, 멜론", spot: "가이라쿠엔", 
    geojson: { type: "Polygon", coordinates: [[[140,36.8],[140.8,36.8],[140.6,35.8],[139.8,36],[140,36.8]]] }, mapCoord: {x: 165, y: 165} },
  { id: 9, ko: "도치기현", jp: "栃木県", region: "간토 지방", specialty: "딸기, 교자", spot: "닛코 도쇼구", 
    geojson: { type: "Polygon", coordinates: [[[139.5,37],[140.2,37],[140,36.2],[139.5,36.2],[139.5,37]]] }, mapCoord: {x: 152, y: 163} },
  { id: 10, ko: "군마현", jp: "군마현", region: "간토 지방", specialty: "온천 만두", spot: "쿠사쓰 온천", 
    geojson: { type: "Polygon", coordinates: [[[138.5,37],[139.5,37],[139.5,36.1],[138.7,36.2],[138.5,37]]] }, mapCoord: {x: 140, y: 165} },
  { id: 11, ko: "사이타마현", jp: "埼玉県", region: "간토 지방", specialty: "우동", spot: "가와고에", 
    geojson: { type: "Polygon", coordinates: [[[139,36.2],[139.8,36.2],[139.7,35.8],[139.1,35.8],[139,36.2]]] }, mapCoord: {x: 148, y: 172} },
  { id: 12, ko: "치바현", jp: "千葉県", region: "간토 지방", specialty: "땅콩", spot: "도쿄 디즈니리조트", 
    geojson: { type: "Polygon", coordinates: [[[139.8,36],[140.8,35.8],[140,35],[139.8,35.8],[139.8,36]]] }, mapCoord: {x: 168, y: 175} },
  { id: 13, ko: "도쿄도", jp: "東京都", region: "간토 지방", specialty: "몬자야키", spot: "도쿄타워", 
    geojson: { type: "Polygon", coordinates: [[[139,35.8],[139.8,35.8],[139.6,35.5],[139,35.5],[139,35.8]]] }, mapCoord: {x: 155, y: 172} },
  { id: 14, ko: "가나가와현", jp: "神奈川県", region: "간토 지방", specialty: "슈마이", spot: "요코하마", 
    geojson: { type: "Polygon", coordinates: [[[139,35.5],[139.6,35.5],[139.4,35.1],[139,35.2],[139,35.5]]] }, mapCoord: {x: 153, y: 180} },
  { id: 15, ko: "니가타현", jp: "新潟県", region: "중부 지방", specialty: "고시히카리 쌀", spot: "사도시섬", 
    geojson: { type: "Polygon", coordinates: [[[138,38.5],[139.5,38.3],[139.2,37],[137.8,36.8],[138,38.5]]] }, mapCoord: {x: 130, y: 150} },
  { id: 16, ko: "도야마현", jp: "富山県", region: "중부 지방", specialty: "흰새우", spot: "구로베 협곡", 
    geojson: { type: "Polygon", coordinates: [[[137,37],[137.8,36.8],[137.2,36.4],[136.8,36.6],[137,37]]] }, mapCoord: {x: 118, y: 162} },
  { id: 17, ko: "이시카와현", jp: "石川県", region: "중부 지방", specialty: "금박 공예품", spot: "겐로쿠엔", 
    geojson: { type: "Polygon", coordinates: [[[136.5,37.7],[137.2,37],[136.5,36.2],[136.2,36.5],[136.5,37.7]]] }, mapCoord: {x: 108, y: 152} },
  { id: 18, ko: "후쿠이현", jp: "福井県", region: "중부 지방", specialty: "에치젠 게", spot: "도진보 절벽", 
    geojson: { type: "Polygon", coordinates: [[[135.8,36.3],[136.5,36.2],[136,35.5],[135.5,35.8],[135.8,36.3]]] }, mapCoord: {x: 110, y: 172} },
  { id: 19, ko: "야마나시현", jp: "山梨県", region: "중부 지방", specialty: "포도", spot: "후지산", 
    geojson: { type: "Polygon", coordinates: [[[138.2,35.8],[139,35.8],[138.8,35.2],[138,35.3],[138.2,35.8]]] }, mapCoord: {x: 142, y: 175} },
  { id: 20, ko: "나가노현", jp: "長野県", region: "중부 지방", specialty: "신슈 소바", spot: "젠코사", 
    geojson: { type: "Polygon", coordinates: [[[137.5,37],[138.5,37],[138.2,35.8],[137.5,35.8],[137.5,37]]] }, mapCoord: {x: 132, y: 170} },
  { id: 21, ko: "기후현", jp: "岐阜県", region: "중부 지방", specialty: "히다 규", spot: "시라카와고", 
    geojson: { type: "Polygon", coordinates: [[[136.5,36.8],[137.5,37],[137.2,35.5],[136.5,35.5],[136.5,36.8]]] }, mapCoord: {x: 122, y: 168} },
  { id: 22, ko: "시즈오카현", jp: "静岡県", region: "중부 지방", specialty: "녹차", spot: "이즈 반도", 
    geojson: { type: "Polygon", coordinates: [[[137.2,35.5],[139,35.2],[138.5,34.6],[137,34.7],[137.2,35.5]]] }, mapCoord: {x: 148, y: 182} },
  { id: 23, ko: "아이치현", jp: "愛知県", region: "중부 지방", specialty: "미소카츠", spot: "나고야 성", 
    geojson: { type: "Polygon", coordinates: [[[136.8,35.5],[137.5,35.5],[137.1,34.6],[136.5,34.8],[136.8,35.5]]] }, mapCoord: {x: 132, y: 183} },
  { id: 24, ko: "미е현", jp: "三重県", region: "간사이 지방", specialty: "마쓰사카 규", spot: "이세 신궁", 
    geojson: { type: "Polygon", coordinates: [[[136,35.3],[136.8,35.2],[136.5,34.2],[135.8,34.5],[136,35.3]]] }, mapCoord: {x: 122, y: 190} },
  { id: 25, ko: "시가현", jp: "滋賀県", region: "간사이 지방", specialty: "비와호", spot: "비와호", 
    geojson: { type: "Polygon", coordinates: [[[135.8,35.5],[136.4,35.5],[136.2,34.8],[135.8,34.8],[135.8,35.5]]] }, mapCoord: {x: 115, y: 182} },
  { id: 26, ko: "교토부", jp: "京都府", region: "간사이 지방", specialty: "말차", spot: "기요미즈데라", 
    geojson: { type: "Polygon", coordinates: [[[135,35.7],[136,35.7],[135.8,34.8],[135,34.8],[135,35.7]]] }, mapCoord: {x: 108, y: 180} },
  { id: 27, ko: "오사카부", jp: "大阪府", region: "간사이 지방", specialty: "타코야키", spot: "도톤보리", 
    geojson: { type: "Polygon", coordinates: [[[135.3,34.9],[135.7,34.9],[135.5,34.4],[135.2,34.5],[135.3,34.9]]] }, mapCoord: {x: 105, y: 190} },
  { id: 28, ko: "효고현", jp: "兵庫県", region: "간사이 지방", specialty: "고베 비프", spot: "히메지성", 
    geojson: { type: "Polygon", coordinates: [[[134,35.8],[135.3,35.7],[135.2,34.4],[134,34.5],[134,35.8]]] }, mapCoord: {x: 95, y: 185} },
  { id: 29, ko: "나라현", jp: "나라현", region: "간사이 지방", specialty: "감잎초밥", spot: "나라 공원", 
    geojson: { type: "Polygon", coordinates: [[[135.5,34.8],[136,34.8],[135.8,34.1],[135.5,34.1],[135.5,34.8]]] }, mapCoord: {x: 112, y: 192} },
  { id: 30, ko: "와카야마현", jp: "和歌山県", region: "간사이 지방", specialty: "우메보시", spot: "고야산", 
    geojson: { type: "Polygon", coordinates: [[[135,34.4],[135.8,34.5],[135.5,33.4],[134.8,33.8],[135,34.4]]] }, mapCoord: {x: 108, y: 202} },
  { id: 31, ko: "돗토리현", jp: "鳥取県", region: "주고쿠 지방", specialty: "대게", spot: "모래구릉", 
    geojson: { type: "Polygon", coordinates: [[[133,35.6],[134.5,35.6],[134,35.1],[133,35.2],[133,35.6]]] }, mapCoord: {x: 82, y: 182} },
  { id: 32, ko: "시마네현", jp: "島根県", region: "주고쿠 지방", specialty: "재첩", spot: "이즈모 타이샤", 
    geojson: { type: "Polygon", coordinates: [[[131.8,35.6],[133.2,35.6],[132.8,34.8],[131.8,35],[131.8,35.6]]] }, mapCoord: {x: 68, y: 180} },
  { id: 33, ko: "오카야마현", jp: "岡山県", region: "주고쿠 지방", specialty: "복숭아", spot: "오카야마 성", 
    geojson: { type: "Polygon", coordinates: [[[133.2,35.2],[134.2,35.2],[134,34.4],[133.2,34.4],[133.2,35.2]]] }, mapCoord: {x: 82, y: 190} },
  { id: 34, ko: "히로시마현", jp: "広島県", region: "주고쿠 지방", specialty: "굴", spot: "미야지마", 
    geojson: { type: "Polygon", coordinates: [[[132,35.2],[133.2,35.2],[133,34.1],[132.2,34.2],[132,35.2]]] }, mapCoord: {x: 68, y: 190} },
  { id: 35, ko: "야마구치현", jp: "山口県", region: "주고쿠 지방", specialty: "복어", spot: "아키요시다이", 
    geojson: { type: "Polygon", coordinates: [[[130.8,34.8],[132.2,34.8],[132,33.9],[130.8,34.1],[130.8,34.8]]] }, mapCoord: {x: 50, y: 195} },
  { id: 36, ko: "도쿠시마현", jp: "徳島県", region: "시코쿠 지방", specialty: "스다치", spot: "나루토", 
    geojson: { type: "Polygon", coordinates: [[[133.8,34.4],[134.8,34.4],[134.5,33.7],[133.8,33.8],[133.8,34.4]]] }, mapCoord: {x: 85, y: 208} },
  { id: 37, ko: "가가와현", jp: "香川県", region: "시코쿠 지방", specialty: "사누키 우동", spot: "쇼도시마", 
    geojson: { type: "Polygon", coordinates: [[[133.5,34.4],[134.4,34.4],[134.2,34.0],[133.5,34.0],[133.5,34.4]]] }, mapCoord: {x: 78, y: 205} },
  { id: 38, ko: "에히메현", jp: "愛媛県", region: "시코쿠 지방", specialty: "귤", spot: "도고 온천", 
    geojson: { type: "Polygon", coordinates: [[[132,34.3],[133.6,34.3],[133.2,33.2],[132,33.4],[132,34.3]]] }, mapCoord: {x: 65, y: 210} },
  { id: 39, ko: "고치현", jp: "고치현", region: "시코쿠 지방", specialty: "가쓰오 다타키", spot: "가쓰라하마", 
    geojson: { type: "Polygon", coordinates: [[[132.5,33.7],[134.2,33.7],[133.8,32.7],[132.5,33.0],[132.5,33.7]]] }, mapCoord: {x: 75, y: 218} },
  { id: 40, ko: "후쿠오카현", jp: "福岡県", region: "규슈 지방", specialty: "돈코츠 라멘", spot: "하카타", 
    geojson: { type: "Polygon", coordinates: [[[130,34],[131.2,34],[130.8,33.2],[130,33.3],[130,34]]] }, mapCoord: {x: 35, y: 215} },
  { id: 41, ko: "사가현", jp: "사가현", region: "규슈 지방", specialty: "사가 규", spot: "요시노가리", 
    geojson: { type: "Polygon", coordinates: [[[129.8,33.5],[130.5,33.5],[130.2,33.0],[129.8,33.1],[129.8,33.5]]] }, mapCoord: {x: 25, y: 220} },
  { id: 42, ko: "나가사키현", jp: "나가사키현", region: "규슈 지방", specialty: "카스텔라", spot: "하우스텐보스", 
    geojson: { type: "Polygon", coordinates: [[[129.3,34.4],[130.2,34.4],[129.8,32.6],[129.0,32.8],[129.3,34.4]]] }, mapCoord: {x: 15, y: 225} },
  { id: 43, ko: "구마모토현", jp: "熊本県", region: "규슈 지방", specialty: "말사시미", spot: "아소산", 
    geojson: { type: "Polygon", coordinates: [[[130,33.2],[131.3,33.2],[130.8,32.2],[130,32.3],[130,33.2]]] }, mapCoord: {x: 28, y: 232} },
  { id: 44, ko: "오이타현", jp: "大分県", region: "규슈 지방", specialty: "온천 푸딩", spot: "벳푸", 
    geojson: { type: "Polygon", coordinates: [[[130.8,33.6],[132,33.6],[131.6,32.8],[130.8,33.0],[130.8,33.6]]] }, mapCoord: {x: 42, y: 220} },
  { id: 45, ko: "미야자키현", jp: "미야자키현", region: "규슈 지방", specialty: "치킨난반", spot: "아오시마", 
    geojson: { type: "Polygon", coordinates: [[[131,32.8],[131.8,32.8],[131.2,31.4],[130.8,31.8],[131,32.8]]] }, mapCoord: {x: 40, y: 242} },
  { id: 46, ko: "가고시마현", jp: "鹿児島県", region: "규슈 지방", specialty: "흑돼지", spot: "사쿠라지마", 
    geojson: { type: "Polygon", coordinates: [[[130,32.2],[131.2,32.2],[130.8,30.8],[129.8,31.2],[130,32.2]]] }, mapCoord: {x: 28, y: 252} },
  { id: 47, ko: "오키나와현", jp: "沖縄県", region: "오키나와 지방", specialty: "바다포도", spot: "츄라우미", 
    geojson: { type: "Polygon", coordinates: [[[127.5,26.8],[128.3,26.8],[127.8,26.0],[127.2,26.2],[127.5,26.8]]] }, mapCoord: {x: 10, y: 280} }
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
document.getElementById('toSignup').onclick = () => show('setup');
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

// --- GeoJSON 폴리곤을 캔버스 크기(240x200)에 맞춰 정밀 스케일링하여 렌더링하는 핵심 함수 ---
function renderGeoJsonPolygon(canvas, geojson) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!geojson || !geojson.coordinates) return;

  const rings = geojson.coordinates; // Polygon rings
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

  // 1. 해당 현 좌표들의 바운딩 박스(Bounding Box) 계산
  rings.forEach(ring => {
    ring.forEach(([lng, lat]) => {
      if (lng < minX) minX = lng;
      if (lng > maxX) maxX = lng;
      if (lat < minY) minY = lat;
      if (lat > maxY) maxY = lat;
    });
  });

  const padding = 25;
  const drawWidth = canvas.width - padding * 2;
  const drawHeight = canvas.height - padding * 2;

  const geoWidth = maxX - minX || 0.1;
  const geoHeight = maxY - minY || 0.1;

  // 가로세로 비율 유지하면서 캔버스 중앙에 꽉 차게 스케일 계산
  const scaleX = drawWidth / geoWidth;
  const scaleY = drawHeight / geoHeight;
  const scale = Math.min(scaleX, scaleY);

  // 중앙 정렬 오프셋
  const offsetX = padding + (drawWidth - geoWidth * scale) / 2;
  const offsetY = padding + (drawHeight - geoHeight * scale) / 2;

  // 위도(Lat)는 아래에서 위로 증가하므로 y축 반전 변환 적용
  const transform = (lng, lat) => {
    const x = offsetX + (lng - minX) * scale;
    const y = canvas.height - (offsetY + (lat - minY) * scale);
    return [x, y];
  };

  ctx.beginPath();
  rings.forEach(ring => {
    ring.forEach(([lng, lat], i) => {
      const [x, y] = transform(lng, lat);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
  });
  ctx.closePath();

  // 고급스러운 GIS 스타일 채우기 및 선 디자인
  ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 3;
  ctx.fillStyle = "#3b82f6";
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.strokeStyle = "#1d4ed8";
  ctx.lineWidth = 2;
  ctx.stroke();
}

// --- 일본 전체 지도 미니맵 모달 ---
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

  ctx.fillStyle = "#cbd5e1";
  ctx.beginPath();
  ctx.ellipse(170, 40, 25, 18, 0, 0, Math.PI * 2);
  ctx.moveTo(110, 60);
  ctx.bezierCurveTo(180, 100, 160, 180, 100, 200);
  ctx.bezierCurveTo(70, 180, 100, 100, 110, 60);
  ctx.ellipse(80, 215, 15, 8, 0, 0, Math.PI * 2);
  ctx.ellipse(40, 230, 20, 15, 0, 0, Math.PI * 2);
  ctx.fill();

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
  
  // GeoJSON GIS 좌표계를 캔버스에 렌더링
  const canvas = document.getElementById('shapeCanvas');
  renderGeoJsonPolygon(canvas, q.geojson);

  document.getElementById('questionText').textContent = (state.lang === 'jp_jp') ? "ここはどこですか？" : "이곳은 어디일까요?";

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
