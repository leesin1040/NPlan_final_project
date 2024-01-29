// 여행보드 생성 엑시오스
const createTravelBtn = document.getElementById('boardCreateBtn');
createTravelBtn.addEventListener('click', createTravel);

async function createTravel() {
  let startDateString = document.getElementById('startDate').value;
  let endDateString = document.getElementById('endDate').value;
  let travelTitle = document.getElementById('boardTitle').value;
  let travelColor = document.getElementById('selectedColor').value;
  let travelTheme = document.getElementById('selectedTheme').value;
  let travelRegion = document.getElementById('selectedRegion').value;

  let startDate = new Date(startDateString);
  let endDate = new Date(endDateString);
  let timeDifferenceInMilliseconds = endDate - startDate;
  let days = timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24);

  try {
    const createTravelResponse = await axios.post('api/travel', {
      title: travelTitle,
      color: travelColor,
      region: travelRegion,
      theme: travelTheme,
      start_date: startDateString,
      end_date: endDateString,
    });

    const travelId = createTravelResponse.data.data.newTravel.id;

    // days가 전체 생성된 후에 이동하도록 await
    await axios.post(`api/travel/${travelId}/days`, { days: days });

    // days 생성 후 이동
    window.location.href = `/travel/${travelId}`;
  } catch (error) {
    alert(error.response.data.message);
  }
}
