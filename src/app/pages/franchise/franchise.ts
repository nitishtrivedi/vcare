import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GsapReveal } from '../../directives/gsap-reveal';
import { AuthService } from '../../services/auth';
import { gsap, prefersReducedMotion, registerGsap } from '../../shared/motion/gsap-setup';

interface Stat {
  value: string;
  label: string;
}

interface Model {
  tag: string;
  name: string;
  pitch: string;
  accent: string;
  icon: string;
  stats: Stat[];
  points: string[];
  bestFor: string;
}

interface Pillar {
  title: string;
  description: string;
  icon: string;
  accent: string;
}

interface Opportunity {
  number: string;
  title: string;
  description: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
}

interface Faq {
  question: string;
  answer: string;
}

export interface FranchiseSubmission {
  name: string;
  email: string;
  phone: string;
  city: string;
  budget: string;
  message: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

@Component({
  selector: 'app-franchise',
  imports: [ReactiveFormsModule, GsapReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './franchise.html',
  styleUrl: './franchise.scss',
})
export class Franchise implements AfterViewInit, OnDestroy {
  @ViewChild('root', { static: true }) private root!: ElementRef<HTMLElement>;

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private ctx?: gsap.Context;

  // ---------- HERO ----------
  readonly heroStats: Stat[] = [
    { value: '5+ Yrs', label: 'Proven Zero Fee Model' },
    { value: '₹50L', label: 'Starting investment' },
    { value: '₹1L+', label: 'Monthly earning potential' },
    { value: '3–6 Mo', label: 'To launch your centre' },
  ];

  // ---------- MODELS ----------
  readonly models: Model[] = [
    {
      tag: 'Track 01 · Fully managed',
      name: 'Managed Campus Model',
      pitch:
        'Invest in a VCare centre and let our team run it end-to-end: staffing, admissions, curriculum delivery and daily operations. You receive a fixed monthly payout.',
      accent: '#176fae',
      icon: 'fa-building',
      stats: [
        { value: '₹1,00,000+', label: 'Guaranteed minimum monthly payout' },
        { value: 'Fully managed', label: 'Staffing & operations by VCare' },
      ],
      points: [
        'VCare recruits, trains and manages your centre’s entire staff',
        'Admissions, marketing and enrolment handled entirely by VCare',
        'Compliance, safety protocols and quality audits taken care of for you',
        'A fixed monthly payout, independent of your day-to-day involvement',
      ],
      bestFor:
        'Investors, NRIs and busy professionals who want a stake in early education without operational responsibility.',
    },
    {
      tag: 'Track 02 · Owner-operated',
      name: 'Owner-Operated Franchise',
      pitch:
        'Run your own VCare centre: hire your team, drive local admissions and keep the profit your centre earns, with a royalty share going back to VCare.',
      accent: '#c93b41',
      icon: 'fa-user-tie',
      stats: [
        { value: '15% + GST', label: 'Royalty on centre revenue' },
        { value: '~63%*', label: 'Indicative ROI by year 2' },
      ],
      points: [
        'You keep the profit your centre generates, after royalty and running costs',
        'Full access to VCare curriculum, teacher training and brand systems',
        'Launch playbook, marketing toolkit and admissions support included',
        'Ongoing quality audits and continued access to the VCare operations team',
      ],
      bestFor:
        'Hands-on entrepreneurs and educators who want to actively build, manage and grow their own centre.',
    },
  ];

  readonly modelsNote =
    'Payout and return figures are indicative, based on VCare’s own operating centre performance and standard cost assumptions at the time of publishing. Actual figures vary by location, footfall, staffing and management quality.';

  // ---------- PILLARS ----------
  readonly pillars: Pillar[] = [
    {
      title: 'Proven Zero Fee Curriculum',
      description:
        'A ready-to-run early learning system refined over 5+ years, built on the Finnish Educare, Reggio Emilia and Montessori philosophies.',
      icon: 'fa-book-open',
      accent: '#c93b41',
    },
    {
      title: 'Trusted Brand & Marketing',
      description:
        'Launch with a name parents already search for, backed by ready-to-use local campaigns and admission funnels.',
      icon: 'fa-bullhorn',
      accent: '#e77b30',
    },
    {
      title: 'Recruitment & Teacher Training',
      description:
        'Hiring templates, structured onboarding and ongoing training workshops keep every VCare classroom to the same standard.',
      icon: 'fa-users',
      accent: '#218768',
    },
    {
      title: 'Admissions & Launch Playbook',
      description:
        'A step-by-step enrolment-drive system to help you fill your first batch fast, right from day one.',
      icon: 'fa-rocket',
      accent: '#176fae',
    },
    {
      title: 'Safety & Compliance SOPs',
      description:
        'Documented safety protocols, hygiene checklists and incident-management procedures, ready to implement on day one.',
      icon: 'fa-shield-halved',
      accent: '#f2b632',
    },
    {
      title: 'Ongoing Quality Audits',
      description:
        'Regular centre assessments and continued access to the VCare operations team for the entire life of your franchise.',
      icon: 'fa-clipboard-check',
      accent: '#c93b41',
    },
  ];

  // ---------- OPPORTUNITY ----------
  readonly opportunities: Opportunity[] = [
    {
      number: '01',
      title: 'Rising demand for quality early education',
      description:
        'Urban and semi-urban India is moving fast toward branded, structured preschools, away from unorganised neighbourhood daycares.',
    },
    {
      number: '02',
      title: 'A differentiator no one else offers',
      description:
        'VCare’s Zero Fee Refundable Deposit Model is a genuine parent magnet. No competing preschool brand offers anything like it.',
    },
    {
      number: '03',
      title: 'Lower risk than starting independently',
      description:
        'Skip years of trial and error. Launch with a tested curriculum, operational systems and a brand that already has admissions traction.',
    },
    {
      number: '04',
      title: 'A model proven on the ground',
      description:
        'Our Karvenagar, Pune centre has built a loyal parent community. You inherit a working blueprint, not a concept on paper.',
    },
  ];

  // ---------- PROCESS ----------
  readonly steps: Step[] = [
    {
      number: '01',
      title: 'Enquire',
      description: 'Share your city and investment budget through our franchise enquiry form.',
    },
    {
      number: '02',
      title: 'Discovery call',
      description:
        'Our franchise team walks you through the model, the numbers and the support structure.',
    },
    {
      number: '03',
      title: 'Site check',
      description: 'We help assess your proposed location for demand, footfall and suitability.',
    },
    {
      number: '04',
      title: 'Agreement & setup',
      description:
        'Sign the franchise agreement and get access to design, hiring and launch playbooks.',
    },
    {
      number: '05',
      title: 'Launch',
      description:
        'Open your VCare centre with on-ground support through your first admission season.',
    },
  ];

  // ---------- FAQ ----------
  readonly faqs: Faq[] = [
    {
      question: 'What is the minimum investment to open a VCare franchise?',
      answer:
        'Franchise investment starts at ₹50 Lakhs for our Starter Campus tier, covering setup, licensing and initial launch support.',
    },
    {
      question: 'What kind of monthly earning can I expect?',
      answer:
        'Based on our operating centres, franchise partners can expect a minimum earning potential of ₹1,00,000 per month at the Starter tier, scaling up to ₹1,40,000+ at our Premier Campus tier.',
    },
    {
      question: 'Do I need prior experience in education?',
      answer:
        'No prior experience is required. VCare provides full training, recruitment support and an operational playbook so you can run your centre with confidence from day one.',
    },
    {
      question: 'What support does VCare provide after launch?',
      answer:
        'Ongoing quality audits, teacher-training refreshers, marketing toolkits and continued access to VCare’s central operations team, for the entire life of your franchise.',
    },
    {
      question: 'How long does it take to open a VCare centre?',
      answer:
        'Typically between 3 and 6 months from signing the agreement, depending on how quickly your site is ready.',
    },
    {
      question: 'Is the Zero Fee Model available to franchise partners?',
      answer:
        'Yes. Every VCare franchise operates under the same trusted Zero Fee Refundable Deposit Model that has built strong parent loyalty at our flagship centre.',
    },
  ];

  readonly openFaq = signal<number | null>(0);

  // ---------- ENQUIRY FORM ----------
  readonly budgetOptions = ['₹50 Lakhs', '₹60 Lakhs', '₹70 Lakhs', 'Above ₹70 Lakhs'];
  readonly formStatus = signal<FormStatus>('idle');
  readonly formErrorMessage = signal('');

  readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    city: ['', Validators.required],
    budget: ['', Validators.required],
    message: [''],
  });

