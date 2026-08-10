import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

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

// --- 🗺️ 보정된 좌표 데이터셋 (균일한 해상도 적용) ---
const rawDB = [
  { id: 1, ko: "홋카이도", jp: "北海道", region: "홋카이도 지방", specialty: "게, 유제품", spot: "삿포로 오도리 공원", coords: "140.2,41.4 139.8,41.6 139.3,42.0 139.1,42.3 139.5,42.8 140.1,42.7 140.8,42.4 141.5,43.2 140.5,43.6 139.3,44.1 139.8,44.9 140.8,45.4 141.8,45.5 142.8,45.4 145.0,45.3 145.9,45.1 145.2,44.2 145.5,43.7 145.6,43.0 143.8,43.1 142.5,42.4 143.1,41.4 141.8,41.5 140.5,41.4 140.2,41.4" },
  { id: 2, ko: "아오모리현", jp: "青森県", region: "도호쿠 지방", specialty: "사과", spot: "히로사키 성", coords: "140.0,41.5 140.4,41.3 140.8,41.4 141.3,41.4 141.5,41.2 141.5,40.8 141.3,40.5 140.6,40.5 140.0,40.5 139.6,40.7 139.5,41.0 139.8,41.4 140.0,41.5" },
  { id: 3, ko: "이와테현", jp: "岩手県", region: "도호쿠 지방", specialty: "모리오카 냉면", spot: "주손지", coords: "141.0,40.5 141.8,40.4 142.1,40.3 142.0,39.8 141.8,39.2 141.4,38.8 141.0,39.2 140.8,39.8 141.0,40.5" },
  { id: 4, ko: "미야기현", jp: "宮城県", region: "도호쿠 지방", specialty: "우설구이", spot: "마쓰시마", coords: "141.0,39.2 141.6,39.0 141.7,38.7 141.3,38.0 140.7,37.9 140.3,38.2 140.5,38.8 141.0,39.2" },
  { id: 5, ko: "아키타현", jp: "秋田県", region: "도호쿠 지방", specialty: "키리탄포", spot: "다자와호", coords: "139.9,40.5 140.8,40.2 140.6,39.5 140.4,39.2 139.8,39.4 139.7,40.0 139.9,40.5" },
  { id: 6, ko: "야마가타현", jp: "山形県", region: "도호쿠 지방", specialty: "체리", spot: "자오 온천", coords: "139.8,39.2 140.5,38.9 140.3,38.2 139.9,37.9 139.7,38.0 139.9,38.7 139.8,39.2" },
  { id: 7, ko: "후쿠시마현", jp: "福島県", region: "도호쿠 지방", specialty: "복숭아", spot: "아이즈와카마쓰 성", coords: "139.7,38.0 140.6,37.8 141.1,37.6 140.8,37.0 139.9,37.0 139.5,37.0 139.7,38.0" },
  { id: 8, ko: "이바라키현", jp: "茨城県", region: "간토 지방", specialty: "낫토", spot: "가이라쿠엔", coords: "139.8,36.8 140.8,36.6 140.6,36.0 140.2,35.9 139.8,36.0 139.8,36.8" },
  { id: 9, ko: "도치기현", jp: "栃木県", region: "간토 지방", specialty: "딸기, 교자", spot: "닛코 도쇼구", coords: "139.5,37.0 140.2,37.0 140.0,36.2 139.5,36.2 139.5,37.0" },
  { id: 10, ko: "군마현", jp: "群馬県", region: "간토 지방", specialty: "온천 만두", spot: "쿠사쓰 온천", coords: "138.5,37.0 139.5,37.0 139.5,36.1 138.7,36.2 138.5,37.0" },
  { id: 11, ko: "사이타마현", jp: "埼玉県", region: "간토 지방", specialty: "우동", spot: "가와고에", coords: "139.0,36.2 139.8,36.2 139.7,35.8 139.1,35.8 139.0,36.2" },
  { id: 12, ko: "치바현", jp: "千葉県", region: "간토 지방", specialty: "땅콩", spot: "도쿄 디즈니리조트", coords: "139.8,36.0 140.8,35.8 140.5,35.2 139.9,35.3 139.8,36.0" },
  { id: 13, ko: "도쿄도", jp: "東京都", region: "간토 지방", specialty: "몬자야키", spot: "도쿄타워", coords: "139.0,35.8 139.8,35.8 139.6,35.5 139.0,35.5 139.0,35.8" },
  { id: 14, ko: "가나가와현", jp: "神奈川県", region: "간토 지방", specialty: "슈마이", spot: "요코하마", coords: "139.0,35.5 139.6,35.5 139.4,35.1 139.0,35.2 139.0,35.5" },
  { id: 15, ko: "니가타현", jp: "新潟県", region: "중부 지방", specialty: "고시히카리 쌀", spot: "사도시섬", coords: "139.3,38.3 139.3,37.3 138.7,36.9 137.8,37.1 138.2,37.7 138.8,38.2 139.3,38.3" },
  { id: 16, ko: "도야마현", jp: "富山県", region: "중부 지방", specialty: "흰새우", spot: "구로베 협곡", coords: "137.0,37.0 137.8,36.8 137.2,36.4 136.8,36.6 137.0,37.0" },
  { id: 17, ko: "이시카와현", jp: "石川県", region: "중부 지방", specialty: "금박 공예품", spot: "겐로쿠엔", coords: "136.5,37.7 137.2,37.0 136.5,36.2 136.2,36.5 136.5,37.7" },
  { id: 18, ko: "후쿠이현", jp: "福井県", region: "중부 지방", specialty: "에치젠 게", spot: "도진보 절벽", coords: "135.8,36.3 136.5,36.2 136.0,35.5 135.5,35.8 135.8,36.3" },
  { id: 19, ko: "야마나시현", jp: "山梨県", region: "중부 지방", specialty: "포도", spot: "후지산", coords: "138.2,35.8 139.0,35.8 138.8,35.2 138.0,35.3 138.2,35.8" },
  { id: 20, ko: "나가노현", jp: "長野県", region: "중부 지방", specialty: "신슈 소바", spot: "젠코사", coords: "137.5,37.0 138.5,37.0 138.2,35.8 137.5,35.8 137.5,37.0" },
  { id: 21, ko: "기후현", jp: "岐阜県", region: "중부 지방", specialty: "히다 규", spot: "시라카와고", coords: "136.5,36.8 137.5,37.0 137.2,35.5 136.5,35.5 136.5,36.8" },
  { id: 22, ko: "시즈오카현", jp: "静岡県", region: "중부 지방", specialty: "녹차", spot: "이즈 반도", coords: "137.2,35.5 139.0,35.2 138.5,34.6 137.0,34.7 137.2,35.5" },
  { id: 23, ko: "아이치현", jp: "愛知県", region: "중부 지방", specialty: "미소카츠", spot: "나고야 성", coords: "136.8,35.5 137.5,35.5 137.1,34.6 136.5,34.8 136.8,35.5" },
  { id: 24, ko: "미에현", jp: "三重県", region: "간사이 지방", specialty: "마쓰사카 규", spot: "이세 신궁", coords: "136.0,35.3 136.8,35.2 136.5,34.2 135.8,34.5 136.0,35.3" },
  { id: 25, ko: "시가현", jp: "滋賀県", region: "간사이 지방", specialty: "비와호", spot: "비와호", coords: "135.8,35.5 136.4,35.5 136.2,34.8 135.8,34.8 135.8,35.5" },
  { id: 26, ko: "교토부", jp: "京都府", region: "간사이 지방", specialty: "말차", spot: "기요미즈데라", coords: "135.0,35.7 136.0,35.7 135.8,34.8 135.0,34.8 135.0,35.7" },
  { id: 27, ko: "오사카부", jp: "大阪府", region: "간사이 지방", specialty: "타코야키", spot: "도톤보리", coords: "135.3,34.9 135.7,34.9 135.5,34.4 135.2,34.5 135.3,34.9" },
  { id: 28, ko: "효고현", jp: "兵庫県", region: "간사이 지방", specialty: "고베 비프", spot: "히메지성", coords: "134.0,35.8 135.3,35.7 135.2,34.4 134.0,34.5 134.0,35.8" },
  { id: 29, ko: "나라현", jp: "奈良県", region: "간사이 지방", specialty: "감잎초밥", spot: "나라 공원", coords: "135.5,34.8 136.0,34.8 135.8,34.1 135.5,34.1 135.5,34.8" },
  { id: 30, ko: "와카야마현", jp: "和歌山県", region: "간사이 지방", specialty: "우메보시", spot: "고야산", coords: "135.0,34.4 135.8,34.5 135.5,33.4 134.8,33.8 135.0,34.4" },
  { id: 31, ko: "돗토리현", jp: "鳥取県", region: "주고쿠 지방", specialty: "대게", spot: "모래구릉", coords: "133.0,35.6 134.5,35.6 134.0,35.1 133.0,35.2 133.0,35.6" },
  { id: 32, ko: "시마네현", jp: "島根県", region: "주고쿠 지방", specialty: "재첩", spot: "이즈모 타이샤", coords: "131.8,35.6 133.2,35.6 132.8,34.8 131.8,35.0 131.8,35.6" },
  { id: 33, ko: "오카야마현", jp: "岡山県", region: "주고쿠 지방", specialty: "복숭아", spot: "오카야마 성", coords: "133.2,35.2 134.2,35.2 134.0,34.4 133.2,34.4 133.2,35.2" },
  { id: 34, ko: "히로시마현", jp: "広島県", region: "주고쿠 지방", specialty: "굴", spot: "미야지마", coords: "132.0,35.2 133.2,35.2 133.0,34.1 132.1,34.2 132.0,35.2" },
  { id: 35, ko: "야마구치현", jp: "山口県", region: "주고쿠 지방", specialty: "복어", spot: "아키요시다이", coords: "130.8,34.8 132.2,34.8 132.0,33.9 130.8,34.1 130.8,34.8" },
  { id: 36, ko: "도쿠시마현", jp: "徳島県", region: "시코쿠 지방", specialty: "스다치", spot: "나루토", coords: "133.8,34.4 134.8,34.4 134.5,33.7 133.8,33.8 133.8,34.4" },
  { id: 37, ko: "가가와현", jp: "香川県", region: "시코쿠 지방", specialty: "사누키 우동", spot: "쇼도시마", coords: "133.5,34.4 134.4,34.4 134.2,34.0 133.5,34.0 133.5,34.4" },
  { id: 38, ko: "에히메현", jp: "愛媛県", region: "시코쿠 지방", specialty: "귤", spot: "도고 온천", coords: "132.0,34.3 133.6,34.3 133.2,33.2 132.0,33.4 132.0,34.3" },
  { id: 39, ko: "고치현", jp: "高知県", region: "시코쿠 지방", specialty: "가쓰오 다타키", spot: "가쓰라하마", coords: "132.5,33.7 134.2,33.7 133.8,32.7 132.5,33.0 132.5,33.7" },
  { id: 40, ko: "후쿠오카현", jp: "福岡県", region: "규슈 지방", specialty: "돈코츠 라멘", spot: "하카타", coords: "130.0,34.0 131.2,34.0 130.8,33.2 130.0,33.3 130.0,34.0" },
  { id: 41, ko: "사가현", jp: "佐賀県", region: "규슈 지방", specialty: "사가 규", spot: "요시노가리", coords: "129.8,33.5 130.5,33.5 130.2,33.0 129.8,33.1 129.8,33.5" },
  { id: 42, ko: "나가사키현", jp: "長崎県", region: "규슈 지방", specialty: "카스텔라", spot: "하우스텐보스", coords: "129.3,34.4 130.2,34.4 129.8,32.6 129.0,32.8 129.3,34.4" },
  { id: 43, ko: "구마모토현", jp: "熊本県", region: "규슈 지방", specialty: "말사시미", spot: "아소산", coords: "130.0,33.2 131.3,33.2 130.8,32.2 130.0,32.3 130.0,33.2" },
  { id: 44, ko: "오이타현", jp: "大分県", region: "규슈 지방", specialty: "온천 푸딩", spot: "벳푸", coords: "130.8,33.6 132.0,33.6 131.6,32.8 130.8,33.0 130.8,33.6" },
  { id: 45, ko: "미야자키현", jp: "宮崎県", region: "규슈 지방", specialty: "치킨난반", spot: "아오시마", coords: "131.0,32.8 131.8,32.8 131.2,31.4 130.8,31.8 131.0,32.8" },
  { id: 46, ko: "가고시마현", jp: "鹿児島県", region: "규슈 지방", specialty: "흑돼지", spot: "사쿠라지마", coords: "130.0,32.2 131.2,32.2 130.8,30.8 129.8,31.2 130.0,32.2" },
  { id: 47, ko: "오키나와현", jp: "沖縄県", region: "오키나와 지방", specialty: "바다포도", spot: "츄라우미", coords: "127.5,26.8 128.3,26.8 127.8,26.0 127.2,26.2 127.5,26.8" }
];

