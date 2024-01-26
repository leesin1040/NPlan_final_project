const TOUR_API_KEY = '{{TOUR_API_KEY}}';
// 지역 및 카테고리 선택
const submit = document.getElementById('submit');
submit.addEventListener('click', async (event) => {
  event.preventDefault();

  const areaCode = document.getElementById('areaCode').value;
  const category = document.getElementById('category').value;
  console.log(areaCode, category);

  if (category === 'O00') {
    await getPlaceListAll(areaCode);
  } else await getPlaceListByCategory(areaCode, category);
});

// 더 많은 장소를 가져오기(Tour api 연결)
const connectApi = document.getElementById('connectApi');
connectApi.addEventListener('click', async (event) => {
  event.preventDefault();

  const areaCode = document.getElementById('areaCode').value;
  const category = document.getElementById('category').value;
  console.log(areaCode, category);

  if (category === 'O00') {
    await getPlacesFromApiWithoutCategory(areaCode);
  } else await getPlacesFromApi(areaCode, category);
});

// 장소 선택
document.querySelectorAll('.place').forEach((element) => {
  element.addEventListener('click', async (event) => {
    const id = event.currentTarget.id;
    console.log(id);

    // dayId 받아오는 로직 짜기
    const dayId = 1;
    await getPlaceInfo(id, dayId);

    // alert(`place id: ${id}`);
  });
});

// place table에서 지역기준 장소정보 가져오기
async function getPlaceListAll(areaCode) {
  await axios
    .get('api/place/region', {
      region: areaCode,
    })
    .then((response) => {
      const datas = response.data.data;
      console.log(datas);

      const placeList = document.getElementsByClassName('placeList');
      placeList.innerHTML = '';

      datas.map((data) => {
        const place = document.createElement('div');
        place.className = 'place';
        place.id = data.id;
        place = document.appendChild(placeList);

        const imgUrl = document.createElement('div');
        imgUrl.className = 'imgUrl';
        imgUrl = document.appendChild(place);

        const img = document.createElement('img');
        data.imgUrl === null
          ? (img.src =
              'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo-available_87543-11093.jpg')
          : (img.src = data.imgUrl);
        img = document.appendChild(imgUrl);

        const placeContent = document.createElement('div');
        placeContent.className = 'placeContent';
        placeContent = document.appendChild(place);

        const name = document.createElement('p');
        name.className = 'name';
        name.innerText = data.name;
        name = document.appendChild(placeContent);

        const address = document.createElement('p');
        address.className = 'address';
        address.innerText = data.address;
        address = document.appendChild(placeContent);

        const category = document.createElement('p');
        category.className = 'category';
        category.innerText = data.category;
        category = document.appendChild(placeContent);
      });
    })
    .catch((error) => {
      // alert(error.response.data.message);
      console.error('Error:', error);
    });
}

// place table에서 지역기준 + 카테고리 별 장소정보 가져오기
async function getPlaceListByCategory(areaCode, category) {
  await axios
    .get('api/place/region/content', {
      region: areaCode,
      content: category,
    })
    .then((response) => {
      const datas = response.data.data;
      console.log(datas);

      const placeList = document.getElementsByClassName('placeList');
      placeList.innerHTML = '';

      datas.map((data) => {
        const place = document.createElement('div');
        place.className = 'place';
        place.id = data.id;
        place = document.appendChild(placeList);

        const imgUrl = document.createElement('div');
        imgUrl.className = 'imgUrl';
        imgUrl = document.appendChild(place);

        const img = document.createElement('img');
        data.imgUrl === null
          ? (img.src =
              'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo-available_87543-11093.jpg')
          : (img.src = data.imgUrl);
        img = document.appendChild(imgUrl);

        const placeContent = document.createElement('div');
        placeContent.className = 'placeContent';
        placeContent = document.appendChild(place);

        const name = document.createElement('p');
        name.className = 'name';
        name.innerText = data.name;
        name = document.appendChild(placeContent);

        const address = document.createElement('p');
        address.className = 'address';
        address.innerText = data.address;
        address = document.appendChild(placeContent);

        const category = document.createElement('p');
        category.className = 'category';
        category.innerText = data.category;
        category = document.appendChild(placeContent);
      });
    })
    .catch((error) => {
      // alert(error.response.data.message);
      console.error('Error:', error);
    });
}

// place 선택 시 해당 place schedule에 추가
async function getPlaceInfo(placeId, dayId) {
  await axios
    .post('api/schedule', {
      placeId,
      dayId,
    })
    .then((response) => {
      const data = response.data;
      console.log(data);
    })
    .catch((error) => {
      // alert(error.response.data.message);
      console.error('Error:', error);
    });
}

// tour api key 받아오기
async function getTourApiKey() {
  await axios
    .get('api/place/api-key')
    .then((response) => {
      const TOUR_API_KEY = response.data;
      return TOUR_API_KEY;
    })
    .catch((error) => {
      // alert(error.response.data.message);
      console.error('Error:', error);
    });
}

//Tour api로부터 place 정보 받아오기
async function getPlacesFromApi(areaCode, category) {
  const TOUR_API_KEY = getTourApiKey();
  const operation = `areaBasedList1`; // 지역기반관광정보조회
  const baseUrl = `https://apis.data.go.kr/B551011/KorService1/${operation}?serviceKey=${TOUR_API_KEY}`;
  await axios
    .get(baseUrl, {
      params: {
        numOfRows: 20, // 한페이지 결과 수
        pageNo: 1, // 페이지 번호
        MobileOS: 'ETC', // OS 구분
        MobileApp: 'AppTest', // 서비스 명
        _type: 'json', // response type
        areaCode: areaCode, // 지역코드
        cat1: category, // 대분류코드
        arrange: 'A', // 정렬구분: A(제목순), C(수정일순), D(생성일순), E(거리순)/ (대표이미지가 있는 것만) O(제목순), Q(수정일순), R(생성일순), S(거리순)
      },
    })
    .then((response) => {
      const data = response.data.response.body.items.item;
      console.log(data);

      // for (let item of data) {
      //   console.log(item['code'], item['name']);
      // }
    })
    .catch((error) => {
      // alert(error.response.data.message);
      console.error('Error:', error);
    });
}

//Tour api로부터 place 정보 받아오기(카테고리 없이 전체)
async function getPlacesFromApiWithoutCategory(areaCode) {
  const TOUR_API_KEY = getTourApiKey();
  const operation = `areaBasedList1`; // 지역기반관광정보조회
  const baseUrl = `https://apis.data.go.kr/B551011/KorService1/${operation}?serviceKey=${TOUR_API_KEY}`;
  await axios
    .get(baseUrl, {
      params: {
        numOfRows: 20, // 한페이지 결과 수
        pageNo: 1, // 페이지 번호
        MobileOS: 'ETC', // OS 구분
        MobileApp: 'AppTest', // 서비스 명
        _type: 'json', // response type
        areaCode: areaCode, // 지역코드
        arrange: 'A', // 정렬구분: A(제목순), C(수정일순), D(생성일순), E(거리순)/ (대표이미지가 있는 것만) O(제목순), Q(수정일순), R(생성일순), S(거리순)
      },
    })
    .then((response) => {
      const data = response.data.response.body.items.item;
      console.log(data);

      // for (let item of data) {
      //   console.log(item['code'], item['name']);
      // }
    })
    .catch((error) => {
      // alert(error.response.data.message);
      console.error('Error:', error);
    });
}
