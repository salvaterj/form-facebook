import { FormConfig } from '@/types/form';

export const formsConfig: FormConfig[] = [
  {
    slug: 'cliente-a',
    clientName: 'Cliente A',
    theme: {
      primaryColor: '#2563eb', // Blue
      secondaryColor: '#1e3a8a',
      logoUrl: 'https://via.placeholder.com/150x50?text=Logo+Cliente+A',
    },
    pixelIds: {
      meta: '1234567890',
      googleAds: 'AW-987654321',
    },
    webhookUrl: 'https://webhook.site/placeholder-url', // Substituir pela URL do n8n
    fields: [
      { id: 'nome', label: 'Nome Completo', type: 'text', placeholder: 'Seu nome aqui', required: true },
      { id: 'whatsapp', label: 'WhatsApp', type: 'tel', placeholder: '(00) 00000-0000', required: true },
      { id: 'email', label: 'E-mail', type: 'email', placeholder: 'seu@email.com', required: false },
    ],
    successMessage: 'Obrigado! Em breve entraremos em contato.',
  },
  {
    slug: 'cliente-b',
    clientName: 'Cliente B',
    theme: {
      primaryColor: '#16a34a', // Green
      secondaryColor: '#14532d',
      logoUrl: 'https://via.placeholder.com/150x50?text=Logo+Cliente+B',
    },
    pixelIds: {
      meta: '0987654321',
    },
    webhookUrl: 'https://webhook.site/placeholder-url-b',
    fields: [
      { id: 'nome', label: 'Nome', type: 'text', required: true },
      { id: 'celular', label: 'Celular/WhatsApp', type: 'tel', required: true },
      { id: 'empresa', label: 'Nome da Empresa', type: 'text', required: false },
    ],
    successMessage: 'Seu pedido foi recebido com sucesso!',
  }
];

export const getFormBySlug = (slug: string) => {
  return formsConfig.find((f) => f.slug === slug);
};
