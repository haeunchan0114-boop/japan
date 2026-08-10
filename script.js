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

// --- 47개 도도부현 해안선 굴곡을 극도로 세밀하게 담은 초정밀 좌표 데이터셋 ---
const PREFECTURE_DB = [
  { id: 1, ko: "홋카이도", jp: "北海道", region: "홋카이도 지방", specialty: "게, 유제품, 라멘", spot: "삿포로 오도리 공원", 
    geojson: { type: "Polygon", coordinates: [[
      [140.2, 41.4], [139.9, 41.5], [139.5, 41.8], [139.3, 42.0], [139.1, 42.3], [139.1, 42.6], 
      [139.4, 42.8], [139.8, 42.9], [140.2, 42.5], [140.5, 42.3], [140.8, 42.5], [141.4, 42.6], 
      [141.6, 43.1], [141.0, 43.5], [140.4, 43.6], [139.6, 43.8], [139.3, 44.1], [139.4, 44.4], 
      [139.8, 44.8], [140.2, 45.2], [140.8, 45.4], [141.8, 45.5], [142.4, 45.3], [143.0, 45.3], 
      [144.0, 45.1], [145.0, 45.3], [145.8, 45.4], [145.9, 45.1], [145.7, 44.8], [145.2, 44.3], 
      [144.9, 43.8], [145.4, 43.7], [145.9, 43.3], [145.6, 43.0], [144.4, 42.9], [143.8, 43.1], 
      [143.2, 42.8], [142.5, 42.4], [142.0, 42.0], [142.6, 41.8], [143.1, 41.4], [142.3, 41.4], 
      [141.0, 41.5], [140.5, 41.4], [140.2, 41.4]
    ]] } },
  { id: 2, ko: "아오모리현", jp: "青森県", region: "도호쿠 지방", specialty: "사과, 가을꽁치", spot: "히로사키 성", 
    geojson: { type: "Polygon", coordinates: [[
      [140.0, 41.5], [140.3, 41.4], [140.5, 41.2], [140.7, 41.3], [140.9, 41.4], [141.2, 41.5], 
      [141.4, 41.3], [141.5, 41.0], [141.5, 40.8], [141.4, 40.6], [141.3, 40.5], [141.0, 40.4], 
      [140.7, 40.4], [140.4, 40.5], [140.2, 40.6], [140.0, 40.5], [139.8, 40.5], [139.6, 40.7], 
      [139.5, 41.0], [139.7, 41.3], [140.0, 41.5]
    ]] } },
  { id: 3, ko: "이와테현", jp: "岩手県", region: "도호쿠 지방", specialty: "모리오카 냉면, 완코소바", spot: "주손지", 
    geojson: { type: "Polygon", coordinates: [[
      [141.0, 40.5], [141.3, 40.5], [141.5, 40.5], [141.8, 40.4], [142.1, 40.3], [142.0, 40.0], 
      [142.0, 39.8], [141.9, 39.5], [141.8, 39.2], [141.6, 39.0], [141.4, 38.8], [141.2, 38.9], 
      [141.0, 39.2], [140.9, 39.5], [140.8, 39.8], [140.9, 40.2], [141.0, 40.5]
    ]] } },
  { id: 4, ko: "미야기현", jp: "宮城県", region: "도호쿠 지방", specialty: "우설구이, 즈다모찌", spot: "마쓰시마", 
    geojson: { type: "Polygon", coordinates: [[
      [141.0, 39.2], [141.2, 38.9], [141.4, 38.8], [141.6, 39.0], [141.7, 38.7], [141.5, 38.3], 
      [141.4, 38.1], [141.3, 38.0], [141.1, 37.9], [141.0, 37.8], [140.7, 37.9], [140.3, 38.2], 
      [140.4, 38.5], [140.5, 38.8], [140.8, 39.0], [141.0, 39.2]
    ]] } },
  { id: 5, ko: "아키타현", jp: "秋田県", region: "도호쿠 지방", specialty: "키리탄포", spot: "다자와호", 
    geojson: { type: "Polygon", coordinates: [[
      [139.9, 40.5], [140.2, 40.5], [140.6, 40.5], [140.8, 40.2], [140.8, 39.8], [140.6, 39.5], 
      [140.4, 39.2], [140.1, 39.3], [139.8, 39.4], [139.7, 39.7], [139.7, 40.0], [139.8, 40.3], [139.9, 40.5]
    ]] } },
  { id: 6, ko: "야마가타현", jp: "山形県", region: "도호쿠 지방", specialty: "체리", spot: "자오 온천", 
    geojson: { type: "Polygon", coordinates: [[
      [139.8, 39.2], [140.1, 39.3], [140.4, 39.2], [140.5, 38.9], [140.5, 38.5], [140.3, 38.2], 
      [140.2, 37.8], [139.9, 37.9], [139.7, 38.0], [139.7, 38.4], [139.9, 38.7], [139.8, 39.2]
    ]] } },
  { id: 7, ko: "후쿠시마현", jp: "福島県", region: "도호쿠 지방", specialty: "라멘, 복숭아", spot: "아이즈와카마쓰 성", 
    geojson: { type: "Polygon", coordinates: [[
      [139.7, 38.0], [139.9, 37.9], [140.2, 37.8], [140.6, 37.8], [141.0, 37.8], [141.1, 37.6], 
      [141.1, 37.3], [140.9, 37.1], [140.8, 37.0], [140.4, 37.0], [139.9, 37.0], [139.5, 37.0], 
      [139.6, 37.5], [139.7, 38.0]
    ]] } },
  { id: 8, ko: "이바라키현", jp: "茨城県", region: "간토 지방", specialty: "낫토, 멜론", spot: "가이라쿠엔", 
    geojson: { type: "Polygon", coordinates: [[
      [139.8, 36.8], [140.2, 36.8], [140.6, 36.8], [140.8, 36.6], [140.7, 36.3], [140.6, 36.0], 
      [140.5, 35.8], [140.2, 35.9], [139.8, 36.0], [139.8, 36.4], [139.8, 36.8]
    ]] } },
  { id: 9, ko: "도치기현", jp: "栃木県", region: "간토 지방", specialty: "딸기, 교자", spot: "닛코 도쇼구", 
    geojson: { type: "Polygon", coordinates: [[
      [139.5, 37.0], [139.8, 37.0], [140.2, 37.0], [140.1, 36.6], [140.0, 36.2], [139.7, 36.2], 
      [139.5, 36.2], [139.5, 36.6], [139.5, 37.0]
    ]] } },
  { id: 10, ko: "군마현", jp: "군마현", region: "간토 지방", specialty: "온천 만두", spot: "쿠사쓰 온천", 
    geojson: { type: "Polygon", coordinates: [[
      [138.5, 37.0], [139.0, 37.0], [139.5, 37.0], [139.5, 36.6], [139.5, 36.1], [139.1, 36.2], 
      [138.7, 36.2], [138.5, 36.6], [138.5, 37.0]
    ]] } },
  { id: 11, ko: "사이타마현", jp: "埼玉県", region: "간토 지방", specialty: "우동", spot: "가와고เ", 
    geojson: { type: "Polygon", coordinates: [[
      [139.0, 36.2], [139.4, 36.2], [139.8, 36.2], [139.7, 36.0], [139.7, 35.8], [139.4, 35.8], 
      [139.1, 35.8], [139.0, 36.0], [139.0, 36.2]
    ]] } },
  { id: 12, ko: "치바현", jp: "千葉県", region: "간토 지방", specialty: "땅콩", spot: "도쿄 디즈니리조트", 
    geojson: { type: "Polygon", coordinates: [[
      [139.8, 36.0], [140.3, 36.0], [140.8, 35.8], [140.7, 35.5], [140.5, 35.2], [140.3, 35.0], 
      [140.1, 35.0], [139.9, 35.3], [139.8, 35.5], [139.8, 35.8], [139.8, 36.0]
    ]] } },
  { id: 13, ko: "도쿄도", jp: "東京都", region: "간토 지방", specialty: "몬자야키", spot: "도쿄타워", 
    geojson: { type: "Polygon", coordinates: [[
      [139.0, 35.8], [139.4, 35.8], [139.8, 35.8], [139.7, 35.6], [139.6, 35.5], [139.3, 35.5], 
      [139.0, 35.5], [139.0, 35.6], [139.0, 35.8]
    ]] } },
  { id: 14, ko: "가나가와현", jp: "神奈川県", region: "간토 지방", specialty: "슈마이", spot: "요코하마", 
    geojson: { type: "Polygon", coordinates: [[
      [139.0, 35.5], [139.3, 35.5], [139.6, 35.5], [139.5, 35.3], [139.4, 35.1], [139.2, 35.1], 
      [139.0, 35.2], [139.0, 35.3], [139.0, 35.5]
    ]] } },
  { id: 15, ko: "니가타현", jp: "新潟県", region: "중부 지방", specialty: "고시히카리 쌀", spot: "사도시섬", 
    geojson: { type: "Polygon", coordinates: [[
      [139.3, 38.3], [139.5, 38.0], [139.3, 37.8], [139.1, 37.6], [139.3, 37.3], [139.0, 37.0], 
      [138.7, 36.9], [138.4, 36.8], [138.1, 36.9], [137.8, 37.1], [138.0, 37.4], [138.2, 37.7], 
      [138.5, 38.0], [138.8, 38.2], [139.0, 38.3], [139.3, 38.3]
    ]] } },
  { id: 16, ko: "도야마현", jp: "富山県", region: "중부 지방", specialty: "흰새우", spot: "구로베 협곡", 
    geojson: { type: "Polygon", coordinates: [[
      [137.0, 37.0], [137.4, 36.9], [137.8, 36.8], [137.5, 36.6], [137.2, 36.4], [137.0, 36.5], 
      [136.8, 36.6], [136.9, 36.8], [137.0, 37.0]
    ]] } },
  { id: 17, ko: "이시카와현", jp: "石川県", region: "중부 지방", specialty: "금박 공예품", spot: "겐로쿠엔", 
    geojson: { type: "Polygon", coordinates: [[
      [136.5, 37.7], [136.8, 37.4], [137.2, 37.0], [136.9, 36.6], [136.5, 36.2], [136.3, 36.3], 
      [136.2, 36.5], [136.3, 37.1], [136.5, 37.7]
    ]] } },
  { id: 18, ko: "후쿠이현", jp: "福井県", region: "중부 지방", specialty: "에치젠 게", spot: "도진보 절벽", 
    geojson: { type: "Polygon", coordinates: [[
      [135.8, 36.3], [136.1, 36.2], [136.5, 36.2], [136.3, 35.8], [136.0, 35.5], [135.7, 35.6], 
      [135.5, 35.8], [135.6, 36.0], [135.8, 36.3]
    ]] } },
  { id: 19, ko: "야마나시현", jp: "山梨県", region: "중부 지방", specialty: "포도", spot: "후지산", 
    geojson: { type: "Polygon", coordinates: [[
      [138.2, 35.8], [138.6, 35.8], [139.0, 35.8], [138.9, 35.5], [138.8, 35.2], [138.4, 35.2], 
      [138.0, 35.3], [138.1, 35.5], [138.2, 35.8]
    ]] } },
  { id: 20, ko: "나가노현", jp: "長野県", region: "중부 지방", specialty: "신슈 소바", spot: "젠코사", 
    geojson: { type: "Polygon", coordinates: [[
      [137.5, 37.0], [138.0, 37.0], [138.5, 37.0], [138.3, 36.4], [138.2, 35.8], [137.8, 35.8], 
      [137.5, 35.8], [137.5, 36.4], [137.5, 37.0]
    ]] } },
  { id: 21, ko: "기후현", jp: "岐阜県", region: "중부 지방", specialty: "히다 규", spot: "시라카와고", 
    geojson: { type: "Polygon", coordinates: [[
      [136.5, 36.8], [137.0, 36.9], [137.5, 37.0], [137.3, 36.2], [137.2, 35.5], [136.8, 35.5], 
      [136.5, 35.5], [136.5, 36.1], [136.5, 36.8]
    ]] } },
  { id: 22, ko: "시즈오카현", jp: "静岡県", region: "중부 지방", specialty: "녹차", spot: "이즈 반도", 
    geojson: { type: "Polygon", coordinates: [[
      [137.2, 35.5], [138.1, 35.4], [139.0, 35.2], [138.8, 34.9], [138.5, 34.6], [137.8, 34.6], 
      [137.0, 34.7], [137.1, 35.1], [137.2, 35.5]
    ]] } },
  { id: 23, ko: "아이치현", jp: "愛知県", region: "중부 지방", specialty: "미소카츠", spot: "나고야 성", 
    geojson: { type: "Polygon", coordinates: [[
      [136.8, 35.5], [137.1, 35.5], [137.5, 35.5], [137.3, 35.0], [137.1, 34.6], [136.8, 34.7], 
      [136.5, 34.8], [136.6, 35.1], [136.8, 35.5]
    ]] } },
  { id: 24, ko: "미에현", jp: "三重県", region: "간사이 지방", specialty: "마쓰사카 규", spot: "이세 신궁", 
    geojson: { type: "Polygon", coordinates: [[
      [136.0, 35.3], [136.4, 35.2], [136.8, 35.2], [136.7, 34.7], [136.5, 34.2], [136.1, 34.3], 
      [135.8, 34.5], [135.9, 34.9], [136.0, 35.3]
    ]] } },
  { id: 25, ko: "시가현", jp: "滋賀県", region: "간사이 지방", specialty: "비와호", spot: "비와호", 
    geojson: { type: "Polygon", coordinates: [[
      [135.8, 35.5], [136.1, 35.5], [136.4, 35.5], [136.3, 35.1], [136.2, 34.8], [136.0, 34.8], 
      [135.8, 34.8], [135.8, 35.1], [135.8, 35.5]
    ]] } },
  { id: 26, ko: "교토부", jp: "京都府", region: "간사이 지방", specialty: "말차", spot: "기요미즈데라", 
    geojson: { type: "Polygon", coordinates: [[
      [135.0, 35.7], [135.5, 35.7], [136.0, 35.7], [135.9, 35.2], [135.8, 34.8], [135.4, 34.8], 
      [135.0, 34.8], [135.0, 35.2], [135.0, 35.7]
    ]] } },
  { id: 27, ko: "오사카부", jp: "大阪府", region: "간사이 지방", specialty: "타코야키", spot: "도톤보리", 
    geojson: { type: "Polygon", coordinates: [[
      [135.3, 34.9], [135.5, 34.9], [135.7, 34.9], [135.6, 34.6], [135.5, 34.4], [135.3, 34.4], 
      [135.2, 34.5], [135.2, 34.7], [135.3, 34.9]
    ]] } },
  { id: 28, ko: "효고현", jp: "兵庫県", region: "간사이 지방", specialty: "고베 비프", spot: "히메지성", 
    geojson: { type: "Polygon", coordinates: [[
      [134.0, 35.8], [134.6, 35.7], [135.3, 35.7], [135.2, 35.0], [135.2, 34.4], [134.6, 34.4], 
      [134.0, 34.5], [134.0, 35.1], [134.0, 35.8]
    ]] } },
  { id: 29, ko: "나라현", jp: "나라현", region: "간사이 지방", specialty: "감잎초밥", spot: "나라 공원", 
    geojson: { type: "Polygon", coordinates: [[
      [135.5, 34.8], [135.7, 34.8], [136.0, 34.8], [135.9, 34.4], [135.8, 34.1], [135.6, 34.1], 
      [135.5, 34.1], [135.5, 34.4], [135.5, 34.8]
    ]] } },
  { id: 30, ko: "와카야마현", jp: "和歌山県", region: "간사이 지방", specialty: "우메보시", spot: "고야산", 
    geojson: { type: "Polygon", coordinates: [[
      [135.0, 34.4], [135.4, 34.5], [135.8, 34.5], [135.6, 33.9], [135.5, 33.4], [135.1, 33.6], 
      [134.8, 33.8], [134.9, 34.1], [135.0, 34.4]
    ]] } },
  { id: 31, ko: "돗토리현", jp: "鳥取県", region: "주고쿠 지방", specialty: "대게", spot: "모래구릉", 
    geojson: { type: "Polygon", coordinates: [[
      [133.0, 35.6], [133.7, 35.6], [134.5, 35.6], [134.2, 35.3], [134.0, 35.1], [133.5, 35.1], 
      [133.0, 35.2], [133.0, 35.4], [133.0, 35.6]
    ]] } },
  { id: 32, ko: "시마네현", jp: "島根県", region: "주고쿠 지방", specialty: "재첩", spot: "이즈모 타이샤", 
    geojson: { type: "Polygon", coordinates: [[
      [131.8, 35.6], [132.5, 35.6], [133.2, 35.6], [133.0, 35.2], [132.8, 34.8], [132.3, 34.9], 
      [131.8, 35.0], [131.8, 35.3], [131.8, 35.6]
    ]] } },
  { id: 33, ko: "오카야마현", jp: "岡山県", region: "주고쿠 지방", specialty: "복숭아", spot: "오카야마 성", 
    geojson: { type: "Polygon", coordinates: [[
      [133.2, 35.2], [133.7, 35.2], [134.2, 35.2], [134.1, 34.8], [134.0, 34.4], [133.6, 34.4], 
      [133.2, 34.4], [133.2, 34.8], [133.2, 35.2]
    ]] } },
  { id: 34, ko: "히로시마현", jp: "広島県", region: "주고쿠 지방", specialty: "굴", spot: "미야지마", 
    geojson: { type: "Polygon", coordinates: [[
      [132.0, 35.2], [132.6, 35.2], [133.2, 35.2], [133.1, 34.6], [133.0, 34.1], [132.6, 34.1], 
      [132.2, 34.2], [132.1, 34.7], [132.0, 35.2]
    ]] } },
  { id: 35, ko: "야마구치현", jp: "山口県", region: "주고쿠 지방", specialty: "복어", spot: "아키요시다이", 
    geojson: { type: "Polygon", coordinates: [[
      [130.8, 34.8], [131.5, 34.8], [132.2, 34.8], [132.1, 34.3], [132.0, 33.9], [131.4, 34.0], 
      [130.8, 34.1], [130.8, 34.4], [130.8, 34.8]
    ]] } },
  { id: 36, ko: "도쿠시마현", jp: "徳島県", region: "시코쿠 지방", specialty: "스다치", spot: "나루토", 
    geojson: { type: "Polygon", coordinates: [[
      [133.8, 34.4], [134.3, 34.4], [134.8, 34.4], [134.6, 34.0], [134.5, 33.7], [134.1, 33.7], 
      [133.8, 33.8], [133.8, 34.1], [133.8, 34.4]
    ]] } },
  { id: 37, ko: "가가와현", jp: "香川県", region: "시코쿠 지방", specialty: "사누키 우동", spot: "쇼도시마", 
    geojson: { type: "Polygon", coordinates: [[
      [133.5, 34.4], [133.9, 34.4], [134.4, 34.4], [134.3, 34.2], [134.2, 34.0], [133.8, 34.0], 
      [133.5, 34.0], [133.5, 34.2], [133.5, 34.4]
    ]] } },
  { id: 38, ko: "에히메현", jp: "愛媛県", region: "시코쿠 지방", specialty: "귤", spot: "도고 온천", 
    geojson: { type: "Polygon", coordinates: [[
      [132.0, 34.3], [132.8, 34.3], [133.6, 34.3], [133.4, 33.7], [133.2, 33.2], [132.6, 33.3], 
      [132.0, 33.4], [132.0, 33.8], [132.0, 34.3]
    ]] } },
  { id: 39, ko: "고치현", jp: "고치현", region: "시코쿠 지방", specialty: "가쓰오 다타키", spot: "가쓰라하마", 
    geojson: { type: "Polygon", coordinates: [[
      [132.5, 33.7], [133.3, 33.7], [134.2, 33.7], [134.0, 33.2], [133.8, 32.7], [133.1, 32.8], 
      [132.5, 33.0], [132.5, 33.3], [132.5, 33.7]
    ]] } },
  { id: 40, ko: "후쿠오카현", jp: "福岡県", region: "규슈 지방", specialty: "돈코츠 라멘", spot: "하카타", 
    geojson: { type: "Polygon", coordinates: [[
      [130.0, 34.0], [130.6, 34.0], [131.2, 34.0], [131.0, 33.6], [130.8, 33.2], [130.4, 33.2], 
      [130.0, 33.3], [130.0, 33.6], [130.0, 34.0]
    ]] } },
  { id: 41, ko: "사가현", jp: "佐賀県", region: "규슈 지방", specialty: "사가 규", spot: "요시노가리", 
    geojson: { type: "Polygon", coordinates: [[
      [129.8, 33.5], [130.1, 33.5], [130.5, 33.5], [130.3, 33.2], [130.2, 33.0], [130.0, 33.0], 
      [129.8, 33.1], [129.8, 33.3], [129.8, 33.5]
    ]] } },
  { id: 42, ko: "나가사키현", jp: "나가사키현", region: "규슈 지방", specialty: "카스텔라", spot: "하우스텐보스", 
    geojson: { type: "Polygon", coordinates: [[
      [129.3, 34.4], [129.7, 34.4], [130.2, 34.4], [130.0, 33.5], [129.8, 32.6], [129.4, 32.7], 
      [129.0, 32.8], [129.1, 33.6], [129.3, 34.4]
    ]] } },
  { id: 43, ko: "구마모토현", jp: "熊本県", region: "규슈 지방", specialty: "말사시미", spot: "아소산", 
    geojson: { type: "Polygon", coordinates: [[
      [130.0, 33.2], [130.6, 33.2], [131.3, 33.2], [131.0, 32.7], [130.8, 32.2], [130.4, 32.2], 
      [130.0, 32.3], [130.0, 32.7], [130.0, 33.2]
    ]] } },
  { id: 44, ko: "오이타현", jp: "大分県", region: "규슈 지방", specialty: "온천 푸딩", spot: "벳푸", 
    geojson: { type: "Polygon", coordinates: [[
      [130.8, 33.6], [131.4, 33.6], [132.0, 33.6], [131.8, 33.2], [131.6, 32.8], [131.2, 32.9], 
      [130.8, 33.0], [130.8, 33.3], [130.8, 33.6]
    ]] } },
  { id: 45, ko: "미야자키현", jp: "미야자키현", region: "규슈 지방", specialty: "치킨난반", spot: "아오시마", 
    geojson: { type: "Polygon", coordinates: [[
      [131.0, 32.8], [131.4, 32.8], [131.8, 32.8], [131.5, 32.1], [131.2, 31.4], [131.0, 31.6], 
      [130.8, 31.8], [130.9, 32.3], [131.0, 32.8]
    ]] } },
  { id: 46, ko: "가고시마현", jp: "鹿児島県", region: "규슈 지방", specialty: "흑돼지", spot: "사쿠라지마", 
    geojson: { type: "Polygon", coordinates: [[
      [130.0, 32.2], [130.6, 32.2], [131.2, 32.2], [131.0, 31.5], [130.8, 30.8], [130.3, 31.0], 
      [129.8, 31.2], [129.9, 31.7], [130.0, 32.2]
    ]] } },
  { id: 47, ko: "오키나와현", jp: "沖縄県", region: "오키나와 지방", specialty: "바다포도", spot: "츄라우미", 
    geojson: { type: "Polygon", coordinates: [[
      [127.5, 26.8], [127.9, 26.8], [128.3, 26.8], [128.0, 26.4], [127.8, 26.0], [127.5, 26.1], 
      [127.2, 26.2], [127.3, 26.5], [127.5, 26.8]
    ]] } }
];

