document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault(); // 폼 기본 제출 동작 방지
  
  const username = document.getElementById('username').value;
  alert(`${username}님, 환영합니다! 퀴즈 페이지로 이동합니다.`);
  
  // quiz.html 페이지로 이동
  window.location.href = "quiz.html";
});
