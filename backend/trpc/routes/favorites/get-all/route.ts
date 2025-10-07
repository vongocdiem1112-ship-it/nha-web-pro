import { protectedProcedure } from '../../../create-context';

export const getFavoritesProcedure = protectedProcedure.query(async ({ ctx }) => {
  const { data, error } = await ctx.supabase.rpc('get_user_favorites', {
    user_uuid: ctx.user.id,
  });

  if (error) {
    console.error('Error fetching favorites:', error);
    throw new Error('Failed to fetch favorites');
  }

  return data || [];
});
