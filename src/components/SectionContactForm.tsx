'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionContactFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const services = [
  'Web & Yazılım',
  'Marka & Tasarım',
  'Sosyal Medya & Reklam',
  'Prodüksiyon & Çekim',
  '360° Tüm Hizmetler',
];

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    height: 0,
    transition: {
      height: {
        duration: 0.65,
        ease: [0.32, 0.72, 0, 1], // Yumuşak ve tok kapanma, ani hızlanmayı önler
      },
      opacity: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
  },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: {
      height: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1], // Doğal ve yumuşak açılış
      },
      opacity: {
        duration: 0.35,
        ease: 'easeInOut',
      },
      staggerChildren: 0.035,
      delayChildren: 0.02,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -6,
    scale: 0.99,
    transition: {
      duration: 0.35,
      ease: 'easeInOut',
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 26,
    },
  },
};

export default function SectionContactForm({ isOpen, onClose }: SectionContactFormProps) {
  const [selectedService, setSelectedService] = useState<string>(services[0]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = encodeURIComponent(`[Proje Talebi] ${formData.name || 'Yeni Talep'} - ${selectedService}`);
    const body = encodeURIComponent(
      `Merhaba Creasiv Ekibi,\n\n` +
      `Web siteniz üzerinden yeni bir proje talebi iletildi:\n\n` +
      `• Hizmet: ${selectedService}\n` +
      `• Ad Soyad: ${formData.name}\n` +
      `• Telefon: ${formData.phone}\n` +
      `• E-Posta: ${formData.email}\n\n` +
      `Mesaj / Proje Notları:\n${formData.message || '-'}\n`
    );

    // Otomatik maile at
    window.location.href = `mailto:creasivcom@gmail.com?subject=${subject}&body=${body}`;

    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="contact-form-anchor"
          id="contact-form-anchor"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="w-full max-w-full overflow-hidden pointer-events-auto select-auto"
        >
          <div className="pb-1 sm:pb-2 pt-2 px-1.5 sm:px-2.5">
            {!submitted ? (
              <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col gap-4 p-5 sm:p-7 bg-white/[0.08] backdrop-blur-2xl border border-white/25 sm:border-white/30 rounded-3xl overflow-hidden shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]"
              >
                {/* Üst Bilgi Barı */}
                <motion.div variants={itemVariants} className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-white/80">
                    Hızlı Teklif & İletişim Kutusu
                  </span>
                </motion.div>

                {/* Hizmet Seçimi Kutucukları (Şeffaf Cam Tasarım) */}
                <motion.div variants={itemVariants} className="flex flex-wrap gap-2 pt-1">
                  {services.map((svc) => {
                    const isSelected = selectedService === svc;
                    return (
                      <button
                        key={svc}
                        type="button"
                        onClick={() => setSelectedService(svc)}
                        className={cn(
                          'px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all backdrop-blur-md cursor-pointer active:scale-95',
                          isSelected
                            ? 'bg-white text-neutral-900 border border-white shadow-lg scale-[1.02]'
                            : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40'
                        )}
                      >
                        {svc}
                      </button>
                    );
                  })}
                </motion.div>

                {/* Form Girdi Kutucukları (Şeffaf Cam Tasarım) */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    required
                    placeholder="Ad Soyad / Firma *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 text-white placeholder:text-white/60 text-base sm:text-sm font-medium px-4 py-3.5 rounded-2xl border border-white/25 focus:border-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/40 transition-all shadow-inner"
                  />

                  <input
                    type="tel"
                    required
                    placeholder="Telefon Numarası *"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 text-white placeholder:text-white/60 text-base sm:text-sm font-medium px-4 py-3.5 rounded-2xl border border-white/25 focus:border-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/40 transition-all shadow-inner"
                  />

                  <input
                    type="email"
                    required
                    placeholder="E-Posta Adresi *"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 text-white placeholder:text-white/60 text-base sm:text-sm font-medium px-4 py-3.5 rounded-2xl border border-white/25 focus:border-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/40 transition-all shadow-inner"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <textarea
                    rows={2}
                    placeholder="Projeniz hakkında kısaca bilgi veya not bırakın..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 text-white placeholder:text-white/60 text-base sm:text-sm font-medium px-4 py-3.5 rounded-2xl border border-white/25 focus:border-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/40 transition-all resize-none shadow-inner"
                  />
                </motion.div>

                {/* Alt Butonlar & E-Posta Bilgisi */}
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      type="submit"
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-black hover:bg-neutral-900 text-white font-extrabold uppercase tracking-wider text-sm px-9 py-3.5 rounded-2xl shadow-xl transition-all cursor-pointer active:scale-95"
                    >
                      <span>GÖNDER</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-sm sm:text-base text-white/90 font-medium">
                    Doğrudan e-posta:{' '}
                    <a
                      href="mailto:creasivcom@gmail.com"
                      className="no-underline text-white hover:text-white/80 font-bold transition-colors"
                    >
                      creasivcom@gmail.com
                    </a>
                  </div>
                </motion.div>
              </form>
            ) : (
              /* Başarı Ekranı */
              <div className="w-full flex flex-col items-center text-center gap-3 p-6 sm:p-8 bg-white/10 backdrop-blur-2xl border border-white/25 text-white rounded-3xl shadow-2xl">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-white/20 text-white">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                  Talebiniz E-posta Olarak Açıldı!
                </h3>
                <p className="text-xs sm:text-sm text-white/85 max-w-md leading-relaxed">
                  Bilgileriniz e-posta uygulamanıza aktarıldı. <strong className="text-white underline">creasivcom@gmail.com</strong> adresimize ilettiğinizde en kısa sürede sizinle iletişime geçeceğiz.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    onClose();
                  }}
                  className="mt-2 px-6 py-2.5 rounded-xl bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Kapat
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
