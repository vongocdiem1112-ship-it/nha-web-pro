import { protectedProcedure } from '../../../create-context';
import { TRPCError } from '@trpc/server';

export const getProfileProcedure = protectedProcedure.query(async ({ ctx }) => {
  const { data, error } = await ctx.supabase
    .from('users')
    .select('*')
    .eq('id', ctx.user.id)
    .single();

  if (error || !data) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'User profile not found' });
  }

  return data;
});
