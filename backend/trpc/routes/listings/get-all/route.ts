import { publicProcedure } from '../../../create-context';
import { z } from 'zod';

export const getAllListingsProcedure = publicProcedure
  .input(
    z.object({
      type: z.enum(['nha', 'dat', 'chung_cu', 'cho_thue']).optional(),
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }).optional()
  )
  .query(async ({ ctx, input }) => {
    const { type, limit = 20, offset = 0 } = input || {};

    let query = ctx.supabase
      .from('listings')
      .select('*, users!listings_user_id_fkey(id, full_name, avatar_url, phone, social_links)', { count: 'exact' })
      .eq('status', 'active')
      .order('is_hot', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching listings:', error);
      throw new Error('Failed to fetch listings');
    }

    return {
      items: data || [],
      total: count || 0,
      hasMore: (offset + limit) < (count || 0),
    };
  });