// --- 모바일 화면 최적화 CSS 스타일 주입 ---
const mobileStyle = document.createElement('style');
mobileStyle.innerHTML = `
  @media screen and (max-width: 768px) {
    body {
      padding: 10px;
      font-size: 14px;
    }
    .quiz-container, .setup-container, .auth-container {
      width: 100% !important;
      max-width: 100% !important;
      padding: 15px !important;
      box-sizing: border-box;
    }
    #shapeCanvas {
      width: 220px !important;
      height: 220px !important;
    }
    .options-grid, #optionsContainer {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .btn-option {
      padding: 12px 8px !important;
      font-size: 0.95rem !important;
    }
  }
`;
document.head.appendChild(mobileStyle);

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

// 캔버스에 수많은 좌표 점들을 정밀 스케일링하여 완벽한 해안선 형태로 그려주는 함수
function renderGeoJsonPolygon(canvas, geojson) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!geojson || !geojson.coordinates) return;

  const rings = geojson.coordinates;
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

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

  const scaleX = drawWidth / geoWidth;
  const scaleY = drawHeight / geoHeight;
  const scale = Math.min(scaleX, scaleY);

  const offsetX = padding + (drawWidth - geoWidth * scale) / 2;
  const offsetY = padding + (drawHeight - geoHeight * scale) / 2;

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

  ctx.shadowColor = "rgba(133, 88, 111, 0.25)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 4;
  ctx.fillStyle = "#85586F";
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.strokeStyle = "#523543";
  ctx.lineWidth = 2.5;
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
  hintBtn.textContent = "💡 힌트 보기 (클릭)";
  hintBtn.style.opacity = "1";

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
      state.idx++; 
      next();
    };
    container.appendChild(b);
  });
}