const PREFECTURE_DB = rawDB.map(p => ({
  ...p,
  geojson: { type: "Polygon", coordinates: [p.coords.split(' ').map(c => c.split(',').map(Number))] }
}));

// --- 🎨 UI 스타일 적용 ---
const layoutFixStyle = document.createElement('style');
layoutFixStyle.innerHTML = `
  body { font-family: 'Segoe UI', sans-serif; background-color: #FDFBF7; margin: 0; padding: 20px; display: flex; justify-content: center; }
  .setup-container, .quiz-container { background: #FFFFFF; border-radius: 16px; padding: 25px; box-shadow: 0 8px 24px rgba(82, 53, 67, 0.12); width: 100%; max-width: 700px; box-sizing: border-box; }
  .learning-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start; margin-top: 15px; }
  @media (max-width: 650px) { .learning-grid { grid-template-columns: 1fr; } }
  .quiz-action-bar { display: flex; gap: 10px; margin-top: 20px; }
  .btn-action { flex: 1; padding: 12px; border-radius: 8px; border: none; font-weight: bold; cursor: pointer; transition: 0.2s; }
  .btn-home { background-color: #E0E0E0; color: #333; }
  .btn-skip { background-color: #85586F; color: #FFF; }
  .result-card { text-align: center; padding: 20px; background: #FFF8F0; border-radius: 12px; border: 2px solid #85586F; margin-top: 15px; }
`;
document.head.appendChild(layoutFixStyle);

