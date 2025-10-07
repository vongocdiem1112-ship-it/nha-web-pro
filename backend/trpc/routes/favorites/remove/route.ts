import { protectedProcedure } from '../../../create-context';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const removeFavoriteProcedure = protectedProcedure
  .input(z.object({ listingId: z.string().uuid() }))
  .mutation(async ({ ctx, input }) => {
    const { error } = await ctx.supabase
      .from('favorites')
      .delete()
      .eq('user_id', ctx.user.id)
      .eq('listing_id', input.listingId);

    if (error) {
      console.error('Error removing favorite:', error);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to remove favorite' });
    }

    return { success: true };
  });
