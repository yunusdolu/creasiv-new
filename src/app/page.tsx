'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import FlowArt, { FlowSection } from '@/components/ui/story-scroll';
import SectionContactForm from '@/components/SectionContactForm';
import FloatingDock from '@/components/ui/floating-dock';
import { Button3D } from '@/components/ui/3d-button';
import {
  IconHome,
  IconTerminal2,
  IconNewSection,
  IconExchange,
  IconSparkles,
  IconMail,
  IconBrandInstagram,
} from '@tabler/icons-react';

// Logonun etrafında dairesel formda dönen belirgin ve kalın "TIKLA VEYA AŞAĞIYA KAYDIR" rozeti (Sadece Biz Kimiz sayfasında)
function CircularTextBadge({
  id = 'hero',
  text = 'TIKLA VEYA AŞAĞIYA KAYDIR • TIKLA VEYA AŞAĞIYA KAYDIR • ',
  mobileText = 'TIKLA VEYA AŞAĞIYA KAYDIR • ',
}: {
  id?: string;
  text?: string;
  mobileText?: string;
}) {
  const pathId = `circle-path-${id}`;
  const svgRef = React.useRef<SVGSVGElement>(null);
  const angleRef = React.useRef(0);
  const speedRef = React.useRef(15); // Başlangıç dönüş hızı: 15 deg/s (24 saniyede 1 tam tur)
  const isHoveredRef = React.useRef(false);

  React.useEffect(() => {
    const button = svgRef.current?.closest('button');
    const handleEnter = () => {
      isHoveredRef.current = true;
    };
    const handleLeave = () => {
      isHoveredRef.current = false;
    };

    if (button) {
      button.addEventListener('mouseenter', handleEnter);
      button.addEventListener('mouseleave', handleLeave);
    }

    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Normal hız: 15 deg/s (24s / tur), Hover hızı: 52 deg/s (~6.9s / tur)
      const targetSpeed = isHoveredRef.current ? 52 : 15;

      // Hızı mevcut değerden hedefe doğru yumuşakça ivmelendir (sıfırlamadan, kaldığı açıdan hızlanır/yavaşlar)
      speedRef.current += (targetSpeed - speedRef.current) * Math.min(delta * 4, 1);
      angleRef.current = (angleRef.current + speedRef.current * delta) % 360;

      if (svgRef.current) {
        svgRef.current.style.transform = `rotate(${angleRef.current}deg)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (button) {
        button.removeEventListener('mouseenter', handleEnter);
        button.removeEventListener('mouseleave', handleLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    // Gölge filtresi <text> yerine <svg> üzerinde: iOS Safari SVG içi elemanlardaki CSS filter'da yazıyı gizleyebiliyor
    <svg
      ref={svgRef}
      viewBox="0 0 200 200"
      className="absolute inset-0 h-full w-full pointer-events-none select-none z-10 will-change-transform drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]"
      aria-hidden="true"
    >
      <defs>
        <path
          id={pathId}
          d="M 100, 100 m 0, -80 a 80,80 0 1,1 0,160 a 80,80 0 1,1 0,-160"
        />
      </defs>
      {/* Masaüstü: metin iki kez, ince yazı */}
      <text
        className="hidden sm:inline font-black uppercase fill-white"
        style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '0.04em' }}
      >
        <textPath href={`#${pathId}`} xlinkHref={`#${pathId}`} startOffset="0%" textLength={492} lengthAdjust="spacing">
          {text}
        </textPath>
      </text>
      {/* Mobil: logo küçük olduğu için metin tek sefer ve yaklaşık iki kat büyük */}
      <text
        className="sm:hidden font-black uppercase fill-white"
        style={{ fontSize: '19px', fontWeight: 900, letterSpacing: '0.02em' }}
      >
        <textPath href={`#${pathId}`} xlinkHref={`#${pathId}`} startOffset="0%" textLength={492} lengthAdjust="spacing">
          {mobileText}
        </textPath>
      </text>
    </svg>
  );
}

export default function CreasivSite() {
  const [modalOpen, setModalOpen] = useState(false);
  const [dockOpen, setDockOpen] = useState(false);
  const contactSectionRef = useRef<HTMLDivElement>(null);
  const formAnchorRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Form açılırken: ResizeObserver ile form genişledikçe sayfayı birebir takip ettir (her frame senkron)
  // Form kapanırken: section başına yumuşak scroll
  const handleToggleContact = useCallback(() => {
    setModalOpen((prev) => {
      const willOpen = !prev;
      if (typeof window === 'undefined') return willOpen;

      if (willOpen) {
        // Form açılıyor — React render'ı bekle, sonra ResizeObserver ile form büyüdükçe scroll et
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const anchor = formAnchorRef.current;
            if (!anchor) return;

            // Önceki observer varsa temizle
            resizeObserverRef.current?.disconnect();

            let prevHeight = anchor.getBoundingClientRect().height;

            const observer = new ResizeObserver((entries) => {
              for (const entry of entries) {
                const newHeight = entry.contentRect.height;
                const delta = newHeight - prevHeight;
                if (delta > 0) {
                  // Form büyüdüğü kadar sayfayı aşağı kaydır (birebir senkron)
                  window.scrollBy({ top: delta, behavior: 'auto' });
                }
                prevHeight = newHeight;
              }
            });

            observer.observe(anchor);
            resizeObserverRef.current = observer;

            // Animasyon bittikten sonra temizle ve ScrollTrigger'ı yenile
            setTimeout(() => {
              observer.disconnect();
              resizeObserverRef.current = null;
              window.dispatchEvent(new Event('resize'));
              try { (window as any).ScrollTrigger?.refresh(); } catch {}
            }, 900);
          });
        });
      } else {
        // Form kapanıyor — section başına geri scroll
        resizeObserverRef.current?.disconnect();
        resizeObserverRef.current = null;

        if ((window as any).creasivScrollTo) {
          (window as any).creasivScrollTo('section-contact');
        } else {
          const section = document.getElementById('section-contact');
          if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
          try { (window as any).ScrollTrigger?.refresh(); } catch {}
        }, 700);
      }

      return willOpen;
    });
  }, []);

  const handleCloseContact = useCallback(() => {
    setModalOpen(false);
    if (typeof window === 'undefined') return;

    resizeObserverRef.current?.disconnect();
    resizeObserverRef.current = null;

    // Section başına yumuşak scroll
    if ((window as any).creasivScrollTo) {
      (window as any).creasivScrollTo('section-contact');
    } else {
      const section = document.getElementById('section-contact');
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      try { (window as any).ScrollTrigger?.refresh(); } catch {}
    }, 700);
  }, []);


  // Sayfa mouse tekerleği, dokunma veya kaydırma ile hareket ettirildiğinde menüyü otomatik kapat
  useEffect(() => {
    if (!dockOpen) return;

    const handleUserScroll = () => {
      setDockOpen(false);
    };

    window.addEventListener('wheel', handleUserScroll, { passive: true });
    window.addEventListener('touchmove', handleUserScroll, { passive: true });
    window.addEventListener('scroll', handleUserScroll, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleUserScroll);
      window.removeEventListener('touchmove', handleUserScroll);
      window.removeEventListener('scroll', handleUserScroll);
    };
  }, [dockOpen]);

  // GSAP ScrollTrigger'ın her bölüm için hesapladığı en üst ('top top') piksel konumuna tam hizalama
  const scrollToSection = (id: string) => {
    setDockOpen(false);
    if (typeof window !== 'undefined' && (window as any).creasivScrollTo) {
      (window as any).creasivScrollTo(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Beyaz daireler ve siyah gölgeli ikon stilleriyle menü bağlantıları
  const links = [
    {
      title: 'Biz Kimiz',
      icon: (
        <IconHome className="h-full w-full text-neutral-900 drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]" />
      ),
      href: '#section-about',
      onClick: () => scrollToSection('section-about'),
    },
    {
      title: 'Yazılım Çözümleri',
      icon: (
        <IconTerminal2 className="h-full w-full text-neutral-900 drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]" />
      ),
      href: '#section-software',
      onClick: () => scrollToSection('section-software'),
    },
    {
      title: 'Tasarım Çözümleri',
      icon: (
        <IconNewSection className="h-full w-full text-neutral-900 drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]" />
      ),
      href: '#section-design',
      onClick: () => scrollToSection('section-design'),
    },
    {
      title: 'Prodüksiyon Çözümleri',
      icon: (
        <IconExchange className="h-full w-full text-neutral-900 drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]" />
      ),
      href: '#section-production',
      onClick: () => scrollToSection('section-production'),
    },
    {
      title: 'İletişim & Proje',
      icon: (
        <IconSparkles className="h-full w-full text-neutral-900 drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]" />
      ),
      href: '#section-contact',
      onClick: () => scrollToSection('section-contact'),
    },
    {
      title: 'E-Posta İletişim',
      icon: (
        <IconMail className="h-full w-full text-neutral-900 drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]" />
      ),
      href: 'mailto:creasivcom@gmail.com',
    },
    {
      title: 'Instagram',
      icon: (
        <IconBrandInstagram className="h-full w-full text-neutral-900 drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]" />
      ),
      href: 'https://instagram.com/creasivcom',
      target: '_blank',
    },
  ];

  return (
    <>
      {/* =========================================================
          SABİT DİKEY FLOATING DOCK (Logoya Tıklanınca Alta Doğru Açılır)
         ========================================================= */}
      <aside
        aria-label="Hızlı Gezinti Menüsü"
        className="fixed top-[148px] sm:top-[186px] md:top-[242px] lg:top-[286px] right-6 sm:right-8 md:right-10 w-28 sm:w-[138px] md:w-[185px] lg:w-[230px] flex flex-col items-center z-50 pointer-events-none"
      >
        <FloatingDock items={links} isOpen={dockOpen} onClose={() => setDockOpen(false)} />
      </aside>

      <FlowArt aria-label="Creasiv Flow Art">
        {/* =========================================================
            01 — BİZ KİMİZ
           ========================================================= */}
        <FlowSection
          id="section-about"
          aria-label="Biz Kimiz"
          style={{ backgroundColor: '#1A3DE8', color: '#fff' }}
        >
          {/* Her Kartta Sağ Üstte Orijinal Sembol Logo Butonu (Ekstra %20 Büyütüldü + Dairesel Rozet) */}
          <button
            type="button"
            onClick={() => setDockOpen((prev) => !prev)}
            aria-label={dockOpen ? "Gezinti Menüsünü Kapat" : "Gezinti Menüsünü Aç"}
            title={dockOpen ? "Gezinti Menüsünü Kapat" : "Gezinti Menüsünü Aç"}
            className="absolute top-6 right-6 sm:top-8 sm:right-8 md:top-10 md:right-10 pointer-events-auto select-none z-30 cursor-pointer group transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none"
          >
            <div className="relative h-28 w-28 sm:h-[138px] sm:w-[138px] md:h-[185px] md:w-[185px] lg:h-[230px] lg:w-[230px]">
              <CircularTextBadge id="hero" />
              <Image
                src="/logo-white-transparent.png"
                alt="Creasiv Sembol Logo"
                fill
                sizes="(max-width: 768px) 138px, 230px"
                className="object-contain opacity-95 group-hover:opacity-100 transition-all duration-300 drop-shadow-[0_12px_24px_rgba(0,0,0,0.55)] drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)] group-hover:drop-shadow-[0_18px_32px_rgba(0,0,0,0.7)]"
                priority
              />
            </div>
          </button>

          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-white">
            01 — Biz Kimiz
          </p>

          <hr className="my-[2vw] border-none border-t border-white/50" />

          {/* Creasiv Yazılı Logosu + BİR yan yana, ardından DİJİTAL AJANS */}
          <div>
            <h1 className="text-[clamp(3.2rem,10.4vw,12.2rem)] font-bold leading-[1] uppercase tracking-tight text-white">
              <span className="flex items-center gap-3 sm:gap-6 flex-wrap">
                <span className="relative block h-[clamp(4rem,12.8vw,12.4rem)] aspect-[852/237] max-w-[75vw] shrink-0">
                  <Image
                    src="/creasiv-logo.png"
                    alt="Creasiv"
                    fill
                    sizes="(max-width: 768px) 450px, 750px"
                    className="object-contain object-left brightness-200 contrast-125"
                    priority
                  />
                </span>
                <span>BİR</span>
              </span>
              <span className="block">DİJİTAL AJANS</span>
            </h1>
          </div>

          <hr className="my-[2vw] border-none border-t border-white/50" />

          {/* Mobilde sağ alttaki ok butonunun metnin üstüne binmemesi için alt boşluk */}
          <p className="mb-20 sm:mb-0 max-w-[50ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed text-white">
            Biz Creasiv; yazılım, tasarım ve prodüksiyonu aynı çatı altında birleştiren yeni nesil bir dijital kreatif stüdyoyuz.
          </p>


          {/* Sağ Altta Büyük Aşağı Ok Butonu (Logonun tam dikey ekseninde ortalanmış) */}
          <button
            type="button"
            onClick={() => scrollToSection('section-software')}
            aria-label="Aşağıya Kaydır"
            title="Aşağıya Kaydır"
            className="absolute bottom-6 sm:bottom-8 md:bottom-10 right-6 sm:right-8 md:right-10 w-28 sm:w-[138px] md:w-[185px] lg:w-[230px] flex items-center justify-center pointer-events-auto select-none z-30 cursor-pointer group p-2 focus:outline-none transition-transform duration-300 hover:scale-110 active:scale-95"
          >
            <div className="animate-bounce flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.55)] transition-transform duration-300 group-hover:translate-y-1.5"
              >
                <line x1="12" y1="4" x2="12" y2="20" />
                <polyline points="19 13 12 20 5 13" />
              </svg>
            </div>
          </button>
        </FlowSection>

        {/* =========================================================
            02 — YAZILIM ÇÖZÜMLERİ
           ========================================================= */}
        <FlowSection
          id="section-software"
          aria-label="Yazılım Çözümleri"
          style={{ backgroundColor: '#fd5200', color: '#fff' }}
        >
          {/* Her Kartta Sağ Üstte Orijinal Sembol Logo Butonu (Ekstra %20 Büyütüldü + Gölgeli) */}
          <button
            type="button"
            onClick={() => setDockOpen((prev) => !prev)}
            aria-label={dockOpen ? "Gezinti Menüsünü Kapat" : "Gezinti Menüsünü Aç"}
            title={dockOpen ? "Gezinti Menüsünü Kapat" : "Gezinti Menüsünü Aç"}
            className="absolute top-6 right-6 sm:top-8 sm:right-8 md:top-10 md:right-10 pointer-events-auto select-none z-30 cursor-pointer group transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none"
          >
            <div className="relative h-28 w-28 sm:h-[138px] sm:w-[138px] md:h-[185px] md:w-[185px] lg:h-[230px] lg:w-[230px]">
              <Image
                src="/logo-white-transparent.png"
                alt="Creasiv Sembol Logo"
                fill
                sizes="(max-width: 768px) 138px, 230px"
                className="object-contain opacity-95 group-hover:opacity-100 transition-all duration-300 drop-shadow-[0_12px_24px_rgba(0,0,0,0.55)] drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)] group-hover:drop-shadow-[0_18px_32px_rgba(0,0,0,0.7)]"
              />
            </div>
          </button>

          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em]">02 — Yazılım Çözümleri</p>
          <hr className="my-[2vw] border-none border-t border-white/60" />
          <div>
            <h2 className="text-[clamp(3.2rem,10.4vw,12.2rem)] font-bold leading-[1] uppercase tracking-tight">
              Yazılım
              <br />
              Web
              <br />
              Sistem
            </h2>
          </div>
          <hr className="my-[2vw] border-none border-t border-white/60" />
          <p className="max-w-[50ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed">
            Özel kurumsal web siteleri, yüksek dönüşümlü e-ticaret altyapıları, landing page kurguları ve modern web uygulamaları.
          </p>
          <hr className="my-[2vw] border-none border-t border-white/60" />
          
          {/* Satır 1 — 3 Madde */}
          <div className="flex flex-wrap gap-[3vw]">
            <div className="min-w-[180px] flex-1">
              <div className="mb-2.5">
                <span className="inline-block rounded-none bg-white px-2.5 py-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#fd5200]">
                  Kurumsal Siteler
                </span>
              </div>
              <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
                Markanızın prestijini dijitalde yansıtan, hız ve güvenilirlik odaklı web deneyimleri.
              </p>
            </div>
            <div className="min-w-[180px] flex-1">
              <div className="mb-2.5">
                <span className="inline-block rounded-none bg-white px-2.5 py-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#fd5200]">
                  E-Ticaret
                </span>
              </div>
              <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
                Yüksek dönüşüm optimizasyonu, güvenli ödeme sistemleri ve kesintisiz ölçeklenebilir mimari.
              </p>
            </div>
            <div className="min-w-[180px] flex-1">
              <div className="mb-2.5">
                <span className="inline-block rounded-none bg-white px-2.5 py-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#fd5200]">
                  Landing Page
                </span>
              </div>
              <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
                Reklam trafiğini doğrudan satışa ve nitelikli müşteriye dönüştüren hedefli kampanya sayfaları.
              </p>
            </div>
          </div>

          <hr className="my-[2vw] border-none border-t border-white/60" />

          {/* Satır 2 — 3 Madde */}
          <div className="flex flex-wrap gap-[3vw]">
            <div className="min-w-[180px] flex-1">
              <div className="mb-2.5">
                <span className="inline-block rounded-none bg-white px-2.5 py-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#fd5200]">
                  Web Uygulamaları
                </span>
              </div>
              <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
                İş süreçlerinizi dijitalleştiren SaaS, CRM, yönetim panelleri ve operasyonel bulut yazılımları.
              </p>
            </div>
            <div className="min-w-[180px] flex-1">
              <div className="mb-2.5">
                <span className="inline-block rounded-none bg-white px-2.5 py-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#fd5200]">
                  SEO & Hız
                </span>
              </div>
              <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
                Google aramalarında en üst sıralara tırmanmanızı sağlayan 100/100 teknik hız ve SEO optimizasyonu.
              </p>
            </div>
            <div className="min-w-[180px] flex-1">
              <div className="mb-2.5">
                <span className="inline-block rounded-none bg-white px-2.5 py-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#fd5200]">
                  Bulut & Entegrasyon
                </span>
              </div>
              <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
                AWS ve modern bulut sağlayıcıları ile %99.9 kesintisiz çalışma ve esnek API entegrasyon gücü.
              </p>
            </div>
          </div>

          <hr className="my-[2vw] border-none border-t border-white/60" />
          <p className="mt-auto ml-auto max-w-[50ch] text-right text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed">
            Hızlı, ölçeklenebilir ve modern yazılım çözümleriyle dijital varlığınızı güçlendiriyoruz.
          </p>
        </FlowSection>

        {/* =========================================================
            03 — TASARIM ÇÖZÜMLERİ
           ========================================================= */}
        <FlowSection
          id="section-design"
          aria-label="Tasarım Çözümleri"
          style={{ backgroundColor: '#000', color: '#fff' }}
        >
          {/* Her Kartta Sağ Üstte Orijinal Sembol Logo Butonu (Ekstra %20 Büyütüldü + Gölgeli) */}
          <button
            type="button"
            onClick={() => setDockOpen((prev) => !prev)}
            aria-label={dockOpen ? "Gezinti Menüsünü Kapat" : "Gezinti Menüsünü Aç"}
            title={dockOpen ? "Gezinti Menüsünü Kapat" : "Gezinti Menüsünü Aç"}
            className="absolute top-6 right-6 sm:top-8 sm:right-8 md:top-10 md:right-10 pointer-events-auto select-none z-30 cursor-pointer group transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none"
          >
            <div className="relative h-28 w-28 sm:h-[138px] sm:w-[138px] md:h-[185px] md:w-[185px] lg:h-[230px] lg:w-[230px]">
              <Image
                src="/logo-white-transparent.png"
                alt="Creasiv Sembol Logo"
                fill
                sizes="(max-width: 768px) 138px, 230px"
                className="object-contain opacity-95 group-hover:opacity-100 transition-all duration-300 drop-shadow-[0_12px_24px_rgba(0,0,0,0.55)] drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)] group-hover:drop-shadow-[0_18px_32px_rgba(0,0,0,0.7)]"
              />
            </div>
          </button>

          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em]">03 — Tasarım Çözümleri</p>
          <hr className="my-[2vw] border-none border-t border-white/50" />
          <div>
            <h2 className="text-[clamp(3.2rem,10.4vw,12.2rem)] font-bold leading-[1] uppercase tracking-tight">
              Marka
              <br />
              Kimlik
              <br />
              Tasarım
            </h2>
          </div>
          <hr className="my-[2vw] border-none border-t border-white/50" />
          <p className="max-w-[50ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed">
            Sıfırdan logo ve kurumsal kimlik inşası, dijital vitrin grafikleri, ambalaj & etiket tasarımları ve baskı materyalleri.
          </p>
          <hr className="my-[2vw] border-none border-t border-white/50" />

          {/* Satır 1 — 3 Madde */}
          <div className="flex flex-wrap gap-[3vw]">
            <div className="min-w-[180px] flex-1">
              <div className="mb-2.5">
                <span className="inline-block rounded-none bg-white px-2.5 py-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-black">
                  Logo İnşası
                </span>
              </div>
              <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
                Markanın karakterini yansıtan zamansız, tescillenebilir ve akılda kalıcı logo tasarımı.
              </p>
            </div>
            <div className="min-w-[180px] flex-1">
              <div className="mb-2.5">
                <span className="inline-block rounded-none bg-white px-2.5 py-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-black">
                  Kurumsal Kimlik
                </span>
              </div>
              <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
                Renk paletleri, tipografi hiyerarşisi, kurumsal evraklar ve kapsamlı marka kılavuzu.
              </p>
            </div>
            <div className="min-w-[180px] flex-1">
              <div className="mb-2.5">
                <span className="inline-block rounded-none bg-white px-2.5 py-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-black">
                  Dijital Vitrin
                </span>
              </div>
              <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
                Sosyal medya, web bannerları ve dijital reklamlar için estetik ve tutarlı görsel dil.
              </p>
            </div>
          </div>

          <hr className="my-[2vw] border-none border-t border-white/50" />

          {/* Satır 2 — 3 Madde */}
          <div className="flex flex-wrap gap-[3vw]">
            <div className="min-w-[180px] flex-1">
              <div className="mb-2.5">
                <span className="inline-block rounded-none bg-white px-2.5 py-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-black">
                  Ambalaj & Etiket
                </span>
              </div>
              <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
                Raf albenisi yüksek ambalaj kurguları, özel kesim etiketler ve 3D ürün giydirmeleri.
              </p>
            </div>
            <div className="min-w-[180px] flex-1">
              <div className="mb-2.5">
                <span className="inline-block rounded-none bg-white px-2.5 py-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-black">
                  Baskı Materyalleri
                </span>
              </div>
              <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
                Katalog, broşür, dergi, fuar stand grafikleri ve premium matbaa baskı hazırlığı.
              </p>
            </div>
            <div className="min-w-[180px] flex-1">
              <div className="mb-2.5">
                <span className="inline-block rounded-none bg-white px-2.5 py-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-black">
                  Tasarım Sistemleri
                </span>
              </div>
              <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
                Ekiplerinizin hızını artıran Figma komponent kütüphaneleri ve tutarlı UI tasarım sistemleri.
              </p>
            </div>
          </div>

          <hr className="my-[2vw] border-none border-t border-white/50" />
          <p className="mt-auto ml-auto max-w-[50ch] text-right text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed">
            Fikirleri estetik, zamansız ve etkileyici görsel deneyimlere dönüştürüyoruz.
          </p>
        </FlowSection>

        {/* =========================================================
            04 — PRODÜKSİYON ÇÖZÜMLERİ
           ========================================================= */}
        <FlowSection
          id="section-production"
          aria-label="Prodüksiyon Çözümleri"
          style={{ backgroundColor: '#F5F0E8', color: '#000' }}
        >
          {/* Her Kartta Sağ Üstte Orijinal Sembol Logo Butonu (Ekstra %20 Büyütüldü - Krem zemin için siyah + gölge) */}
          <button
            type="button"
            onClick={() => setDockOpen((prev) => !prev)}
            aria-label={dockOpen ? "Gezinti Menüsünü Kapat" : "Gezinti Menüsünü Aç"}
            title={dockOpen ? "Gezinti Menüsünü Kapat" : "Gezinti Menüsünü Aç"}
            className="absolute top-6 right-6 sm:top-8 sm:right-8 md:top-10 md:right-10 pointer-events-auto select-none z-30 cursor-pointer group transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none"
          >
            <div className="relative h-28 w-28 sm:h-[138px] sm:w-[138px] md:h-[185px] md:w-[185px] lg:h-[230px] lg:w-[230px]">
              <Image
                src="/logo-white-transparent.png"
                alt="Creasiv Sembol Logo"
                fill
                sizes="(max-width: 768px) 138px, 230px"
                className="object-contain brightness-0 opacity-85 group-hover:opacity-100 transition-all duration-300 drop-shadow-[0_10px_20px_rgba(0,0,0,0.22)] drop-shadow-[0_2px_6px_rgba(0,0,0,0.12)] group-hover:drop-shadow-[0_14px_26px_rgba(0,0,0,0.32)]"
              />
            </div>
          </button>

          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em]">04 — Prodüksiyon Çözümleri</p>
          <hr className="my-[2vw] border-none border-t border-black/60" />
          <div>
            <h2 className="text-[clamp(3.2rem,10.4vw,12.2rem)] font-bold leading-[1] uppercase tracking-tight">
              8K Drone
              <br />
              Kamera
              <br />
              Kurgu
            </h2>
          </div>
          <hr className="my-[2vw] border-none border-t border-black/60" />
          <p className="max-w-[50ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed">
            Profesyonel kamera ve 8K drone çekimleri, marka tanıtım filmleri, mekan & ürün çekimleri ve post-prodüksiyon kurgu hizmetleri.
          </p>
          <hr className="my-[2vw] border-none border-t border-black/60" />

          {/* Satır 1 — 3 Madde */}
          <div className="flex flex-wrap gap-[3vw]">
            <div className="min-w-[180px] flex-1">
              <div className="mb-2.5">
                <span className="inline-block rounded-none bg-black px-2.5 py-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F5F0E8]">
                  8K Drone & FPV
                </span>
              </div>
              <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
                Lisanslı pilotlarımızla geniş açılı sinematik hava perspektifleri ve dinamik FPV uçuşları.
              </p>
            </div>
            <div className="min-w-[180px] flex-1">
              <div className="mb-2.5">
                <span className="inline-block rounded-none bg-black px-2.5 py-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F5F0E8]">
                  Tanıtım Filmleri
                </span>
              </div>
              <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
                Markanızın vizyonunu duyguyla ekrana taşıyan yüksek prodüksiyonlu kurumsal reklam filmleri.
              </p>
            </div>
            <div className="min-w-[180px] flex-1">
              <div className="mb-2.5">
                <span className="inline-block rounded-none bg-black px-2.5 py-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F5F0E8]">
                  Mekan & Mimari
                </span>
              </div>
              <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
                Otel, restoran, fabrika ve ofis mekanlarını en prestijli açılar ve doğru ışıkla ölümsüzleştirme.
              </p>
            </div>
          </div>

          <hr className="my-[2vw] border-none border-t border-black/60" />

          {/* Satır 2 — 3 Madde */}
          <div className="flex flex-wrap gap-[3vw]">
            <div className="min-w-[180px] flex-1">
              <div className="mb-2.5">
                <span className="inline-block rounded-none bg-black px-2.5 py-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F5F0E8]">
                  Stüdyo & Ürün
                </span>
              </div>
              <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
                E-ticaret ve kataloglar için yansıma ve renk doğruluğu kusursuz olan makro ve stüdyo çekimleri.
              </p>
            </div>
            <div className="min-w-[180px] flex-1">
              <div className="mb-2.5">
                <span className="inline-block rounded-none bg-black px-2.5 py-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F5F0E8]">
                  Kurgu & DaVinci
                </span>
              </div>
              <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
                Hollywood standardında DaVinci Resolve renk derecelendirme, dinamik montaj ve ses tasarımı.
              </p>
            </div>
            <div className="min-w-[180px] flex-1">
              <div className="mb-2.5">
                <span className="inline-block rounded-none bg-black px-2.5 py-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F5F0E8]">
                  Motion & VFX
                </span>
              </div>
              <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
                Videolarınıza prestij katan 3D logo animasyonları, ekran grafikleri ve görsel efektler.
              </p>
            </div>
          </div>

          <hr className="my-[2vw] border-none border-t border-black/60" />
          <p className="mt-auto ml-auto max-w-[50ch] text-right text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed">
            En üst düzey sinematik ekipmanlarla hikayenizi en etkileyici şekilde anlatıyoruz.
          </p>
        </FlowSection>

        {/* =========================================================
            05 — BİZİMLE ÇALIŞMAYA HAZIR MISIN?
           ========================================================= */}
        <FlowSection
          id="section-contact"
          aria-label="Bizimle Çalışmaya Hazır Mısın?"
          style={{ backgroundColor: '#ED1C24', color: '#fff' }}
          innerClassName="justify-start gap-4 sm:gap-6 pb-2 sm:pb-3"
        >
          {/* Section ref for scroll-back */}
          <div ref={contactSectionRef} />

          {/* Her Kartta Sağ Üstte Orijinal Sembol Logo Butonu (Ekstra %20 Büyütüldü + Gölgeli) */}
          <button
            type="button"
            onClick={() => setDockOpen((prev) => !prev)}
            aria-label={dockOpen ? "Gezinti Menüsünü Kapat" : "Gezinti Menüsünü Aç"}
            title={dockOpen ? "Gezinti Menüsünü Kapat" : "Gezinti Menüsünü Aç"}
            className="absolute top-6 right-6 sm:top-8 sm:right-8 md:top-10 md:right-10 pointer-events-auto select-none z-30 cursor-pointer group transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none"
          >
            <div className="relative h-28 w-28 sm:h-[138px] sm:w-[138px] md:h-[185px] md:w-[185px] lg:h-[230px] lg:w-[230px]">
              <Image
                src="/logo-white-transparent.png"
                alt="Creasiv Sembol Logo"
                fill
                sizes="(max-width: 768px) 138px, 230px"
                className="object-contain opacity-95 group-hover:opacity-100 transition-all duration-300 drop-shadow-[0_12px_24px_rgba(0,0,0,0.55)] drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)] group-hover:drop-shadow-[0_18px_32px_rgba(0,0,0,0.7)]"
              />
            </div>
          </button>

          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em]">05 — İletişim</p>
          <hr className="my-[2vw] border-none border-t border-white/60" />
          <div>
            <h2 className="text-[clamp(3.2rem,9.6vw,11.2rem)] font-bold leading-[1] uppercase tracking-tight">
              Bizimle
              <br />
              Çalışmaya
              <br />
              Hazır Mısın?
            </h2>
          </div>
          <hr className="my-[2vw] border-none border-t border-white/60" />

          {/* Açıklama Metni, 3D Butonlar ve Form */}
          <div className="flex flex-col gap-3 sm:gap-4 w-full">
            <p className="max-w-[50ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed">
              Aklınızdaki fikri dijitalde gerçeğe dönüştürmek veya markanızı bir üst seviyeye taşımak için bir araya gelelim.
            </p>

            {/* Fark Yarat Butonu */}
            <div className="flex items-center justify-start -ml-2 sm:-ml-3 pt-1">
              <Button3D
                onClick={handleToggleContact}
                isOpen={modalOpen}
                variant="white"
              />
            </div>

            {/* Butona Basınca Beliren Form */}
            <div ref={formAnchorRef}>
              <SectionContactForm
                isOpen={modalOpen}
                onClose={handleCloseContact}
              />
            </div>
          </div>
        </FlowSection>
      </FlowArt>
    </>
  );
}