// --- 📱 DOM 생성 및 바인딩 ---
const learningSection = document.createElement('div');
learningSection.id = 'learningSection';
learningSection.className = 'hidden setup-container';
learningSection.innerHTML = `
  <h2 style="color:#523543; margin-top:0;">🗺️ 일본 전도 학습 모드</h2>
  <p style="margin-bottom:15px; color:#666;">지도의 각 지역을 클릭하여 정보를 확인하세요!</p>
  <div class="learning-grid">
    <div style="text-align:center;">
      <canvas id="japanMapCanvas" width="300" height="380" style="background:#FAF3E0; border:2px solid #523543; border-radius:12px; cursor:pointer; width:100%; height:auto; max-width:300px;"></canvas>
    </div>
    <div id="learningInfo" style="padding:18px; background:#FFF8F0; border-radius:12px; border:2px solid #85586F; display:none;">
      <h3 id="learnName" style="margin:0 0 10px 0; color:#85586F; font-size:1.3rem;"></h3>
      <p style="margin:6px 0;"><strong>📍 지역:</strong> <span id="learnRegion"></span></p>
      <p style="margin:6px 0;"><strong>🍜 특산물:</strong> <span id="learnSpecialty"></span></p>
      <p style="margin:6px 0;"><strong>📸 관광지:</strong> <span id="learnSpot"></span></p>
    </div>
  </div>
  <button id="backToSetupFromLearning" class="btn-action btn-home" style="margin-top:20px; width:100%;">🏠 홈으로 돌아가기</button>
`;
document.body.appendChild(learningSection);

