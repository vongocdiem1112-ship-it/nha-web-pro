import { protectedProcedure } from '../../../create-context';

export const getMyListingsProcedure = protectedProcedure.query(async ({ ctx }) => {
  const { data, error } = await ctx.supabase
    .from('listings')
    .select('*')
    .eq('user_id', ctx.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching my listings:', error);
    throw new Error('Failed to fetch your listings');
  }

  return data || [];
});
