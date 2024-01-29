// params에서 travelId와 days를 가져와 day생성
// day생성하면서 dayId로 card생성

// day는 dayList에 안에 추가하자

const urlParams = new URLSearchParams(window.location.search);
const travelId = urlParams.get('id');
const travelTitle = urlParams.get('title');
document.title = travelTitle;
document.getElementById('travelTitle').innerHTML += travelTitle;

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

        axios.get(`api/schedule/allOfDay/${day.id}`).then((response) => {
          const scheduleData = response.data;
          const scheduleList = document.getElementById(`scheduleList${day.id}`);
          // console.log(scheduleList);
          scheduleData.data.forEach((schedule) => {
            // console.log(schedule);

            let scheduleHtml = `
            <div
            class="schedule"
            draggable="true"
            
            style="border: 4px solid"
          >
            <strong>(${schedule.place.category})${schedule.place.name}</strong><br />
            <strong>${schedule.place.address} 5</strong>
            <button
              class="delete-btn bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-2 border border-gray-400 rounded shadow"
              type="button"
              id="scheduleDetail${schedule.id}"
            >
              상세보기
            </button>
          </div>
              `;
            scheduleList.innerHTML += scheduleHtml;
          });
        });
      });
    })
    .catch((error) => {
      alert(error.response.data.message);
      // console.error('Error:', error);
    });
}
window.onload = function () {
  getDays(travelId);
  // 버튼에 이벤트리스트할당
  document.addEventListener('click', function (event) {
    // 경로 보기 버튼
    if (event.target.id.startsWith('viewDayPath')) {
      const dayId = event.target.id.replace('viewDayPath', '');
      viewDayPath(dayId);
    }
    // Add Schedule 버튼
    else if (event.target.id.startsWith('addScheduleBtnId')) {
      const dayId = event.target.id.replace('addScheduleBtnId', '');
      document.getElementById('addScheduleModal').style.display = 'flex';
      addSchdule(dayId);
    }
    //상세보기 버튼
    else if (event.target.id.startsWith('scheduleDetail')) {
      const closeDetailModal = document.getElementById('closeDetailModal');
      closeDetailModal.addEventListener('click', () => {
        viewScheduleModal.style.display = 'none';
      });
      const scheduleId = event.target.id.replace('scheduleDetail', '');
      document.getElementById('viewScheduleModal').style.display = 'flex';
      // console.log(scheduleId);
      viewScheduleDetail(scheduleId);
    }
  });
};
// 스케쥴 상세보기 모달
function viewScheduleDetail(scheduleId) {
  axios.get(`api/schedule/one/${scheduleId}`).then((response) => {
    // console.log(response.data);
    const scheduleDetailData = response.data.data;
    const scheduledayTitle = document.getElementById('dayTitle');
    const scheduleName = document.getElementById('name');
    const scheduleAddress = document.getElementById('address');
    const scheduleCategory = document.getElementById('category');
    const scheduleMemo = document.getElementById('memo');
    const scheduleMap = document.getElementById('scheduleMap');
    // day이름
    scheduledayTitle.innerHTML += `${scheduleDetailData.day.day}일차`;
    scheduleName.value = scheduleDetailData.place.name;
    scheduleAddress.value = scheduleDetailData.place.address;
    scheduleCategory.value = scheduleDetailData.place.category;
    scheduleMemo.value = scheduleDetailData.memo;

    // schedule map
    // 일단은 위치 마커만 추가
    // 추후 이전 스케쥴이 존재할 시 연결해서 동선 보여주기 추가
    let mapContainer = scheduleMap, // 지도를 표시할 div
      mapOption = {
        // 좌표에 카드들 중 첫번쨰의 좌표
        center: new kakao.maps.LatLng(scheduleDetailData.place.mapY, scheduleDetailData.place.mapX), // 지도의 중심좌표
        level: 3,
      };

    // 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
    let map = new kakao.maps.Map(mapContainer, mapOption);
    // 마커 표시하기
    // 카드들의 위치와 표시
    // 마커를 표시할 위치와 title 객체 배열입니다
    var positions = [
      {
        title: scheduleDetailData.place.name,
        latlng: new kakao.maps.LatLng(scheduleDetailData.place.mapY, scheduleDetailData.place.mapX),
      },
    ];
    // console.log(positions);
    // 마커 이미지의 이미지 주소입니다
    var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';

    // 마커 이미지의 이미지 크기 입니다
    var imageSize = new kakao.maps.Size(24, 35);

    // 마커 이미지를 생성합니다
    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

    // 마커를 생성합니다
    var marker = new kakao.maps.Marker({
      map: map, // 마커를 표시할 지도
      position: positions[0].latlng, // 마커를 표시할 위치
      title: positions[0].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
      image: markerImage, // 마커 이미지
      clickable: true,
    });

    // 마커에 클릭이벤트를 등록합니다
    kakao.maps.event.addListener(
      marker,
      'click',
      (function (marker) {
        var iwContent = `<div style = "width:100%; height:100%;">
                             <div">${scheduleDetailData.place.name}</div>
                            <div>${scheduleDetailData.place.address}</div>
                            </div>`,
          iwRemoveable = true;
        var infowindow = new kakao.maps.InfoWindow({
          content: iwContent,
          removable: iwRemoveable,
        });
        return function () {
          infowindow.open(map, marker);
        };
      })(marker),
    );
  });
}
// 경로보기 모달창 이벤트리스너 할당 및 Get Map
function viewDayPath(dayId) {
  const viewPathModal = document.getElementById('viewPathModal');
  const closePathModal = document.getElementById('closePathModal');
  closePathModal.addEventListener('click', () => {
    viewPathModal.style.display = 'none';
  });
  viewPathModal.style.display = 'flex';
  // day에 속한 좌표들 가져오기
  axios
    .get(`api/travel/${travelId}/day/${dayId}`)
    .then((response) => {
      const locationData = response.data.data;

      const newData = {
        origin: {},
        destination: {},
        waypoints: [],
      };
      locationData[0].schedule.forEach((a, index) => {
        if (index === 0) {
          newData.origin = {
            x: a.place.mapX,
            y: a.place.mapY,
          };
        } else if (index === locationData[0].schedule.length - 1) {
          newData.destination = {
            x: a.place.mapX,
            y: a.place.mapY,
          };
        } else {
          newData.waypoints.push({
            name: a.place.name,
            x: a.place.mapX,
            y: a.place.mapY,
          });
        }
      });
      // console.log(newData);
      // 1.카카오 map에서 지도가져오기
      let mapContainer = document.getElementById('dayMap'), // 지도를 표시할 div
        mapOption = {
          // 좌표에 카드들 중 첫번쨰의 좌표
          center: new kakao.maps.LatLng(newData.origin.y, newData.origin.x), // 지도의 중심좌표
          level: 3,
        };

      // 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
      let map = new kakao.maps.Map(mapContainer, mapOption);
      // console.log(newData.destination.y);
      var positions = [
        {
          title: locationData[0].schedule[0].place.name,
          latlng: new kakao.maps.LatLng(newData.origin.y, newData.origin.x),
        },
        {
          title: locationData[0].schedule[locationData[0].schedule.length - 1].place.name,
          latlng: new kakao.maps.LatLng(
            String(newData.destination.y),
            String(newData.destination.x),
          ),
        },
      ];
      newData.waypoints.forEach((waypoint) => {
        positions.push({
          title: waypoint.name,
          latlng: new kakao.maps.LatLng(waypoint.y, waypoint.x),
        });
      });
      console.log(positions);
      // 마커 이미지의 이미지 주소입니다
      var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';

      for (var i = 0; i < positions.length; i++) {
        // 마커 이미지의 이미지 크기 입니다
        var imageSize = new kakao.maps.Size(24, 35);

        // 마커 이미지를 생성합니다
        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

        // 마커를 생성합니다
        var marker = new kakao.maps.Marker({
          map: map, // 마커를 표시할 지도
          position: positions[i].latlng, // 마커를 표시할 위치
          title: positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
          image: markerImage, // 마커 이미지
          clickable: true,
        });

        // 마커에 클릭이벤트를 등록합니다
        kakao.maps.event.addListener(
          marker,
          'click',
          (function (marker) {
            var iwContent = `<div style = "width:100%; height:100%;">
                             <div">${locationData[0].schedule[i].place.name}</div>
                            <div>${locationData[0].schedule[i].place.address}</div>
                            </div>`,
              iwRemoveable = true;
            var infowindow = new kakao.maps.InfoWindow({
              content: iwContent,
              removable: iwRemoveable,
            });
            return function () {
              infowindow.open(map, marker);
            };
          })(marker),
        );
      }

      const REST_API_KEY = '';
      axios
        .post('https://apis-navi.kakaomobility.com/v1/waypoints/directions', newData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `KakaoAK ${REST_API_KEY}`,
          },
        })
        .then((response) => {
          // console.log(response.data.routes[0].sections);
          const linePath = [];
          response.data.routes[0].sections.forEach((a) => {
            a.roads.forEach((router) => {
              router.vertexes.forEach((vertex, index) => {
                if (index % 2 === 0) {
                  linePath.push(
                    new kakao.maps.LatLng(router.vertexes[index + 1], router.vertexes[index]),
                  );
                }
              });
              var polyline = new kakao.maps.Polyline({
                path: linePath,
                strokeWeight: 5,
                strokeColor: '#000000',
                strokeOpacity: 0.7,
                strokeStyle: 'solid',
                endArrow: true,
              });
              polyline.setMap(map);
            });
          });
        });
    })
    .catch((error) => {
      console.error(error);
    });
}

