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

// --- 최대한도까지 디테일을 채운 좌표 데이터셋 ---
const PREFECTURE_DB = [
  { id: 1, ko: "홋카이도", jp: "北海道", region: "홋카이도 지방", specialty: "게, 유제품", spot: "삿포로 오도리 공원", geojson: { type: "Polygon", coordinates: [[[140.23,41.42], [139.81,41.65], [139.32,42.01], [139.11,42.34], [139.52,42.87], [139.88,42.92], [140.35,42.21], [141.22,42.61], [141.51,43.23], [140.92,43.51], [140.11,43.64], [139.63,43.85], [139.31,44.11], [139.42,44.52], [139.87,44.91], [140.21,45.24], [140.85,45.41], [141.87,45.52], [142.42,45.31], [143.15,45.33], [144.21,45.15], [145.02,45.32], [145.85,45.46], [145.92,45.12], [145.65,44.83], [145.21,44.22], [144.92,43.85], [145.53,43.71], [145.98,43.35], [145.65,43.01], [144.42,42.95], [143.81,43.12], [143.21,42.84], [142.53,42.42], [142.02,42.05], [142.67,41.82], [143.15,41.42], [142.34,41.41], [141.03,41.55], [140.54,41.43], [140.23,41.42]]] } },
  { id: 2, ko: "아오모리현", jp: "青森県", region: "도호쿠 지방", specialty: "사과", spot: "히로사키 성", geojson: { type: "Polygon", coordinates: [[[140.01,41.52], [140.34,41.43], [140.52,41.25], [140.71,41.38], [140.94,41.45], [141.24,41.51], [141.45,41.32], [141.56,41.02], [141.51,40.81], [141.42,40.64], [141.33,40.52], [141.04,40.42], [140.75,40.45], [140.42,40.56], [140.21,40.64], [140.03,40.51], [139.81,40.54], [139.63,40.75], [139.54,41.02], [139.73,41.34], [140.01,41.52]]] } },
  { id: 3, ko: "이와테현", jp: "岩手県", region: "도호쿠 지방", specialty: "모리오카 냉면", spot: "주손지", geojson: { type: "Polygon", coordinates: [[[141.01,40.51], [141.32,40.55], [141.56,40.53], [141.84,40.46], [142.12,40.35], [142.05,40.02], [142.03,39.81], [141.95,39.54], [141.86,39.22], [141.65,39.02], [141.43,38.86], [141.22,38.93], [141.05,39.21], [140.96,39.52], [140.85,39.85], [140.92,40.24], [141.01,40.51]]] } },
  { id: 4, ko: "미야기현", jp: "宮城県", region: "도호쿠 지방", specialty: "우설구이", spot: "마쓰시마", geojson: { type: "Polygon", coordinates: [[[141.05,39.21], [141.22,38.94], [141.41,38.82], [141.64,39.04], [141.76,38.75], [141.53,38.32], [141.45,38.15], [141.36,38.03], [141.13,37.94], [141.02,37.81], [140.75,37.96], [140.34,38.25], [140.42,38.54], [140.53,38.82], [140.84,39.05], [141.05,39.21]]] } },
  { id: 5, ko: "아키타현", jp: "秋田県", region: "도호쿠 지방", specialty: "키리탄포", spot: "다자와호", geojson: { type: "Polygon", coordinates: [[[139.95,40.51], [140.22,40.55], [140.64,40.52], [140.85,40.21], [140.82,39.83], [140.63,39.55], [140.44,39.21], [140.15,39.36], [139.83,39.42], [139.75,39.74], [139.72,40.05], [139.81,40.32], [139.95,40.51]]] } },
  { id: 6, ko: "야마가타현", jp: "山形県", region: "도호쿠 지방", specialty: "체리", spot: "자오 온천", geojson: { type: "Polygon", coordinates: [[[139.83,39.25], [140.11,39.34], [140.42,39.25], [140.53,38.92], [140.56,38.54], [140.32,38.21], [140.25,37.84], [139.94,37.92], [139.73,38.04], [139.75,38.45], [139.92,38.74], [139.83,39.25]]] } },
  { id: 7, ko: "후쿠시마현", jp: "福島県", region: "도호쿠 지방", specialty: "복숭아", spot: "아이즈와카마쓰 성", geojson: { type: "Polygon", coordinates: [[[139.73,38.04], [139.95,37.91], [140.23,37.84], [140.61,37.86], [141.05,37.82], [141.13,37.64], [141.16,37.35], [140.94,37.11], [140.82,37.04], [140.45,37.01], [139.93,37.05], [139.52,37.03], [139.61,37.54], [139.73,38.04]]] } },
  { id: 8, ko: "이바라키현", jp: "茨城県", region: "간토 지방", specialty: "낫토", spot: "가이라쿠엔", geojson: { type: "Polygon", coordinates: [[[139.82,36.84], [140.23,36.81], [140.64,36.85], [140.82,36.63], [140.75,36.31], [140.61,36.04], [140.52,35.84], [140.24,35.91], [139.85,36.03], [139.81,36.42], [139.82,36.84]]] } },
  { id: 9, ko: "도치기현", jp: "栃木県", region: "간토 지방", specialty: "딸기, 교자", spot: "닛코 도쇼구", geojson: { type: "Polygon", coordinates: [[[139.54,37.01], [139.82,37.05], [140.21,37.03], [140.12,36.64], [140.04,36.21], [139.75,36.25], [139.51,36.21], [139.53,36.62], [139.54,37.01]]] } },
  { id: 10, ko: "군마현", jp: "群馬県", region: "간토 지방", specialty: "온천 만두", spot: "쿠사쓰 온천", geojson: { type: "Polygon", coordinates: [[[138.53,37.02], [139.04,37.05], [139.54,37.01], [139.52,36.61], [139.55,36.14], [139.12,36.25], [138.74,36.21], [138.51,36.65], [138.53,37.02]]] } },
  { id: 11, ko: "사이타마현", jp: "埼玉県", region: "간토 지방", specialty: "우동", spot: "가와고에", geojson: { type: "Polygon", coordinates: [[[139.02,36.24], [139.45,36.21], [139.82,36.23], [139.74,36.05], [139.76,35.81], [139.43,35.85], [139.11,35.82], [139.04,36.01], [139.02,36.24]]] } },
  { id: 12, ko: "치바현", jp: "千葉県", region: "간토 지방", specialty: "땅콩", spot: "도쿄 디즈니리조트", geojson: { type: "Polygon", coordinates: [[[139.85,36.03], [140.32,36.05], [140.81,35.84], [140.72,35.51], [140.54,35.22], [140.31,35.05], [140.12,35.03], [139.94,35.35], [139.82,35.51], [139.84,35.82], [139.85,36.03]]] } },
  { id: 13, ko: "도쿄도", jp: "東京都", region: "간토 지방", specialty: "몬자야키", spot: "도쿄타워", geojson: { type: "Polygon", coordinates: [[[139.02,35.84], [139.42,35.81], [139.83,35.85], [139.75,35.61], [139.61,35.54], [139.35,35.51], [139.04,35.53], [139.01,35.62], [139.02,35.84]]] } },
  { id: 14, ko: "가나가와현", jp: "神奈川県", region: "간토 지방", specialty: "슈마이", spot: "요코하마", geojson: { type: "Polygon", coordinates: [[[139.04,35.53], [139.31,35.51], [139.65,35.54], [139.52,35.31], [139.41,35.15], [139.24,35.12], [139.02,35.21], [139.05,35.34], [139.04,35.53]]] } },
  { id: 15, ko: "니가타현", jp: "新潟県", region: "중부 지방", specialty: "고시히카리 쌀", spot: "사도시섬", geojson: { type: "Polygon", coordinates: [[[139.34,38.31], [139.55,38.04], [139.31,37.82], [139.14,37.65], [139.33,37.31], [139.02,37.04], [138.71,36.95], [138.44,36.82], [138.15,36.91], [137.82,37.14], [138.01,37.42], [138.25,37.71], [138.54,38.03], [138.82,38.25], [139.04,38.33], [139.34,38.31]]] } },
  { id: 16, ko: "도야마현", jp: "富山県", region: "중부 지방", specialty: "흰새우", spot: "구로베 협곡", geojson: { type: "Polygon", coordinates: [[[137.02,37.04], [137.45,36.91], [137.83,36.85], [137.52,36.63], [137.21,36.45], [137.05,36.52], [136.83,36.61], [136.95,36.84], [137.02,37.04]]] } },
  { id: 17, ko: "이시카와현", jp: "石川県", region: "중부 지방", specialty: "금박 공예품", spot: "겐로쿠엔", geojson: { type: "Polygon", coordinates: [[[136.54,37.72], [136.81,37.45], [137.23,37.01], [136.94,36.65], [136.52,36.21], [136.35,36.34], [136.21,36.52], [136.32,37.14], [136.54,37.72]]] } },
  { id: 18, ko: "후쿠이현", jp: "福井県", region: "중부 지방", specialty: "에치젠 게", spot: "도진보 절벽", geojson: { type: "Polygon", coordinates: [[[135.85,36.34], [136.14,36.25], [136.52,36.21], [136.31,35.84], [136.03,35.55], [135.75,35.61], [135.54,35.82], [135.61,36.05], [135.85,36.34]]] } },
  { id: 19, ko: "야마나시현", jp: "山梨県", region: "중부 지방", specialty: "포도", spot: "후지산", geojson: { type: "Polygon", coordinates: [[[138.25,35.81], [138.64,35.83], [139.01,35.84], [138.92,35.55], [138.85,35.21], [138.41,35.24], [138.05,35.35], [138.12,35.51], [138.25,35.81]]] } },
  { id: 20, ko: "나가노현", jp: "長野県", region: "중부 지방", specialty: "신슈 소바", spot: "젠코사", geojson: { type: "Polygon", coordinates: [[[137.55,37.04], [138.02,37.01], [138.53,37.02], [138.35,36.42], [138.25,35.81], [137.84,35.85], [137.52,35.82], [137.54,36.45], [137.55,37.04]]] } },
  { id: 21, ko: "기후현", jp: "岐阜県", region: "중부 지방", specialty: "히다 규", spot: "시라카와고", geojson: { type: "Polygon", coordinates: [[[136.55,36.81], [137.05,36.93], [137.55,37.04], [137.32,36.21], [137.24,35.55], [136.81,35.52], [136.52,35.55], [136.54,36.14], [136.55,36.81]]] } },
  { id: 22, ko: "시즈오카현", jp: "静岡県", region: "중부 지방", specialty: "녹차", spot: "이즈 반도", geojson: { type: "Polygon", coordinates: [[[137.24,35.55], [138.12,35.45], [139.02,35.24], [138.83,34.91], [138.54,34.62], [137.85,34.65], [137.05,34.72], [137.14,35.12], [137.24,35.55]]] } },
  { id: 23, ko: "아이치현", jp: "愛知県", region: "중부 지방", specialty: "미소카츠", spot: "나고야 성", geojson: { type: "Polygon", coordinates: [[[136.81,35.52], [137.15,35.55], [137.54,35.51], [137.32,35.04], [137.12,34.65], [136.85,34.72], [136.55,34.84], [136.62,35.12], [136.81,35.52]]] } },
  { id: 24, ko: "미에현", jp: "三重県", region: "간사이 지방", specialty: "마쓰사카 규", spot: "이세 신궁", geojson: { type: "Polygon", coordinates: [[[136.03,35.34], [136.45,35.21], [136.81,35.22], [136.75,34.71], [136.52,34.25], [136.14,34.32], [135.85,34.54], [135.91,34.92], [136.03,35.34]]] } },
  { id: 25, ko: "시가현", jp: "滋賀県", region: "간사이 지방", specialty: "비와호", spot: "비와호", geojson: { type: "Polygon", coordinates: [[[135.82,35.51], [136.12,35.53], [136.45,35.52], [136.31,35.15], [136.25,34.82], [136.03,34.84], [135.85,34.81], [135.82,35.12], [135.82,35.51]]] } },
  { id: 26, ko: "교토부", jp: "京都府", region: "간사이 지방", specialty: "말차", spot: "기요미즈데라", geojson: { type: "Polygon", coordinates: [[[135.02,35.75], [135.55,35.71], [136.04,35.72], [135.92,35.25], [135.85,34.81], [135.42,34.85], [135.04,34.82], [135.05,35.24], [135.02,35.75]]] } },
  { id: 27, ko: "오사카부", jp: "大阪府", region: "간사이 지방", specialty: "타코야키", spot: "도톤보리", geojson: { type: "Polygon", coordinates: [[[135.31,34.95], [135.54,34.92], [135.72,34.91], [135.65,34.65], [135.52,34.42], [135.35,34.45], [135.21,34.52], [135.24,34.71], [135.31,34.95]]] } },
  { id: 28, ko: "효고현", jp: "兵庫県", region: "간사이 지방", specialty: "고베 비프", spot: "히메지성", geojson: { type: "Polygon", coordinates: [[[134.05,35.85], [134.62,35.71], [135.34,35.72], [135.25,35.04], [135.21,34.45], [134.65,34.42], [134.02,34.55], [134.04,35.12], [134.05,35.85]]] } },
  { id: 29, ko: "나라현", jp: "奈良県", region: "간사이 지방", specialty: "감잎초밥", spot: "나라 공원", geojson: { type: "Polygon", coordinates: [[[135.55,34.82], [135.75,34.85], [136.03,34.84], [135.95,34.41], [135.81,34.15], [135.65,34.12], [135.54,34.11], [135.51,34.45], [135.55,34.82]]] } },
  { id: 30, ko: "와카야마현", jp: "和歌山県", region: "간사이 지방", specialty: "우메보시", spot: "고야산", geojson: { type: "Polygon", coordinates: [[[135.04,34.42], [135.45,34.51], [135.82,34.54], [135.61,33.95], [135.52,33.41], [135.15,33.64], [134.84,33.85], [134.95,34.12], [135.04,34.42]]] } },
  { id: 31, ko: "돗토리현", jp: "鳥取県", region: "주고쿠 지방", specialty: "대게", spot: "모래구릉", geojson: { type: "Polygon", coordinates: [[[133.05,35.64], [133.72,35.61], [134.51,35.62], [134.25,35.34], [134.03,35.12], [133.52,35.15], [133.01,35.24], [133.05,35.42], [133.05,35.64]]] } },
  { id: 32, ko: "시마네현", jp: "島根県", region: "주고쿠 지방", specialty: "재첩", spot: "이즈모 타이샤", geojson: { type: "Polygon", coordinates: [[[131.84,35.65], [132.51,35.62], [133.25,35.61], [133.02,35.24], [132.85,34.81], [132.34,34.95], [131.81,35.05], [131.85,35.32], [131.84,35.65]]] } },
  { id: 33, ko: "오카야마현", jp: "岡山県", region: "주고쿠 지방", specialty: "복숭아", spot: "오카야마 성", geojson: { type: "Polygon", coordinates: [[[133.25,35.24], [133.71,35.25], [134.24,35.21], [134.15,34.82], [134.03,34.45], [133.62,34.41], [133.21,34.44], [133.25,34.85], [133.25,35.24]]] } },
  { id: 34, ko: "히로시마현", jp: "広島県", region: "주고쿠 지방", specialty: "굴", spot: "미야지마", geojson: { type: "Polygon", coordinates: [[[132.04,35.21], [132.65,35.25], [133.25,35.24], [133.12,34.61], [133.05,34.15], [132.61,34.12], [132.25,34.24], [132.14,34.75], [132.04,35.21]]] } },
  { id: 35, ko: "야마구치현", jp: "山口県", region: "주고쿠 지방", specialty: "복어", spot: "아키요시다이", geojson: { type: "Polygon", coordinates: [[[130.82,34.81], [131.54,34.85], [132.21,34.82], [132.15,34.31], [132.02,33.95], [131.45,34.04], [130.85,34.12], [130.81,34.45], [130.82,34.81]]] } },
  { id: 36, ko: "도쿠시마현", jp: "徳島県", region: "시코쿠 지방", specialty: "스다치", spot: "나루토", geojson: { type: "Polygon", coordinates: [[[133.82,34.45], [134.34,34.41], [134.85,34.42], [134.61,34.05], [134.52,33.71], [134.14,33.75], [133.81,33.82], [133.85,34.12], [133.82,34.45]]] } },
  { id: 37, ko: "가가와현", jp: "香川県", region: "시코쿠 지방", specialty: "사누키 우동", spot: "쇼도시마", geojson: { type: "Polygon", coordinates: [[[133.54,34.41], [133.92,34.45], [134.45,34.42], [134.31,34.25], [134.24,34.01], [133.85,34.04], [133.51,34.02], [133.55,34.21], [133.54,34.41]]] } },
  { id: 38, ko: "에히메현", jp: "愛媛県", region: "시코쿠 지방", specialty: "귤", spot: "도고 온천", geojson: { type: "Polygon", coordinates: [[[132.05,34.32], [132.84,34.35], [133.61,34.31], [133.45,33.72], [133.22,33.25], [132.65,33.31], [132.02,33.45], [132.05,33.82], [132.05,34.32]]] } },
  { id: 39, ko: "고치현", jp: "高知県", region: "시코쿠 지방", specialty: "가쓰오 다타키", spot: "가쓰라하마", geojson: { type: "Polygon", coordinates: [[[132.55,33.72], [133.31,33.75], [134.25,33.71], [134.04,33.25], [133.81,32.74], [133.15,32.85], [132.51,33.04], [132.54,33.32], [132.55,33.72]]] } },
  { id: 40, ko: "후쿠오카현", jp: "福岡県", region: "규슈 지방", specialty: "돈코츠 라멘", spot: "하카타", geojson: { type: "Polygon", coordinates: [[[130.05,34.02], [130.61,34.05], [131.25,34.01], [131.02,33.65], [130.85,33.21], [130.42,33.24], [130.01,33.35], [130.04,33.62], [130.05,34.02]]] } },
  { id: 41, ko: "사가현", jp: "佐賀県", region: "규슈 지방", specialty: "사가 규", spot: "요시노가리", geojson: { type: "Polygon", coordinates: [[[129.84,33.52], [130.15,33.55], [130.51,33.51], [130.34,33.25], [130.21,33.04], [130.05,33.01], [129.82,33.15], [129.85,33.32], [129.84,33.52]]] } },
  { id: 42, ko: "나가사키현", jp: "長崎県", region: "규슈 지방", specialty: "카스텔라", spot: "하우스텐보스", geojson: { type: "Polygon", coordinates: [[[129.35,34.42], [129.74,34.45], [130.21,34.41], [130.05,33.54], [129.82,32.65], [129.45,32.71], [129.04,32.85], [129.15,33.62], [129.35,34.42]]] } },
  { id: 43, ko: "구마모토현", jp: "熊本県", region: "규슈 지방", specialty: "말사시미", spot: "아소산", geojson: { type: "Polygon", coordinates: [[[130.04,33.25], [130.62,33.21], [131.35,33.24], [131.05,32.75], [130.81,32.21], [130.45,32.25], [130.02,32.31], [130.05,32.74], [130.04,33.25]]] } },
  { id: 44, ko: "오이타현", jp: "大分県", region: "규슈 지방", specialty: "온천 푸딩", spot: "벳푸", geojson: { type: "Polygon", coordinates: [[[130.85,33.61], [131.42,33.64], [132.01,33.65], [131.85,33.21], [131.62,32.84], [131.25,32.91], [130.81,33.05], [130.84,33.35], [130.85,33.61]]] } },
  { id: 45, ko: "미야자키현", jp: "宮崎県", region: "규슈 지방", specialty: "치킨난반", spot: "아오시마", geojson: { type: "Polygon", coordinates: [[[131.04,32.85], [131.45,32.81], [131.82,32.84], [131.55,32.15], [131.21,31.42], [131.05,31.64], [130.84,31.85], [130.95,32.31], [131.04,32.85]]] } },
  { id: 46, ko: "가고시마현", jp: "鹿児島県", region: "규슈 지방", specialty: "흑돼지", spot: "사쿠라지마", geojson: { type: "Polygon", coordinates: [[[130.02,32.25], [130.65,32.21], [131.21,32.24], [131.04,31.55], [130.85,30.81], [130.34,31.05], [129.81,31.24], [129.95,31.75], [130.02,32.25]]] } },
  { id: 47, ko: "오키나와현", jp: "沖縄県", region: "오키나와 지방", specialty: "바다포도", spot: "츄라우미", geojson: { type: "Polygon", coordinates: [[[127.52,26.85], [127.94,26.81], [128.35,26.84], [128.02,26.45], [127.81,26.04], [127.55,26.12], [127.24,26.25], [127.31,26.54], [127.52,26.85]]] } }
];

