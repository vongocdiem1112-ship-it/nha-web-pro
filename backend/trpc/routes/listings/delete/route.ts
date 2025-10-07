import { protectedProcedure } from '../../../create-context';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const deleteListingProcedure = protectedProcedure
  .input(z.object({ id: z.string().uuid() }))
  .mutation(async ({ ctx, input }) => {
    const { data: listing, error: fetchError } = await ctx.supabase
      .from('listings')
      .select('user_id')
      .eq('id', input.id)
      .single();

    if (fetchError || !listing) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Listing not found' });
    }

    if (listing.user_id !== ctx.user.id) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'You can only delete your own listings' });
    }

    const { error } = await ctx.supabase.from('listings').delete().eq('id', input.id);

    if (error) {
      console.error('Error deleting listing:', error);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete listing' });
    }

    return { success: true };
  });
