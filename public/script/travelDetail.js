let realTravelId = window.location.pathname.split('/')[2];
// 여행보드 수정 엑시오스
const boardUpdateBtn = document.getElementById('boardUpdateBtn');
const boardDeleteBtn = document.getElementById('boardDeleteBtn');
boardUpdateBtn.addEventListener('click', updateTravel);
boardDeleteBtn.addEventListener('click', deleteTravel);

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

async function deleteTravel() {
  let travelId = document.getElementById('travelId').value;
  try {
    await axios.delete(`/api/travel/${travelId}`);
    alert('여행보드가 삭제되었습니다.');
    // 페이지 이동
    window.location.href = '/my-travel';
  } catch (error) {
    // 개선된 에러 핸들링
    if (error.response && error.response.data && error.response.data.message) {
      alert(error.response.data.message);
    } else {
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
  }
}

// 스케쥴 상세보기 모달
async function viewScheduleDetail(scheduleId) {
  // 상세보기 schedule 정보 띄우기
  await axios
    .get(`/api/schedule/${scheduleId}`)
    .then((response) => {
      // console.log(response.data);
      const scheduleDetailData = response.data.data;
      console.log('🚀 ~ .then ~ scheduleDetailData:', scheduleDetailData);
      // const scheduledayTitle = document.getElementById('dayTitle');
      // const scheduleName = document.getElementById('name');
      // const scheduleAddress = document.getElementById('address');
      // const scheduleCategory = document.getElementById('category');
      // const scheduleMemo = document.getElementById('memo');
      const scheduleMap = document.getElementById('scheduleMap');
      // // day이름
      // scheduledayTitle.innerHTML += `${scheduleDetailData.day.day}일차`;
      // scheduleName.value = scheduleDetailData.place.name;
      // scheduleAddress.value = scheduleDetailData.place.address;
      // scheduleCategory.value = scheduleDetailData.place.category;
      // scheduleMemo.value = scheduleDetailData.memo;
      //   // schedule map
      //   // 일단은 위치 마커만 추가
      //   // 추후 이전 스케쥴이 존재할 시 연결해서 동선 보여주기 추가
      let mapContainer = scheduleMap, // 지도를 표시할 div
        mapOption = {
          // 좌표에 카드들 중 첫번쨰의 좌표
          center: new kakao.maps.LatLng(
            scheduleDetailData.place.mapY,
            scheduleDetailData.place.mapX,
          ), // 지도의 중심좌표
          level: 3,
        };
      //   // 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
      let map = new kakao.maps.Map(mapContainer, mapOption);
      //   // 마커 표시하기
      //   // 카드들의 위치와 표시
      //   // 마커를 표시할 위치와 title 객체 배열입니다
      const positions = [
        {
          title: scheduleDetailData.place.name,
          latlng: new kakao.maps.LatLng(
            scheduleDetailData.place.mapY,
            scheduleDetailData.place.mapX,
          ),
        },
      ];
      //   // console.log(positions);
      //   // 마커 이미지의 이미지 주소입니다
      const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';
      //   // 마커 이미지의 이미지 크기 입니다
      const imageSize = new kakao.maps.Size(24, 35);
      //   // 마커 이미지를 생성합니다
      const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
      //   // 마커를 생성합니다
      const marker = new kakao.maps.Marker({
        map: map, // 마커를 표시할 지도
        position: positions[0].latlng, // 마커를 표시할 위치
        title: positions[0].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        image: markerImage, // 마커 이미지
        clickable: true,
      });

      var infowindow = new kakao.maps.InfoWindow({
        content: `
            <div style="width: 100%; max-width: 600px; height: 100%;">
                <div>
                    <img src="${scheduleDetailData.place.imgUrl}" style="width: 150px;">
                </div>
                <p>
                    <button type="button" class="btn btn-info btn-sm me-1" disabled="">${scheduleDetailData.place.category}</button>
                    <span class="place-name">${scheduleDetailData.place.name}</span>
                </p>
                <p class="schedulePlaceAdress">${scheduleDetailData.place.address}</p>
            </div>`,
        removable: true,
      });
      infowindow.open(map, marker);

      kakao.maps.event.addListener(marker, 'click', function () {
        // 마커 위에 인포윈도우를 표시합니다
        infowindow.open(map, marker);
      });
    })

    .catch((error) => {
      // alert(error.response.data.message);
      console.error('Error:', error);
    });

  // 스케줄 상세 - '삭제' 버튼을 누르면 schedule에서 삭제
  const deleteBtn = document.getElementById('viewScheduleModal-delete');
  deleteBtn.addEventListener('click', async (event) => {
    await axios
      .delete(`/api/schedule/${scheduleId}`)
      .then((response) => {
        alert('삭제되었습니다.');
        window.location.reload();
      })
      .catch((error) => {
        // alert(error.response.data.message);
        console.error('Error:', error);
      });
  });
}

// 스케줄 상세 - '닫기' 버튼을 누르면 모달창 닫힘
function closeDetailModalPage() {
  const modal = document.getElementById('viewScheduleModal');
  modal.style.display = 'none';
}

// 경로보기 모달창 이벤트리스너 할당 및 Get Map
async function viewDayPath(dayId) {
  const viewPathModal = document.getElementById('viewPathModal');
  const closePathModal = document.getElementById('closePathModal');
  let path = window.location.pathname;
  let pathParts = path.split('/');
  let travelId = pathParts[pathParts.indexOf('travel') + 1];
  closePathModal.addEventListener('click', () => {
    viewPathModal.style.display = 'none';
  });
  viewPathModal.style.display = 'flex';

  // day에 속한 좌표들 가져오기
  axios
    .get(`/api/travel/${travelId}/day/${dayId}`)
    .then(async (response) => {
      const schedules = response.data.data.schedule;
      const directions = response.data.data.directions;
      let coords = JSON.parse(response.data.data.directions);
      const cloneSchedules = [...schedules];
      const origin = cloneSchedules.shift();
      const destination = cloneSchedules.pop();

      let mapContainer = document.getElementById('dayMap'), // 지도를 표시할 div
        mapOption = {
          // 좌표에 카드들 중 첫번쨰의 좌표
          center: new kakao.maps.LatLng(origin.place.mapY, origin.place.mapX), // 지도의 중심좌표
          level: 3,
        };

      // 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
      const map = new kakao.maps.Map(mapContainer, mapOption);

      const positions = schedules.map((schedule) => ({
        title: schedule.place.name,
        address: schedule.place.address,
        latlng: new kakao.maps.LatLng(schedule.place.mapY, schedule.place.mapX),
      }));

      const placePath = schedules.map((schedule) => schedule.place.id);
      const previousPlacePath = response.data.data.placePath;
      if (
        !previousPlacePath ||
        !directions ||
        JSON.stringify(placePath) !== JSON.stringify(previousPlacePath) ||
        directions === null
      ) {
        coords = await drawDirections(origin, destination, schedules, travelId, dayId, placePath);
      }

      // 마커 이미지의 이미지 주소입니다
      let imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';

      positions.forEach((position, index) => {
        let imageSize;
        if (positions.length - 1 === index || index === 0) {
          imageSize = new kakao.maps.Size(36, 52);
        } else {
          imageSize = new kakao.maps.Size(24, 35);
        }

        // 마커 이미지를 생성합니다
        let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

        // 마커를 생성합니다
        let marker = new kakao.maps.Marker({
          map: map, // 마커를 표시할 지도
          position: position.latlng, // 마커를 표시할 위치
          title: position.title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
          image: markerImage, // 마커 이미지
          clickable: true,
        });

        // 마커에 클릭이벤트를 등록합니다
        kakao.maps.event.addListener(
          marker,
          'click',
          (function (marker) {
            let iwContent = `<div style = "width:100%; height:100%;">
                             <div">${position.title}</div>
                            <div>${position.address}</div>
                            </div>`,
              iwRemoveable = true;
            let infowindow = new kakao.maps.InfoWindow({
              content: iwContent,
              removable: iwRemoveable,
            });
            return function () {
              infowindow.open(map, marker);
            };
          })(marker),
        );
      });

      const kakaoCoords = coords.map((coord) =>
        coord.map(({ lat, lng }) => new kakao.maps.LatLng(lat, lng)),
      );

      kakaoCoords.forEach((coord, index) => {
        const polyline = new kakao.maps.Polyline({
          path: coord,
          strokeWeight: 5,
          strokeColor: `#000000`,
          strokeOpacity: 0.7,
          strokeStyle: 'solid',
          endArrow: true,
        });
        polyline.setMap(map);
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

// 경로api 연결
async function drawDirections(origin, destination, schedules, travelId, dayId, placePath) {
  const REST_API_KEY = '553ceec33cc4d1eec0b87f1834680033';
  const requestParams = {
    origin: {
      x: origin.place.mapX,
      y: origin.place.mapY,
    },
    destination: {
      x: destination.place.mapX,
      y: destination.place.mapY,
    },
    waypoints: schedules.map((point) => ({
      x: point.place.mapX,
      y: point.place.mapY,
    })),
    avoid: ['roadevent'],
    alternatives: true,
  };
  try {
    const response = await axios.post(
      'https://apis-navi.kakaomobility.com/v1/waypoints/directions',
      requestParams,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `KakaoAK ${REST_API_KEY}`,
        },
      },
    );
    const sections = response.data.routes[0].sections;
    const coords = sections.map((sections) => {
      return sections.roads
        .map((road) => {
          // road.vertexes 에서 짝수 인덱스는 x, 홀수 인덱스는 y 인 좌표 object 반환
          const lngs = road.vertexes.filter((vertex, index) => index % 2 === 0);
          return lngs
            .map((lng, index) => ({
              lat: road.vertexes[index * 2 + 1],
              lng,
            }))
            .flat();
        })
        .flat();
    });
    // console.log(coords);
    await createPath(travelId, dayId, coords, placePath);
    return coords;
  } catch (error) {
    console.log(error);
  }
}
// api연결 후 저장
async function createPath(travelId, dayId, coords, placePath) {
  axios
    .patch(`/api/travel/${travelId}/day/${dayId}/directions`, {
      directions: coords,
      placePath,
    })
    .then((response) => {
      console.log(response.data.data);
    })
    .catch((error) => {
      alert(error);
    });
}
