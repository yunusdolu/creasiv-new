/** @type {import('next').NextConfig} */

// creasiv.com'daki eski sitenin Google'da indekslenmiş adresleri — 404 yerine ana sayfaya 301 yönlendirilir
const legacyPaths = [
  '/hizmetler/:path*',
  '/lisanslar/:path*',
  '/otomasyonlar/:path*',
  '/markani-kur/:path*',
  '/blog/:path*',
  '/teklif-al/:path*',
  '/hakkimizda/:path*',
  '/kisisel-veriler/:path*',
  '/bilgi-guvenligi/:path*',
  '/gizlilik/:path*',
  '/en/:path*',
];

const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return legacyPaths.map((source) => ({ source, destination: '/', permanent: true }));
  },
};

export default nextConfig;
