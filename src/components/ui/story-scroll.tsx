'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  // Mobil tarayıcıda adres çubuğu açılıp kapanınca pin konumlarının zıplamasını önler
  ScrollTrigger.config({ ignoreMobileResize: true });
}

function cx(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(' ');
}

export interface FlowSectionProps {
  className?: string;
  innerClassName?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  'aria-label'?: string;
  id?: string;
}

export const FlowSection: React.FC<FlowSectionProps> = ({
  className,
  innerClassName,
  style = {},
  children,
  'aria-label': ariaLabel,
  id,
}) => (
  <section
    id={id}
    data-flow-section
    aria-label={ariaLabel}
    className={cx(
      // overflow: clip (hidden değil): hidden elemanı kaydırma kabı yapar ve CSS view() zaman çizelgesini bozar
      // 100lvh: Safari 26'da sayfa yüzen çubukların arkasına uzanır; svh kısa kalıp alttaki kartı gösteriyordu
      'relative min-h-[100lvh] w-full overflow-hidden [overflow:clip]',
      className,
    )}
  >
    <div
      data-flow-inner
      className={cx(
        'flow-art-container relative flex min-h-[100lvh] w-full flex-col gap-6 px-[4vw] pt-[clamp(2rem,8vw,4vw)]',
        innerClassName?.includes('pb-') ? '' : 'pb-[4vw]',
        innerClassName || 'justify-between',
        'will-change-transform',
      )}
      style={{ transformOrigin: 'bottom left', ...style }}
    >
      {children}
    </div>
  </section>
);

export interface FlowArtProps {
  children: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}

const childCount = (children: React.ReactNode) => React.Children.count(children);

const FlowArt: React.FC<FlowArtProps> = ({
  children,
  className,
  'aria-label': ariaLabel = 'Story scroll',
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const tintRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // iOS Safari alt araç çubuğu rengi: alttaki şeridi (globals.css → .safari-tint) o an ekranın altını
  // kaplayan bölümün rengine boyar. Renk sadece bölüm değişince yazılır; kaydırmada her karede iş yapılmaz.
  useEffect(() => {
    const tint = tintRef.current;
    const container = containerRef.current;
    if (!tint || !container || getComputedStyle(tint).display === 'none') return;

    const sections = Array.from(container.querySelectorAll<HTMLElement>('[data-flow-section]'));
    const colors = sections.map((section) => {
      const inner = section.querySelector<HTMLElement>('.flow-art-container');
      return inner ? getComputedStyle(inner).backgroundColor : '';
    });

    let current = -1;
    let ticking = false;

    const update = () => {
      ticking = false;
      const getTop = (window as any).creasivGetSectionTop as ((id: string) => number) | undefined;
      // Yeni bölüm ekran yüksekliğinin ~%55'i kadar girince renge geç: dönerek gelen kart ancak o noktada
      // alt kenarın çoğunu kaplıyor (daha erken geçişte önceki bölümün altında ince bir çizgi görünüyordu)
      const threshold = window.scrollY + window.innerHeight * 0.45;
      let active = 0;
      sections.forEach((section, i) => {
        const top = getTop && section.id ? getTop(section.id) : section.offsetTop;
        if (threshold >= top) active = i;
      });
      if (active !== current && colors[active]) {
        current = active;
        tint.style.backgroundColor = colors[active];
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    ScrollTrigger.addEventListener('refresh', update);
    return () => {
      window.removeEventListener('scroll', onScroll);
      ScrollTrigger.removeEventListener('refresh', update);
    };
  }, []);

  useGSAP(
    () => {
      if (!containerRef.current || reducedMotion) return;

      const sections = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>('[data-flow-section]'),
      );
      if (sections.length === 0) return;

      const triggers: ScrollTrigger[] = [];

      // CSS scroll-driven animation desteği (Chrome/Android 115+, Safari 26+). Yoksa GSAP ile aynı efekt.
      const useCssScrollTimeline =
        CSS.supports('animation-timeline: view()') && CSS.supports('overflow: clip');
      const cssAnimated: HTMLElement[] = [];

      sections.forEach((section, i) => {
        gsap.set(section, { zIndex: i + 1 });

        const inner = section.querySelector<HTMLElement>('.flow-art-container');
        if (!inner) return;

        if (i > 0) {
          if (useCssScrollTimeline) {
            // Dönüşü tarayıcıya bırak (globals.css → .flow-rotate-in): kaydırmayla birlikte ekran kartında,
            // ekranın yenileme hızında (120Hz) çalışır; JS her karede transform yazmaz
            inner.classList.add('flow-rotate-in');
            cssAnimated.push(inner);
          } else {
            gsap.set(inner, { rotation: 30, transformOrigin: 'bottom left' });
            const tween = gsap.to(inner, {
              rotation: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'top 25%',
                scrub: true,
              },
            });
            if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
          }
        }

        if (i < sections.length - 1) {
          triggers.push(
            ScrollTrigger.create({
              id: section.id || `flow-section-${i}`,
              trigger: section,
              start: 'bottom bottom',
              end: 'bottom top',
              pin: true,
              pinSpacing: false,
            }),
          );
        }

        // Her bölümün EN ÜST noktasına ('top top') hizalanmasını sağlayan navigasyon tetikleyicisi
        triggers.push(
          ScrollTrigger.create({
            id: `nav-${section.id || i}`,
            trigger: section,
            start: 'top top',
          }),
        );
      });

      ScrollTrigger.refresh();

      // Dışarıdan butonlarla çağrıldığında her bölümün EN ÜST kısmını ('top top') tam hizalayan kaydırma fonksiyonu
      (window as any).creasivScrollTo = (id: string) => {
        if (id === 'section-about') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        const navTrigger = triggers.find((t) => t.vars.id === `nav-${id}`);
        if (navTrigger && typeof navTrigger.start === 'number') {
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          const targetY = Math.min(Math.max(0, navTrigger.start), maxScroll);
          window.scrollTo({ top: targetY, behavior: 'smooth' });
          return;
        }

        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };

      (window as any).creasivGetSectionTop = (id: string) => {
        if (id === 'section-about') return 0;
        const navTrigger = triggers.find((t) => t.vars.id === `nav-${id}`);
        if (navTrigger && typeof navTrigger.start === 'number') {
          return navTrigger.start;
        }
        const el = document.getElementById(id);
        return el ? el.offsetTop : 0;
      };

      return () => {
        triggers.forEach((t) => t.kill());
        cssAnimated.forEach((el) => el.classList.remove('flow-rotate-in'));
        delete (window as any).creasivScrollTo;
        delete (window as any).creasivGetSectionTop;
      };
    },
    { scope: containerRef, dependencies: [childCount(children), reducedMotion] },
  );

  return (
    <main
      ref={containerRef}
      aria-label={ariaLabel}
      className={cx('w-full overflow-x-hidden [overflow-x:clip]', className)}
    >
      {children}
      <div ref={tintRef} className="safari-tint" aria-hidden="true" />
    </main>
  );
};

export default FlowArt;
