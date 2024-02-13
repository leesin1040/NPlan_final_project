const mapContainer = document.getElementById('map'), // 지도를 표시할 div
  mapOption = {
    center: new kakao.maps.LatLng(37.56671610918077, 126.97879660743492), // 지도의 중심좌표
    level: 5, // 지도의 확대 레벨
  };

const map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

// 지도를 클릭한 위치에 표출할 마커입니다
const marker = new kakao.maps.Marker({
    // 지도 중심좌표에 마커를 생성합니다
    position: map.getCenter(),
  }),
  infowindow = new kakao.maps.InfoWindow({ zindex: 1 });
// 지도에 마커를 표시합니다
marker.setMap(map);
const geocoder = new kakao.maps.services.Geocoder();
// 지도에 클릭 이벤트를 등록합니다
// 지도를 클릭하면 마지막 파라미터로 넘어온 함수를 호출합니다
kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
  searchDetailAddrFromCoords(mouseEvent.latLng, function (result, status) {
    if (status === kakao.maps.services.Status.OK) {
      const detailAddr = '<div>주소 : ' + result[0].address.address_name + '</div>';
      document.getElementById('placeAddress').value = `${result[0].address.address_name}`;
      const content =
        '<div class="bAddr">' + '<span id="placeLocation">현재 위치</span>' + detailAddr + '</div>';

      // 마커를 클릭한 위치에 표시합니다
      marker.setPosition(mouseEvent.latLng);
      marker.setMap(map);

      // 인포윈도우에 클릭한 위치에 대한 법정동 상세 주소정보를 표시합니다
      infowindow.setContent(content);
      infowindow.open(map, marker);
    }
  });
  // 클릭한 위도, 경도 정보를 가져옵니다
  const latlng = mouseEvent.latLng;

  // 마커 위치를 클릭한 위치로 옮깁니다
  marker.setPosition(latlng);
  document.getElementById('placeMapX').value = latlng.getLng();
  document.getElementById('placeMapY').value = latlng.getLat();
});

// 좌표로 주소 정보를 요청합니다
function searchDetailAddrFromCoords(coords, callback) {
  geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('createPlaceBtn').addEventListener('click', createPlace);
});

// place저장 axios
async function createPlace() {
  const mapX = parseFloat(document.getElementById('placeMapX').value);
  const mapY = parseFloat(document.getElementById('placeMapY').value);
  const address = document.getElementById('placeAddress').value;
  const name = document.getElementById('placeName').value;
  const cat1 = document.getElementById('placeCat1').value;
  let accessToken = getCookieValue('Authorization');
  axios
    .post(
      '/api/place',
      {
        name,
        address,
        mapX,
        mapY,
        cat1,
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    )
    .then((response) => {
      alert(`${response.data.message}`);
    })
    .catch((error) => {
      alert(error.message);
    });
}

function getCookieValue(cookieName) {
  const cookieValue = document.cookie
    .split('; ')
    .find((row) => row.startsWith(cookieName + '='))
    ?.split('=')[1];

  return cookieValue || null;
}