// // 드래그 앤 드롭
// let draggedCard = null;
// let originColumn = null;
// // 드래그 앤 드롭 설정
// function setupDragAndDrop() {
//   const cards = document.querySelectorAll('.schedule');
//   const columns = document.querySelectorAll('.day');

//   // 카드에 대한 이벤트 리스너 설정
//   cards.forEach((card) => {
//     card.setAttribute('draggable', true);
//     card.addEventListener('dragstart', handleDragStart);
//     card.addEventListener('dragend', handleDragEnd);
//   });

//   // 컬럼에 대한 이벤트 리스너 설정
//   columns.forEach((column) => {
//     column.addEventListener('dragover', handleDragOver);
//     column.addEventListener('drop', handleDrop);
//   });
//   // console.log('너 동작은 하니?');
// }

// // 드래그 시작 시 호출
// function handleDragStart(event) {
//   draggedCard = event.target;
//   originColumn = draggedCard.closest('.day');
//   // console.log('Drag Start:', draggedCard);
// }

// // 드래그 종료 시 호출
// function handleDragEnd() {
//   // console.log('Drag End');
//   draggedCard = null;
//   originColumn = null;
// }

// // 드래그 오버 시 호출
// function handleDragOver(event) {
//   event.preventDefault();
//   // console.log('Drag Over');
// }
// // 드롭 시 호출
// function handleDrop(event) {
//   event.preventDefault();
//   const targetColumn = event.target.closest('.day');
//   const targetCardList = targetColumn.querySelector('.scheduleList');

