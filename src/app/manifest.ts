import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Creasiv — Dijital Ajans',
    short_name: 'Creasiv',
    description: 'Yazılım, tasarım ve prodüksiyonu tek çatı altında birleştiren dijital kreatif stüdyo.',
    start_url: '/',
    display: 'standalone',
    background_color: '#1A3DE8',
    theme_color: '#1A3DE8',
    lang: 'tr',
    icons: [
      { src: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { src: '/logo-square-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/logo-square.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
