'use client';

import { useState } from 'react';
import { FormConfig, FormField } from '@/types/form';
import { saveFormAction } from '@/app/actions/form';
import { Plus, Trash2, Save, X, Settings, Palette, Target, Code } from 'lucide-react';

interface FormEditorProps {
  initialData?: FormConfig;
  onClose: () => void;
}

const DEFAULT_FORM: FormConfig = {
  slug: '',
  clientName: '',
  theme: {
    primaryColor: '#2563eb',
    secondaryColor: '#1e3a8a',
    logoUrl: '',
  },
  pixelIds: {
    meta: '',
    googleAds: '',
  },
  webhookUrl: '',
  fields: [
    { id: 'nome', label: 'Nome Completo', type: 'text', required: true },
    { id: 'whatsapp', label: 'WhatsApp', type: 'tel', required: true },
  ],
  successMessage: 'Obrigado! Em breve entraremos em contato.',
};

export function FormEditor({ initialData, onClose }: FormEditorProps) {
  const [form, setForm] = useState<FormConfig>(initialData || DEFAULT_FORM);
  const [activeTab, setActiveTab] = useState<'geral' | 'visual' | 'pixels' | 'campos'>('geral');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!form.slug || !form.clientName || !form.webhookUrl) {
      alert('Por favor, preencha os campos obrigatórios (Slug, Nome e Webhook)');
      return;
    }
    setIsSaving(true);
    try {
      await saveFormAction(form);
      onClose();
    } catch (error) {
      alert('Erro ao salvar formulário');
    } finally {
      setIsSaving(false);
    }
  };

  const addField = () => {
    const newField: FormField = {
      id: `campo_${form.fields.length + 1}`,
      label: 'Novo Campo',
      type: 'text',
      required: false,
    };
    setForm({ ...form, fields: [...form.fields, newField] });
  };

  const removeField = (id: string) => {
    setForm({ ...form, fields: form.fields.filter((f) => f.id !== id) });
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setForm({
      ...form,
      fields: form.fields.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {initialData ? `Editando: ${initialData.clientName}` : 'Criar Novo Formulário'}
            </h2>
            <p className="text-sm text-gray-500">Configure visual e integrações</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-48 border-r bg-gray-50 p-4 space-y-2">
            <button
              onClick={() => setActiveTab('geral')}
              className={`w-full flex items-center space-x-2 p-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'geral' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200 text-gray-600'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Geral</span>
            </button>
            <button
              onClick={() => setActiveTab('visual')}
              className={`w-full flex items-center space-x-2 p-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'visual' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200 text-gray-600'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Visual</span>
            </button>
            <button
              onClick={() => setActiveTab('pixels')}
              className={`w-full flex items-center space-x-2 p-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'pixels' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200 text-gray-600'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Pixels</span>
            </button>
            <button
              onClick={() => setActiveTab('campos')}
              className={`w-full flex items-center space-x-2 p-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'campos' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200 text-gray-600'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>Campos</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-8 overflow-y-auto">
            {activeTab === 'geral' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Slug (URL)</label>
                    <input
                      type="text"
                      placeholder="ex: cliente-a"
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Nome do Cliente</label>
                    <input
                      type="text"
                      placeholder="Nome fantasia"
                      value={form.clientName}
                      onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">URL do Webhook (n8n)</label>
                  <input
                    type="url"
                    placeholder="https://n8n.seusistema.com/..."
                    value={form.webhookUrl}
                    onChange={(e) => setForm({ ...form, webhookUrl: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Mensagem de Sucesso</label>
                  <textarea
                    value={form.successMessage}
                    onChange={(e) => setForm({ ...form, successMessage: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {activeTab === 'visual' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Cor Primária (Botão)</label>
                    <div className="flex space-x-2">
                      <input
                        type="color"
                        value={form.theme.primaryColor}
                        onChange={(e) => setForm({ ...form, theme: { ...form.theme, primaryColor: e.target.value } })}
                        className="h-10 w-20 border rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={form.theme.primaryColor}
                        onChange={(e) => setForm({ ...form, theme: { ...form.theme, primaryColor: e.target.value } })}
                        className="flex-1 p-2 border rounded-lg outline-none text-gray-900 bg-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Cor Secundária (Fundo)</label>
                    <div className="flex space-x-2">
                      <input
                        type="color"
                        value={form.theme.secondaryColor}
                        onChange={(e) => setForm({ ...form, theme: { ...form.theme, secondaryColor: e.target.value } })}
                        className="h-10 w-20 border rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={form.theme.secondaryColor}
                        onChange={(e) => setForm({ ...form, theme: { ...form.theme, secondaryColor: e.target.value } })}
                        className="flex-1 p-2 border rounded-lg outline-none text-gray-900 bg-white"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">URL do Logotipo</label>
                  <input
                    type="text"
                    placeholder="https://.../logo.png"
                    value={form.theme.logoUrl}
                    onChange={(e) => setForm({ ...form, theme: { ...form.theme, logoUrl: e.target.value } })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                  />
                </div>
              </div>
            )}

            {activeTab === 'pixels' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Meta Pixel ID (Facebook)</label>
                  <input
                    type="text"
                    placeholder="ex: 1234567890"
                    value={form.pixelIds.meta}
                    onChange={(e) => setForm({ ...form, pixelIds: { ...form.pixelIds, meta: e.target.value } })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Google Ads Pixel ID</label>
                  <input
                    type="text"
                    placeholder="ex: AW-123456789"
                    value={form.pixelIds.googleAds}
                    onChange={(e) => setForm({ ...form, pixelIds: { ...form.pixelIds, googleAds: e.target.value } })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                  />
                </div>
              </div>
            )}

            {activeTab === 'campos' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-gray-700 uppercase">Campos do Formulário</h3>
                  <button
                    onClick={addField}
                    className="flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>ADICIONAR CAMPO</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {form.fields.map((field) => (
                    <div key={field.id} className="p-4 border rounded-xl bg-gray-50 flex items-start space-x-4">
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Label</label>
                          <input
                            type="text"
                            value={field.label}
                            onChange={(e) => updateField(field.id, { label: e.target.value })}
                            className="w-full p-1.5 text-sm border rounded outline-none text-gray-900 bg-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Tipo</label>
                          <select
                            value={field.type}
                            onChange={(e) => updateField(field.id, { type: e.target.value as any })}
                            className="w-full p-1.5 text-sm border rounded outline-none bg-white text-gray-900"
                          >
                            <option value="text">Texto</option>
                            <option value="email">E-mail</option>
                            <option value="tel">WhatsApp/Tel</option>
                            <option value="number">Número</option>
                            <option value="textarea">Área de Texto</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-col items-center space-y-2 pt-5">
                        <label className="flex items-center space-x-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => updateField(field.id, { required: e.target.checked })}
                            className="w-3 h-3 text-blue-600 rounded"
                          />
                          <span className="text-[10px] font-bold text-gray-500 uppercase">Obri.</span>
                        </label>
                        <button
                          onClick={() => removeField(field.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
          >
            CANCELAR
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-8 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg flex items-center space-x-2 transition-all active:scale-95 disabled:opacity-70"
          >
            {isSaving ? (
              <span className="animate-pulse">SALVANDO...</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>SALVAR FORMULÁRIO</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
