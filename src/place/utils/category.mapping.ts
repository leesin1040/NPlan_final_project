export function categoryMapping(cat1: string) {
  const cat1Map = {
    자연: 'A01',
    '인문(문화/예술/역사)': 'A02',
    레포츠: 'A03',
    쇼핑: 'A04',
    음식: 'A05',
    숙박: 'B02',
  };

  return cat1Map[cat1];
}
