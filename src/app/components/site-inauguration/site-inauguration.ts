import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  signal,
} from '@angular/core';

type InaugurationPhase = 'curtain' | 'text' | 'ribbon' | 'scissors' | 'ready' | 'cutting' | 'done';

interface ConfettiPiece {
  id: number;
  left: number;
  top: number;
  width: number;
  height: number;
  color: string;
  delay: number;
  duration: number;
  drift: string;
  rotation: string;
  scale: number;
  spin: string;
  side: 'top' | 'left' | 'right';
}
const CONFETTI_COLORS = ['#EB2027', '#F69220', '#FBED21', '#3BB44A', '#006FB9'];

@Component({
  selector: 'app-site-inauguration',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './site-inauguration.html',
  styleUrl: './site-inauguration.scss',
})
export class SiteInauguration implements OnInit, AfterViewInit, OnDestroy {
  @Output()
  finished = new EventEmitter<void>();

  @ViewChild('ceremony')
  private ceremony?: ElementRef<HTMLElement>;

  readonly phase = signal<InaugurationPhase>('curtain');

  readonly showSkip = signal(false);

  readonly showConfetti = signal(false);

  readonly isDragging = signal(false);

  readonly hasCut = signal(false);

  readonly scissorX = signal(0);

  readonly scissorY = signal(0);

  // readonly confettiPieces: ConfettiPiece[] = Array.from({ length: 64 }, (_, index) => ({
  //   id: index,

  //   left: Math.random() * 100,

  //   color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],

  //   delay: Math.random() * 700,

  //   duration: 2600 + Math.random() * 1400,

  //   drift: `${Math.random() * 300 - 150}px`,

  //   rotation: `${Math.random() * 900 - 450}deg`,
  // }));

