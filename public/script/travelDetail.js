// URL의 마지막 부분을 travelId로 가져옵니다. 경로 :: /travel/:travelId
const pathArray = window.location.pathname.split('/');
const travelId = pathArray[pathArray.length - 1];

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
      console.log(realLoginBtn);
      realLoginBtn.addEventListener('click', handleLogin);
    });
  getDays(travelId);
  // 상단 모두 DOMContentLoaded 요소들입니다.
});

function getDays(travelId) {
  axios
    .get(`api/travel/${travelId}/day`)
    .then((response) => {
      const dayData = response.data;
      const dayList = document.getElementById('dayList');
      dayList.innerHTML = '';
      dayData.data.forEach((day) => {
        let dayHtml = `
        <div class="day" data-day-id="${day.id}">
          <div class="day-header">
            <div class="left-content">${day.day}일차</div>
            <div class="viewPathButton" id=viewDayPath${day.id}>경로보기</div>
          </div>
          <div class="scheduleList" id="scheduleList${day.id}"></div>
          <div class="flex-container">
            <div class="centered-content">
              <div class="plus-sign" id="addScheduleBtnId${day.id}">+ Add Schedule</div>
            </div>
          </div>
        </div>
          `;
        dayList.innerHTML += dayHtml;
        const scheduleId = `scheduleId${day.id}`;
      });
    })
    .catch((error) => {
      // console.error('Error:', error);
    });
}

// 동적으로 생산된 버튼에 이벤트리스트할당
document.addEventListener('click', function (event) {
  // 경로 보기 버튼
  if (event.target.id.startsWith('viewDayPath')) {
    const dayId = event.target.id.replace('viewDayPath', '');
    viewDayPath(dayId);
  }
  // Add Schedule 버튼
  else if (event.target.id.startsWith('addScheduleBtnId')) {
    const dayId = event.target.id.replace('addScheduleBtnId', '');
  }
});

// 드래그 앤 드롭
let draggedCard = null;
let originColumn = null;
// 드래그 앤 드롭 설정
function setupDragAndDrop() {
  const cards = document.querySelectorAll('.schedule');
  const columns = document.querySelectorAll('.day');

  // 카드에 대한 이벤트 리스너 설정
  cards.forEach((card) => {
    card.setAttribute('draggable', true);
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);
  });

  // 컬럼에 대한 이벤트 리스너 설정
  columns.forEach((column) => {
    column.addEventListener('dragover', handleDragOver);
    column.addEventListener('drop', handleDrop);
  });
  // console.log('너 동작은 하니?');
}

// 드래그 시작 시 호출
function handleDragStart(event) {
  draggedCard = event.target;
  originColumn = draggedCard.closest('.day');
  // console.log('Drag Start:', draggedCard);
}

// 드래그 종료 시 호출
function handleDragEnd() {
  // console.log('Drag End');
  draggedCard = null;
  originColumn = null;
}

// 드래그 오버 시 호출
function handleDragOver(event) {
  event.preventDefault();
  // console.log('Drag Over');
}
// 드롭 시 호출
function handleDrop(event) {
  event.preventDefault();
  const targetColumn = event.target.closest('.day');
  const targetCardList = targetColumn.querySelector('.scheduleList');

  if (targetCardList && draggedCard) {
    const cards = Array.from(targetCardList.children);
    const droppedIndex = cards.indexOf(event.target.closest('.schedule'));

    targetCardList.insertBefore(draggedCard, cards[droppedIndex]);
    const cardElements = Array.from(targetCardList.children);
    const numberOfCards = cardElements.length;
    console.log(`카드의 개수: ${numberOfCards}`);
    // updateCardPosition(draggedCard, originColumn, targetColumn, droppedIndex);
  }
}

setupDragAndDrop();
