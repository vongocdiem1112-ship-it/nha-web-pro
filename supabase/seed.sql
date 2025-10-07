-- VungTauLand Sample Data
-- Run this to populate database with test data

-- Insert sample users
INSERT INTO users (id, email, phone, full_name, avatar_url, role, broker_status, social_links) VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin@vungtauland.com', '0901234567', 'Admin VungTauLand', 'https://i.pravatar.cc/150?img=1', 'admin', NULL, '{}'),
  ('22222222-2222-2222-2222-222222222222', 'broker1@gmail.com', '0912345678', 'Nguyễn Văn A', 'https://i.pravatar.cc/150?img=11', 'broker', 'approved', '{"zalo": "0912345678", "facebook": "nguyenvana"}'),
  ('33333333-3333-3333-3333-333333333333', 'broker2@gmail.com', '0923456789', 'Trần Thị B', 'https://i.pravatar.cc/150?img=5', 'broker', 'approved', '{"zalo": "0923456789"}'),
  ('44444444-4444-4444-4444-444444444444', 'broker3@gmail.com', '0934567890', 'Lê Văn C', 'https://i.pravatar.cc/150?img=12', 'broker', 'approved', '{"zalo": "0934567890", "facebook": "levanc"}'),
  ('55555555-5555-5555-5555-555555555555', 'user1@gmail.com', '0945678901', 'Phạm Thị D', 'https://i.pravatar.cc/150?img=9', 'user', NULL, '{}'),
  ('66666666-6666-6666-6666-666666666666', 'broker4@gmail.com', '0956789012', 'Hoàng Văn E', 'https://i.pravatar.cc/150?img=13', 'broker', 'pending', '{}');