const ui = {
  loading: document.getElementById('loadingSection'),
  login: document.getElementById('loginSection'),
  signup: document.getElementById('signupSection'),
  setup: document.getElementById('setupSection'),
  quiz: document.getElementById('quizSection'),
  learning: document.getElementById('learningSection')
};

function show(name) { Object.values(ui).forEach(div => div?.classList.add('hidden')); ui[name]?.classList.remove('hidden'); }

// 버튼 배치 변경: [퀴즈 시작하기] 밑에 [일본 전도 학습하기] 배치
const startBtn = document.getElementById('startQuizBtn');
if (startBtn) {
  const learnBtn = document.createElement('button');
  learnBtn.className = 'btn-primary';
  learnBtn.textContent = '🗺️ 일본 전도 학습하기';
  learnBtn.style.cssText = 'background:#523543; color:#fff; padding:12px; border-radius:8px; border:none; font-weight:bold; cursor:pointer; width:100%; margin-top:10px;';
  learnBtn.onclick = () => { show('learning'); drawJapanMap(); };
  
  startBtn.parentNode.insertBefore(learnBtn, startBtn.nextSibling);
}

document.getElementById('backToSetupFromLearning').onclick = () => show('setup');
onAuthStateChanged(auth, (user) => { if (user) show('setup'); else show('login'); });

