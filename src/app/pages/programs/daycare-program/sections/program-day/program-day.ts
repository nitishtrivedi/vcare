import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  OnInit,
  NgZone,
  signal,
  ViewChild,
  OnDestroy,
} from '@angular/core';

import { gsap, prefersReducedMotion, registerGsap } from '../../../../../shared/motion/gsap-setup';

type Tone = 'blue' | 'green' | 'orange';

interface DayBlock {
  label: string;
  minutes: number;
  tone: Tone;
  start: number;
  end: number;
  arc: string;
  mid: { x: number; y: number };
}

const DAY_START = 8 * 60 + 30; // 8:30 AM

const RAW_BLOCKS: Array<{
  label: string;
  minutes: number;
  tone: Tone;
}> = [
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
const GAP_DEG = 0.9;

function polar(r: number, deg: number): { x: number; y: number } {
  const rad = ((deg - 90) * Math.PI) / 180;

  return {
    x: CX + r * Math.cos(rad),
    y: CY + r * Math.sin(rad),
  };
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

const TOTAL = RAW_BLOCKS.reduce((sum, block) => sum + block.minutes, 0);

function formatClock(totalMinutes: number): string {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const hour24 = Math.floor(normalized / 60);
  const minute = normalized % 60;

  const period = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 || 12;

  return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours && remainingMinutes) {
    return `${hours} hr ${remainingMinutes} min`;
  }

  if (hours) {
    return `${hours} hr`;
  }

  return `${remainingMinutes} min`;
}

@Component({
  selector: 'app-program-day',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-day.html',
  styleUrl: './program-day.scss',
})
export class ProgramDay implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('root', { static: true })
  private root!: ElementRef<HTMLElement>;

  private ctx?: gsap.Context;
  private clockInterval?: ReturnType<typeof setInterval>;

  constructor(private readonly zone: NgZone) {
    registerGsap();
  }

  // Build the schedule and SVG arcs only once.
  readonly blocks: DayBlock[] = (() => {
    let cursor = DAY_START;
    let angle = 0;

    return RAW_BLOCKS.map((block) => {
      const span = (block.minutes / TOTAL) * 360;

      const item: DayBlock = {
        ...block,
        start: cursor,
        end: cursor + block.minutes,
        arc: arcPath(angle, angle + span),
        mid: polar((R_OUTER + R_INNER) / 2, angle + span / 2),
      };

      cursor += block.minutes;
      angle += span;

      return item;
    });
  })();

  readonly total = TOTAL;
  readonly totalLabel = formatDuration(TOTAL);
  readonly dayStartLabel = formatClock(DAY_START);
  readonly dayEndLabel = formatClock(DAY_START + TOTAL);

  readonly selectedIndex = signal<number | null>(null);
  readonly hoverIndex = signal<number | null>(null);

  // Hover temporarily takes priority over click selection.
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

  // Real current-time indicator.
  readonly nowAngle = signal<number | null>(null);
  readonly currentTimeLabel = signal('');
  readonly isOutOfHours = signal(true);

  readonly nowTick = computed(() => {
    const angle = this.nowAngle();

    if (angle === null) {
      return null;
    }

    return {
      in: polar(R_INNER - 6, angle),
      out: polar(R_OUTER + 10, angle),
    };
  });

  ngOnInit(): void {
    this.updateNow();

    // One lightweight clock update per minute.
    this.clockInterval = setInterval(() => {
      this.updateNow();
    }, 60_000);
  }

  ngAfterViewInit(): void {
    // Respect accessibility settings.
    if (prefersReducedMotion()) {
      return;
    }

    // Keep GSAP and ScrollTrigger activity outside Angular's zone.
    this.zone.runOutsideAngular(() => {
      this.ctx = gsap.context(() => {
        const entrance = gsap.timeline({
          defaults: {
            ease: 'power3.out',
          },
          scrollTrigger: {
            trigger: this.root.nativeElement,
            start: 'top 72%',
            once: true,
          },
        });

        // Section heading: gentle upward entrance.
        entrance.from(
          '.pd__head',
          {
            autoAlpha: 0,
            y: 20,
            duration: 0.65,
          },
          0,
        );

        // Dial: subtle scale and fade, without moving its individual arcs.
        entrance.from(
          '.pd__dial-wrap',
          {
            autoAlpha: 0,
            y: 22,
            scale: 0.97,
            duration: 0.8,
          },
          0.05,
        );

        // Detail card: soft entrance.
        entrance.from(
          '.pd__detail',
          {
            autoAlpha: 0,
            y: 12,
            scale: 0.98,
            duration: 0.5,
            ease: 'power2.out',
          },
          0.28,
        );

        // List: staggered fade only.
        // No transforms, so CSS hover effects continue working.
        entrance.from(
          '.pd-item',
          {
            autoAlpha: 0,
            duration: 0.32,
            stagger: 0.035,
            ease: 'power1.out',
          },
          0.12,
        );

        // Footer note.
        entrance.from(
          '.pd__foot',
          {
            autoAlpha: 0,
            y: 8,
            duration: 0.4,
          },
          0.5,
        );
      }, this.root.nativeElement);
    });
  }

  private updateNow(): void {
    // Explicitly use IST rather than the visitor's device timezone.
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(new Date());

    const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? 0);

    const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? 0);

    const minutesNow = hour * 60 + minute;
    const offset = minutesNow - DAY_START;

    this.currentTimeLabel.set(formatClock(minutesNow));

    // Operating window: 8:30 AM inclusive, 6:00 PM exclusive.
    const inHours = offset >= 0 && offset < TOTAL;

    this.isOutOfHours.set(!inHours);

    if (!inHours) {
      this.nowAngle.set(null);
      return;
    }

    // 0 degrees = 8:30 AM; 360 degrees = 6:00 PM.
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

    const element = this.root.nativeElement.querySelector<HTMLElement>(`[data-index="${next}"]`);

    element?.focus();
  }

  formatBlockTime(block: DayBlock): string {
    return `${formatClock(block.start)} – ${formatClock(block.end)}`;
  }

  formatBlockDuration(block: DayBlock): string {
    return formatDuration(block.minutes);
  }

  ngOnDestroy(): void {
    if (this.clockInterval !== undefined) {
      clearInterval(this.clockInterval);
      this.clockInterval = undefined;
    }

    // Remove tweens and ScrollTriggers created by this component.
    this.ctx?.revert();
  }
}
