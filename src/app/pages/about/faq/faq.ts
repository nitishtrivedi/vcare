import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  OnDestroy,
  ViewChild,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { GsapReveal } from '../../../directives/gsap-reveal';
import { gsap, prefersReducedMotion, registerGsap } from '../../../shared/motion/gsap-setup';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  id: string;
  title: string;
  icon: string;
  accent: string;
  items: FaqItem[];
}

@Component({
  selector: 'app-faq',
  imports: [RouterLink, GsapReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class Faq implements AfterViewInit, OnDestroy {
  @ViewChild('root', { static: true }) private root!: ElementRef<HTMLElement>;
  private ctx?: gsap.Context;

  readonly categories: FaqCategory[] = [
    {
      id: 'general',
      title: 'General & Curriculum',
      icon: 'fa-book-open',
      accent: '#c93b41',
      items: [
        {
          question: 'What age groups does V Care welcome?',
          answer:
            'From 6 months to 8 years, spanning our Parent Toddler Program, Playgroup, Nursery, Junior KG, Senior KG and After School Program.',
        },
        {
          question: 'What teaching approach does V Care follow?',
          answer:
            'We blend the Finnish Educare Model, Reggio Emilia and Montessori practices with the Early Years Learning Framework, focusing on experiential, play-based learning rather than rote memorisation.',
        },
        {
          question: 'Where is V Care located?',
          answer: 'Our preschool and activity centre is in Karvenagar, Pune, Maharashtra.',
        },
        {
          question: 'What are your operating days?',
          answer:
            'We are open Monday to Saturday. The centre remains closed on the 2nd and last Saturday of every month.',
        },
      ],
    },
    {
      id: 'admissions',
      title: 'Admissions & Programs',
      icon: 'fa-id-card',
      accent: '#e77b30',
      items: [
        {
          question: 'What programs does V Care offer?',
          answer:
            'Parent Toddler Program (6 months to 2 years), Playgroup, Nursery, Junior KG and Senior KG under our Preschool Program, the After School Program, and Daycare.',
        },
        {
          question: 'What is the adult-to-child ratio?',
          answer:
            'We maintain a 1:5 adult-to-child ratio in our Daycare, so every child gets adequate, personal attention.',
        },
        {
          question: 'How do I enrol my child?',
          answer:
            'Call us at +91 97650 76513 or send an enquiry through our contact form, and our admissions team will guide you through the visit and documentation.',
        },
        {
          question: 'Can I visit the campus before enrolling?',
          answer:
            'Absolutely. We encourage it. Book a time that works for you and we will walk you through the classrooms and activities in person.',
        },
      ],
    },
    {
      id: 'zero-fee',
      title: 'Zero Fee Model',
      icon: 'fa-shield-heart',
      accent: '#218768',
      items: [
        {
          question: 'What exactly is the Zero Fee Model?',
          answer:
            'Instead of tuition fees, you place a one-time Refundable Education Deposit (RED) of ₹2,00,000 at admission. Your child studies with zero monthly or annual fees for the entire journey, and the full deposit is returned at the end.',
        },
        {
          question: 'When do I get my deposit back?',
          answer:
            'On completion of Senior KG, after your child’s full 4-year journey through Playgroup, Nursery, Junior KG and Senior KG.',
        },
        {
          question: 'What if we need to leave before the program ends?',
          answer:
            'A pro-rated settlement applies, with a transparent early-exit clause explained upfront in the deposit agreement.',
        },
        {
          question: 'Is this a fee or an investment product?',
          answer:
            'Neither. It is a pure, time-bound refundable deposit, legally documented, and never tied to school performance or profits.',
        },
      ],
    },
    {
      id: 'safety',
      title: 'Daycare, Fees & Safety',
      icon: 'fa-shield-halved',
      accent: '#176fae',
      items: [
        {
          question: 'What are the Daycare timings and charges?',
          answer:
            'Daycare covers children from 6 months to 8 years in flexible slots, from 2 hours (₹3,500/month) up to 10 hours (₹15,000/month), with a pay-per-day option also available for parents without registration.',
        },
        {
          question: 'What meals are provided during Daycare?',
          answer:
            'We follow mindful eating routines with breakfast, lunch and snacks, and coordinate directly with parents on any dietary needs.',
        },
        {
          question: 'How do you ensure child safety on campus?',
          answer:
            'Our premises are CCTV-monitored with hygienic, soft-flooring play areas, and every child is looked after by trained, caring educators throughout the day.',
        },
        {
          question: 'What is your late pickup and late payment policy?',
          answer:
            'Fees are due on or before the 5th of every month. Late payments and pickups beyond scheduled hours carry a small daily or hourly charge, shared with you clearly at admission.',
        },
      ],
    },
  ];

  readonly total = this.categories.reduce((n, c) => n + c.items.length, 0);
  readonly activeTab = signal<string>('all');
  readonly openKeys = signal<ReadonlySet<string>>(new Set());

  readonly visibleCategories = computed(() => {
    const tab = this.activeTab();
    return tab === 'all' ? this.categories : this.categories.filter((c) => c.id === tab);
  });

  constructor() {
    registerGsap();
  }

  key(catId: string, index: number): string {
    return `${catId}-${index}`;
  }

  isOpen(catId: string, index: number): boolean {
    return this.openKeys().has(this.key(catId, index));
  }

  toggle(catId: string, index: number): void {
    const k = this.key(catId, index);
    this.openKeys.update((set) => {
      const next = new Set(set);
      next.has(k) ? next.delete(k) : next.add(k);
      return next;
    });
  }

  setTab(id: string): void {
    this.activeTab.set(id);
    this.openKeys.set(new Set());
    // Wait for Angular to render the new list before animating it in.
    setTimeout(() => this.animateItems(), 0);
  }

  ngAfterViewInit(): void {
    if (prefersReducedMotion()) return;

    this.ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .from('.faq-hero__title .ab-mask > span', { yPercent: 110, duration: 1, stagger: 0.12 })
        .from('.faq-tab', { autoAlpha: 0, y: 14, duration: 0.5, stagger: 0.06 }, '-=0.5');

      gsap.to('.faq-hero__blob-a', {
        x: 50,
        y: 30,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.faq-hero__blob-b', {
        x: -40,
        y: -20,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, this.root.nativeElement);

    this.animateItems();
  }

  private animateItems(): void {
    if (prefersReducedMotion()) return;

    gsap.fromTo(
      this.root.nativeElement.querySelectorAll('.faq-item'),
      { autoAlpha: 0, y: 18 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.06,
        ease: 'power3.out',
        clearProps: 'transform',
        overwrite: 'auto',
      },
    );
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
