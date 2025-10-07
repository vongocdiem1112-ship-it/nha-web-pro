export interface ListingTemplate {
  id: string;
  name: string;
  icon: string;
  type: 'nha' | 'dat' | 'chung_cu' | 'cho_thue';
  fields: {
    title: string;
    description: string;
    bedrooms?: number;
    bathrooms?: number;
    direction?: string;
    priceRange?: { min: number; max: number };
    areaRange?: { min: number; max: number };
  };
}

export const LISTING_TEMPLATES: ListingTemplate[] = [
  {
    id: 'nha-pho-3-tang',
    name: 'Nhà phố 3 tầng',
    icon: '🏠',
    type: 'nha',
    fields: {
      title: 'Nhà phố 3 tầng mặt tiền đường [Tên đường], [Quận]',
      description: `🏠 NHÀ PHỐ 3 TẦNG - MẶT TIỀN ĐƯỜNG

📍 VỊ TRÍ:
- Địa chỉ: [Số nhà], [Tên đường], [Phường], [Quận]
- Mặt tiền đường rộng [X]m
- Gần trường học, chợ, bệnh viện

📐 THÔNG TIN:
- Diện tích: [X]m² (ngang [X]m x dài [X]m)
- Kết cấu: 3 tầng kiên cố
- Phòng ngủ: [X] phòng
- Phòng tắm: [X] phòng
- Hướng: [Hướng nhà]

✨ ĐẶC ĐIỂM:
- Thiết kế hiện đại, thoáng mát
- Nội thất cao cấp
- Sổ hồng riêng, pháp lý rõ ràng
- Đường vào xe hơi thoải mái

💰 GIÁ: [X] tỷ (Thương lượng)

📞 Liên hệ: [SĐT] để xem nhà`,
      bedrooms: 3,
      bathrooms: 3,
      direction: 'Đông',
      priceRange: { min: 3000000000, max: 8000000000 },
      areaRange: { min: 80, max: 150 },
    },
  },
  {
    id: 'chung-cu-2pn',
    name: 'Chung cư 2PN',
    icon: '🏢',
    type: 'chung_cu',
    fields: {
      title: 'Chung cư 2PN view đẹp tại [Tên dự án], [Quận]',
      description: `🏢 CHUNG CƯ 2 PHÒNG NGỦ - VIEW ĐẸP

📍 DỰ ÁN: [Tên dự án]
- Địa chỉ: [Đường], [Phường], [Quận]
- Tầng: [X]
- View: [Hướng view]

📐 THÔNG TIN:
- Diện tích: [X]m²
- Phòng ngủ: 2 phòng
- Phòng tắm: 2 phòng
- Ban công: Rộng rãi
- Hướng: [Hướng]

✨ TIỆN ÍCH:
- Hồ bơi, gym, sân chơi trẻ em
- An ninh 24/7
- Thang máy hiện đại
- Chỗ đỗ xe riêng
- Gần siêu thị, trường học

🛋️ NỘI THẤT:
- [Đầy đủ/Cơ bản/Không nội thất]
- Máy lạnh, bếp, tủ lạnh
- Giường, tủ quần áo

💰 GIÁ: [X] tỷ (Bao phí)

📞 Liên hệ: [SĐT] để xem nhà`,
      bedrooms: 2,
      bathrooms: 2,
      direction: 'Đông Nam',
      priceRange: { min: 1500000000, max: 4000000000 },
      areaRange: { min: 60, max: 90 },
    },
  },
  {
    id: 'dat-nen',
    name: 'Đất nền',
    icon: '🏗️',
    type: 'dat',
    fields: {
      title: 'Đất nền [X]m² mặt tiền đường [Tên đường], [Quận]',
      description: `🏗️ ĐẤT NỀN - MẶT TIỀN ĐƯỜNG

📍 VỊ TRÍ:
- Địa chỉ: [Đường], [Phường], [Quận]
- Mặt tiền đường rộng [X]m
- Gần khu dân cư đông đúc

📐 THÔNG TIN:
- Diện tích: [X]m² (ngang [X]m x dài [X]m)
- Hướng: [Hướng]
- Địa hình: Bằng phẳng, đất thổ cư 100%

✨ ĐẶC ĐIỂM:
- Sổ hồng riêng, pháp lý rõ ràng
- Đường trước nhà rộng [X]m
- Điện nước đầy đủ
- Vị trí đẹp, tiềm năng sinh lời cao

🎯 PHÂN KHÚC:
- Thích hợp xây nhà ở
- Đầu tư sinh lời
- Kinh doanh buôn bán

💰 GIÁ: [X] tỷ ([X] triệu/m²)

📞 Liên hệ: [SĐT] để xem đất`,
      priceRange: { min: 2000000000, max: 10000000000 },
      areaRange: { min: 100, max: 500 },
    },
  },
  {
    id: 'nha-cho-thue',
    name: 'Nhà cho thuê',
    icon: '🏘️',
    type: 'cho_thue',
    fields: {
      title: 'Cho thuê nhà nguyên căn [X]PN tại [Quận]',
      description: `🏘️ CHO THUÊ NHÀ NGUYÊN CĂN

📍 VỊ TRÍ:
- Địa chỉ: [Số nhà], [Đường], [Phường], [Quận]
- Gần trường học, chợ, siêu thị
- Khu dân cư an ninh

📐 THÔNG TIN:
- Diện tích: [X]m²
- Phòng ngủ: [X] phòng
- Phòng tắm: [X] phòng
- Phòng khách, bếp riêng
- Sân phơi, chỗ để xe

🛋️ NỘI THẤT:
- Đầy đủ nội thất cơ bản
- Máy lạnh, nóng lạnh
- Bếp gas, tủ lạnh
- Giường, tủ quần áo

✨ TIỆN ÍCH:
- Điện nước riêng
- Internet cáp quang
- An ninh 24/7
- Khu vực yên tĩnh

💰 GIÁ THUÊ: [X] triệu/tháng
- Đặt cọc: [X] tháng
- Thanh toán: Hàng tháng

📞 Liên hệ: [SĐT] để xem nhà`,
      bedrooms: 3,
      bathrooms: 2,
      priceRange: { min: 5000000, max: 20000000 },
      areaRange: { min: 60, max: 120 },
    },
  },
  {
    id: 'biet-thu',
    name: 'Biệt thự',
    icon: '🏰',
    type: 'nha',
    fields: {
      title: 'Biệt thự cao cấp [X]m² tại [Khu/Dự án], [Quận]',
      description: `🏰 BIỆT THỰ CAO CẤP

📍 VỊ TRÍ:
- Dự án: [Tên dự án/khu]
- Địa chỉ: [Đường], [Phường], [Quận]
- Khu compound an ninh 24/7

📐 THÔNG TIN:
- Diện tích đất: [X]m²
- Diện tích xây dựng: [X]m²
- Kết cấu: [X] tầng + tum
- Phòng ngủ: [X] phòng (có phòng master)
- Phòng tắm: [X] phòng
- Hướng: [Hướng]

✨ ĐẶC ĐIỂM:
- Thiết kế sang trọng, hiện đại
- Sân vườn rộng rãi
- Hồ bơi riêng
- Gara ô tô
- Sổ hồng riêng

🏊 TIỆN ÍCH KHU:
- Hồ bơi chung
- Sân tennis, gym
- Công viên cây xanh
- Trường học quốc tế
- Siêu thị, nhà hàng

💰 GIÁ: [X] tỷ (Có thương lượng)

📞 Liên hệ: [SĐT] để xem nhà`,
      bedrooms: 4,
      bathrooms: 4,
      direction: 'Nam',
      priceRange: { min: 10000000000, max: 50000000000 },
      areaRange: { min: 200, max: 500 },
    },
  },
  {
    id: 'can-ho-studio',
    name: 'Căn hộ Studio',
    icon: '🏠',
    type: 'chung_cu',
    fields: {
      title: 'Căn hộ Studio đầy đủ nội thất tại [Dự án]',
      description: `🏠 CĂN HỘ STUDIO - FULL NỘI THẤT

📍 DỰ ÁN: [Tên dự án]
- Địa chỉ: [Đường], [Quận]
- Tầng: [X]
- View: [Hướng view]

📐 THÔNG TIN:
- Diện tích: [X]m²
- Phòng ngủ: Studio (không gian mở)
- Phòng tắm: 1 phòng
- Ban công: Có
- Hướng: [Hướng]

🛋️ NỘI THẤT:
- Đầy đủ nội thất cao cấp
- Giường, tủ quần áo
- Bàn làm việc
- Máy lạnh, TV
- Bếp, tủ lạnh, máy giặt

✨ TIỆN ÍCH:
- Hồ bơi, gym
- An ninh 24/7
- Thang máy
- Chỗ đỗ xe

🎯 PHÂN KHÚC:
- Thích hợp cho người độc thân
- Cặp đôi trẻ
- Đầu tư cho thuê

💰 GIÁ: [X] tỷ

📞 Liên hệ: [SĐT]`,
      bedrooms: 1,
      bathrooms: 1,
      priceRange: { min: 800000000, max: 2000000000 },
      areaRange: { min: 25, max: 45 },
    },
  },
];

export const DISTRICTS = [
  'Thành phố Vũng Tàu',
  'Thành phố Bà Rịa',
  'Huyện Châu Đức',
  'Huyện Xuyên Mộc',
  'Huyện Long Điền',
  'Huyện Đất Đỏ',
  'Huyện Tân Thành',
  'Huyện Côn Đảo',
];

export const DIRECTIONS = [
  'Đông',
  'Tây',
  'Nam',
  'Bắc',
  'Đông Bắc',
  'Đông Nam',
  'Tây Bắc',
  'Tây Nam',
];

export const PROPERTY_TYPES = [
  { value: 'nha', label: 'Nhà' },
  { value: 'dat', label: 'Đất' },
  { value: 'chung_cu', label: 'Chung cư' },
  { value: 'cho_thue', label: 'Cho thuê' },
];
