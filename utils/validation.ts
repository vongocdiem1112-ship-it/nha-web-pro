import { z } from 'zod';

export const sanitizeString = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ');
};

export const sanitizeNumber = (input: string | number): number => {
  const num = typeof input === 'string' ? parseFloat(input.replace(/[^\d.-]/g, '')) : input;
  return isNaN(num) ? 0 : num;
};

export const sanitizePhone = (phone: string): string => {
  return phone.replace(/[^\d+]/g, '');
};

export const sanitizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

export const validators = {
  email: z.string().email('Email không hợp lệ').min(1, 'Email là bắt buộc'),
  
  phone: z.string()
    .min(10, 'Số điện thoại phải có ít nhất 10 số')
    .max(11, 'Số điện thoại không được quá 11 số')
    .regex(/^[0-9+]+$/, 'Số điện thoại không hợp lệ'),
  
  password: z.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(100, 'Mật khẩu không được quá 100 ký tự'),
  
  name: z.string()
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(100, 'Tên không được quá 100 ký tự'),
  
  title: z.string()
    .min(10, 'Tiêu đề phải có ít nhất 10 ký tự')
    .max(200, 'Tiêu đề không được quá 200 ký tự'),
  
  description: z.string()
    .min(20, 'Mô tả phải có ít nhất 20 ký tự')
    .max(5000, 'Mô tả không được quá 5000 ký tự'),
  
  price: z.number()
    .positive('Giá phải lớn hơn 0')
    .max(1000000000000, 'Giá không hợp lệ'),
  
  area: z.number()
    .positive('Diện tích phải lớn hơn 0')
    .max(100000, 'Diện tích không hợp lệ'),
  
  address: z.string()
    .min(10, 'Địa chỉ phải có ít nhất 10 ký tự')
    .max(500, 'Địa chỉ không được quá 500 ký tự'),
  
  url: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
};

export const schemas = {
  login: z.object({
    email: validators.email,
    password: validators.password,
  }),
  
  register: z.object({
    fullName: validators.name,
    email: validators.email,
    phone: validators.phone,
    password: validators.password,
    role: z.enum(['user', 'broker']),
  }),
  
  createListing: z.object({
    type: z.enum(['nha', 'dat', 'chung_cu', 'cho_thue']),
    title: validators.title,
    description: validators.description,
    price: validators.price,
    area: validators.area,
    bedrooms: z.number().int().min(0).max(50).optional(),
    bathrooms: z.number().int().min(0).max(50).optional(),
    direction: z.string().optional(),
    address: validators.address,
    district: z.string().min(1, 'Quận/Huyện là bắt buộc'),
    images: z.array(z.string().url()).min(1, 'Phải có ít nhất 1 ảnh').max(10, 'Tối đa 10 ảnh'),
  }),
  
  updateProfile: z.object({
    fullName: validators.name,
    phone: validators.phone,
    avatarUrl: validators.url,
    socialLinks: z.object({
      zalo: z.string().optional(),
      facebook: validators.url,
    }).optional(),
  }),
  
  sendMessage: z.object({
    content: z.string().min(1, 'Tin nhắn không được để trống').max(1000, 'Tin nhắn không được quá 1000 ký tự'),
    imageUrl: validators.url,
  }),
};

export const validateAndSanitize = <T extends z.ZodType>(
  schema: T,
  data: unknown
): z.infer<T> => {
  return schema.parse(data);
};

export const safeValidate = <T extends z.ZodType>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; errors: string[] } => {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors = result.error.issues.map((err: z.ZodIssue) => err.message);
  return { success: false, errors };
};
