'use server';

import { revalidatePath } from 'next/cache';
import { FormConfig } from '@/types/form';
import * as db from '@/lib/db';

export async function saveFormAction(form: FormConfig) {
  await db.upsertForm(form);
  revalidatePath('/admin');
  revalidatePath(`/${form.slug}`);
  revalidatePath('/');
}

export async function deleteFormAction(slug: string) {
  await db.deleteForm(slug);
  revalidatePath('/admin');
  revalidatePath('/');
}

export async function getAllFormsAction() {
  return await db.getForms();
}
