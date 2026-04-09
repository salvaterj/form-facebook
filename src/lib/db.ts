import { FormConfig } from '@/types/form';
import { supabase } from './supabase';

export async function getForms(): Promise<FormConfig[]> {
  try {
    const { data, error } = await supabase
      .from('forms')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(row => row.config as FormConfig);
  } catch (error) {
    console.error('Error fetching forms from Supabase:', error);
    return [];
  }
}

export async function getFormBySlug(slug: string): Promise<FormConfig | undefined> {
  try {
    const { data, error } = await supabase
      .from('forms')
      .select('config')
      .eq('slug', slug)
      .maybeSingle();

    if (error) throw error;
    return data?.config as FormConfig;
  } catch (error) {
    console.error(`Error fetching form ${slug} from Supabase:`, error);
    return undefined;
  }
}

export async function upsertForm(form: FormConfig): Promise<void> {
  const { error } = await supabase
    .from('forms')
    .upsert({ 
      slug: form.slug, 
      config: form,
      updated_at: new Date().toISOString()
    }, { onConflict: 'slug' });

  if (error) throw error;
}

export async function deleteForm(slug: string): Promise<void> {
  const { error } = await supabase
    .from('forms')
    .delete()
    .eq('slug', slug);

  if (error) throw error;
}