//   if (targetCardList && draggedCard) {
//     const cards = Array.from(targetCardList.children);
//     const droppedIndex = cards.indexOf(event.target.closest('.schedule'));

//     targetCardList.insertBefore(draggedCard, cards[droppedIndex]);
//     const cardElements = Array.from(targetCardList.children);
//     const numberOfCards = cardElements.length;
//     console.log(`카드의 개수: ${numberOfCards}`);
//     // updateCardPosition(draggedCard, originColumn, targetColumn, droppedIndex);
//   }
// }

// setupDragAndDrop();
// function updateCardPosition(card, originColumn, newColumn, newIndex) {
//   const cardId = card.getAttribute('data-card-id');
//   const originColumnId = originColumn.getAttribute('data-column-id');
//   const newColumnId = newColumn.getAttribute('data-column-id');

//   const urlParams = new URLSearchParams(window.location.search);
//   const boardId = urlParams.get('boardId');
//   const accessToken = localStorage.getItem('access_token');

//   if (newColumnId !== originColumnId) {
//     // 다른 컬럼으로 이동
//     axios
//       .patch(
//         `/board/${boardId}/column/${originColumnId}/cardMove/${cardId}`,
//         { destinationColumnId: newColumnId },
//         {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         },
//       )
//       .then(() => console.log('Card moved successfully'))
//       .catch((error) => console.error('Error moving card', error));
//   } else {
//     // 같은 컬럼 내에서 위치 변경
//     const newOrder = newIndex; // 서버에 보낼 새 순서는 드롭된 인덱스 + 1

//     // console.log(
//     //   boardId,
//     //   'boardId',
//     //   newColumnId,
//     //   'columnId',
//     //   cardId,
//     //   'cardId',
//     //   newOrder,
//     //   'newOrder',
//     // );
//     axios
//       .patch(
//         `/board/${boardId}/column/${newColumnId}/cardOrder`,
//         { cardId: cardId, newOrder: newOrder },
//         {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         },
//       )
//       .then(() => console.log('Card order updated successfully'))
//       .catch((error) => console.error('Error updating card order', error));
//   }
// }
// 드래그 앤 드롭
