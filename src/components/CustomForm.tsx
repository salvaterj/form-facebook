'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { FormConfig } from '@/types/form';
import { trackConversion } from './PixelManager';
import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

interface CustomFormProps {
  config: FormConfig;
  utms: any;
}

export const CustomForm = ({ config, utms }: CustomFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Criar schema dinâmico baseado nos campos
  const schemaShape: Record<string, z.ZodTypeAny> = {};
  config.fields.forEach((field) => {
    let fieldSchema: any = z.string();

    if (field.type === 'email') {
      fieldSchema = fieldSchema.email('E-mail inválido');
    }

    if (field.required) {
      fieldSchema = fieldSchema.min(1, 'Campo obrigatório');
    } else {
      fieldSchema = fieldSchema.optional().or(z.literal(''));
    }

    schemaShape[field.id] = fieldSchema;
  });

  const schema = z.object(schemaShape);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setError(null);

    const payload = {
      formId: config.slug,
      clientName: config.clientName,
      data,
      utms,
      timestamp: new Date().toISOString(),
    };

    console.log('Payload a ser enviado para o n8n:', payload);

    try {
      await axios.post(config.webhookUrl, payload);
      setIsSubmitted(true);
      trackConversion(config);

      if (config.redirectUrl) {
        window.location.href = config.redirectUrl;
      }
    } catch (err) {
      console.error('Erro ao enviar formulário:', err);
      setError('Ocorreu um erro ao enviar. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-8 bg-white rounded-2xl shadow-lg animate-in fade-in zoom-in duration-300">
        <CheckCircle2 className="w-16 h-16" style={{ color: config.theme.primaryColor }} />
        <h2 className="text-2xl font-bold text-gray-800 text-center">Sucesso!</h2>
        <p className="text-gray-600 text-center">
          {config.successMessage || 'Obrigado por entrar em contato!'}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6"
    >
      <div className="space-y-2 text-center">
        {config.theme.logoUrl && (
          <img
            src={config.theme.logoUrl}
            alt={config.clientName}
            className="h-12 mx-auto mb-4 object-contain"
          />
        )}
        <h1 className="text-xl font-bold text-gray-800">Complete seus dados</h1>
        <p className="text-sm text-gray-500">Para receber um contato especializado</p>
      </div>

      <div className="space-y-4">
        {config.fields.map((field) => (
          <div key={field.id} className="space-y-1">
            <label htmlFor={field.id} className="text-sm font-medium text-gray-700">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                id={field.id}
                placeholder={field.placeholder}
                {...register(field.id)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-all text-gray-900 bg-white ${
                  errors[field.id] ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
                style={{ '--tw-ring-color': config.theme.primaryColor + '44' } as any}
                rows={3}
              />
            ) : (
              <input
                id={field.id}
                type={field.type}
                placeholder={field.placeholder}
                {...register(field.id)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-all text-gray-900 bg-white ${
                  errors[field.id] ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
                style={{ '--tw-ring-color': config.theme.primaryColor + '44' } as any}
              />
            )}
            {errors[field.id] && (
              <p className="text-xs text-red-500">{errors[field.id]?.message as string}</p>
            )}
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-red-500 text-center font-medium">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-6 text-white font-bold rounded-lg shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
        style={{ backgroundColor: config.theme.primaryColor }}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Enviando...</span>
          </>
        ) : (
          <span>ENVIAR AGORA</span>
        )}
      </button>

      <p className="text-[10px] text-center text-gray-400">
        Seus dados estão protegidos de acordo com a LGPD.
      </p>
    </form>
  );
};
