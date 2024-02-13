window.onload = function () {
  document.getElementById('updateProfileForm').addEventListener('submit', updateProfile);
  document.getElementById('delete-profile-button').addEventListener('click', deleteUserProfile);
  document.getElementById('changeUserImgBtn').addEventListener('click', getProfileImg);
};

// 프로필이미지 수정
function getProfileImg(event) {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.click();
  fileInput.onchange = (changeEvent) => {
    const file = changeEvent.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      axios
        .post('/api/user/upload-img', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          if (response.data && response.data.message) {
            alert(response.data.message);
          } else {
            alert('이미지 업로드 성공!');
          }
          window.location.reload();
        })
        .catch((error) => {
          console.error('업로드 실패:', error);
          if (error.response && error.response.data && error.response.data.message) {
            alert('업로드 실패: ' + error.response.data.message);
          } else {
            alert('업로드 실패: 서버 오류');
          }
        });
    }
  };
}

//회원 정보 수정 요청 함수
async function updateProfile(e) {
  e.preventDefault();
  try {
    const password = document.getElementById('password').value;
    const newPassword = document.getElementById('newPassword').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    const response = await axios.put('api/user/info', {
      password: password,
      newPassword: newPassword,
      passwordConfirm: passwordConfirm,
    });

    alert(response.data.message);

    window.location.reload();
  } catch (error) {
    alert(error.response.data.message);
    // console.error('회원 정보 업데이트 중 오류 발생', error);
  }
}

// 회원 탈퇴 이벤트 리스너 추가
document.getElementById('delete-profile-button').addEventListener('click', deleteUserProfile);

// 회원 탈퇴 요청 함수
function deleteUserProfile() {
  if (!confirm('정말로 탈퇴 하시겠습니까?')) {
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
