export function cat1Mapping(cat2: string) {
  const cat1Map = {
    A01: '자연',
    A02: '인문',
    A04: '쇼핑',
    A05: '음식',
    B02: '숙박',
  };
  const cat1 = cat1Map[cat2];
  return { cat1 };
}
export function cat3Mapping(cat3: string) {
  const ca3Map = {
    A01010100: '국립공원',
    A01010200: '도립공원',
    A01010300: '군립공원',
    A01010400: '산',
    A01010500: '자연생태관광지',
    A01010600: '자연휴양림',
    A01010700: '수목원',
    A01010800: '폭포',
    A01010900: '계곡',
    A01011000: '약수터',
    A01011100: '해안절경',
    A01011200: '해수욕장',
    A01011300: '섬',
    A01011400: '항구/포구',
    A01011600: '등대',
    A01011700: '호수',
    A01011800: '강',
    A01011900: '동굴',
    A01020100: '희귀동.식물',
    A01020200: '기암괴석',
    A02010100: '고궁',
    A02010200: '성',
    A02010300: '문',
    A02010400: '고택',
    A02010500: '생가',
    A02010600: '민속마을',
    A02010700: '유적지/사적지',
    A02010800: '사찰',
    A02010900: '종교성지',
    A02011000: '안보관광',
    A02020200: '관광단지',
    A02020300: '온천/욕장/스파',
    A02020400: '이색찜질방',
    A02020500: '헬스투어',
    A02020600: '테마공원',
    A02020700: '공원',
    A02020800: '유람선/잠수함관광',
    A02030100: '농.산.어촌체험',
    A02030200: '전통체험',
    A02030300: '산사체험',
    A02030400: '이색체험',
    A02030600: '이색거리',
    A02040400: '발전소',
    A02040600: '식음료',
    A02040800: '기타',
    A02040900: '전자-반도체',
    A02041000: '자동차',
    A02050100: '다리/대교',
    A02050200: '기념탑/기념비/전망대',
    A02050300: '분수',
    A02050400: '동상',
    A02050500: '터널',
    A02050600: '유명건물',
    A02060100: '박물관',
    A02060200: '기념관',
    A02060300: '전시관',
    A02060400: '컨벤션센터',
    A02060500: '미술관/회랑',
    A02060600: '공연장',
    A02060700: '문화원',
    A02060800: '외국문화원',
    A02060900: '도서관',
    A02061000: '대형서점',
    A02061100: '문화전수시설',
    A02061200: '영화관',
    A02061300: '어학당',
    A02061400: '학교',
    A02070100: '문화관광축제',
    A02070200: '일반축제',
    A04010100: '5일장',
    A04010200: '상설시장',
    A04010300: '백화점',
    A04010400: '면세점',
    A04010500: '대형마트',
    A04010600: '전문매장/상가',
    A04010700: '공예/공방',
    A04010900: '특산물판매점',
    A04011000: '사후면세점',
    A05020100: '한식',
    A05020200: '서양식',
    A05020300: '일식',
    A05020400: '중식',
    A05020700: '이색음식점',
    A05020900: '카페/전통찻집',
    A05021000: '기타음식점',
    B02010100: '관광호텔',
    B02010500: '콘도미니엄',
    B02010600: '유스호스텔',
    B02010700: '펜션',
    B02010900: '모텔',
    B02011000: '민박',
    B02011100: '게스트하우스',
    B02011200: '홈스테이',
    B02011300: '서비스드레지던스',
    B02011600: '한옥',
  };
  const category = ca3Map[cat3];
  return category;
}

export function cat2Mapping(cat2: string) {
  const cat2Map = {
    A0101: '자연관광지',
    A0102: '관광자원',
    A0201: '역사관광지',
    A0202: '휴양관광지',
    A0203: '체험관광지',
    A0204: '산업관광지',
    A0205: '건축/조형물',
    A0206: '문화시설',
    A0207: '축제',
    A0401: '쇼핑',
    A0502: '음식점',
    B0201: '숙박시설',
  };
  const category = cat2Map[cat2];
  return { category };
}
