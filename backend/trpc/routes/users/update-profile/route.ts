import { protectedProcedure } from '../../../create-context';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const updateProfileProcedure = protectedProcedure
  .input(
    z.object({
      fullName: z.string().min(2).optional(),
      phone: z.string().optional(),
      avatarUrl: z.string().url().optional(),
      socialLinks: z.record(z.string(), z.string()).optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const updates: any = {};
    if (input.fullName) updates.full_name = input.fullName;
    if (input.phone !== undefined) updates.phone = input.phone;
    if (input.avatarUrl !== undefined) updates.avatar_url = input.avatarUrl;
    if (input.socialLinks !== undefined) updates.social_links = input.socialLinks;

    const { data, error } = await ctx.supabase
      .from('users')
      .update(updates)
      .eq('id', ctx.user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update profile' });
    }

    return data;
  });
