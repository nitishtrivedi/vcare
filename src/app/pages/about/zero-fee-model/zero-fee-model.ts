import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WaveDivider } from '../../../components/wave-divider/wave-divider';
import { gsap, prefersReducedMotion, registerGsap } from '../../../shared/motion/gsap-setup';

interface HeroStat {
  value: string;
  label: string;
}

interface PromisePoint {
  title: string;
  description: string;
  accent: string;
  icon: 'no-fee' | 'no-monthly' | 'no-hidden' | 'complete';
}

interface JourneyStep {
  number: string;
  title: string;
  description: string;
  tags?: string[];
}

interface TrustCard {
  title: string;
  accent: string;
  points: string[];
  icon: 'legal' | 'asset' | 'exit';
}

interface ComparisonRow {
  traditional: string;
  vcare: string;
}

@Component({
  selector: 'app-zero-fee-model',
  imports: [RouterLink, WaveDivider],
  templateUrl: './zero-fee-model.html',
  styleUrl: './zero-fee-model.scss',
})
export class ZeroFeeModel implements AfterViewInit, OnDestroy {
  @ViewChild('pageRoot', { static: true }) private pageRoot!: ElementRef<HTMLElement>;

  private motionContext: ReturnType<typeof gsap.context> | null = null;

  readonly heroStats: HeroStat[] = [
    { value: 'No Registration Fees', label: 'Worry-free education' },
    { value: 'School Kits Delivered', label: 'Without ANY Charge' },
    { value: '4 Years', label: 'Playgroup → Senior KG' },
    { value: '₹0', label: 'Monthly tuition, ever' },
  ];

  readonly promises: PromisePoint[] = [
    {
      title: 'No Admission Fee',
      description: 'The admission fees under this model is entirely upto us!.',
      accent: '#EB2027',
      icon: 'no-fee',
    },
    {
      title: 'No Monthly Fee',
      description: 'Zero recurring tuition for the entire journey.',
      accent: '#F69220',
      icon: 'no-monthly',
    },
    {
      title: 'No Hidden Charges',
      description: 'What you agree to, is what you pay — nothing more.',
      accent: '#3BB44A',
      icon: 'no-hidden',
    },
    {
      title: 'Complete Learning Program',
      description: 'Full access to curriculum, facilities, materials and trained educators.',
      accent: '#006FB9',
      icon: 'complete',
    },
  ];

  readonly journeySteps: JourneyStep[] = [
    {
      number: '01',
      title: 'Admission',
      description:
        'Visit VCare Campus, lets have a discussion around our wonderful ZERO Fees model and enrol your child!',
    },
    {
      number: '02',
      title: 'The 4-Year Journey',
      description:
        'Your child progresses through every stage with zero monthly or annual tuition fees along the way.',
      tags: ['Playgroup', 'Nursery', 'Junior KG', 'Senior KG'],
    },
    {
      number: '03',
      title: '100% Satisfaction',
      description:
        'On completion of the entire preschool program, it is our VCare promise that no stone would be left unturned, and your child is ready for future endeavors in best way possible',
    },
  ];

  readonly trustCards: TrustCard[] = [
    {
      title: 'Legally Documented',
      accent: '#EB2027',
      icon: 'legal',
      points: [
        'Deposit agreement signed at admission',
        'Refund date, amount and terms clearly mentioned',
        'Fixed tenure — no conditions attached',
      ],
    },
    {
      title: 'Asset-Backed',
      accent: '#3BB44A',
      icon: 'asset',
      points: [
        'Backed by registered business operations',
        'Backed by tangible business assets',
        'Long-term sustainability planning',
      ],
    },
    {
      title: 'Early-Exit Protection',
      accent: '#006FB9',
      icon: 'exit',
      points: [
        'Pro-rated settlement if a child leaves mid-tenure',
        'Transparent, upfront exit clause',
        'Refund never depends on school performance or profits',
      ],
    },
  ];

  readonly comparisonRows: ComparisonRow[] = [
    { traditional: 'Constant pressure of fees', vcare: 'Worry-free education for your child' },
    {
      traditional: 'LARGE sum of money, gone forever',
      vcare: 'Your money treated as your asset',
    },
    { traditional: 'Monthly stress', vcare: 'One-time clarity' },
    { traditional: 'No financial return', vcare: 'Capital preserved' },
  ];

