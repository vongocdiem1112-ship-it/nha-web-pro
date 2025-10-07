export interface NewsArticle {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
  thumbnail: string;
  date: string;
  views: number;
  author: string;
}

export const mockNews: NewsArticle[] = [
  {
    id: 'n1',
    title: 'Thị trường bất động sản Vũng Tàu tăng trưởng mạnh trong quý 1/2025',
    category: 'Thị trường',
    description: 'Giá bất động sản tại Vũng Tàu tăng trung bình 15% so với cùng kỳ năm trước, thu hút nhiều nhà đầu tư.',
    content: 'Theo báo cáo mới nhất từ các chuyên gia bất động sản, thị trường BĐS Vũng Tàu đang có sự tăng trưởng ấn tượng trong quý đầu năm 2025. Các dự án ven biển và khu đô thị mới đang được quan tâm đặc biệt...',
    thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
    date: '2025-01-15',
    views: 1234,
    author: 'Nguyễn Văn A',
  },
  {
    id: 'n2',
    title: 'Dự án The Sóng Vũng Tàu bàn giao đợt 1 cho cư dân',
    category: 'Dự án',
    description: 'Dự án căn hộ cao cấp The Sóng chính thức bàn giao 200 căn hộ đầu tiên cho khách hàng.',
    content: 'Sáng ngày 14/01, chủ đầu tư dự án The Sóng Vũng Tàu đã tổ chức lễ bàn giao căn hộ đợt 1 với sự tham gia của hơn 200 gia đình. Dự án được đánh giá cao về chất lượng xây dựng và tiện ích...',
    thumbnail: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
    date: '2025-01-14',
    views: 987,
    author: 'Trần Thị B',
  },
  {
    id: 'n3',
    title: 'Quy hoạch mới cho khu vực Hồ Tràm - Bình Châu',
    category: 'Quy hoạch',
    description: 'UBND tỉnh Bà Rịa - Vũng Tàu công bố quy hoạch chi tiết khu du lịch Hồ Tràm - Bình Châu.',
    content: 'Quy hoạch mới tập trung phát triển du lịch nghỉ dưỡng cao cấp, với nhiều dự án resort và biệt thự biển. Dự kiến sẽ thu hút hàng tỷ USD đầu tư trong 5 năm tới...',
    thumbnail: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
    date: '2025-01-13',
    views: 1456,
    author: 'Lê Văn C',
  },
  {
    id: 'n4',
    title: 'Lãi suất vay mua nhà giảm, cơ hội cho người mua',
    category: 'Tài chính',
    description: 'Các ngân hàng đồng loạt giảm lãi suất vay mua nhà xuống mức thấp nhất trong 2 năm qua.',
    content: 'Từ đầu năm 2025, lãi suất vay mua nhà đã giảm từ 0.5-1%/năm tùy ngân hàng. Đây là cơ hội tốt cho người có nhu cầu mua nhà để sở hữu bất động sản với chi phí vay thấp hơn...',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
    date: '2025-01-12',
    views: 2103,
    author: 'Phạm Thị D',
  },
  {
    id: 'n5',
    title: '5 điều cần biết khi mua căn hộ chung cư lần đầu',
    category: 'Tư vấn',
    description: 'Hướng dẫn chi tiết cho người mua nhà lần đầu để tránh rủi ro và chọn được căn hộ phù hợp.',
    content: 'Mua nhà là quyết định lớn trong đời. Bài viết này sẽ chia sẻ 5 điều quan trọng nhất mà người mua nhà lần đầu cần lưu ý: kiểm tra pháp lý, vị trí, tiện ích, chất lượng xây dựng và khả năng thanh toán...',
    thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
    date: '2025-01-11',
    views: 1789,
    author: 'Hoàng Văn E',
  },
  {
    id: 'n6',
    title: 'Xu hướng thiết kế nội thất năm 2025',
    category: 'Thiết kế',
    description: 'Phong cách tối giản, thân thiện môi trường đang là xu hướng được ưa chuộng nhất.',
    content: 'Năm 2025 chứng kiến sự trở lại của phong cách thiết kế tối giản kết hợp với vật liệu thân thiện môi trường. Màu sắc trung tính, không gian mở và ánh sáng tự nhiên là những yếu tố được ưu tiên...',
    thumbnail: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800',
    date: '2025-01-10',
    views: 1567,
    author: 'Nguyễn Thị F',
  },
  {
    id: 'n7',
    title: 'Khu công nghiệp Phú Mỹ mở rộng thêm 500ha',
    category: 'Dự án',
    description: 'Dự án mở rộng khu công nghiệp Phú Mỹ được phê duyệt, tạo động lực cho thị trường BĐS khu vực.',
    content: 'Việc mở rộng khu công nghiệp Phú Mỹ sẽ thu hút thêm nhiều doanh nghiệp đầu tư, tạo việc làm cho hàng chục nghìn lao động. Điều này cũng thúc đẩy nhu cầu nhà ở tại khu vực...',
    thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
    date: '2025-01-09',
    views: 1345,
    author: 'Trần Văn G',
  },
  {
    id: 'n8',
    title: 'Cách tính thuế khi mua bán bất động sản',
    category: 'Pháp lý',
    description: 'Hướng dẫn chi tiết về các loại thuế và phí phải nộp khi giao dịch bất động sản.',
    content: 'Khi mua bán BĐS, người mua và người bán cần nộp các loại thuế và phí khác nhau. Bài viết này sẽ giải thích rõ từng loại thuế, cách tính và thời điểm nộp để bạn có thể chuẩn bị tài chính hợp lý...',
    thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
    date: '2025-01-08',
    views: 2234,
    author: 'Lê Thị H',
  },
  {
    id: 'n9',
    title: 'Top 10 khu dân cư đáng sống nhất Vũng Tàu',
    category: 'Thị trường',
    description: 'Danh sách các khu dân cư có hạ tầng tốt, an ninh cao và tiện ích đầy đủ tại Vũng Tàu.',
    content: 'Dựa trên khảo sát từ cư dân và chuyên gia, chúng tôi đã tổng hợp top 10 khu dân cư đáng sống nhất tại Vũng Tàu. Các tiêu chí đánh giá bao gồm: an ninh, tiện ích, môi trường sống và cộng đồng dân cư...',
    thumbnail: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
    date: '2025-01-07',
    views: 1890,
    author: 'Phạm Văn I',
  },
  {
    id: 'n10',
    title: 'Dự báo thị trường BĐS 6 tháng cuối năm 2025',
    category: 'Thị trường',
    description: 'Chuyên gia dự báo thị trường sẽ tiếp tục tăng trưởng ổn định với nhiều cơ hội đầu tư.',
    content: 'Theo các chuyên gia, thị trường BĐS Vũng Tàu sẽ tiếp tục xu hướng tăng trưởng trong 6 tháng cuối năm. Các phân khúc căn hộ trung cấp và đất nền dự án được dự báo sẽ có thanh khoản tốt...',
    thumbnail: 'https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=800',
    date: '2025-01-06',
    views: 1678,
    author: 'Hoàng Thị K',
  },
];
