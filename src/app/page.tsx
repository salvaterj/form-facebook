import Link from 'next/link'
import { getForms } from '@/lib/db'
import { LayoutDashboard, ArrowRight, CheckCircle2 } from 'lucide-react'

export const dynamic = 'force-dynamic';

export default async function Home() {
  const forms = await getForms();

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Páginas de Captura de Alta Conversão
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Crie formulários personalizados para seus clientes em segundos. Integrado com Meta Pixel, Google Ads e n8n.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/admin"
                className="rounded-xl bg-blue-600 px-8 py-4 text-sm font-bold text-white shadow-lg hover:bg-blue-500 transition-all flex items-center space-x-2 active:scale-95"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>ACESSAR PAINEL ADMIN</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Forms List Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Formulários Ativos</h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Acesse as landing pages criadas para seus clientes.
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {forms.map((form) => (
              <article key={form.slug} className="flex max-w-xl flex-col items-start justify-between bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-transparent hover:border-blue-100 group">
                <div className="flex items-center gap-x-4 text-xs">
                  <span className="text-gray-500 uppercase font-bold tracking-widest">Ativo</span>
                  <div className="flex space-x-1">
                    {form.pixelIds.meta && <div className="w-2 h-2 rounded-full bg-blue-500" title="Meta Pixel Ativo" />}
                    {form.pixelIds.googleAds && <div className="w-2 h-2 rounded-full bg-green-500" title="Google Ads Ativo" />}
                  </div>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-2xl font-bold leading-6 text-gray-900 group-hover:text-blue-600 transition-colors">
                    <Link href={`/${form.slug}`}>
                      <span className="absolute inset-0" />
                      {form.clientName}
                    </Link>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                    URL personalizada: <span className="font-mono text-blue-500">/{form.slug}</span>
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-x-4">
                  <div className="text-sm leading-6">
                    <p className="font-semibold text-gray-900 flex items-center space-x-2">
                      <span>Ver Página</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
