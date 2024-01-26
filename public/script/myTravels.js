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
      const userExist = document.getElementById('userExist');
      if (BeforeLoginButton && userExist) {
        if (accessToken) {
          BeforeLoginButton.style.display = 'none';
          userExist.style.display = 'block';
        } else {
          BeforeLoginButton.style.display = 'block';
          userExist.style.display = 'none';
        }
      }
      // 로그인 엑시오스 불러오기
      const realLoginBtn = document.getElementById('realLoginBtn');
      console.log(realLoginBtn);
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
      // alert(response.data.message);
      // window.location.href = `/days.html?id=${response.data.data.newTravel.id}&title=${response.data.data.newTravel.title}`;
      window.location.reload();
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

// 트레블 리스트 생성
async function getTravels() {
  let accessToken = localStorage.getItem('accessToken');
  await axios({
    method: 'GET',
    url: 'api/travel',
    headers: { Authorization: `Bearer ${accessToken}` },
  }).then((res) => {
    const myTravel = res.data.data.myTravels;
    const invitedTravel = res.data.data.invitedTravels;

    // 내 여행보드, 초대받은 여행보드 컨테이너 선언 후 보드 뿌리기
    const myTravelContainer = document.getElementById('myTravelBoardContainer');
    const invitedTravelContainer = document.getElementById('invitedTravelBoardContainer');

    myTravel.forEach((travel) => {
      const travelElement = createTravelElement(travel);
      myTravelContainer.appendChild(travelElement);
    });
    invitedTravel.forEach((travel) => {
      const travelElement = createTravelElement(travel);
      invitedTravelContainer.appendChild(travelElement);
    });
  });
}

function createTravelElement(travel) {
  const div = document.createElement('div');
  div.classList.add('col');
  div.innerHTML = `<div class="card h-100 rounded-3" data-id=${travel.id}>
  <div class="card-body rounded-3" style="background-color: ${travel.color}">
    <div class="my-1 mb-2 text-center">
      <button type="button" class="btn btn-info btn-sm me-1" disabled>${travel.region}</button
      ><button type="button" class="btn btn-success btn-sm" disabled>${travel.theme}</button>
      <h5 class="card-title mt-3">${travel.title}</h5>
    </div>
    <!-- 맴버 프사들 -->
    <div class="img-stack"></div>
    <!-- 맴버프사 끝 -->
  </div>
</div>`;
  // // 멤버 프로필 이미지 추가 - 맴버 배열 가져오는거 컨트롤러/서비스 바꾸어야함
  // const imgStack = div.querySelector('.img-stack');
  // travel.member.forEach((member) => {
  //   const img = document.createElement('img');
  //   img.src = member.user.img; // 멤버의 이미지 URL 사용
  //   img.alt = 'Member Image';
  //   img.width = 32;
  //   img.height = 32;
  //   img.classList.add('rounded-circle', 'memberImg');
  //   imgStack.appendChild(img);
  // });
  // 트레블 카드 클릭시 이동
  const card = div.querySelector('.card');
  card.addEventListener('click', function () {
    const travelId = this.getAttribute('data-id');
    window.location.href = `/travel-details.html?id=${travelId}`; // 페이지 이동 주소 바꿔야함
  });

  return div;
}
getTravels();
