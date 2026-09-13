'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenModal: () => void;
}

const navItems = [
  { label: 'Biz Kimiz', href: '#section-about', tag: '01' },
  { label: 'Yazılım', href: '#section-software', tag: '02' },
  { label: 'Tasarım', href: '#section-design', tag: '03' },
  { label: 'Prodüksiyon', href: '#section-production', tag: '04' },
  { label: 'İletişim', href: '#section-contact', tag: '05' },
];

export default function Navbar({ onOpenModal }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 pt-4 pb-2">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-xl border border-white/10 bg-black/60 px-5 py-3 backdrop-blur-md">
        {/* Brand Logos */}
        <a href="#" className="flex items-center gap-3">
          <div className="relative h-7 w-7">
            <Image
              src="/logo-white-transparent.png"
              alt="Creasiv Emblem"
              fill
              sizes="28px"
              className="object-contain"
              priority
            />
          </div>
          <div className="relative h-6 w-24">
            <Image
              src="/creasiv-logo.png"
              alt="Creasiv"
              fill
              sizes="96px"
              className="object-contain brightness-200 contrast-125"
              priority
            />
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => scrollToSection(e, item.href)}
              className="text-xs font-bold uppercase tracking-wider text-white/75 hover:text-white transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenModal}
            className="rounded-lg bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-[#fd5200] hover:text-white"
          >
            İletişime Geç
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menü"
            className="flex md:hidden h-8 w-8 items-center justify-center text-white"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="mt-2 md:hidden rounded-xl border border-white/10 bg-black/95 p-4 backdrop-blur-xl">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className="flex items-center justify-between text-sm font-bold uppercase text-white/80 py-2 border-b border-white/10"
              >
                <span>{item.label}</span>
                <span className="text-xs text-white/40">{item.tag}</span>
              </a>
            ))}
            <button
              onClick={() => {
                setMobileOpen(false);
                onOpenModal();
              }}
              className="mt-2 rounded-lg bg-[#fd5200] py-3 text-xs font-bold uppercase tracking-wider text-white"
            >
              Projeyi Başlat
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
