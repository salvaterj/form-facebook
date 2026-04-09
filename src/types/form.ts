export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'textarea';
  placeholder?: string;
  required?: boolean;
}

export interface FormTheme {
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
}

export interface FormConfig {
  slug: string;
  clientName: string;
  theme: FormTheme;
  pixelIds: {
    meta?: string;
    googleAds?: string;
  };
  webhookUrl: string;
  fields: FormField[];
  successMessage?: string;
  redirectUrl?: string;
}