  readonly winPoints: string[] = [
    'Premium early education',
    'Financial discipline & predictability',
    'Zero fear of "wasted fees"',
    'A school that shares responsibility',
  ];

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') {
      return;
    }

    registerGsap();

    this.motionContext = gsap.context(() => {
      // Keep the page fully readable when the visitor requests reduced motion.
      if (prefersReducedMotion()) {
        gsap.set('[data-zfm-track]', { scaleX: 1, scaleY: 1 });
        gsap.set('.zfm-visual__zero-ring', { strokeDashoffset: 0 });
        return;
      }

      this.playHeroEntrance();
      this.setupHeroArtwork();
      this.setupScrollReveals();
      this.setupTimelineProgress();
      this.setupComparisonRows();
      this.setupCtaDecorations();
    }, this.pageRoot.nativeElement);
  }

  ngOnDestroy(): void {
    // Reverts GSAP tweens and ScrollTriggers created by this page before the route is destroyed.
    this.motionContext?.revert();
    this.motionContext = null;
  }

  private playHeroEntrance(): void {
    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });

    intro
      .from('[data-zfm-hero-kicker]', { autoAlpha: 0, y: 18, duration: 0.6 })
      .from('[data-zfm-hero-title]', { autoAlpha: 0, y: 34, duration: 0.82 }, '-=0.28')
      .from('[data-zfm-hero-lead]', { autoAlpha: 0, y: 22, duration: 0.7 }, '-=0.48')
      .from(
        '[data-zfm-hero-actions] .zfm-btn',
        {
          autoAlpha: 0,
          y: 18,
          duration: 0.55,
          stagger: 0.11,
        },
        '-=0.38',
      )
      .from('[data-zfm-hero-reassurance]', { autoAlpha: 0, y: 12, duration: 0.5 }, '-=0.25')
      .from('[data-zfm-hero-art]', { autoAlpha: 0, scale: 0.94, y: 24, duration: 1.05 }, '-=0.78');

    gsap.from('[data-zfm-stats] .zfm-stat', {
      autoAlpha: 0,
      y: 18,
      duration: 0.65,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '[data-zfm-stats]',
        start: 'top 92%',
        once: true,
      },
    });
  }

  private setupHeroArtwork(): void {
    gsap.fromTo(
      '.zfm-visual__zero-ring',
      { strokeDashoffset: 874 },
      { strokeDashoffset: 0, duration: 1.7, delay: 0.28, ease: 'power2.out' },
    );

    // Orbit the small education symbol around the zero-fee seal.
    gsap.to('[data-zfm-orbit]', {
      rotation: 360,
      svgOrigin: '280 232',
      duration: 42,
      ease: 'none',
      repeat: -1,
    });

    gsap.to('[data-zfm-float]', {
      y: (index) => (index % 2 === 0 ? -9 : 8),
      rotation: (index) => (index % 2 === 0 ? 5 : -4),
      duration: (index) => 2.4 + index * 0.35,
      ease: 'sine.inOut',
      stagger: 0.22,
      yoyo: true,
      repeat: -1,
    });

    gsap.to('[data-zfm-book]', {
      y: -4,
      rotation: -2,
      duration: 2.5,
      transformOrigin: 'center center',
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    gsap.to('[data-zfm-coin]', {
      y: -7,
      rotation: 7,
      duration: 2.2,
      transformOrigin: 'center center',
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    gsap.from('[data-zfm-chip]', {
      autoAlpha: 0,
      y: 16,
      scale: 0.94,
      duration: 0.7,
      delay: 0.65,
      stagger: 0.13,
      ease: 'back.out(1.3)',
    });

    gsap.to('[data-zfm-glow]', {
      x: (index) => (index === 0 ? -16 : 14),
      y: (index) => (index === 0 ? 12 : -10),
      duration: 5.5,
      ease: 'sine.inOut',
      stagger: 0.7,
      yoyo: true,
      repeat: -1,
    });
  }

  private setupScrollReveals(): void {
    const revealElements =
      this.pageRoot.nativeElement.querySelectorAll<HTMLElement>('[data-zfm-reveal]');

    revealElements.forEach((element) => {
      gsap.from(element, {
        autoAlpha: 0,
        y: 30,
        duration: 0.78,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 88%',
          once: true,
        },
      });
    });

    // Bring the promise cards in as one staggered group, while preserving their own hover states.
    gsap.from('.promise-card', {
      autoAlpha: 0,
      y: 26,
      duration: 0.72,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.zfm-promises__grid',
        start: 'top 82%',
        once: true,
      },
    });
  }

  private setupTimelineProgress(): void {
    gsap.to('[data-zfm-track]', {
      scaleX: 1,
      scaleY: 1,
      duration: 1.3,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.zfm-journey__timeline',
        start: 'top 78%',
        once: true,
      },
    });
  }

  private setupComparisonRows(): void {
    gsap.from('[data-zfm-compare-row]', {
      autoAlpha: 0,
      x: 20,
      duration: 0.55,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '[data-zfm-table]',
        start: 'top 82%',
        once: true,
      },
    });
  }

  private setupCtaDecorations(): void {
    gsap.to('[data-zfm-cta-float]', {
      y: (index) => (index % 2 === 0 ? -10 : 9),
      rotation: (index) => (index % 2 === 0 ? 8 : -7),
      duration: (index) => 2.6 + index * 0.45,
      ease: 'sine.inOut',
      stagger: 0.25,
      yoyo: true,
      repeat: -1,
    });

    gsap.to('[data-zfm-seal]', {
      rotation: -8,
      duration: 5.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  }
}
