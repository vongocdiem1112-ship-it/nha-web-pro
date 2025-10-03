import { PropertyCard } from "./PropertyCard";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const properties = [
  {
    id: 1,
    image: property1,
    title: "Căn hộ cao cấp Vinhomes Central Park",
    price: "5.2 tỷ",
    location: "Quận Bình Thạnh, TP.HCM",
    beds: 2,
    baths: 2,
    area: 76,
    type: "Căn hộ",
  },
  {
    id: 2,
    image: property2,
    title: "Nhà phố hiện đại khu Thảo Điền",
    price: "12.5 tỷ",
    location: "Quận 2, TP.HCM",
    beds: 4,
    baths: 3,
    area: 120,
    type: "Nhà riêng",
  },
  {
    id: 3,
    image: property3,
    title: "Biệt thự nghỉ dưỡng Đà Lạt",
    price: "8.9 tỷ",
    location: "Đà Lạt, Lâm Đồng",
    beds: 5,
    baths: 4,
    area: 250,
    type: "Biệt thự",
  },
  {
    id: 4,
    image: property1,
    title: "Căn hộ The Sun Avenue 2PN view sông",
    price: "3.8 tỷ",
    location: "Quận 2, TP.HCM",
    beds: 2,
    baths: 2,
    area: 68,
    type: "Căn hộ",
  },
  {
    id: 5,
    image: property2,
    title: "Nhà mặt tiền đường Nguyễn Văn Linh",
    price: "15.2 tỷ",
    location: "Quận 7, TP.HCM",
    beds: 4,
    baths: 4,
    area: 150,
    type: "Nhà riêng",
  },
  {
    id: 6,
    image: property3,
    title: "Villa view biển Vũng Tàu",
    price: "9.5 tỷ",
    location: "Vũng Tàu, Bà Rịa",
    beds: 5,
    baths: 5,
    area: 280,
    type: "Biệt thự",
  },
];

export const PropertyGrid = () => {
  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Bất động sản nổi bật
          </h2>
          <p className="text-muted-foreground text-lg">
            Khám phá các tin đăng mới nhất
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
      </div>
    </section>
  );
};
