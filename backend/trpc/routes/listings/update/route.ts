import { protectedProcedure } from '../../../create-context';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const updateListingProcedure = protectedProcedure
  .input(
    z.object({
      id: z.string().uuid(),
      type: z.enum(['nha', 'dat', 'chung_cu', 'cho_thue']).optional(),
      title: z.string().min(10).max(200).optional(),
      description: z.string().max(2000).optional(),
      price: z.number().positive().optional(),
      area: z.number().positive().optional(),
      bedrooms: z.number().int().min(0).optional(),
      bathrooms: z.number().int().min(0).optional(),
      direction: z.string().optional(),
      address: z.string().min(5).optional(),
      district: z.string().min(2).optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
      images: z.array(z.string().url()).min(1).max(10).optional(),
      status: z.enum(['active', 'hidden', 'sold', 'rented']).optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { id, ...updates } = input;

    const { data: listing, error: fetchError } = await ctx.supabase
      .from('listings')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !listing) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Listing not found' });
    }

    if (listing.user_id !== ctx.user.id) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'You can only update your own listings' });
    }

    const { data, error } = await ctx.supabase
      .from('listings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating listing:', error);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update listing' });
    }

    return data;
  });
