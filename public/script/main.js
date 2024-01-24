document.addEventListener('DOMContentLoaded', function () {
  // Header 로드
  fetch('/header.html')
    .then((response) => response.text())
    .then((data) => {
      document.getElementById('header').innerHTML = data;

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

  // 날짜 선택기 초기화
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

  // 모달 이벤트 리스너
  var exampleModal = document.getElementById('exampleModal');
  if (exampleModal) {
    exampleModal.addEventListener('show.bs.modal', function (event) {
      var button = event.relatedTarget;
      var recipient = button.getAttribute('data-bs-whatever');

      var modalTitle = exampleModal.querySelector('.modal-title');
      var modalBodyInput = exampleModal.querySelector('.modal-body input');

      modalTitle.textContent = 'New message to ' + recipient;
      modalBodyInput.value = recipient;
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
  console.log(accessToken);
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
      alert(response.data.message);
      window.location.href = `/days.html?id=${response.data.data.newTravel.id}&title=${response.data.data.newTravel.title}`;
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
}
