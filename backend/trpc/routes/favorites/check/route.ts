import { protectedProcedure } from '../../../create-context';
import { z } from 'zod';

export const checkFavoriteProcedure = protectedProcedure
  .input(z.object({ listingId: z.string().uuid() }))
  .query(async ({ ctx, input }) => {
    const { data, error } = await ctx.supabase
      .from('favorites')
      .select('id')
      .eq('user_id', ctx.user.id)
      .eq('listing_id', input.listingId)
      .maybeSingle();

    if (error) {
      console.error('Error checking favorite:', error);
      return { isFavorite: false };
    }

    return { isFavorite: !!data };
  });
