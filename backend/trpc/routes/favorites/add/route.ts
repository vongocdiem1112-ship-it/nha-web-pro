import { protectedProcedure } from '../../../create-context';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const addFavoriteProcedure = protectedProcedure
  .input(z.object({ listingId: z.string().uuid() }))
  .mutation(async ({ ctx, input }) => {
    const { data, error } = await ctx.supabase
      .from('favorites')
      .insert({
        user_id: ctx.user.id,
        listing_id: input.listingId,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new TRPCError({ code: 'CONFLICT', message: 'Already in favorites' });
      }
      console.error('Error adding favorite:', error);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to add favorite' });
    }

    return data;
  });
