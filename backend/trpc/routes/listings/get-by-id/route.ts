import { publicProcedure } from '../../../create-context';
import { z } from 'zod';

export const getListingByIdProcedure = publicProcedure
  .input(z.object({ id: z.string().uuid() }))
  .query(async ({ ctx, input }) => {
    const { data, error } = await ctx.supabase
      .from('listings')
      .select('*, users!listings_user_id_fkey(id, full_name, avatar_url, phone, social_links, role)')
      .eq('id', input.id)
      .single();

    if (error) {
      console.error('Error fetching listing:', error);
      throw new Error('Listing not found');
    }

    await ctx.supabase.rpc('increment_listing_views', { listing_uuid: input.id });

    return data;
  });
