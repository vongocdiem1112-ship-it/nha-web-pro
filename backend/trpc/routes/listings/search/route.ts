import { publicProcedure } from '../../../create-context';
import { z } from 'zod';

export const searchListingsProcedure = publicProcedure
  .input(
    z.object({
      query: z.string().optional(),
      type: z.enum(['nha', 'dat', 'chung_cu', 'cho_thue']).optional(),
      minPrice: z.number().optional(),
      maxPrice: z.number().optional(),
      minArea: z.number().optional(),
      maxArea: z.number().optional(),
      district: z.string().optional(),
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    })
  )
  .query(async ({ ctx, input }) => {
    let query = ctx.supabase
      .from('listings')
      .select('*, users!listings_user_id_fkey(id, full_name, avatar_url, phone, social_links)', { count: 'exact' })
      .eq('status', 'active');

    if (input.query) {
      query = query.or(`title.ilike.%${input.query}%,description.ilike.%${input.query}%,address.ilike.%${input.query}%`);
    }
    if (input.type) {
      query = query.eq('type', input.type);
    }
    if (input.minPrice) {
      query = query.gte('price', input.minPrice);
    }
    if (input.maxPrice) {
      query = query.lte('price', input.maxPrice);
    }
    if (input.minArea) {
      query = query.gte('area', input.minArea);
    }
    if (input.maxArea) {
      query = query.lte('area', input.maxArea);
    }
    if (input.district) {
      query = query.eq('district', input.district);
    }

    query = query
      .order('is_hot', { ascending: false })
      .order('created_at', { ascending: false })
      .range(input.offset, input.offset + input.limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error searching listings:', error);
      throw new Error('Failed to search listings');
    }

    return {
      items: data || [],
      total: count || 0,
      hasMore: (input.offset + input.limit) < (count || 0),
    };
  });
