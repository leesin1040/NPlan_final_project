// // 홈으로 이동
// document.getElementById('gohome').addEventListener('click', function () {
//   window.location.href = 'index.html';
// });

window.onload = function () {
  document.getElementById('updateProfileForm').addEventListener('submit', updateProfile);
  document.getElementById('delete-profile-button').addEventListener('click', deleteUserProfile);
};

//회원 정보 수정 요청 함수
async function updateProfile() {
  try {
    const password = document.getElementById('password').value;
    const newPassword = document.getElementById('newPassword').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    const response = await axios.put('api/user/info', {
      password: password,
      newPassword: newPassword,
      passwordConfirm: passwordConfirm,
    });

    alert('비밀번호가 변경되었습니다.');
    console.log(response);

    // Only reload the page if the password change was successful
    window.location.reload();
  } catch (error) {
    alert('비밀번호 변경 중 오류가 발생했습니다. 다시 시도해주세요.');
    console.error('회원 정보 업데이트 중 오류 발생', error);
  }
}

// 회원 탈퇴 이벤트 리스너 추가
document.getElementById('delete-profile-button').addEventListener('click', deleteUserProfile);

// 회원 탈퇴 요청 함수
function deleteUserProfile() {
  if (!confirm('정말로 계정을 삭제하시겠습니까?')) {
    return; // 사용자가 취소를 눌렀을 때
  }

  axios
    .put('api/user/delete', {})
    .then((response) => {
      alert(response.data.message);
      window.location.href = '/';
    })
    .catch((error) => {
      alert('회원 탈퇴에 실패했습니다.');

      console.error('회원 탈퇴 중 오류 발생', error);
    });
}
