import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Blog as BlogItem } from '../../models/blog.model';
import { BlogService } from '../../services/blog';
import { gsap, prefersReducedMotion, registerGsap } from '../../shared/motion/gsap-setup';

const ACCENTS = ['#c93b41', '#e77b30', '#d49a12', '#218768', '#176fae', '#7c4dd8'];

@Component({
  selector: 'app-blog',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class Blog implements OnInit, OnDestroy {
  @ViewChild('root', { static: true }) private root!: ElementRef<HTMLElement>;

  private readonly blogService = inject(BlogService);
  private readonly injector = inject(Injector);
  private heroCtx?: gsap.Context;
  private listCtx?: gsap.Context;

  readonly skeletons = [0, 1, 2, 3, 4, 5];
  readonly blogs = signal<BlogItem[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');
  readonly query = signal('');

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.blogs();

    return this.blogs().filter((b) =>
      `${b.title} ${b.author_name} ${this.plain(b.content)}`.toLowerCase().includes(q),
    );
  });

  readonly featured = computed(() => (this.query().trim() ? null : (this.filtered()[0] ?? null)));

  readonly grid = computed(() => {
    const list = this.filtered();
    return this.query().trim() ? list : list.slice(1);
  });

  constructor() {
    registerGsap();
  }

  ngOnInit(): void {
    this.loadBlogs();
  }

  ngAfterViewInit(): void {
    if (prefersReducedMotion()) return;

    this.heroCtx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .from('.bl-hero__kicker', { autoAlpha: 0, y: 14, duration: 0.6 })
        .from('.bl-word', { yPercent: 115, rotate: 3, duration: 1.1, stagger: 0.12 }, '-=0.3')
        .from(
          '.bl-hero__lead, .bl-search',
          { autoAlpha: 0, y: 18, duration: 0.7, stagger: 0.1 },
          '-=0.7',
        )
        .from(
          '.bl-book',
          { autoAlpha: 0, scale: 0.85, rotate: -4, duration: 1.2, ease: 'expo.out' },
          '-=1',
        );

      gsap.to('.bl-blob--1', {
        x: 80,
        y: 40,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.bl-blob--2', {
        x: -60,
        y: 60,
        duration: 14,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.bl-blob--3', {
        x: 40,
        y: -50,
        duration: 16,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Animated book illustration
      gsap.to('.bl-book__line', {
        strokeDashoffset: 0,
        duration: 1.6,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        stagger: { each: 0.2, repeat: -1 },
      });
      gsap.fromTo(
        '.bl-book__line',
        { strokeDashoffset: 80 },
        {
          strokeDashoffset: 0,
          duration: 1.6,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
          stagger: 0.2,
        },
      );
      gsap.to('.bl-book__page--r', {
        scaleX: 0.9,
        svgOrigin: '210 90',
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.bl-book__orb', {
        y: -12,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.3,
      });
    }, this.root.nativeElement);
  }

  ngOnDestroy(): void {
    this.heroCtx?.revert();
    this.listCtx?.revert();
  }

  async loadBlogs(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const list = await this.blogService.getBlogs();
      this.blogs.set(list);
      afterNextRender(() => this.animateList(), { injector: this.injector });
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Unable to load the journal.');
    } finally {
      this.isLoading.set(false);
    }
  }

  private animateList(): void {
    if (prefersReducedMotion()) return;

    this.listCtx?.revert();
    this.listCtx = gsap.context(() => {
      gsap.from('.bl-feature', {
        autoAlpha: 0,
        y: 60,
        duration: 1,
        ease: 'power4.out',
        scrollTrigger: { trigger: '.bl-feature', start: 'top 88%' },
      });

      gsap.from('.bl-card', {
        autoAlpha: 0,
        y: 60,
        rotate: 1.2,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'transform',
        scrollTrigger: { trigger: '.bl-grid', start: 'top 88%' },
      });

      gsap.to('.bl-feature__img', {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: '.bl-feature',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, this.root.nativeElement);
  }

  onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);

    afterNextRender(
      () => {
        if (prefersReducedMotion()) return;
        gsap.fromTo(
          '.bl-card',
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: 'power2.out',
            clearProps: 'transform',
          },
        );
      },
      { injector: this.injector },
    );
  }

  clearSearch(): void {
    this.query.set('');
  }

  accent(index: number): string {
    return ACCENTS[index % ACCENTS.length];
  }

  resolveImageUrl(path: string | null): string | null {
    return this.blogService.resolveImageUrl(path);
  }

  formatDate(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }

  plain(content: string): string {
    return content
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  excerpt(content: string, max = 160): string {
    const text = this.plain(content);
    return text.length <= max ? text : `${text.slice(0, max).trim()}…`;
  }

  readingTime(content: string): number {
    const words = this.plain(content).split(' ').filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  }

  pad(n: number): string {
    return String(n).padStart(2, '0');
  }
}
