import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  OnDestroy,
  signal,
  ViewChild,
} from '@angular/core';
import { gsap, prefersReducedMotion, registerGsap } from '../../../../../shared/motion/gsap-setup';

type Tone = 'blue' | 'green' | 'orange';

interface DayBlock {
  label: string;
  minutes: number;
  tone: Tone;
  start: number; // minutes from the start of the day
  end: number;
  arc: string; // precomputed SVG path for the segment
  mid: { x: number; y: number }; // label anchor
}

const DAY_START = 8 * 60 + 30; // 8:30 AM
const RAW_BLOCKS: Array<{ label: string; minutes: number; tone: Tone }> = [
  { label: 'Welcome & circle time', minutes: 30, tone: 'blue' },
  { label: 'Jolly Phonics & guided activities', minutes: 30, tone: 'green' },
  { label: 'Breakfast time', minutes: 15, tone: 'orange' },
  { label: 'Art and craft', minutes: 45, tone: 'blue' },
  { label: 'Fun with mathematics', minutes: 90, tone: 'green' },
  { label: 'Lunch time', minutes: 30, tone: 'orange' },
  { label: 'Theme-based storytelling', minutes: 30, tone: 'blue' },
  { label: 'Nap time', minutes: 90, tone: 'green' },
  { label: 'Quiet play & transition', minutes: 15, tone: 'orange' },
  { label: 'Milk time', minutes: 15, tone: 'blue' },
  { label: 'Brainy way! Computer education', minutes: 60, tone: 'green' },
  { label: 'Theme-based physical activities', minutes: 30, tone: 'orange' },
  { label: 'Snack time', minutes: 30, tone: 'blue' },
  { label: 'Theme-based moral education', minutes: 30, tone: 'green' },
  { label: 'Life skills', minutes: 30, tone: 'orange' },
];

const CX = 200;
const CY = 200;
const R_OUTER = 180;
const R_INNER = 128;
const GAP_DEG = 0.9; // visual gap between segments