-- Insert sample listings
INSERT INTO listings (user_id, type, title, description, price, area, bedrooms, bathrooms, direction, address, district, latitude, longitude, images, is_hot, status) VALUES
  ('22222222-2222-2222-2222-222222222222', 'nha', 'Nhà phố 3 tầng mặt tiền đường Trần Phú', 'Nhà đẹp, vị trí đắc địa, gần biển, đầy đủ tiện nghi. Phù hợp kinh doanh hoặc ở.', 8500000000, 120, 4, 3, 'Đông', '123 Trần Phú', 'Thành phố Vũng Tàu', 10.3459, 107.0843, ARRAY['https://images.unsplash.com/photo-1568605114967-8130f3a36994', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c'], true, 'active'),
  
  ('22222222-2222-2222-2222-222222222222', 'dat', 'Đất nền khu dân cư Phước Hải', 'Đất nền đẹp, sổ hồng riêng, hạ tầng hoàn thiện, giá đầu tư tốt.', 2500000000, 150, NULL, NULL, 'Nam', 'Khu dân cư Phước Hải, Đất Đỏ', 'Huyện Đất Đỏ', 10.4123, 107.1234, ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef', 'https://images.unsplash.com/photo-1464146072230-91cabc968266'], false, 'active'),
  
  ('33333333-3333-3333-3333-333333333333', 'chung_cu', 'Căn hộ Sơn Thiên 2 view biển tầng cao', 'Căn hộ 2PN, view biển tuyệt đẹp, nội thất cao cấp, bàn giao ngay.', 3200000000, 75, 2, 2, 'Đông Nam', 'Sơn Thiên 2, Thùy Vân', 'Thành phố Vũng Tàu', 10.3567, 107.0912, ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2'], true, 'active'),
  
  ('33333333-3333-3333-3333-333333333333', 'cho_thue', 'Cho thuê nhà nguyên căn gần chợ Vũng Tàu', 'Nhà 2 tầng, 3 phòng ngủ, đầy đủ nội thất, gần chợ, trường học.', 15000000, 80, 3, 2, 'Bắc', '45 Nguyễn Thái Học', 'Thành phố Vũng Tàu', 10.3512, 107.0834, ARRAY['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3'], false, 'active'),
  
  ('44444444-4444-4444-4444-444444444444', 'nha', 'Biệt thự biển Bãi Dài view 360 độ', 'Biệt thự sang trọng, thiết kế hiện đại, view biển tuyệt đẹp, hồ bơi riêng.', 25000000000, 350, 5, 4, 'Đông Nam', 'Khu biệt thự Bãi Dài', 'Thành phố Vũng Tàu', 10.3789, 107.1123, ARRAY['https://images.unsplash.com/photo-1613490493576-7fde63acd811', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea'], true, 'active'),
  
  ('44444444-4444-4444-4444-444444444444', 'dat', 'Đất thổ cư Long Điền giá rẻ', 'Đất thổ cư 100%, đường xe hơi, điện nước đầy đủ, giá đầu tư.', 1800000000, 200, NULL, NULL, 'Tây', 'Xã Phước Hưng, Long Điền', 'Huyện Long Điền', 10.4567, 107.2345, ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef'], false, 'active'),
  
  ('22222222-2222-2222-2222-222222222222', 'chung_cu', 'Chung cư The Sóng giá tốt', 'Căn hộ 3PN, view thành phố, giá tốt nhất thị trường, sổ hồng lâu dài.', 4500000000, 95, 3, 2, 'Tây Nam', 'The Sóng, Thùy Vân', 'Thành phố Vũng Tàu', 10.3601, 107.0889, ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750'], false, 'active'),
  
  ('33333333-3333-3333-3333-333333333333', 'cho_thue', 'Cho thuê mặt bằng kinh doanh Trần Hưng Đạo', 'Mặt bằng rộng 100m2, vị trí đẹp, phù hợp kinh doanh cafe, nhà hàng.', 30000000, 100, NULL, NULL, 'Đông', '234 Trần Hưng Đạo', 'Thành phố Vũng Tàu', 10.3478, 107.0856, ARRAY['https://images.unsplash.com/photo-1497366216548-37526070297c'], false, 'active'),
  
  ('44444444-4444-4444-4444-444444444444', 'nha', 'Nhà vườn Xuyên Mộc yên tĩnh', 'Nhà vườn rộng 500m2, không gian xanh mát, phù hợp nghỉ dưỡng cuối tuần.', 5500000000, 500, 3, 2, 'Nam', 'Xã Bình Châu, Xuyên Mộc', 'Huyện Xuyên Mộc', 10.5234, 107.4567, ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9'], false, 'active'),
  
  ('22222222-2222-2222-2222-222222222222', 'dat', 'Đất mặt tiền Quốc lộ 51', 'Đất vị trí đẹp, mặt tiền QL51, phù hợp kinh doanh, đầu tư.', 12000000000, 300, NULL, NULL, 'Bắc', 'Quốc lộ 51, Châu Đức', 'Huyện Châu Đức', 10.6789, 107.3456, ARRAY['https://images.unsplash.com/photo-1464146072230-91cabc968266'], true, 'active');

-- Insert sample news
INSERT INTO news (title, description, content, image_url, category, views_count) VALUES
  ('Thị trường BĐS Vũng Tàu quý 1/2025: Tăng trưởng ấn tượng', 'Thị trường bất động sản Vũng Tàu ghi nhận mức tăng trưởng mạnh trong quý đầu năm 2025.', 'Theo báo cáo từ các sàn giao dịch BĐS tại Vũng Tàu, quý 1/2025 chứng kiến sự tăng trưởng ấn tượng về cả giá và lượng giao dịch. Đặc biệt, phân khúc căn hộ cao cấp view biển và đất nền khu vực ven biển được quan tâm nhiều nhất...', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa', 'thi_truong', 1250),
  
  ('Phân tích xu hướng đầu tư BĐS nghỉ dưỡng 2025', 'Bất động sản nghỉ dưỡng đang trở thành kênh đầu tư hấp dẫn với nhà đầu tư.', 'Trong bối cảnh du lịch phục hồi mạnh mẽ, BĐS nghỉ dưỡng tại các thành phố biển như Vũng Tàu đang thu hút sự quan tâm lớn. Các chuyên gia dự báo mức tăng trưởng 15-20% trong năm 2025...', 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf', 'phan_tich', 890),
  
  ('Dự án The Ocean Villas chính thức mở bán', 'Dự án biệt thự biển cao cấp The Ocean Villas tại Bãi Sau chính thức ra mắt thị trường.', 'Chủ đầu tư ABC Group vừa công bố mở bán dự án The Ocean Villas với 50 căn biệt thự biển cao cấp. Dự án có vị trí đắc địa tại Bãi Sau, thiết kế hiện đại, đầy đủ tiện ích 5 sao...', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde', 'du_an', 2100),
  
  ('Giá đất Vũng Tàu tăng 10% so với cùng kỳ', 'Giá đất tại các khu vực trung tâm Vũng Tàu ghi nhận mức tăng 10% so với cùng kỳ năm ngoái.', 'Theo khảo sát từ các sàn giao dịch, giá đất tại khu vực trung tâm TP Vũng Tàu đã tăng trung bình 10% so với cùng kỳ. Nguyên nhân chủ yếu do nguồn cung hạn chế và nhu cầu tăng cao...', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa', 'thi_truong', 1560),
  
  ('Hạ tầng giao thông mới thúc đẩy BĐS Bà Rịa - Vũng Tàu', 'Các dự án hạ tầng giao thông mới đang tạo động lực phát triển cho thị trường BĐS.', 'Việc hoàn thành cao tốc Biên Hòa - Vũng Tàu và các tuyến đường ven biển mới đã rút ngắn thời gian di chuyển, tạo động lực mạnh mẽ cho thị trường BĐS khu vực...', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000', 'phan_tich', 1780);

-- Insert sample favorites (user1 saves some listings)
INSERT INTO favorites (user_id, listing_id) VALUES
  ('55555555-5555-5555-5555-555555555555', (SELECT id FROM listings WHERE title LIKE '%Nhà phố 3 tầng%' LIMIT 1)),
  ('55555555-5555-5555-5555-555555555555', (SELECT id FROM listings WHERE title LIKE '%Căn hộ Sơn Thiên%' LIMIT 1)),
  ('55555555-5555-5555-5555-555555555555', (SELECT id FROM listings WHERE title LIKE '%Biệt thự biển%' LIMIT 1));

-- Insert sample view history
INSERT INTO view_history (user_id, listing_id) VALUES
  ('55555555-5555-5555-5555-555555555555', (SELECT id FROM listings WHERE title LIKE '%Nhà phố 3 tầng%' LIMIT 1)),
  ('55555555-5555-5555-5555-555555555555', (SELECT id FROM listings WHERE title LIKE '%Đất nền khu dân cư%' LIMIT 1)),
  ('55555555-5555-5555-5555-555555555555', (SELECT id FROM listings WHERE title LIKE '%Căn hộ Sơn Thiên%' LIMIT 1));

-- Update some listing views
UPDATE listings SET views_count = 145 WHERE title LIKE '%Nhà phố 3 tầng%';
UPDATE listings SET views_count = 89 WHERE title LIKE '%Căn hộ Sơn Thiên%';
UPDATE listings SET views_count = 234 WHERE title LIKE '%Biệt thự biển%';
UPDATE listings SET views_count = 67 WHERE title LIKE '%Đất nền khu dân cư%';
UPDATE listings SET views_count = 112 WHERE title LIKE '%Cho thuê nhà nguyên căn%';
