export const MOTION = {
  fadeUp: { duration: 0.8, ease: 'power3.out', y: 40 },
  slideLeft: { duration: 0.8, ease: 'power3.out', x: -60 },
  slideRight: { duration: 0.8, ease: 'power3.out', x: 60 },
  zoomIn: { duration: 0.8, ease: 'power3.out', scale: 0.92 },
  pop: { duration: 0.6, ease: 'back.out(1.6)', scale: 0.6 },
} as const;

export type RevealType = 'fade-up' | 'fade-in' | 'zoom-in' | 'slide-left' | 'slide-right' | 'pop';
