// 1. 퀴즈 데이터 (필요 시 문제 항목을 자유롭게 추가하세요)
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

// HTML 요소 가져오기
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const currentNum = document.getElementById('currentNum');
const totalNum = document.getElementById('totalNum');
const quizContainer = document.getElementById('quizContainer');

// 총 문제 수 표시
totalNum.innerText = quizData.length;

// 문제 불러오기 함수
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

// 정답 확인 함수
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

// 결과 출력 함수
function showResult() {
  quizContainer.innerHTML = `
    <div class="score-box">
      <h2>퀴즈 완료! 👏</h2>
      <p style="margin-top: 15px;">총 ${quizData.length}문제 중 <strong>${score}</strong>문제를 맞추셨습니다!</p>
      <button class="btn-primary" onclick="location.reload()">다시 풀기</button>
    </div>
  `;
}

// 최초 실행
loadQuiz();
