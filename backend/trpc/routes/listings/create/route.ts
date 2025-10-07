import { protectedProcedure } from '../../../create-context';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const createListingProcedure = protectedProcedure
  .input(
    z.object({
      type: z.enum(['nha', 'dat', 'chung_cu', 'cho_thue']),
      title: z.string().min(10).max(200),
      description: z.string().max(2000).optional(),
      price: z.number().positive(),
      area: z.number().positive(),
      bedrooms: z.number().int().min(0).optional(),
      bathrooms: z.number().int().min(0).optional(),
      direction: z.string().optional(),
      address: z.string().min(5),
      district: z.string().min(2),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
      images: z.array(z.string().url()).min(1).max(10),
      is_hot: z.boolean().default(false),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { data: userData, error: userError } = await ctx.supabase
      .from('users')
      .select('role, broker_status')
      .eq('id', ctx.user.id)
      .single();

    if (userError || !userData) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not found' });
    }

    if (userData.role !== 'broker' || userData.broker_status !== 'approved') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Only approved brokers can create listings',
      });
    }

    const { data, error } = await ctx.supabase
      .from('listings')
      .insert({
        user_id: ctx.user.id,
        type: input.type,
        title: input.title,
        description: input.description || null,
        price: input.price,
        area: input.area,
        bedrooms: input.bedrooms || null,
        bathrooms: input.bathrooms || null,
        direction: input.direction || null,
        address: input.address,
        district: input.district,
        city: 'Bà Rịa - Vũng Tàu',
        latitude: input.latitude || null,
        longitude: input.longitude || null,
        images: input.images,
        is_hot: input.is_hot,
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating listing:', error);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create listing' });
    }

    return data;
  });
