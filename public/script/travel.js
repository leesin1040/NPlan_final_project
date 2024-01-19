// 달력

// 버튼
document.getElementById('dates').addEventListener('click', date);

function date() {
  let startDateString = document.getElementById('startDate').value;
  let endDateString = document.getElementById('endDate').value;
  let travelTitle = document.getElementById('title').value;
  let travelColor = document.getElementById('color').value;
  let travelTheme = document.getElementById('theme').value;
  let travelRegion = document.getElementById('region').value;
  // input type="date"에서 얻은 문자열을 Date 객체로 변환
  let startDate = new Date(startDateString);
  let endDate = new Date(endDateString);
  let timeDifferenceInMilliseconds = endDate - startDate;
  let days = timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24);
  let accessToken = localStorage.getItem('accessToken');
  axios
    .post(
      'api/travel',
      {
        title: travelTitle,
        color: travelColor,
        region: travelRegion,
        theme: travelTheme,
        start_date: startDateString,
        end_date: endDateString,
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    )

    .then((response) => {
      axios.post(`api/travel/${response.data.data.newTravel.id}/days`, { days: days });
      alert(response.data.message);
      window.location.href = `/days.html?travelId=${response.data.data.newTravel.id}&days=${days}`;
    })
    .catch((error) => {
      // console.error(error);
      alert(error.response.data.message);
    });
}
