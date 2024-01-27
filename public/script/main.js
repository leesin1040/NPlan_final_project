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
