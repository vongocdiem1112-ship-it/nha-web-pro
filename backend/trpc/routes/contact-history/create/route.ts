import { publicProcedure } from '../../../create-context';
import { z } from 'zod';

export const createContactHistoryProcedure = publicProcedure
  .input(
    z.object({
      listingId: z.string().uuid(),
      brokerId: z.string().uuid(),
      contactType: z.enum(['call', 'chat', 'view']),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { data, error } = await ctx.supabase
      .from('contact_history')
      .insert({
        listing_id: input.listingId,
        user_id: ctx.user?.id || null,
        broker_id: input.brokerId,
        contact_type: input.contactType,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating contact history:', error);
    }

    return data;
  });
