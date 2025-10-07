import { publicProcedure } from '../../../create-context';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const registerProcedure = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      password: z.string().min(6),
      fullName: z.string().min(2),
      phone: z.string().optional(),
      role: z.enum(['user', 'broker']).default('user'),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { data: authData, error: authError } = await ctx.supabase.auth.signUp({
      email: input.email,
      password: input.password,
    });

    if (authError || !authData.user) {
      console.error('Error creating auth user:', authError);
      throw new TRPCError({ code: 'BAD_REQUEST', message: authError?.message || 'Failed to register' });
    }

    const brokerStatus = input.role === 'broker' ? 'pending' : null;

    const { error: profileError } = await ctx.supabase.from('users').insert({
      id: authData.user.id,
      email: input.email,
      phone: input.phone || null,
      full_name: input.fullName,
      role: input.role,
      broker_status: brokerStatus,
      social_links: {},
    });

    if (profileError) {
      console.error('Error creating user profile:', profileError);
      await ctx.supabase.auth.admin.deleteUser(authData.user.id);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create user profile' });
    }

    return {
      user: authData.user,
      session: authData.session,
    };
  });