// --- 🌐 좌표 비율 투영 계산식 ---
function projectCoords(lng, lat, minLng, maxLng, minLat, maxLat, width, height, padding = 30) {
  const avgLatRad = ((minLat + maxLat) / 2) * (Math.PI / 180);
  const cosLat = Math.cos(avgLatRad);

  const mapWidthLng = (maxLng - minLng) * cosLat;
  const mapHeightLat = maxLat - minLat;

  const drawW = width - padding * 2;
  const drawH = height - padding * 2;

  const scale = Math.min(drawW / mapWidthLng, drawH / mapHeightLat);

  const offsetX = padding + (drawW - mapWidthLng * scale) / 2;
  const offsetY = padding + (drawH - mapHeightLat * scale) / 2;

  const x = offsetX + (lng - minLng) * cosLat * scale;
  const y = height - (offsetY + (lat - minLat) * scale);

  return [x, y];
}

// --- 🗺️ 전체 지도 그리기 ---
let mapPaths = [];
function drawJapanMap() {
  const canvas = document.getElementById('japanMapCanvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  mapPaths = [];

  let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
  PREFECTURE_DB.forEach(pref => {
    pref.geojson.coordinates[0].forEach(([lng, lat]) => {
      if (lng < minLng) minLng = lng; if (lng > maxLng) maxLng = lng;
      if (lat < minLat) minLat = lat; if (lat > maxLat) maxLat = lat;
    });
  });

  PREFECTURE_DB.forEach(pref => {
    const path = new Path2D();
    const pts = pref.geojson.coordinates[0].map(([lng, lat]) => 
      projectCoords(lng, lat, minLng, maxLng, minLat, maxLat, canvas.width, canvas.height, 15)
    );

    path.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) path.lineTo(pts[i][0], pts[i][1]);
    path.closePath();

    ctx.fillStyle = "#85586F";
    ctx.fill(path);
    ctx.strokeStyle = "#FAF3E0";
    ctx.lineWidth = 1;
    ctx.stroke(path);

    mapPaths.push({ pref, path });
  });

  canvas.onclick = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    for (let item of mapPaths) {
      if (ctx.isPointInPath(item.path, x, y)) {
        drawJapanMap();
        ctx.fillStyle = "#E88D67";
        ctx.fill(item.path);
        ctx.stroke(item.path);

        const info = document.getElementById('learningInfo');
        info.style.display = 'block';
        document.getElementById('learnName').textContent = `${item.pref.ko} (${item.pref.jp})`;
        document.getElementById('learnRegion').textContent = item.pref.region;
        document.getElementById('learnSpecialty').textContent = item.pref.specialty;
        document.getElementById('learnSpot').textContent = item.pref.spot;
        break;
      }
    }
  };
}

// --- 🎯 퀴즈 현 지도 렌더링 (모든 문제 동일 정밀도 적용) ---
function renderGeoJsonPolygon(canvas, geojson) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!geojson?.coordinates) return;

  const ptsArr = geojson.coordinates[0];
  let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
  ptsArr.forEach(([lng, lat]) => {
    if (lng < minLng) minLng = lng; if (lng > maxLng) maxLng = lng;
    if (lat < minLat) minLat = lat; if (lat > maxLat) maxLat = lat;
  });

  const pts = ptsArr.map(([lng, lat]) => projectCoords(lng, lat, minLng, maxLng, minLat, maxLat, canvas.width, canvas.height, 35));

  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();

  ctx.fillStyle = "#85586F";
  ctx.fill();
  ctx.strokeStyle = "#523543";
  ctx.lineWidth = 3;
  ctx.stroke();
}

