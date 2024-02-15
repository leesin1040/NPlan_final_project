// dayId 받아오기
async function addSchedule(dayId) {
  let path = window.location.pathname;
  let pathParts = path.split('/');
  let travelId = pathParts[pathParts.indexOf('travel') + 1];

  const dayTitle = document.getElementById('dayTitle');
  dayTitle.innerText = '';

  // await axios
  //   .get(`/api/travel/${travelId}/day/${dayId}`, {})
  //   .then((response) => {
  //     const data = response.data.data[0];

  //     // console.log(`${data.day}일차`);
  //     dayTitle.innerText = `${data.day}일차`;
  //   })
  //   .catch((error) => {
  //     // alert(error.response.data.message);
  //     console.error('Error:', error);
  //   });

  // 지역 및 카테고리 선택
  const submit = document.getElementById('addScheduleModal-submit');
  submit.addEventListener('click', async (event) => {
    event.preventDefault();

    const areaCode = document.getElementById('areaCode').value;
    const category = document.getElementById('category').value;
    console.log(areaCode, category);

    if (category === 'O00') {
      await getPlaceListAll(areaCode);
    } else {
      await getPlaceListByCategory(areaCode, category);
    }
  });

  // place table에서 지역별 장소정보 가져오기
  async function getPlaceListAll(areaCode) {
    await axios
      .get(`/api/place/region/${areaCode}`)
      .then((response) => {
        const datas = response.data.data;
        console.log(datas);

        showPlaceList(datas);
      })
      .catch((error) => {
        // alert(error.response.data.message);
        console.error('Error:', error);
      });
  }

  // place table에서 지역별 + 카테고리별 장소정보 가져오기
  async function getPlaceListByCategory(areaCode, cat1) {
    await axios
      .get(`/api/place/region/${areaCode}/content/${cat1}`)
      .then((response) => {
        const datas = response.data.data;
        console.log(datas);

        showPlaceList(datas);
      })
      .catch((error) => {
        // alert(error.response.data.message);
        console.error('Error:', error);
      });
  }

  // place table에서 받아온 place 정보를 html에 띄우기
  function showPlaceList(datas) {
    const placeList = document.getElementById('addScheduleModal-placeList');
    placeList.innerHTML = '';

    datas.map((data) => {
      const place = document.createElement('div');
      place.className = 'addScheduleModal-place';
      place.id = data.id;
      place.dataset.mapx = data.mapx;
      place.dataset.mapy = data.mapy;
      placeList.appendChild(place);

      const imgUrl = document.createElement('div');
      imgUrl.className = 'addScheduleModal-imgUrl';
      place.appendChild(imgUrl);

      const placeImg = document.createElement('img');
      placeImg.className = 'addScheduleModal-placeImg';
      data.imgUrl === null
        ? (placeImg.src =
            'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo-available_87543-11093.jpg')
        : (placeImg.src = data.imgUrl);
      imgUrl.appendChild(placeImg);

      const placeContent = document.createElement('div');
      placeContent.className = 'addScheduleModal-placeContent';
      place.appendChild(placeContent);

      const placeName = document.createElement('p');
      placeName.className = 'placeName';
      placeName.innerText = data.name;
      placeContent.appendChild(placeName);

      const placeAddress = document.createElement('p');
      placeAddress.className = 'placeAddress ';
      placeAddress.innerText = data.address;
      placeContent.appendChild(placeAddress);

      const placeCategory = document.createElement('p');
      placeCategory.className = 'placeCategory btn btn-primary btn-sm disabled';
      placeCategory.dataset.cat1 = data.cat1;
      placeCategory.innerText = data.category;
      placeContent.appendChild(placeCategory);

      const selectBtn = document.createElement('button');
      selectBtn.className = 'addScheduleModal-select btn btn-outline-success';
      selectBtn.id = `selectPlace${data.id}`;
      selectBtn.innerText = '선택';
      place.appendChild(selectBtn);
    });
  }

  // 장소 선택하면 해당 장소를 schedule에 등록
  document.addEventListener(
    'click',
    async (event) => {
      if (event.target.id.startsWith('selectPlace')) {
        const placeId = event.target.id.replace('selectPlace', '');

        // schedule 생성
        await axios
          .post('/api/schedule', {
            placeId,
            dayId,
          })
          .then((response) => {
            const data = response.data;
            window.location.reload();
          })
          .catch((error) => {
            // alert(error.response.data.message);
            console.error('Error:', error);
          });
      }
    },
    { once: true },
  );
}

// x버튼을 누르면 모달창 닫힘
function closeModalPage() {
  const modal = document.getElementById('addScheduleModal');
  modal.style.display = 'none';
}
