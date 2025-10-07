import { protectedProcedure } from '../../../create-context';

export const getBrokerContactHistoryProcedure = protectedProcedure.query(async ({ ctx }) => {
  const { data, error } = await ctx.supabase
    .from('contact_history')
    .select(`
      *,
      listing:listings(id, title, images, price),
      user:users!contact_history_user_id_fkey(id, full_name, avatar_url, phone)
    `)
    .eq('broker_id', ctx.user.id)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Error fetching contact history:', error);
    throw new Error('Failed to fetch contact history');
  }

  return data || [];
});
