import { protectedProcedure } from '../../../create-context';
import { z } from 'zod';
import { LISTING_TEMPLATES, DISTRICTS, DIRECTIONS } from '../../../../../constants/listingTemplates';

function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPrice(min: number, max: number): number {
  const price = randomInRange(min, max);
  return Math.round(price / 100000000) * 100000000;
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

const STREET_NAMES = [
  'Trần Phú', 'Lê Lợi', 'Nguyễn Trãi', 'Hoàng Hoa Thám',
  'Phan Chu Trinh', 'Võ Thị Sáu', 'Trường Chinh', 'Hai Bà Trưng',
  'Lý Thường Kiệt', 'Quang Trung', 'Thùy Vân', 'Thi Sách',
  'Nguyễn Văn Trỗi', 'Lê Hồng Phong', 'Trần Hưng Đạo'
];

const WARD_NAMES = [
  'Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5',
  'Phường Thắng Tam', 'Phường Thắng Nhì', 'Phường Thắng Nhất',
  'Phường Nguyễn An Ninh', 'Phường Rạch Dừa'
];

export const getTemplateSuggestionsProcedure = protectedProcedure
  .input(
    z.object({
      type: z.enum(['nha', 'dat', 'chung_cu', 'cho_thue']),
    })
  )
  .mutation(async ({ input }) => {
    const { type } = input;

    const matchingTemplates = LISTING_TEMPLATES.filter(t => t.type === type);
    const template = getRandomElement(matchingTemplates);

    const district = getRandomElement(DISTRICTS);
    const street = getRandomElement(STREET_NAMES);
    const ward = getRandomElement(WARD_NAMES);
    const houseNumber = randomInRange(1, 999);
    const direction = getRandomElement(DIRECTIONS);

    const price = template.fields.priceRange
      ? randomPrice(template.fields.priceRange.min, template.fields.priceRange.max)
      : 0;

    const area = template.fields.areaRange
      ? randomInRange(template.fields.areaRange.min, template.fields.areaRange.max)
      : 0;

    const bedrooms = template.fields.bedrooms || randomInRange(2, 4);
    const bathrooms = template.fields.bathrooms || randomInRange(2, 3);

    let title = template.fields.title
      .replace('[Tên đường]', street)
      .replace('[Quận]', district)
      .replace('[Tên dự án]', `Dự án ${street}`);

    if (title.includes('[X]')) {
      title = title.replace(/\[X\]/g, area.toString());
    }

    if (title.includes('[Khu/Dự án]')) {
      title = title.replace('[Khu/Dự án]', `Khu ${street}`);
    }

    let description = template.fields.description
      .replace(/\[Số nhà\]/g, houseNumber.toString())
      .replace(/\[Tên đường\]/g, street)
      .replace(/\[Đường\]/g, street)
      .replace(/\[Phường\]/g, ward)
      .replace(/\[Quận\]/g, district)
      .replace(/\[Hướng nhà\]/g, direction)
      .replace(/\[Hướng\]/g, direction)
      .replace(/\[Hướng view\]/g, direction)
      .replace(/\[Tên dự án\]/g, `Dự án ${street}`)
      .replace(/\[Tên dự án\/khu\]/g, `Khu ${street}`)
      .replace(/\[Khu\/Dự án\]/g, `Khu ${street}`);

    const streetWidth = randomInRange(4, 12);
    const floors = randomInRange(2, 4);
    const width = Math.floor(area / randomInRange(15, 25));
    const length = Math.floor(area / width);

    description = description
      .replace(/\[X\]m²/g, `${area}m²`)
      .replace(/ngang \[X\]m/g, `ngang ${width}m`)
      .replace(/dài \[X\]m/g, `dài ${length}m`)
      .replace(/đường rộng \[X\]m/g, `đường rộng ${streetWidth}m`)
      .replace(/Tầng: \[X\]/g, `Tầng: ${randomInRange(5, 25)}`)
      .replace(/\[X\] tầng/g, `${floors} tầng`)
      .replace(/Phòng ngủ: \[X\]/g, `Phòng ngủ: ${bedrooms}`)
      .replace(/Phòng tắm: \[X\]/g, `Phòng tắm: ${bathrooms}`);

    if (type === 'cho_thue') {
      const priceInMillions = Math.floor(price / 1000000);
      description = description
        .replace(/\[X\] triệu\/tháng/g, `${priceInMillions} triệu/tháng`)
        .replace(/Đặt cọc: \[X\] tháng/g, `Đặt cọc: ${randomInRange(1, 3)} tháng`);
    } else {
      const priceInBillions = (price / 1000000000).toFixed(1);
      const pricePerSqm = Math.floor(price / area / 1000000);
      description = description
        .replace(/\[X\] tỷ/g, `${priceInBillions} tỷ`)
        .replace(/\(\[X\] triệu\/m²\)/g, `(${pricePerSqm} triệu/m²)`);
    }

    description = description.replace(/\[SĐT\]/g, 'Xem thông tin liên hệ');
    description = description.replace(/\[Đầy đủ\/Cơ bản\/Không nội thất\]/g, getRandomElement(['Đầy đủ', 'Cơ bản', 'Không nội thất']));

    return {
      title,
      description,
      price: price.toString(),
      area: area.toString(),
      bedrooms: type === 'dat' ? '' : bedrooms.toString(),
      bathrooms: type === 'dat' ? '' : bathrooms.toString(),
      direction,
      address: `${houseNumber} ${street}, ${ward}`,
      district,
    };
  });
