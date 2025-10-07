import { protectedProcedure } from '../../../create-context';

export const getConversationsProcedure = protectedProcedure.query(async ({ ctx }) => {
  const { data, error } = await ctx.supabase
    .from('conversations')
    .select(`
      *,
      listing:listings(id, title, images, price, address),
      user:users!conversations_user_id_fkey(id, full_name, avatar_url),
      broker:users!conversations_broker_id_fkey(id, full_name, avatar_url)
    `)
    .or(`user_id.eq.${ctx.user.id},broker_id.eq.${ctx.user.id}`)
    .order('last_message_at', { ascending: false, nullsFirst: false });

  if (error) {
    console.error('Error fetching conversations:', error);
    throw new Error('Failed to fetch conversations');
  }

  return data || [];
});
