'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
}

const services = [
  'Web & Yazılım',
  'Marka & Tasarım',
  'Sosyal Medya & Reklam',
  'Prodüksiyon & Çekim',
  '360° Tüm Hizmetler',
];

export default function ProjectModal({ isOpen, onClose, defaultService }: ProjectModalProps) {
  const [selectedService, setSelectedService] = useState<string>(defaultService || services[0]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  // Close on Escape & Lock body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = encodeURIComponent(`[Proje Talebi] ${formData.name || 'Yeni İletişim'} - ${selectedService}`);
    const body = encodeURIComponent(
      `Merhaba Creasiv Ekibi,\n\n` +
      `Web siteniz üzerinden yeni bir proje talebi gönderildi:\n\n` +
      `Hizmet: ${selectedService}\n` +
      `Ad Soyad: ${formData.name}\n` +
      `Telefon: ${formData.phone}\n` +
      `E-Posta: ${formData.email}\n\n` +
      `Mesaj / Detaylar:\n${formData.message || '-'}\n`
    );

    // Otomatik maile at
    window.location.href = `mailto:creasivcom@gmail.com?subject=${subject}&body=${body}`;

    setSubmitted(true);
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-visibility duration-400 ${
        isOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible delay-300'
      }`}
      aria-hidden={!isOpen}
    >
      {/* Karartılmış Arka Plan */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Sağdan Açılan Sade ve Net Panel */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-50 flex h-full w-full sm:max-w-lg md:max-w-xl flex-col justify-between bg-[#0a0a0c] text-white border-l border-white/10 shadow-2xl transform transition-transform duration-400 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Üst Bar */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-white/10 shrink-0">
          <span className="text-xs font-bold uppercase tracking-widest text-white/60">
            PROJE TALEBİ
          </span>

          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-white/20 bg-white/5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white hover:text-black hover:border-white transition-all cursor-pointer"
          >
            <span>Kapat</span>
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Alanı */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 sm:py-8 space-y-6">
          {!submitted ? (
            <form id="project-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Başlık */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white leading-tight">
                  Fikrinizi Dijitale Taşıyalım
                </h2>
                <p className="mt-2 text-sm text-white/60">
                  Bilgilerinizi girin veya doğrudan{' '}
                  <a
                    href="mailto:creasivcom@gmail.com"
                    className="text-white font-medium underline underline-offset-4 hover:text-neutral-200"
                  >
                    creasivcom@gmail.com
                  </a>{' '}
                  üzerinden bize ulaşın.
                </p>
              </div>

              {/* Hizmet Seçimi */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-2.5">
                  Hizmet Seçin
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {services.map((svc) => {
                    const isSelected = selectedService === svc;
                    return (
                      <button
                        key={svc}
                        type="button"
                        onClick={() => setSelectedService(svc)}
                        className={`p-3 text-left text-xs sm:text-sm font-semibold transition-all border cursor-pointer ${
                          isSelected
                            ? 'bg-white text-black border-white'
                            : 'bg-white/[0.03] text-white/70 border-white/10 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        {svc}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* İletişim Bilgileri */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">
                    Ad Soyad / Firma *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Adınız Soyadınız"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-white/15 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:border-white focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="05XX XXX XX XX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border border-white/15 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:border-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1.5">
                  E-Posta *
                </label>
                <input
                  type="email"
                  required
                  placeholder="ornek@markaniz.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-white/15 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:border-white focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1.5">
                  Mesaj / Proje Notu
                </label>
                <textarea
                  rows={3}
                  placeholder="Projeniz hakkında kısaca bilgi verin..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full border border-white/15 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:border-white focus:outline-none transition-colors resize-none"
                />
              </div>
            </form>
          ) : (
            /* Başarı Ekranı */
            <div className="py-16 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center border border-white/30 bg-white/10 text-white">
                <CheckCircle2 className="h-8 w-8 text-[#ED1C24]" />
              </div>
              <h3 className="text-2xl font-bold uppercase tracking-tight text-white">
                Talebiniz Hazırlandı
              </h3>
              <p className="text-sm text-white/70 max-w-sm mx-auto leading-relaxed">
                E-posta uygulamanız açıldı. Bilgileriniz <strong className="text-white">creasivcom@gmail.com</strong> adresimize iletilmek üzere hazırlandı.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="mt-4 px-6 py-3 border border-white bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                Pencereyi Kapat
              </button>
            </div>
          )}
        </div>

        {/* Alt Buton: Sadece GÖNDER ve Görünür E-Posta */}
        {!submitted && (
          <div className="p-6 sm:p-8 border-t border-white/10 bg-[#0a0a0c] shrink-0 space-y-3">
            <button
              type="submit"
              form="project-form"
              className="w-full bg-[#ED1C24] hover:bg-[#c9121a] text-white py-4 px-6 font-extrabold uppercase tracking-wider text-base transition-colors cursor-pointer shadow-lg active:scale-[0.99]"
            >
              GÖNDER
            </button>

            <div className="flex items-center justify-center gap-1.5 text-xs text-white/50">
              <span>Doğrudan e-posta adresi:</span>
              <a
                href="mailto:creasivcom@gmail.com"
                className="font-medium text-white/90 hover:text-white underline underline-offset-4 transition-colors"
              >
                creasivcom@gmail.com
              </a>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
