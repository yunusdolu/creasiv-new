"use client";
import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  MotionValue,
  Variants,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";

export interface FloatingDockItem {
  title: string;
  icon: React.ReactNode;
  href: string;
  onClick?: () => void;
  target?: string;
}

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.045, // Seri, akıcı basamaklı açılış
      delayChildren: 0.01,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -32, // Yukarıdan aşağıya doğru (alta doğru) açılır
    scale: 0.6,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 450,
      damping: 26,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.6,
    transition: {
      duration: 0.15,
      ease: "easeInOut",
    },
  },
};

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
  isOpen = false,
  onClose,
}: {
  items: FloatingDockItem[];
  desktopClassName?: string;
  mobileClassName?: string;
  isOpen?: boolean;
  onClose?: () => void;
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} isOpen={isOpen} />
      <FloatingDockMobile items={items} className={mobileClassName} isOpen={isOpen} onClose={onClose} />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
  isOpen = false,
  onClose,
}: {
  items: FloatingDockItem[];
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}) => {
  const itemClassName =
    "relative flex h-14 w-14 items-center justify-center rounded-full bg-white hover:bg-neutral-100 border border-neutral-200/80 shadow-2xl shadow-black/25 text-neutral-900 transition-colors";

  const content = (item: FloatingDockItem) => (
    <>
      {/* Sadece mobilde: ikonun solunda her zaman görünen açıklama etiketi */}
      <span className="absolute right-full top-1/2 -translate-y-1/2 mr-3 whitespace-nowrap rounded-lg border border-neutral-200/90 bg-white px-3 py-1.5 text-sm font-semibold tracking-wide text-neutral-900 shadow-xl shadow-black/25">
        {item.title}
      </span>
      <div className="h-7 w-7 flex items-center justify-center text-neutral-900 drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.3)]">{item.icon}</div>
    </>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="dock-mobile-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={onClose}
          aria-hidden="true"
          className="fixed inset-0 -z-10 sm:hidden bg-black/40 pointer-events-auto"
        />
      )}
      {isOpen && (
        <motion.div
          key="dock-mobile-items"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className={cn(
            "flex sm:hidden flex-col items-center gap-3 py-2 w-full pointer-events-auto",
            className,
          )}
        >
          {items.map((item) => (
            <motion.div
              key={item.title}
              variants={itemVariants}
              className="flex w-full items-center justify-center"
            >
              {item.onClick ? (
                <button
                  type="button"
                  onClick={item.onClick}
                  aria-label={item.title}
                  className={itemClassName}
                >
                  {content(item)}
                </button>
              ) : (
                <a
                  href={item.href}
                  target={item.target}
                  rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
                  aria-label={item.title}
                  className={itemClassName}
                >
                  {content(item)}
                </a>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
  isOpen = false,
}: {
  items: FloatingDockItem[];
  className?: string;
  isOpen?: boolean;
}) => {
  let mouseY = useMotionValue(Infinity);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onMouseMove={(e) => mouseY.set(e.clientY)}
          onMouseLeave={() => mouseY.set(Infinity)}
          className={cn(
            "hidden sm:flex flex-col items-center gap-4 py-2 w-full pointer-events-auto",
            className,
          )}
        >
          {items.map((item) => (
            <motion.div
              key={item.title}
              variants={itemVariants}
              className="flex w-full items-center justify-center"
            >
              <IconContainer mouseY={mouseY} key={item.title} {...item} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

function IconContainer({
  mouseY,
  title,
  icon,
  href,
  onClick,
  target,
}: FloatingDockItem & {
  mouseY: MotionValue;
}) {
  let ref = useRef<HTMLDivElement>(null);

  let distance = useTransform(mouseY, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? {
      y: 0,
      height: 0,
    };

    return val - bounds.y - bounds.height / 2;
  });

  let widthTransform = useTransform(distance, [-150, 0, 150], [66, 98, 66]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [66, 98, 66]);

  let widthTransformIcon = useTransform(distance, [-150, 0, 150], [36, 54, 36]);
  let heightTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [36, 54, 36],
  );

  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 180,
    damping: 14,
  });
  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 180,
    damping: 14,
  });

  let widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 180,
    damping: 14,
  });
  let heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 180,
    damping: 14,
  });

  const [hovered, setHovered] = useState(false);

  const innerContent = (
    <motion.div
      ref={ref}
      style={{ width, height }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex aspect-square items-center justify-center rounded-full bg-white hover:bg-neutral-50 backdrop-blur-md border border-neutral-200/80 shadow-[0_12px_32px_-4px_rgba(0,0,0,0.35)] text-neutral-900 transition-colors shrink-0"
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: 10, y: "-50%" }}
            animate={{ opacity: 1, x: 0, y: "-50%" }}
            exit={{ opacity: 0, x: 2, y: "-50%" }}
            className="absolute right-full top-1/2 mr-3 w-fit rounded-lg border border-neutral-200/90 bg-white/95 backdrop-blur-md px-3 py-1.5 text-xs font-semibold tracking-wide whitespace-pre text-neutral-900 pointer-events-none shadow-xl shadow-black/25"
          >
            {title}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        style={{ width: widthIcon, height: heightIcon }}
        className="flex items-center justify-center text-neutral-900 drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
      >
        {icon}
      </motion.div>
    </motion.div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={title}
        className="flex w-full items-center justify-center cursor-pointer focus:outline-none"
      >
        {innerContent}
      </button>
    );
  }

  return (
    <a
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      aria-label={title}
      className="flex w-full items-center justify-center cursor-pointer focus:outline-none"
    >
      {innerContent}
    </a>
  );
}

export default FloatingDock;
