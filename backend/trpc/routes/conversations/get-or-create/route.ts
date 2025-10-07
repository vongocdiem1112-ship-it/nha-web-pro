import { protectedProcedure } from '../../../create-context';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const getOrCreateConversationProcedure = protectedProcedure
  .input(
    z.object({
      listingId: z.string().uuid(),
      brokerId: z.string().uuid(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { data: existing, error: fetchError } = await ctx.supabase
      .from('conversations')
      .select('*')
      .eq('listing_id', input.listingId)
      .eq('user_id', ctx.user.id)
      .eq('broker_id', input.brokerId)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching conversation:', fetchError);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch conversation' });
    }

    if (existing) {
      return existing;
    }

    const { data: newConversation, error: createError } = await ctx.supabase
      .from('conversations')
      .insert({
        listing_id: input.listingId,
        user_id: ctx.user.id,
        broker_id: input.brokerId,
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating conversation:', createError);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create conversation' });
    }

    return newConversation;
  });
