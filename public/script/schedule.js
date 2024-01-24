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

// 장소 선택
document.querySelectorAll('.place').forEach((element) => {
  element.addEventListener('click', async (event) => {
    const id = event.currentTarget.id;
    console.log(id);

    // alert(`movie id: ${id}`);
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
async function getPlaceInfo() {}
