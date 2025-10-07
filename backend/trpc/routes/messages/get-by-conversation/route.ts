import { protectedProcedure } from '../../../create-context';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const getMessagesProcedure = protectedProcedure
  .input(
    z.object({
      conversationId: z.string().uuid(),
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0),
    })
  )
  .query(async ({ ctx, input }) => {
    const { data: conversation, error: convError } = await ctx.supabase
      .from('conversations')
      .select('user_id, broker_id')
      .eq('id', input.conversationId)
      .single();

    if (convError || !conversation) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Conversation not found' });
    }

    if (conversation.user_id !== ctx.user.id && conversation.broker_id !== ctx.user.id) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Not authorized to view this conversation' });
    }

    const { data, error } = await ctx.supabase
      .from('messages')
      .select('*, sender:users!messages_sender_id_fkey(id, full_name, avatar_url)')
      .eq('conversation_id', input.conversationId)
      .order('created_at', { ascending: true })
      .range(input.offset, input.offset + input.limit - 1);

    if (error) {
      console.error('Error fetching messages:', error);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch messages' });
    }

    return data || [];
  });
