'use client';

import { useEffect, useState } from 'react';
import { FormConfig } from '@/types/form';
import { getAllFormsAction, deleteFormAction } from '@/app/actions/form';
import { FormEditor } from '@/components/FormEditor';
import { Plus, Pencil, Trash2, ExternalLink, LayoutDashboard, Search, Settings } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [forms, setForms] = useState<FormConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingForm, setEditingForm] = useState<FormConfig | null | 'new'>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadForms = async () => {
    setLoading(true);
    const data = await getAllFormsAction();
    setForms(data);
    setLoading(false);
  };

  useEffect(() => {
    loadForms();
  }, []);

  const handleDelete = async (slug: string) => {
    if (confirm('Tem certeza que deseja excluir este formulário?')) {
      await deleteFormAction(slug);
      loadForms();
    }
  };

  const filteredForms = forms.filter(f => 
    f.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">LeadForm Admin</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Settings className="w-6 h-6" />
            </button>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-500">
              <span className="text-xs font-bold text-blue-700">JS</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">Seus Formulários</h2>
            <p className="text-gray-500 text-sm">Gerencie seus clientes e pixels de rastreamento.</p>
          </div>
          <button
            onClick={() => setEditingForm('new')}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>NOVO FORMULÁRIO</span>
          </button>
        </div>

        {/* Stats & Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex space-x-4 w-full md:w-auto">
            <div className="bg-white p-4 rounded-xl shadow-sm border flex-1 md:w-48">
              <p className="text-xs font-bold text-gray-400 uppercase">Total de Forms</p>
              <p className="text-2xl font-extrabold text-gray-900">{forms.length}</p>
            </div>
          </div>
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Buscar por cliente ou slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Forms List */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 font-medium">Carregando seus formulários...</p>
            </div>
          ) : filteredForms.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b text-gray-500 text-xs font-bold uppercase">
                  <tr>
                    <th className="px-6 py-4">Cliente</th>
                    <th className="px-6 py-4">Link (Slug)</th>
                    <th className="px-6 py-4">Pixels Ativos</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredForms.map((form) => (
                    <tr key={form.slug} className="hover:bg-blue-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-8 h-8 rounded-lg flex-shrink-0 border shadow-sm flex items-center justify-center overflow-hidden bg-white"
                          >
                            {form.theme.logoUrl ? (
                              <img src={form.theme.logoUrl} alt="" className="max-w-[80%] max-h-[80%] object-contain" />
                            ) : (
                              <div className="w-full h-full" style={{ backgroundColor: form.theme.primaryColor }} />
                            )}
                          </div>
                          <span className="font-bold text-gray-900">{form.clientName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Link 
                          href={`/${form.slug}`} 
                          target="_blank"
                          className="text-blue-600 hover:underline flex items-center space-x-1 font-medium"
                        >
                          <span>/{form.slug}</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-1">
                          {form.pixelIds.meta && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full uppercase tracking-tighter">Meta</span>
                          )}
                          {form.pixelIds.googleAds && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-tighter">GAds</span>
                          )}
                          {!form.pixelIds.meta && !form.pixelIds.googleAds && (
                            <span className="text-gray-400 text-[10px] italic">Nenhum</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setEditingForm(form)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                            title="Editar"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(form.slug)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all"
                            title="Excluir"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-20 flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 bg-gray-100 rounded-full">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Nenhum formulário encontrado</h3>
                <p className="text-gray-500 max-w-xs mx-auto">Tente ajustar sua busca ou crie um novo formulário agora mesmo.</p>
              </div>
              <button
                onClick={() => setEditingForm('new')}
                className="text-blue-600 font-bold hover:underline"
              >
                CRIAR MEU PRIMEIRO FORMULÁRIO
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer Info */}
      <footer className="p-8 text-center text-gray-400 text-xs">
        <p>LeadForm v1.0 • Desenvolvido para Alta Conversão</p>
      </footer>

      {/* Editor Modal */}
      {editingForm && (
        <FormEditor
          initialData={editingForm === 'new' ? undefined : editingForm}
          onClose={() => {
            setEditingForm(null);
            loadForms();
          }}
        />
      )}
    </div>
  );
}