  readonly confettiPieces: ConfettiPiece[] = Array.from({ length: 240 }, (_, index) => {
    const random = Math.random();

    let side: 'top' | 'left' | 'right' = 'top';

    /*
     * Most pieces form the massive
     * top-to-bottom shower.
     *
     * Some pieces are emitted from
     * the left and right edges for
     * a much bigger celebration.
     */

    if (index < 24) {
      side = 'left';
    } else if (index < 48) {
      side = 'right';
    }

    return {
      id: index,

      /*
       * Top shower:
       * distributed over the ENTIRE screen.
       */
      left: side === 'left' ? -2 : side === 'right' ? 102 : Math.random() * 100,

      /*
       * Slightly varied starting heights.
       * This prevents everything looking
       * like one synchronized curtain.
       */
      top: side === 'top' ? -8 - Math.random() * 18 : 24 + Math.random() * 42,

      width: 4 + Math.random() * 8,

      height: 7 + Math.random() * 15,

      color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],

      /*
       * Randomized delay creates a dense,
       * natural shower rather than one
       * synchronized wave.
       */
      delay: Math.random() * 650,

      /*
       * Exactly 3 seconds.
       */
      duration: 3000,

      drift: `${Math.random() * 220 - 110}px`,

      rotation: `${Math.random() * 1440 - 720}deg`,

      scale: 0.75 + Math.random() * 0.7,

      spin: `${360 + Math.random() * 720}deg`,

      side,
    };
  });
  private timers: ReturnType<typeof setTimeout>[] = [];

  private pointerOffsetX = 0;
  private pointerOffsetY = 0;

  private cutTriggered = false;

  private readonly prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  ngOnInit(): void {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }

    /*
     * ========================================================
     * OPENING TIMELINE
     *
     * 0.9s   -> curtains begin moving
     * 2.8s   -> text is visible
     * 5.6s   -> ribbon appears
     * 8.4s   -> scissors appear
     * 12s    -> scissors become draggable
     * ========================================================
     */

    if (this.prefersReducedMotion) {
      this.phase.set('ready');
      this.showSkip.set(true);

      return;
    }

    this.timers.push(
      setTimeout(() => {
        this.phase.set('text');
      }, 900),
    );

    this.timers.push(
      setTimeout(() => {
        this.phase.set('ribbon');
      }, 5600),
    );

    this.timers.push(
      setTimeout(() => {
        this.phase.set('scissors');
      }, 8400),
    );

    this.timers.push(
      setTimeout(() => {
        this.phase.set('ready');
      }, 12000),
    );

    this.timers.push(
      setTimeout(() => {
        this.showSkip.set(true);
      }, 3000),
    );
  }

  ngAfterViewInit(): void {
    const stage = this.ceremony?.nativeElement;

    if (!stage) {
      return;
    }

    const rect = stage.getBoundingClientRect();

    /*
     * Scissors start at lower-right.
     */
    this.scissorX.set(rect.width * 0.77);

    this.scissorY.set(rect.height * 0.66);
  }

  ngOnDestroy(): void {
    this.clearTimers();

    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  // ==========================================================
  // START DRAGGING
  // ==========================================================

  startDragging(event: PointerEvent): void {
    if (this.phase() !== 'ready' || this.hasCut() || !this.ceremony) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const stage = this.ceremony.nativeElement;

    const rect = stage.getBoundingClientRect();

    /*
     * Preserve exact grab point.
     * This stops the scissors from jumping.
     */
    this.pointerOffsetX = event.clientX - rect.left - this.scissorX();

    this.pointerOffsetY = event.clientY - rect.top - this.scissorY();

    this.isDragging.set(true);

    const element = event.currentTarget as HTMLElement;

    try {
      element.setPointerCapture(event.pointerId);
    } catch {
      // Safe fallback.
    }
  }

  // ==========================================================
  // DRAGGING
  // ==========================================================

  dragScissors(event: PointerEvent): void {
    if (!this.isDragging() || this.hasCut() || !this.ceremony) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const stage = this.ceremony.nativeElement;

    const rect = stage.getBoundingClientRect();

    const padding = 35;

    let x = event.clientX - rect.left - this.pointerOffsetX;

    let y = event.clientY - rect.top - this.pointerOffsetY;

    /*
     * Keep scissors inside ceremony.
     */
    x = Math.max(padding, Math.min(rect.width - padding, x));

    y = Math.max(padding, Math.min(rect.height - padding, y));

    this.scissorX.set(x);
    this.scissorY.set(y);

    /*
     * Magnetic attraction near
     * ribbon cutting position.
     */
    const targetX = rect.width / 2;

    const targetY = rect.height * 0.51;

    const distance = Math.sqrt(Math.pow(x - targetX, 2) + Math.pow(y - targetY, 2));

    if (distance < 75) {
      this.scissorX.set(targetX);

      this.scissorY.set(targetY);
    }
  }

  // ==========================================================
  // END DRAGGING
  // ==========================================================

  stopDragging(): void {
    if (!this.isDragging()) {
      return;
    }

    this.isDragging.set(false);

    if (this.hasCut() || !this.ceremony) {
      return;
    }

    const stage = this.ceremony.nativeElement;

    const rect = stage.getBoundingClientRect();

    const targetX = rect.width / 2;

    const targetY = rect.height * 0.51;

    const distance = Math.sqrt(
      Math.pow(this.scissorX() - targetX, 2) + Math.pow(this.scissorY() - targetY, 2),
    );

    /*
     * Reasonable tolerance around centre.
     */
    if (distance <= 85) {
      this.performCut();
    }
  }

  // ==========================================================
  // KEYBOARD
  // ==========================================================

  keyboardCut(): void {
    if (this.phase() !== 'ready' || this.hasCut()) {
      return;
    }

    this.performCut();
  }

  // ==========================================================
  // CUT
  // ==========================================================

  private performCut(): void {
    if (this.cutTriggered) {
      return;
    }

    this.cutTriggered = true;

    /*
     * Snap scissors exactly to centre.
     */
    if (this.ceremony) {
      const rect = this.ceremony.nativeElement.getBoundingClientRect();

      this.scissorX.set(rect.width / 2);

      this.scissorY.set(rect.height * 0.51);
    }

    /*
     * This starts:
     *
     * 1. blades close
     * 2. flash
     * 3. ribbon halves separate
     * 4. bow drops
     */
    this.phase.set('cutting');

    this.hasCut.set(true);

    /*
     * Confetti comes after the actual
     * cutting motion.
     */
    this.timers.push(
      setTimeout(() => {
        this.showConfetti.set(true);
      }, 900),
    );

    /*
     * Let the visitor see the
     * completed opening.
     */
    this.timers.push(
      setTimeout(() => {
        this.phase.set('done');
      }, 4300),
    );

    /*
     * Finally reveal the website.
     */
    this.timers.push(
      setTimeout(() => {
        this.finish();
      }, 5600),
    );
  }

  // ==========================================================
  // SKIP
  // ==========================================================

  skip(): void {
    this.finish();
  }

  // ==========================================================
  // FINISH
  // ==========================================================

  private finish(): void {
    this.clearTimers();

    this.finished.emit();
  }

  private clearTimers(): void {
    this.timers.forEach((timer) => clearTimeout(timer));

    this.timers = [];
  }
}