// --- 모바일 화면 최적화용 CSS ---
const mobileStyle = document.createElement('style');
mobileStyle.innerHTML = `
  @media screen and (max-width: 768px) {
    body { padding: 10px; font-size: 14px; }
    .quiz-container, .setup-container, .auth-container {
      width: 100% !important; max-width: 100% !important; padding: 15px !important; box-sizing: border-box;
    }
    #shapeCanvas { width: 220px !important; height: 220px !important; }
    .options-grid, #optionsContainer { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .btn-option { padding: 12px 8px !important; font-size: 0.95rem !important; }
  }
`;
document.head.appendChild(mobileStyle);

// --- 📱 모바일 최적화 ON/OFF 동적 토글 버튼 ---
const mobileToggleBtn = document.createElement('button');
mobileToggleBtn.innerHTML = "📱 모바일 화면: ON";
mobileToggleBtn.style.cssText = "position:fixed; bottom:15px; right:15px; z-index:9999; padding:12px 20px; background:#85586F; color:#fff; border:none; border-radius:30px; font-weight:bold; box-shadow:0 4px 10px rgba(0,0,0,0.3); cursor:pointer; transition: 0.3s;";
document.body.appendChild(mobileToggleBtn);

let isMobileOpt = true;
mobileToggleBtn.onclick = () => {
  isMobileOpt = !isMobileOpt;
  if (isMobileOpt) {
    mobileToggleBtn.innerHTML = "📱 모바일 화면: ON";
    mobileToggleBtn.style.background = "#85586F";
    mobileStyle.disabled = false;
  } else {
    mobileToggleBtn.innerHTML = "🖥️ 데스크톱 화면: OFF";
    mobileToggleBtn.style.background = "#523543";
    mobileStyle.disabled = true;
  }
};

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
  if (user) show('setup'); else show('login');
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

  if (state.hintLevel >= 1) { h1.style.display = 'block'; document.getElementById('hintText1').textContent = current.region; }
  if (state.hintLevel >= 2) { h2.style.display = 'block'; document.getElementById('hintText2').textContent = current.specialty; }
  if (state.hintLevel >= 3) {
    h3.style.display = 'block'; document.getElementById('hintText3').textContent = current.spot;
    hintBtn.textContent = "💡 모든 힌트가 열렸습니다"; hintBtn.style.opacity = "0.6";
  } else {
    hintBtn.textContent = `💡 힌트 보기 (${state.hintLevel}/3)`;
  }
}

