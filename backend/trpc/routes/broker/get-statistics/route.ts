import { protectedProcedure } from '../../../create-context';
import { TRPCError } from '@trpc/server';

export const getBrokerStatisticsProcedure = protectedProcedure.query(async ({ ctx }) => {
  const { data: user, error: userError } = await ctx.supabase
    .from('users')
    .select('role')
    .eq('id', ctx.user.id)
    .single();

  if (userError || !user || user.role !== 'broker') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Only brokers can view statistics' });
  }

  const { data, error } = await ctx.supabase.rpc('get_broker_statistics', {
    broker_uuid: ctx.user.id,
  });

  if (error) {
    console.error('Error fetching broker statistics:', error);
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch statistics' });
  }

  return data;
});
