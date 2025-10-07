import { protectedProcedure } from '../../../create-context';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const sendMessageProcedure = protectedProcedure
  .input(
    z.object({
      conversationId: z.string().uuid(),
      content: z.string().min(1).max(1000),
      imageUrl: z.string().url().optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { data: conversation, error: convError } = await ctx.supabase
      .from('conversations')
      .select('user_id, broker_id')
      .eq('id', input.conversationId)
      .single();

    if (convError || !conversation) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Conversation not found' });
    }

    if (conversation.user_id !== ctx.user.id && conversation.broker_id !== ctx.user.id) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Not authorized to send messages in this conversation' });
    }

    const { data, error } = await ctx.supabase
      .from('messages')
      .insert({
        conversation_id: input.conversationId,
        sender_id: ctx.user.id,
        content: input.content,
        image_url: input.imageUrl || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to send message' });
    }

    return data;
  });
