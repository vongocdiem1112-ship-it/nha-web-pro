import { publicProcedure } from '../../../create-context';
import { z } from 'zod';

export const getAllNewsProcedure = publicProcedure
  .input(
    z.object({
      category: z.enum(['thi_truong', 'phan_tich', 'du_an']).optional(),
      limit: z.number().min(1).max(50).default(20),
      offset: z.number().min(0).default(0),
    }).optional()
  )
  .query(async ({ ctx, input }) => {
    const { category, limit = 20, offset = 0 } = input || {};

    let query = ctx.supabase
      .from('news')
      .select('*')
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching news:', error);
      throw new Error('Failed to fetch news');
    }

    return data || [];
  });
