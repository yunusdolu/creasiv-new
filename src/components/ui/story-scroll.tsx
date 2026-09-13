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
    className={cx('relative min-h-svh w-full overflow-hidden', className)}
  >
    <div
      data-flow-inner
      className={cx(
        'flow-art-container relative flex min-h-svh w-full flex-col gap-6 px-[4vw] pt-[clamp(2rem,8vw,4vw)]',
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
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useGSAP(
    () => {
      if (!containerRef.current || reducedMotion) return;

      const sections = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>('[data-flow-section]'),
      );
      if (sections.length === 0) return;

      const triggers: ScrollTrigger[] = [];

      sections.forEach((section, i) => {
        gsap.set(section, { zIndex: i + 1 });

        const inner = section.querySelector<HTMLElement>('.flow-art-container');
        if (!inner) return;

        if (i > 0) {
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
      className={cx('w-full overflow-x-hidden', className)}
    >
      {children}
    </main>
  );
};

export default FlowArt;
