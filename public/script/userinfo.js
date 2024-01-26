// 홈으로 이동
document.getElementById('gohome').addEventListener('click', function () {
  window.location.href = 'index.html';
});

// 페이지가 로드될 때 실행되는 함수
window.onload = function () {
  fetchUserProfile();
  document.getElementById('updateProfileForm').addEventListener('submit', updateProfile);
  document.getElementById('delete-profile-button').addEventListener('click', deleteUserProfile);
};

// // 페이지가 로드될 때 실행되는 함수
// window.onload = function () {
//   fetchUserProfile();
//   document.getElementById('updateProfileForm').addEventListener('submit', updateProfile);
// };

function fetchUserProfile() {
  const accessToken = localStorage.getItem('accessToken');
  axios
    .get('/api/user/info', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(function (response) {
      const data = response.data;
      displayUserProfile(data);
    })
    .catch(function (error) {
      alert('로그인이 필요한 서비스 입니다.');
      window.location.href = '/login.html';
      console.error('프로필 정보 불러오기 실패:', error);
    });
}

//회원 정보 수정 요청 함수
function updateProfile(event) {
  showLoading();
  event.preventDefault();

  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const username = document.getElementById('username').value;

  const formData = new FormData();
  formData.append('currentPassword', currentPassword);
  if (newPassword) formData.append('newPassword', newPassword);
  formData.append('username', username);

  const accessToken = localStorage.getItem('access_token');
  axios
    .patch('/api/auth/user', formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      alert(response.data.message);
      hideLoading();
      window.location.reload();
    })
    .catch((error) => {
      alert(error.response.data.message);
      hideLoading();
      console.error('회원 정보 업데이트 중 오류 발생', error);
    });
}

// 회원 탈퇴 이벤트 리스너 추가
document.getElementById('delete-profile-button').addEventListener('click', deleteUserProfile);

// 회원 탈퇴 요청 함수
function deleteUserProfile() {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    alert('로그인이 필요한 기능입니다.');
    window.location.href = '/login.html';
    return;
  }

  if (!confirm('정말로 계정을 삭제하시겠습니까?')) {
    return; // 사용자가 취소를 눌렀을 때
  }

  showLoading();

  axios
    .put('/api/user/delete', {
      // 백엔드 엔드포인트 경로
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => {
      alert(response.data.message);
      hideLoading();
      localStorage.removeItem('access_token');
      window.location.href = '/login.html';
    })
    .catch((error) => {
      alert('회원 탈퇴에 실패했습니다.');
      hideLoading();
      console.error('회원 탈퇴 중 오류 발생', error);
    });
}
