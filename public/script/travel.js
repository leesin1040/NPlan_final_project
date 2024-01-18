// 달력

// 버튼
document.getElementById('dates').addEventListener('click', date);

function date() {
  let startDateString = document.getElementById('startDate').value;
  let endDateString = document.getElementById('endDate').value;
  let travelName = document.getElementById('name').value;
  // input type="date"에서 얻은 문자열을 Date 객체로 변환
  let startDate = new Date(startDateString);
  let endDate = new Date(endDateString);
  let timeDifferenceInMilliseconds = endDate - startDate;
  let timeDifferenceInDays = timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24);
  // console.log(timeDifferenceInDays + 1);
  alert('제목' + travelName + ', ' + (timeDifferenceInDays + 1) + '일입니다');
  window.location.href = '/public/days.html';
}