  constructor() {
    registerGsap();
  }

  get f() {
    return this.form.controls;
  }

  isFaqOpen(index: number): boolean {
    return this.openFaq() === index;
  }

  toggleFaq(index: number): void {
    this.openFaq.update((current) => (current === index ? null : index));
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.formStatus.set('submitting');
    this.formErrorMessage.set('');

    try {
      await this.saveEnquiry(this.form.getRawValue() as FranchiseSubmission);
      this.formStatus.set('success');
      this.form.reset();
    } catch (error) {
      console.error('Franchise enquiry submission failed:', error);
      this.formErrorMessage.set(
        error instanceof Error ? error.message : 'Unable to submit enquiry.',
      );
      this.formStatus.set('error');
    }
  }

  dismissStatus(): void {
    this.formStatus.set('idle');
    this.formErrorMessage.set('');
  }

  private async saveEnquiry(submission: FranchiseSubmission): Promise<void> {
    let response: Response;

    try {
      response = await fetch(`${this.authService.apiUrl}/franchise-enquiries.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      });
    } catch (networkError) {
      console.error('Franchise enquiry network error:', networkError);
      throw new Error('Unable to reach the server. Please check your connection and try again.');
    }

    let result: { success?: boolean; message?: string };

    try {
      result = await response.json();
    } catch (parseError) {
      console.error('Franchise enquiry: invalid JSON response', parseError);
      throw new Error('Invalid server response.');
    }

    if (!response.ok || !result.success) {
      throw new Error(result.message ?? 'Unable to submit enquiry.');
    }
  }

  // ---------- ANIMATION ----------
  ngAfterViewInit(): void {
    if (prefersReducedMotion()) return;

    this.ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .from('.fr-hero__eyebrow', { autoAlpha: 0, y: 14, duration: 0.6 })
        .from(
          '.fr-hero__title .ab-mask > span',
          { yPercent: 110, duration: 1.05, stagger: 0.12 },
          '-=0.3',
        )
        .from(
          '.fr-hero__lead, .fr-hero__actions',
          { autoAlpha: 0, y: 18, duration: 0.7, stagger: 0.1 },
          '-=0.6',
        )
        .from(
          '.fr-stat',
          { autoAlpha: 0, y: 24, scale: 0.94, duration: 0.7, stagger: 0.1, ease: 'back.out(1.4)' },
          '-=0.5',
        );

      gsap.to('.fr-hero__blob-a', {
        x: 60,
        y: 40,
        duration: 11,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.fr-hero__blob-b', {
        x: -50,
        y: -30,
        duration: 13,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.from('[data-model]', {
        autoAlpha: 0,
        y: 50,
        duration: 0.9,
        stagger: 0.18,
        ease: 'power3.out',
        scrollTrigger: { trigger: '[data-model-grid]', start: 'top 80%' },
      });

      gsap.from('[data-pillar]', {
        autoAlpha: 0,
        y: 36,
        scale: 0.96,
        duration: 0.7,
        stagger: { each: 0.08, grid: 'auto' },
        ease: 'power3.out',
        scrollTrigger: { trigger: '[data-pillar-grid]', start: 'top 82%' },
      });

      gsap.from('[data-opp]', {
        autoAlpha: 0,
        x: -30,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '[data-opp-grid]', start: 'top 82%' },
      });

      gsap.fromTo(
        '.fr-steps__line span',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.6,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: '.fr-steps', start: 'top 75%' },
        },
      );

      gsap.from('[data-step]', {
        autoAlpha: 0,
        y: 30,
        duration: 0.7,
        stagger: 0.15,
        ease: 'back.out(1.3)',
        scrollTrigger: { trigger: '.fr-steps', start: 'top 75%' },
      });

      gsap.from('.fr-form-wrap', {
        autoAlpha: 0,
        y: 40,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.fr-cta', start: 'top 75%' },
      });
    }, this.root.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
