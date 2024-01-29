// 지역 및 카테고리 선택
const submit = document.getElementById('submit');
submit.addEventListener('click', async (event) => {
  event.preventDefault();

  const areaCode = document.getElementById('areaCode').value;
  const cat1 = document.getElementById('cat1').value;
  console.log(areaCode, cat1);

  if (cat1 === 'O00') {
    await getPlaceListAll(areaCode);
  } else await getPlaceListByCategory(areaCode, cat1);
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

      showPlaceList(datas);
    })
    .catch((error) => {
      // alert(error.response.data.message);
      console.error('Error:', error);
    });
}

// place table에서 지역기준 + 카테고리 별 장소정보 가져오기
async function getPlaceListByCategory(areaCode, cat1) {
  await axios
    .get('api/place/region/content', {
      region: areaCode,
      content: cat1,
    })
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

// 더 많은 장소를 가져오기(Tour api 연결)
// 버튼 클릭 횟수만큼 다음페이지 장소정보 나오게
const clickCount = 1;
const connectApi = document.getElementById('connectApi');
connectApi.addEventListener('click', async (event) => {
  event.preventDefault();

  const areaCode = document.getElementById('areaCode').value;
  const cat1 = document.getElementById('cat1').value;
  console.log(areaCode, cat1);

  if (cat1 === 'O00') {
    await getPlacesFromApiWithoutCategory(areaCode, clickCount++);
  } else await getPlacesFromApi(areaCode, cat1, clickCount++);
});

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

// Tour api로부터 place 정보 받아오기
async function getPlacesFromApi(areaCode, cat1, clickCount) {
  const TOUR_API_KEY = getTourApiKey();
  const operation = `areaBasedList1`; // 지역기반관광정보조회
  const baseUrl = `https://apis.data.go.kr/B551011/KorService1/${operation}?serviceKey=${TOUR_API_KEY}`;
  await axios
    .get(baseUrl, {
      params: {
        numOfRows: 20, // 한페이지 결과 수
        pageNo: clickCount, // 페이지 번호
        MobileOS: 'ETC', // OS 구분
        MobileApp: 'AppTest', // 서비스 명
        _type: 'json', // response type
        areaCode: areaCode, // 지역코드
        cat1: cat1, // 대분류코드
        arrange: 'A', // 정렬구분: A(제목순), C(수정일순), D(생성일순), E(거리순)/ (대표이미지가 있는 것만) O(제목순), Q(수정일순), R(생성일순), S(거리순)
      },
    })
    .then((response) => {
      const data = response.data.response.body.items.item;
      console.log(data);

      showPlaceListFromApi(data);

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
async function getPlacesFromApiWithoutCategory(areaCode, clickCount) {
  const TOUR_API_KEY = getTourApiKey();
  const operation = `areaBasedList1`; // 지역기반관광정보조회
  const baseUrl = `https://apis.data.go.kr/B551011/KorService1/${operation}?serviceKey=${TOUR_API_KEY}`;
  await axios
    .get(baseUrl, {
      params: {
        numOfRows: 20, // 한페이지 결과 수
        pageNo: clickCount, // 페이지 번호
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

      showPlaceListFromApi(data);

      // for (let item of data) {
      //   console.log(item['code'], item['name']);
      // }
    })
    .catch((error) => {
      // alert(error.response.data.message);
      console.error('Error:', error);
    });
}

// place table에서 받아온 place 정보를 html에 띄우기
function showPlaceList(datas) {
  const placeList = document.getElementsByClassName('placeList');
  placeList.innerHTML = '';

  datas.map((data) => {
    const place = document.createElement('div');
    place.className = 'place';
    place.id = data.id;
    place.dataset.mapx = data.mapx;
    place.dataset.mapy = data.mapy;
    place = document.appendChild(placeList);

    const imgUrl = document.createElement('div');
    imgUrl.className = 'imgUrl';
    imgUrl = document.appendChild(place);

    const img = document.createElement('img');
    img.className - 'img';
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
    category.dataset.cat1 = data.cat1;
    category.innerText = data.category;
    category = document.appendChild(placeContent);
  });
}

// tour api에서 받아온 place 정보 html에 띄우기
function showPlaceListFromApi(datas) {
  const placeList = document.getElementsByClassName('placeList');

  datas.map((data) => {
    const place = document.createElement('div');
    place.className = 'place';
    place.dataset.mapx = data.mapx;
    place.dataset.mapy = data.mapy;
    place = document.appendChild(placeList);

    const imgUrl = document.createElement('div');
    imgUrl.className = 'imgUrl';
    imgUrl = document.appendChild(place);

    const img = document.createElement('img');
    img.className = 'img';
    data.imgUrl === null
      ? (img.src =
          'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo-available_87543-11093.jpg')
      : (img.src = data.firstimage2);
    img = document.appendChild(imgUrl);

    const placeContent = document.createElement('div');
    placeContent.className = 'placeContent';
    placeContent = document.appendChild(place);

    const name = document.createElement('p');
    name.className = 'name';
    name.innerText = data.title;
    name = document.appendChild(placeContent);

    const address = document.createElement('p');
    address.className = 'address';
    address.innerText = data.addr1;
    address = document.appendChild(placeContent);

    const category = document.createElement('p');
    category.className = 'category';
    category.dataset.cat1 = data.cat1;
    category.innerText = getCategory(data.cat2);
    category = document.appendChild(placeContent);
  });
}

// cat1에 따른 카테고리 분류
function getCategory(cat2) {
  const category = '';

  if (cat2 === 'A0101') category = '자연관광지';
  else if (cat2 === 'A0102') category = '관광자원';
  else if (cat2 === 'A0205') category = '건축/조형물';
  else if (cat2 === 'A0206') category = '문화시설';
  else if (cat2 === 'A0207') category = '축제';
  else if (cat2 === 'A0302') category = '육상 레포츠';
  else if (cat2 === 'A0303') category = '수상 레포츠';
  else if (cat2 === 'A0304') category = '항공 레포츠';
  else if (cat2 === 'A0305') category = '복합 레포츠';
  else if (cat2 === 'A0401') category = '쇼핑';
  else if (cat2 === 'A0502') category = '음식점';
  else if (cat2 === 'B0201') category = '숙박시설';
  else if (cat2 === 'C0112') category = '가족코스';
  else if (cat2 === 'C0113') category = '나홀로코스';
  else if (cat2 === 'C0114') category = '힐링코스';
  else if (cat2 === 'C0115') category = '도보코스';
  else if (cat2 === 'C0116') category = '캠핑코스';
  else if (cat2 === 'C0117') category = '맛코스';

  return category;
}

// 장소 선택하면 해당 장소를 schedule에 등록
// api place list 중 하나 선택 시 해당 place를 place table에 추가하고 schedule 생성
document.querySelectorAll('.place').forEach((element) => {
  element.addEventListener('click', async (event) => {
    const placeId = event.currentTarget.id;
    console.log(placeId);

    if (!placeId) {
      const mapx = event.currentTarget.dataset.mapx;
      const mapy = event.currentTarget.dataset.mapy;
      const name = event.currentTarget.getElementsByClassName('name')[0].innerText;
      const address = event.currentTarget.getElementsByClassName('address')[0].innerText;
      const category = event.currentTarget.getElementsByClassName('category')[0].innerText;
      const cat1 = event.currentTarget.getElementsByClassName('category')[0].dataset.cat1;
      const img = event.currentTarget.getElementsByClassName('img')[0].src;

      // console.log(mapx, mapy, name, address, category, cat1, img);
      placeId = createNewPlace(name, address, mapx, mapy, category, cat1, img);
    }

    // schedule 생성
    // [ ]: dayId 받아와야 함
    const dayId = 1;
    await axios
      .post('api/schedule', {
        placeId: id,
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
  });
});

// tour api에서 가져온 place 선택 시 place table에 등록
async function createNewPlace(name, address, mapx, mapy, category, cat1, img) {
  await axios
    .post('api/place', {
      name,
      address,
      mapX: mapx,
      mapY: mapy,
      category,
      cat1,
      imgUrl: img,
    })
    .then((response) => {
      const data = response.data.data;
      console.log(data);

      const placeId = data.id;

      return placeId;
    })
    .catch((error) => {
      // alert(error.response.data.message);
      console.error('Error:', error);
    });
}
