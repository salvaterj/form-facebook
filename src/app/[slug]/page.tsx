import { getFormBySlug } from '@/lib/db';
import { getUTMsFromSearchParams } from '@/utils/utm';
import { CustomForm } from '@/components/CustomForm';
import { PixelManager } from '@/components/PixelManager';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function FormPage({ params, searchParams }: PageProps) {
  const slug = params?.slug;

  if (!slug || slug.includes('.') || slug.startsWith('_')) {
    notFound();
  }

  const config = await getFormBySlug(slug);

  if (!config) {
    notFound();
  }

  // Converter searchParams (objeto) para URLSearchParams
  const searchParamsObj = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === 'string') {
      searchParamsObj.set(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((v) => searchParamsObj.append(key, v));
    }
  });

  const utms = getUTMsFromSearchParams(searchParamsObj);

  return (
    <main
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: `linear-gradient(135deg, ${config.theme.primaryColor}22 0%, ${config.theme.secondaryColor}44 100%)`,
      }}
    >
      <PixelManager config={config} />
      <div className="w-full flex flex-col items-center">
        <CustomForm config={config} utms={utms} />
        
        <footer className="mt-8 text-center text-gray-500 text-xs">
          <p>© {new Date().getFullYear()} {config.clientName}. Todos os direitos reservados.</p>
        </footer>
      </div>
    </main>
  );
}
