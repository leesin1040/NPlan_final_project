document.addEventListener('DOMContentLoaded', () => {
  // 헤더
  fetch('/header.html')
    .then((response) => response.text())
    .then((data) => {
      document.getElementById('header').innerHTML = data;

      // header.html 로드 후 로그아웃 버튼 설정
      const logoutButton = document.getElementById('logoutButton');
      if (logoutButton) {
        logoutButton.addEventListener('click', function () {
          localStorage.removeItem('accessToken'); // JWT 토큰 제거
          window.location.href = '/home'; // 메인 페이지로 리디렉션
        });
      }

      // 로그인 여부에 따른 버튼 표시
      const accessToken = localStorage.getItem('accessToken');
      const loginButton = document.getElementById('loginButton');
      const userExist = document.getElementById('userExist');
      if (loginButton && userExist) {
        if (accessToken) {
          loginButton.style.display = 'none';
          userExist.style.display = 'block';
        } else {
          loginButton.style.display = 'block';
          userExist.style.display = 'none';
        }
      }
    });

  const loginButton = document.getElementById('loginBtn');
  loginButton.addEventListener('click', handleLogin);
});

function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  if (!email || !password) {
    alert('이메일과 비밀번호를 입력해주세요.');
    return;
  }

  axios
    .post('api/auth/login', { email, password })
    .then((response) => {
      const { accessToken } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      alert(response.data.message);
      window.location.href = '/main';
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
}