// --- 🎮 퀴즈 시스템 (스킵, 정답률, 홈 버튼) ---
let state = { questions: [], idx: 0, lang: 'ko_ko', correctCount: 0 };

document.getElementById('startQuizBtn').onclick = () => {
  state.lang = document.getElementById('langMode').value;
  const count = parseInt(document.getElementById('questionCount').value);
  state.questions = [...PREFECTURE_DB].sort(() => Math.random() - 0.5).slice(0, count);
  state.idx = 0;
  state.correctCount = 0;
  
  show('quiz'); 
  setupQuizControls();
  next();
};

function setupQuizControls() {
  let actionBar = document.getElementById('quizActionBar');
  if (!actionBar) {
    actionBar = document.createElement('div');
    actionBar.id = 'quizActionBar';
    actionBar.className = 'quiz-action-bar';

    const homeBtn = document.createElement('button');
    homeBtn.className = 'btn-action btn-home';
    homeBtn.textContent = '🏠 홈으로';
    homeBtn.onclick = () => show('setup');

    const skipBtn = document.createElement('button');
    skipBtn.className = 'btn-action btn-skip';
    skipBtn.textContent = '패스 / 스킵 ⏭️';
    skipBtn.onclick = () => {
      state.idx++;
      next();
    };

    actionBar.appendChild(homeBtn);
    actionBar.appendChild(skipBtn);
    document.getElementById('quizSection').appendChild(actionBar);
  }
}

function next() {
  // 모든 문제 풀이 종료 시 결과 화면 출력
  if (state.idx >= state.questions.length) { 
    showQuizResult();
    return; 
  }

  const q = state.questions[state.idx];
  document.getElementById('currentNum').textContent = state.idx + 1;
  document.getElementById('totalNum').textContent = state.questions.length;
  
  renderGeoJsonPolygon(document.getElementById('shapeCanvas'), q.geojson);
  document.getElementById('questionText').textContent = (state.lang === 'jp_jp') ? "ここはどこですか？" : "이곳은 어디일까요?";

  const container = document.getElementById('optionsContainer');
  container.innerHTML = '';
  let opts = [q];
  while(opts.length < 4) { 
    let r = PREFECTURE_DB[Math.floor(Math.random() * PREFECTURE_DB.length)]; 
    if(!opts.includes(r)) opts.push(r); 
  }
  
  opts.sort(() => Math.random() - 0.5).forEach(o => {
    const b = document.createElement('button'); 
    b.className = 'btn-option'; 
    b.textContent = (state.lang === 'ko_ko') ? o.ko : o.jp;
    b.onclick = () => {
      if(o.id === q.id) {
        alert('정답입니다! 👏');
        state.correctCount++;
      } else {
        alert(`틀렸습니다! 정답은 [ ${state.lang === 'ko_ko' ? q.ko : q.jp} ] 입니다.`);
      }
      state.idx++; 
      next();
    };
    container.appendChild(b);
  });
}

// 📊 최종 결과 및 정답률 표시 함수
function showQuizResult() {
  const total = state.questions.length;
  const rate = Math.round((state.correctCount / total) * 100);

  const container = document.getElementById('optionsContainer');
  container.innerHTML = `
    <div class="result-card">
      <h2 style="color:#523543; margin-top:0;">🎉 퀴즈 종료!</h2>
      <p style="font-size:1.1rem; margin:10px 0;"><strong>총 문제 수:</strong> ${total}개</p>
      <p style="font-size:1.1rem; margin:10px 0; color:#2E7D32;"><strong>맞힌 문제:</strong> ${state.correctCount}개</p>
      <p style="font-size:1.1rem; margin:10px 0; color:#C62828;"><strong>틀린/스킵 문제:</strong> ${total - state.correctCount}개</p>
      <hr style="border:none; border-top:1px dashed #ccc; margin:15px 0;">
      <h3 style="color:#85586F; font-size:1.5rem; margin:0;">최종 정답률: ${rate}%</h3>
    </div>
  `;
}
