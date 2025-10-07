import { publicProcedure } from '../../../create-context';
import { z } from 'zod';

export const getNewsByIdProcedure = publicProcedure
  .input(z.object({ id: z.string().uuid() }))
  .query(async ({ ctx, input }) => {
    const { data, error } = await ctx.supabase
      .from('news')
      .select('*')
      .eq('id', input.id)
      .single();

    if (error) {
      console.error('Error fetching news:', error);
      throw new Error('News not found');
    }

    await ctx.supabase.rpc('increment_news_views', { news_uuid: input.id });

    return data;
  });
