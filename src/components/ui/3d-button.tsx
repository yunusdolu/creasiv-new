'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import './3d-button.css';

interface Button3DProps {
  onClick?: () => void;
  className?: string;
  text?: string;
  variant?: 'white' | 'black';
  isOpen?: boolean;
}

export const Button3D: React.FC<Button3DProps> = ({
  onClick,
  className,
  text,
  variant = 'white',
  isOpen = false,
}) => {
  return (
    <div className={cn('btn-3d-container', className)}>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'button-3d-exact',
          variant === 'black' ? 'button-3d-black' : 'button-3d-white',
          isOpen && 'is-pressed'
        )}
        aria-label={isOpen ? 'Kapat' : (text ?? 'Fark Yarat')}
        aria-expanded={isOpen}
      >
        <div className="ambient-glow" aria-hidden="true" />
        <div className="pill-body">
          <span className="btn-text-content">
            {/* Eşzamanlı 3D Silindirik Makaralı Yazı Geçişi (Boşluk kalmaz, aynı anda döner) */}
            <span
              className="relative inline-flex items-center justify-center overflow-hidden h-[34px] min-w-[130px]"
              style={{ perspective: 500 }}
            >
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.span
                    key="label-kapat"
                    initial={{ y: 22, rotateX: -60, opacity: 0 }}
                    animate={{ y: 0, rotateX: 0, opacity: 1 }}
                    exit={{ y: 22, rotateX: -60, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="btn-label absolute whitespace-nowrap"
                  >
                    Kapat
                  </motion.span>
                ) : (
                  <motion.span
                    key="label-fark-yarat"
                    initial={{ y: -22, rotateX: 60, opacity: 0 }}
                    animate={{ y: 0, rotateX: 0, opacity: 1 }}
                    exit={{ y: -22, rotateX: 60, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="btn-label absolute whitespace-nowrap"
                  >
                    {text ?? 'Fark Yarat'}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>

            {/* Eşzamanlı Rotasyonlu İkon Geçişi (Boşluk kalmadan tam merkezde dönüşür) */}
            <span className="relative inline-flex items-center justify-center h-[26px] w-[26px] shrink-0">
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.span
                    key="icon-close"
                    initial={{ rotate: -90, scale: 0, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 90, scale: 0, opacity: 0 }}
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <svg
                      className="btn-arrow-icon"
                      viewBox="0 0 24 24"
                      width="22"
                      height="22"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </motion.span>
                ) : (
                  <motion.span
                    key="icon-arrow"
                    initial={{ rotate: 90, scale: 0, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: -90, scale: 0, opacity: 0 }}
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <svg
                      className="btn-arrow-icon"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <line x1="4" y1="12" x2="20" y2="12" />
                      <polyline points="13 5 20 12 13 19" />
                    </svg>
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          </span>
        </div>
      </button>
    </div>
  );
};

export const Component = Button3D;
export default Button3D;
