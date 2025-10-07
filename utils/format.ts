export const formatPrice = (price: number): string => {
  if (price >= 1000000000) {
    const billions = price / 1000000000;
    return `${billions % 1 === 0 ? billions : billions.toFixed(1)} tỷ`;
  }
  if (price >= 1000000) {
    const millions = price / 1000000;
    return `${millions % 1 === 0 ? millions : millions.toFixed(1)} triệu`;
  }
  return `${price.toLocaleString('vi-VN')} đ`;
};

export const formatArea = (area: number): string => {
  return `${area}m²`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Hôm nay';
  } else if (diffDays === 1) {
    return 'Hôm qua';
  } else if (diffDays < 7) {
    return `${diffDays} ngày trước`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} tuần trước`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} tháng trước`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} năm trước`;
  }
};

export const formatViews = (views: number): string => {
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  return views.toString();
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
};
