var realTravelId = window.location.pathname.split('/')[2];

console.log(realTravelId); // 출력: "1"

// 여행보드 수정 엑시오스
const boardUpdateBtn = document.getElementById('boardUpdateBtn');
boardUpdateBtn.addEventListener('click', updateTravel);
async function updateTravel() {
  let travelId = document.getElementById('travelId').value;
  let startDateString = document.getElementById('startDate').value;
  let endDateString = document.getElementById('endDate').value;
  let travelTitle = document.getElementById('boardTitle').value;
  let travelColor = document.getElementById('selectedColor').value;
  let travelTheme = document.getElementById('selectedTheme').value;
  let travelRegion = document.getElementById('selectedRegion').value;
  try {
    const updateTravelResponse = await axios.patch(`/api/travel/${travelId}`, {
      title: travelTitle,
      color: travelColor,
      region: travelRegion,
      theme: travelTheme,
      start_date: startDateString,
      end_date: endDateString,
    });
    alert('변경되었습니다.');
    // days 생성 후 이동
    window.location.reload();
  } catch (error) {
    alert(error.response.data.message);
  }
}

// 스케쥴 상세보기 모달
function viewScheduleDetail(scheduleId) {
  axios.get(`/api/schedule/one/${scheduleId}`).then((response) => {
    // console.log(response.data);
    // const scheduleDetailData = response.data.data;
    // const scheduledayTitle = document.getElementById('dayTitle');
    // const scheduleName = document.getElementById('name');
    // const scheduleAddress = document.getElementById('address');
    // const scheduleCategory = document.getElementById('category');
    // const scheduleMemo = document.getElementById('memo');
    // const scheduleMap = document.getElementById('scheduleMap');
    // // day이름
    // scheduledayTitle.innerHTML += `${scheduleDetailData.day.day}일차`;
    // scheduleName.value = scheduleDetailData.place.name;
    // scheduleAddress.value = scheduleDetailData.place.address;
    // scheduleCategory.value = scheduleDetailData.place.category;
    // scheduleMemo.value = scheduleDetailData.memo;

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
  let path = window.location.pathname;
  let pathParts = path.split('/');
  let travelId = pathParts[pathParts.indexOf('travel') + 1];
  console.log(travelId);
  closePathModal.addEventListener('click', () => {
    viewPathModal.style.display = 'none';
  });
  viewPathModal.style.display = 'flex';

  // day에 속한 좌표들 가져오기
  axios
    .get(`/api/travel/${travelId}/day/${dayId}`)
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

      let mapContainer = document.getElementById('dayMap'), // 지도를 표시할 div
        mapOption = {
          // 좌표에 카드들 중 첫번쨰의 좌표
          center: new kakao.maps.LatLng(newData.origin.y, newData.origin.x), // 지도의 중심좌표
          level: 3,
        };

      // 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
      let map = new kakao.maps.Map(mapContainer, mapOption);
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

      const REST_API_KEY = 'd41807851f9aa8590592ed4840439f53';
      axios
        .post('https://apis-navi.kakaomobility.com/v1/waypoints/directions', newData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `KakaoAK ${REST_API_KEY}`,
          },
        })
        .then((response) => {
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
    })
    .catch((error) => {
      console.error(error);
    });
}
