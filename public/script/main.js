document.addEventListener('DOMContentLoaded', function () {
  // Header 로드
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
      // 로그인 여부에 따른 버튼 표기
      const accessToken = localStorage.getItem('accessToken');
      const BeforeLoginButton = document.getElementById('BeforeLoginButton');
      const beforeLoginSignupBtn = document.getElementById('beforeLoginSignupBtn');
      const userExist = document.getElementById('userExist');
      if ((beforeLoginSignupBtn, BeforeLoginButton && userExist)) {
        if (accessToken) {
          BeforeLoginButton.style.display = 'none';
          beforeLoginSignupBtn.style.display = 'none';
          userExist.style.display = 'block';
        } else {
          BeforeLoginButton.style.display = 'block';
          beforeLoginSignupBtn.style.display = 'block';
          userExist.style.display = 'none';
        }
      }
      // 로그인 엑시오스 불러오기
      const realLoginBtn = document.getElementById('realLoginBtn');
      realLoginBtn.addEventListener('click', handleLogin);
    });
  // 날짜 선택기 라이브러리
  const startDateInput = document.getElementById('startDate');
  const endDateInput = document.getElementById('endDate');
  if (startDateInput && endDateInput) {
    flatpickr(startDateInput, {
      position: 'above',
      minDate: 'today',
      dateFormat: 'Y-m-d',
      locale: 'ko',
    });
    flatpickr(endDateInput, {
      position: 'above',
      minDate: 'today',
      dateFormat: 'Y-m-d',
      locale: 'ko',
    });
  }
  // 상단 모두 DOMContentLoaded 요소들입니다.
});

// 여행보드 생성 엑시오스
const createTravelBtn = document.getElementById('boardCreateBtn');
createTravelBtn.addEventListener('click', createTravel);

async function createTravel() {
  let startDateString = document.getElementById('startDate').value;
  let endDateString = document.getElementById('endDate').value;
  let travelTitle = document.getElementById('boardTitle').value;
  let travelColor = document.getElementById('color').value;
  let travelTheme = document.getElementById('theme').value;
  let travelRegion = document.getElementById('region').value;
  // input type="date"에서 얻은 문자열을 Date 객체로 변환
  let startDate = new Date(startDateString);
  let endDate = new Date(endDateString);
  let timeDifferenceInMilliseconds = endDate - startDate;
  let days = timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24);
  let accessToken = localStorage.getItem('accessToken');
  await axios({
    method: 'POST',
    url: 'api/travel',
    data: {
      title: travelTitle,
      color: travelColor,
      region: travelRegion,
      theme: travelTheme,
      start_date: startDateString,
      end_date: endDateString,
    },
    headers: { Authorization: `Bearer ${accessToken}` },
  })
    .then((response) => {
      axios.post(`api/travel/${response.data.data.newTravel.id}/days`, { days: days });
      window.location.href = `/travel/${response.data.data.newTravel.id}`;
      // window.location.href = `/days.html?id=${response.data.data.newTravel.id}&title=${response.data.data.newTravel.title}`;
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
}

// 로그인 엑시오스
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
