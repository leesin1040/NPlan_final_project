// public/script/user-login.js
alert('login js 접속완료');
document.addEventListener('DOMContentLoaded', () => {
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
