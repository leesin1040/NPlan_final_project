// public/script/user-login.js
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
  alert('로그인 성공');
  window.location.href = '/public/travel.html';
  //   axios
  //     .post('/auth/login', { email, password })
  //     .then((response) => {
  //       const { access_token } = response.data;
  //       localStorage.setItem('access_token', access_token);
  //       // console.log(response.data);
  //       alert(response.data.message);
  //       window.location.href = '/user-my-page.html';
  //     })
  //     .catch((error) => {
  //       // console.error(error);
  //       alert(error.response.data.message);
  //     });
}