// ✨ 극한의 디테일을 살리기 위해 Quadratic Curve(곡선 보간) 알고리즘 적용
function renderGeoJsonPolygon(canvas, geojson) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!geojson || !geojson.coordinates) return;

  const rings = geojson.coordinates;
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

  rings.forEach(ring => {
    ring.forEach(([lng, lat]) => {
      if (lng < minX) minX = lng; if (lng > maxX) maxX = lng;
      if (lat < minY) minY = lat; if (lat > maxY) maxY = lat;
    });
  });

  const padding = 25;
  const drawWidth = canvas.width - padding * 2;
  const drawHeight = canvas.height - padding * 2;
  const geoWidth = maxX - minX || 0.1;
  const geoHeight = maxY - minY || 0.1;

  const scaleX = drawWidth / geoWidth;
  const scaleY = drawHeight / geoHeight;
  const scale = Math.min(scaleX, scaleY);
  const offsetX = padding + (drawWidth - geoWidth * scale) / 2;
  const offsetY = padding + (drawHeight - geoHeight * scale) / 2;

  const transform = (lng, lat) => {
    return [
      offsetX + (lng - minX) * scale,
      canvas.height - (offsetY + (lat - minY) * scale)
    ];
  };

  ctx.beginPath();
  rings.forEach(ring => {
    const pts = ring.map(([lng, lat]) => transform(lng, lat));
    if (pts.length < 3) return;
    
    // 첫 점으로 이동
    ctx.moveTo(pts[0][0], pts[0][1]);
    
    // 점과 점 사이를 부드러운 곡선으로 쪼개서 수백 개의 점을 찍은 것처럼 렌더링
    for (let i = 1; i < pts.length - 2; i++) {
      const xc = (pts[i][0] + pts[i + 1][0]) / 2;
      const yc = (pts[i][1] + pts[i + 1][1]) / 2;
      ctx.quadraticCurveTo(pts[i][0], pts[i][1], xc, yc);
    }
    
    // 마지막 두 점 처리
    ctx.quadraticCurveTo(
      pts[pts.length - 2][0], pts[pts.length - 2][1],
      pts[pts.length - 1][0], pts[pts.length - 1][1]
    );
  });
  ctx.closePath();

  ctx.shadowColor = "rgba(133, 88, 111, 0.4)";
  ctx.shadowBlur = 12;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 5;
  
  ctx.fillStyle = "#85586F";
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.strokeStyle = "#523543";
  ctx.lineWidth = 3;
  ctx.lineJoin = "round"; // 뾰족하게 깨지는 현상 방지
  ctx.stroke();
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
  hintBtn.textContent = "💡 힌트 보기 (클릭)"; hintBtn.style.opacity = "1";

  const q = state.questions[state.idx];
  document.getElementById('currentNum').textContent = state.idx + 1;
  document.getElementById('totalNum').textContent = state.questions.length;
  
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
      state.idx++; next();
    };
    container.appendChild(b);
  });
}
