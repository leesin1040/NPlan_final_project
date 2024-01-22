// areaCode1	지역코드조회
// categoryCode1	서비스분류코드조회
// areaBasedList1	지역기반관광정보조회
// locationBasedList1	위치기반관광정보조회*(현재)
// searchKeyword1	키워드검색조회
// searchFestival1	행사정보조회
// searchStay1	숙박정보조회
// detailCommon1	공통정보조회 (상세정보1)
// detailIntro1	소개정보조회 (상세정보2)
// detailInfo1	반복정보조회 (상세정보3)
// detailImage1	이미지정보조회 (상세정보4)
// detailPetTour1 반려동물여행정보조회

const { default: axios } = require('axios');
require('dotenv').config();
// areaBasedSyncList1	국문관광정보 동기화목록조회
const operation = `areaBasedList1`;
const base_url = `https://apis.data.go.kr/B551011/KorService1/${operation}?serviceKey=${process.env.TOUR_API_KEY}`;

function getPlace() {
  axios
    .get(base_url, {
      params: {
        numOfRows: 20, // 한페이지 결과 수
        pageNo: 1, // 페이지 번호
        MobileOS: 'ETC', // OS 구분
        MobileApp: 'AppTest', // 서비스 명
        _type: 'json', // response type,
        // contentId: 2685420,
        areaCode: 2, // 지역코드
        sigunguCode: 7,
        cat1: 'A05', // 대분류코드
        // cat2: 'C0117', // 중분류코드
        arrange: 'O', // 정렬구분: A(제목순), C(수정일순), D(생성일순), E(거리순)/ (대표이미지가 있는 것만) O(제목순), Q(수정일순), R(생성일순), S(거리순)
        // contentTypeId: 39, // 카테고리: 12(관광지), 14(문화시설), 15(축제공연행사), 25(여행코스), 28(레포츠), 32(숙박), 38(쇼핑), 39(음식점)
        // mapX: 126.983745, // x좌표
        // mapY: 37.563446, // y좌표
        // radius: 100, // 거리반경(m)
        // listYN: 'Y', // 목록표시: Y, N(개수만)
      },
    })
    .then((response) => {
      const data = response.data.response['body']['items']['item'];
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
getPlace();