function polar(r: number, deg: number): { x: number; y: number } {
  const rad = ((deg - 90) * Math.PI) / 180; // 0 deg = 12 o'clock
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

function arcPath(startDeg: number, endDeg: number): string {
  const s1 = polar(R_OUTER, startDeg + GAP_DEG / 2);
  const e1 = polar(R_OUTER, endDeg - GAP_DEG / 2);
  const s2 = polar(R_INNER, endDeg - GAP_DEG / 2);
  const e2 = polar(R_INNER, startDeg + GAP_DEG / 2);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${s1.x.toFixed(2)} ${s1.y.toFixed(2)}`,
    `A ${R_OUTER} ${R_OUTER} 0 ${large} 1 ${e1.x.toFixed(2)} ${e1.y.toFixed(2)}`,
    `L ${s2.x.toFixed(2)} ${s2.y.toFixed(2)}`,
    `A ${R_INNER} ${R_INNER} 0 ${large} 0 ${e2.x.toFixed(2)} ${e2.y.toFixed(2)}`,
    'Z',
  ].join(' ');
}

const TOTAL = RAW_BLOCKS.reduce((sum, b) => sum + b.minutes, 0);

function formatClock(totalMinutes: number): string {
  const h24 = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  const period = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h && m) return `${h} hr ${m} min`;
  if (h) return `${h} hr`;
  return `${m} min`;
}

@Component({
  selector: 'app-program-day',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-day.html',
  styleUrl: './program-day.scss',
})
export class ProgramDay implements AfterViewInit, OnDestroy {
  @ViewChild('root', { static: true }) private root!: ElementRef<HTMLElement>;
  @ViewChild('needle', { static: false }) private needle?: ElementRef<SVGGElement>;

  private ctx?: gsap.Context;
  private scrollRef?: gsap.core.Tween;

  // Build the schedule once, with angles and label anchors.
  readonly blocks: DayBlock[] = (() => {
    let cursor = DAY_START;
    let angle = 0;
    return RAW_BLOCKS.map((b) => {
      const span = (b.minutes / TOTAL) * 360;
      const block: DayBlock = {
        ...b,
        start: cursor,
        end: cursor + b.minutes,
        arc: arcPath(angle, angle + span),
        mid: polar((R_OUTER + R_INNER) / 2, angle + span / 2),
      };
      cursor += b.minutes;
      angle += span;
      return block;
    });
  })();

  readonly total = TOTAL;
  readonly totalLabel = formatDuration(TOTAL);
  readonly dayStartLabel = formatClock(DAY_START);
  readonly dayEndLabel = formatClock(DAY_START + TOTAL);

  readonly selectedIndex = signal<number | null>(null);
  readonly hoverIndex = signal<number | null>(null);

  // The block being previewed: hover wins over pinned selection.
  readonly activeIndex = computed(() => this.hoverIndex() ?? this.selectedIndex() ?? 0);
  readonly active = computed(() => this.blocks[this.activeIndex()]);
  readonly activeShare = computed(() => Math.round((this.active().minutes / TOTAL) * 100));
  readonly activeDuration = computed(() => formatDuration(this.active().minutes));
  readonly activeRange = computed(
    () => `${formatClock(this.active().start)} – ${formatClock(this.active().end)}`,
  );

  readonly liveText = computed(
    () => `${this.active().label}, ${this.activeRange()}, ${this.activeDuration()}`,
  );

  // "Now" marker: placed only if the current clock time is inside the day.
  readonly nowAngle = signal<number | null>(null);
  readonly nowPoint = computed(() => {
    const a = this.nowAngle();
    return a === null ? null : polar((R_OUTER + R_INNER) / 2 + 0, a);
  });
  readonly nowTick = computed(() => {
    const a = this.nowAngle();
    return a === null ? null : { in: polar(R_INNER - 6, a), out: polar(R_OUTER + 10, a) };
  });

  ngAfterViewInit(): void {
    this.updateNow();

    if (prefersReducedMotion()) {
      return;
    }

    this.ctx = gsap.context(() => {
      gsap.set('.pd-arc', { autoAlpha: 0, scale: 0.92, transformOrigin: '200px 200px' });

      gsap.to('.pd-arc', {
        autoAlpha: 1,
        scale: 1,
        duration: 0.9,
        ease: 'back.out(1.4)',
        stagger: { each: 0.05, from: 'start' },
        scrollTrigger: {
          trigger: this.root.nativeElement,
          start: 'top 70%',
          once: true,
        },
      });

      gsap.from('.pd-item', {
        autoAlpha: 0,
        x: 18,
        duration: 0.6,
        stagger: 0.05,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: this.root.nativeElement,
          start: 'top 65%',
          once: true,
        },
      });

      // Needle sweeps around the dial as the section scrolls through the viewport.
      if (this.needle) {
        gsap.fromTo(
          this.needle.nativeElement,
          { rotation: 0, transformOrigin: '200px 200px' },
          {
            rotation: 360,
            ease: 'none',
            scrollTrigger: {
              trigger: this.root.nativeElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8,
            },
          },
        );
      }
    }, this.root.nativeElement);
  }

  private updateNow(): void {
    const now = new Date();
    const minutesNow = now.getHours() * 60 + now.getMinutes();
    const offset = minutesNow - DAY_START;

    if (offset < 0 || offset > TOTAL) {
      this.nowAngle.set(null);
      return;
    }
    this.nowAngle.set((offset / TOTAL) * 360);
  }

  select(index: number): void {
    this.selectedIndex.set(index);
  }

  preview(index: number | null): void {
    this.hoverIndex.set(index);
  }

  isActive(index: number): boolean {
    return this.activeIndex() === index;
  }

  // Keyboard: arrows and Home/End move through the schedule.
  onListKeydown(event: KeyboardEvent, index: number): void {
    const last = this.blocks.length - 1;
    let next: number | null = null;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        next = Math.min(index + 1, last);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        next = Math.max(index - 1, 0);
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = last;
        break;
      default:
        return;
    }

    event.preventDefault();
    this.select(next);
    const el = this.root.nativeElement.querySelector<HTMLElement>(`[data-index="${next}"]`);
    el?.focus();
  }
  formatBlockTime(block: DayBlock): string {
    return `${formatClock(block.start)} – ${formatClock(block.end)}`;
  }

  formatBlockDuration(block: DayBlock): string {
    return formatDuration(block.minutes);
  }
  ngOnDestroy(): void {
    this.scrollRef?.kill();
    this.ctx?.revert();
  }
}
