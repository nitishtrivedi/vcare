import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
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

  @ViewChild('budgetDropdownContainer')
private budgetDropdownContainer?: ElementRef<HTMLElement>;

@ViewChild('budgetDropdownTrigger')
private budgetDropdownTrigger?: ElementRef<HTMLButtonElement>;

readonly budgetDropdownOpen = signal(false);


toggleBudgetDropdown(): void {
  this.budgetDropdownOpen.update((open) => !open);
}

openBudgetDropdown(
  event: KeyboardEvent,
  index = 0,
): void {
  event.preventDefault();

  this.budgetDropdownOpen.set(true);

  // Wait for Angular to render the options before moving focus.
  setTimeout(() => this.focusBudgetOption(index), 0);
}

closeBudgetDropdown(): void {
  this.budgetDropdownOpen.set(false);
}

focusBudgetTrigger(): void {
  this.budgetDropdownTrigger?.nativeElement.focus();
}

focusBudgetOption(
  index: number,
  event?: KeyboardEvent,
): void {
  event?.preventDefault();

  const options =
    this.budgetDropdownContainer?.nativeElement
      .querySelectorAll<HTMLButtonElement>('[role="option"]');

  if (!options?.length) {
    return;
  }

  // Wrap around when navigating with the arrow keys.
  const nextIndex = ((index % options.length) + options.length) % options.length;

  options[nextIndex].focus();
}

selectBudgetOption(option: string): void {
  const budgetControl = this.form.controls['budget'];

  budgetControl.setValue(option);
  budgetControl.markAsTouched();
  budgetControl.markAsDirty();

  this.closeBudgetDropdown();
  this.focusBudgetTrigger();
}

@HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent): void {
  const target = event.target;

  if (
    !(target instanceof Element) ||
    !target.closest('.fr-budget-dropdown')
  ) {
    this.closeBudgetDropdown();
  }
}

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private ctx?: gsap.Context;

  // // ---------- HERO ----------
  // readonly heroStats: Stat[] = [
  //   { value: '5+ Yrs', label: 'Proven Zero Fee Model' },
  //   { value: '₹50L', label: 'Starting investment' },
  //   { value: '₹1L+', label: 'Monthly earning potential' },
  //   { value: '3–6 Mo', label: 'To launch your centre' },
  // ];

  // // ---------- MODELS ----------
  // readonly models: Model[] = [
  //   {
  //     tag: 'Track 01 · Fully managed',
  //     name: 'Managed Campus Model',
  //     pitch:
  //       'Invest in a VCare centre and let our team run it end-to-end: staffing, admissions, curriculum delivery and daily operations. You receive a fixed monthly payout.',
  //     accent: '#176fae',
  //     icon: 'fa-building',
  //     stats: [
  //       { value: '₹1,00,000+', label: 'Guaranteed minimum monthly payout' },
  //       { value: 'Fully managed', label: 'Staffing & operations by VCare' },
  //     ],
  //     points: [
  //       'VCare recruits, trains and manages your centre’s entire staff',
  //       'Admissions, marketing and enrolment handled entirely by VCare',
  //       'Compliance, safety protocols and quality audits taken care of for you',
  //       'A fixed monthly payout, independent of your day-to-day involvement',
  //     ],
  //     bestFor:
  //       'Investors, NRIs and busy professionals who want a stake in early education without operational responsibility.',
  //   },
  //   {
  //     tag: 'Track 02 · Owner-operated',
  //     name: 'Owner-Operated Franchise',
  //     pitch:
  //       'Run your own VCare centre: hire your team, drive local admissions and keep the profit your centre earns, with a royalty share going back to VCare.',
  //     accent: '#c93b41',
  //     icon: 'fa-user-tie',
  //     stats: [
  //       { value: '15% + GST', label: 'Royalty on centre revenue' },
  //       { value: '~63%*', label: 'Indicative ROI by year 2' },
  //     ],
  //     points: [
  //       'You keep the profit your centre generates, after royalty and running costs',
  //       'Full access to VCare curriculum, teacher training and brand systems',
  //       'Launch playbook, marketing toolkit and admissions support included',
  //       'Ongoing quality audits and continued access to the VCare operations team',
  //     ],
  //     bestFor:
  //       'Hands-on entrepreneurs and educators who want to actively build, manage and grow their own centre.',
  //   },
  // ];

  // readonly modelsNote =
  //   'Payout and return figures are indicative, based on VCare’s own operating centre performance and standard cost assumptions at the time of publishing. Actual figures vary by location, footfall, staffing and management quality.';

  // // ---------- PILLARS ----------
  // readonly pillars: Pillar[] = [
  //   {
  //     title: 'Proven Zero Fee Curriculum',
  //     description:
  //       'A ready-to-run early learning system refined over 5+ years, built on the Finnish Educare, Reggio Emilia and Montessori philosophies.',
  //     icon: 'fa-book-open',
  //     accent: '#c93b41',
  //   },
  //   {
  //     title: 'Trusted Brand & Marketing',
  //     description:
  //       'Launch with a name parents already search for, backed by ready-to-use local campaigns and admission funnels.',
  //     icon: 'fa-bullhorn',
  //     accent: '#e77b30',
  //   },
  //   {
  //     title: 'Recruitment & Teacher Training',
  //     description:
  //       'Hiring templates, structured onboarding and ongoing training workshops keep every VCare classroom to the same standard.',
  //     icon: 'fa-users',
  //     accent: '#218768',
  //   },
  //   {
  //     title: 'Admissions & Launch Playbook',
  //     description:
  //       'A step-by-step enrolment-drive system to help you fill your first batch fast, right from day one.',
  //     icon: 'fa-rocket',
  //     accent: '#176fae',
  //   },
  //   {
  //     title: 'Safety & Compliance SOPs',
  //     description:
  //       'Documented safety protocols, hygiene checklists and incident-management procedures, ready to implement on day one.',
  //     icon: 'fa-shield-halved',
  //     accent: '#f2b632',
  //   },
  //   {
  //     title: 'Ongoing Quality Audits',
  //     description:
  //       'Regular centre assessments and continued access to the VCare operations team for the entire life of your franchise.',
  //     icon: 'fa-clipboard-check',
  //     accent: '#c93b41',
  //   },
  // ];

  // // ---------- OPPORTUNITY ----------
  // readonly opportunities: Opportunity[] = [
  //   {
  //     number: '01',
  //     title: 'Rising demand for quality early education',
  //     description:
  //       'Urban and semi-urban India is moving fast toward branded, structured preschools, away from unorganised neighbourhood daycares.',
  //   },
  //   {
  //     number: '02',
  //     title: 'A differentiator no one else offers',
  //     description:
  //       'VCare’s Zero Fee Refundable Deposit Model is a genuine parent magnet. No competing preschool brand offers anything like it.',
  //   },
  //   {
  //     number: '03',
  //     title: 'Lower risk than starting independently',
  //     description:
  //       'Skip years of trial and error. Launch with a tested curriculum, operational systems and a brand that already has admissions traction.',
  //   },
  //   {
  //     number: '04',
  //     title: 'A model proven on the ground',
  //     description:
  //       'Our Karvenagar, Pune centre has built a loyal parent community. You inherit a working blueprint, not a concept on paper.',
  //   },
  // ];

  // // ---------- PROCESS ----------
  // readonly steps: Step[] = [
  //   {
  //     number: '01',
  //     title: 'Enquire',
  //     description: 'Share your city and investment budget through our franchise enquiry form.',
  //   },
  //   {
  //     number: '02',
  //     title: 'Discovery call',
  //     description:
  //       'Our franchise team walks you through the model, the numbers and the support structure.',
  //   },
  //   {
  //     number: '03',
  //     title: 'Site check',
  //     description: 'We help assess your proposed location for demand, footfall and suitability.',
  //   },
  //   {
  //     number: '04',
  //     title: 'Agreement & setup',
  //     description:
  //       'Sign the franchise agreement and get access to design, hiring and launch playbooks.',
  //   },
  //   {
  //     number: '05',
  //     title: 'Launch',
  //     description:
  //       'Open your VCare centre with on-ground support through your first admission season.',
  //   },
  // ];

  // // ---------- FAQ ----------
  // readonly faqs: Faq[] = [
  //   {
  //     question: 'What is the minimum investment to open a VCare franchise?',
  //     answer:
  //       'Franchise investment starts at ₹50 Lakhs for our Starter Campus tier, covering setup, licensing and initial launch support.',
  //   },
  //   {
  //     question: 'What kind of monthly earning can I expect?',
  //     answer:
  //       'Based on our operating centres, franchise partners can expect a minimum earning potential of ₹1,00,000 per month at the Starter tier, scaling up to ₹1,40,000+ at our Premier Campus tier.',
  //   },
  //   {
  //     question: 'Do I need prior experience in education?',
  //     answer:
  //       'No prior experience is required. VCare provides full training, recruitment support and an operational playbook so you can run your centre with confidence from day one.',
  //   },
  //   {
  //     question: 'What support does VCare provide after launch?',
  //     answer:
  //       'Ongoing quality audits, teacher-training refreshers, marketing toolkits and continued access to VCare’s central operations team, for the entire life of your franchise.',
  //   },
  //   {
  //     question: 'How long does it take to open a VCare centre?',
  //     answer:
  //       'Typically between 3 and 6 months from signing the agreement, depending on how quickly your site is ready.',
  //   },
  //   {
  //     question: 'Is the Zero Fee Model available to franchise partners?',
  //     answer:
  //       'Yes. Every VCare franchise operates under the same trusted Zero Fee Refundable Deposit Model that has built strong parent loyalty at our flagship centre.',
  //   },
  // ];

  
  // ---------- HERO ----------
  readonly heroStats: Stat[] = [
    { value: '5+ Years', label: 'Years of proven VCare experience' },
    { value: '₹50L', label: 'Model 1 investment' },
    { value: '₹1 Cr', label: 'Model 2 investment' },
    { value: '3–6 Months', label: 'Months to open your centre' },
  ];

  // ---------- MODELS ----------
  readonly models: Model[] = [
    {
      tag: 'Model 1 · ₹50 Lakh',
      name: 'Model 1',
      pitch:
        'Invest ₹50 Lakh in a complete preschool setup, fully run by VCare. The brochure states a fixed monthly return of ₹1 Lakh.',
      accent: '#176fae',
      icon: 'fa-building',
      stats: [
        { value: '₹50 Lakh', label: 'Amount you invest' },
        { value: '₹1 Lakh', label: 'Fixed monthly return' },
        { value: '₹12 Lakh', label: 'Fixed yearly return' },
        { value: '24%', label: 'Yearly return as a share of investment' },
      ],
      points: [
        'Complete preschool setup',
        'Curriculum and teaching materials with a structured daily plan',
        'Staff recruitment, training, admissions and marketing support',
        'Investment recovery: about 50 months if the centre opens on time',
      ],
      bestFor:
        'Fully run by VCare, including staffing, admissions, curriculum and day-to-day operations.',
    },
    {
      tag: 'Model 2 · ₹1 Crore',
      name: 'Model 2',
      pitch:
        'Invest ₹1 Crore in a complete preschool setup, fully run by VCare. The brochure states a fixed monthly return of ₹2 Lakh.',
      accent: '#218768',
      icon: 'fa-school',
      stats: [
        { value: '₹1 Crore', label: 'Amount you invest' },
        { value: '₹2 Lakh', label: 'Fixed monthly return' },
        { value: '₹24 Lakh', label: 'Fixed yearly return' },
        { value: '24%', label: 'Yearly return as a share of investment' },
      ],
      points: [
        'Complete preschool setup',
        'Curriculum and teaching materials with a structured daily plan',
        'Staff recruitment, training, admissions and marketing support',
        'Investment recovery: about 50 months if the centre opens on time',
      ],
      bestFor:
        'Fully run by VCare, including staffing, admissions, curriculum and day-to-day operations.',
    },
  ];

  readonly modelsNote =
    'The brochure calculates investment recovery as the amount invested divided by the monthly return: 50 months for each model. If opening takes six months, the brochure shows 56 months to recover the investment. Figures are based on current plans and are not a guarantee of future results. The signed agreement sets out the binding terms.';

  // ---------- COMPLETE SETUP ----------
  readonly pillars: Pillar[] = [
    {
      title: 'Infrastructure and setup',
      description:
        'Centre planning, fit-out and classroom setup according to the approved design.',
      icon: 'fa-building',
      accent: '#176fae',
    },
    {
      title: 'Curriculum',
      description:
        'A ready-to-run early learning system with teaching materials and a structured daily plan. The brochure references Finnish Educare, Reggio Emilia and Montessori approaches.',
      icon: 'fa-book-open',
      accent: '#218768',
    },
    {
      title: 'Staff recruitment and training',
      description:
        'VCare handles recruitment of the entire team, structured onboarding and ongoing teacher workshops.',
      icon: 'fa-users',
      accent: '#c93b41',
    },
    {
      title: 'Admissions and marketing',
      description:
        'A launch campaign, enrolment drive and admission funnels to help fill your first batch.',
      icon: 'fa-bullhorn',
      accent: '#e77b30',
    },
    {
      title: 'Safety and compliance',
      description:
        'Documented safety protocols, hygiene checklists and incident procedures, ready from day one.',
      icon: 'fa-shield-halved',
      accent: '#f2b632',
    },
    {
      title: 'Operations and ongoing support',
      description:
        'Day-to-day centre operations, quality audits and continued access to the VCare operations team for the life of the partnership.',
      icon: 'fa-clipboard-check',
      accent: '#176fae',
    },
  ];

  // ---------- OPPORTUNITY ----------
  readonly opportunities: Opportunity[] = [
    {
      number: '01',
      title: 'Growing demand',
      description:
        "India's preschool sector is expanding, and parents are increasingly choosing branded, structured preschools over informal daycares.",
    },
    {
      number: '02',
      title: 'A name parents trust',
      description:
        'VCare already has a loyal parent community and a brand parents search for.',
    },
    {
      number: '03',
      title: 'Lower risk than going alone',
      description:
        'Start with a tested curriculum, working systems and an admissions track record rather than building everything independently.',
    },
    {
      number: '04',
      title: 'A working blueprint',
      description:
        'The brochure states that the Karvenagar, Pune centre has been running for over five years.',
    },
    {
      number: '05',
      title: 'Projected enrolment growth',
      description:
        'The brochure projects 20 children in Year 1, 45 in Year 2, 65 in Year 3, and 80 in Year 4. Year 5 is assumed to remain at 80 children, subject to annual review.',
    },
  ];

  // ---------- PROCESS ----------
  readonly steps: Step[] = [
    {
      number: '1',
      title: 'Enquire',
      description:
        'Share your city and investment budget through the enquiry form or by calling VCare.',
    },
    {
      number: '2',
      title: 'Discovery call',
      description:
        'VCare walks you through the investment model, the figures and the support provided.',
    },
    {
      number: '3',
      title: 'Site check',
      description:
        'VCare helps assess your location for demand and footfall.',
    },
    {
      number: '4',
      title: 'Agreement and setup',
      description:
        'Sign the agreement and receive the design, hiring and launch plans.',
    },
    {
      number: '5',
      title: 'Launch',
      description:
        'Open with on-ground support through your first admission season.',
    },
  ];

  // ---------- FAQ ----------
  readonly faqs: Faq[] = [
    {
      question: 'What is the minimum investment?',
      answer:
        'Model 1 requires ₹50 Lakh and Model 2 requires ₹1 Crore. Both give you a complete preschool setup.',
    },
    {
      question: 'What return will I receive?',
      answer:
        'The brochure states a fixed monthly return of ₹1 Lakh for Model 1 and ₹2 Lakh for Model 2. The stated yearly returns are ₹12 Lakh and ₹24 Lakh respectively.',
    },
    {
      question: 'Who runs the centre?',
      answer:
        'VCare runs the centre fully, including staffing, admissions, curriculum and day-to-day operations.',
    },
    {
      question: 'Do I need experience in education?',
      answer:
        'No. VCare provides training, recruitment support and an operating plan.',
    },
    {
      question: 'Are the returns fixed?',
      answer:
        'The brochure describes a fixed monthly return for the selected option, independent of running costs. These figures are not a guarantee of future results; the signed agreement sets out the binding terms.',
    },
    {
      question: 'How long does it take to open?',
      answer:
        'Usually three to six months from signing, depending on how quickly your site is ready.',
    },
    {
      question: 'When do my returns start?',
      answer:
        'The brochure states that returns start from the first month after the centre opens. This will be confirmed in the agreement.',
    },
    {
      question: 'What support do I get after opening?',
      answer:
        'Quality audits, teacher-training refreshers, marketing materials and continued access to the VCare operations team.',
    },
    {
      question: 'What is the difference between the two models?',
      answer:
        'The setup and services are the same. Model 2 requires twice the investment and has twice the stated monthly return.',
    },
  ];


  readonly openFaq = signal<number | null>(0);

  // ---------- ENQUIRY FORM ----------
  //readonly budgetOptions = ['₹50 Lakhs', '₹60 Lakhs', '₹70 Lakhs', 'Above ₹70 Lakhs'];
  readonly budgetOptions = [
  'Model 1 — ₹50 Lakh',
  'Model 2 — ₹1 Crore',
];
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
