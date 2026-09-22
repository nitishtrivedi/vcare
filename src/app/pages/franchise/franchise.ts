import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { WaveDivider } from '../../components/wave-divider/wave-divider';
import { ScrollReveal } from '../../directives/scroll-reveal';
import { AuthService } from '../../services/auth';

interface HeroStat {
  value: string;
  label: string;
}

interface InvestmentTier {
  name: string;
  badge: string;
  investment: string;
  earning: string;
  accent: string;
  popular?: boolean;
  capacity: string;
  features: string[];
}

interface SupportPillar {
  title: string;
  description: string;
  icon: 'curriculum' | 'brand' | 'recruit' | 'launch' | 'safety' | 'audit';
  accent: string;
}

interface OpportunityPoint {
  number: string;
  title: string;
  description: string;
}

interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

interface FaqItem {
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
  imports: [RouterLink, ReactiveFormsModule, ScrollReveal, WaveDivider],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './franchise.html',
  styleUrl: './franchise.scss',
})
export class Franchise {
  // ============================================================
  // HERO
  // ============================================================

  readonly heroStats: HeroStat[] = [
    { value: '5+ Yrs', label: 'Proven Zero Fee Model' },
    { value: '₹50L', label: 'Starting Investment' },
    { value: '₹1L+', label: 'Monthly Earning Potential' },
    { value: '3–6 Mo', label: 'To Launch Your Centre' },
  ];

  // ============================================================
  // INVESTMENT TIERS
  // ============================================================

  readonly tiers: InvestmentTier[] = [
    {
      name: 'Starter Campus',
      badge: 'ENTRY TRACK',
      investment: '₹50 Lakhs',
      earning: '₹1,00,000+',
      accent: '#006FB9',
      capacity: 'Capacity for 60+ children',
      features: [
        'Complete preschool setup — Playgroup to Senior KG',
        'Licensed use of the VCare Zero Fee Model',
        '6 months of on-ground launch support',
        'Access to the VCare Teacher Training Academy',
        'Admission & enrolment playbook',
      ],
    },
    {
      name: 'Growth Campus',
      badge: 'MOST POPULAR',
      investment: '₹60 Lakhs',
      earning: '₹1,20,000+',
      accent: '#EB2027',
      popular: true,
      capacity: 'Capacity for 90+ children',
      features: [
        'Everything in Starter Campus',
        'Extended Daycare & After-School wing',
        'Dedicated regional marketing support',
        'Priority access to admissions leads',
        'Quarterly business review with VCare HQ',
      ],
    },
    {
      name: 'Premier Campus',
      badge: 'MAXIMUM SCALE',
      investment: '₹70 Lakhs',
      earning: '₹1,40,000+',
      accent: '#3BB44A',
      capacity: 'Capacity for 120+ children',
      features: [
        'Everything in Growth Campus',
        'Full Activity Centre — Preschool + Daycare + After School',
        'Dedicated centre operations consultant',
        'First access to future VCare programs',
        'Priority territory protection in your city',
      ],
    },
  ];

  // ============================================================
  // SUPPORT PILLARS
  // ============================================================

  readonly pillars: SupportPillar[] = [
    {
      title: 'Proven Zero Fee Curriculum',
      description:
        'A ready-to-run early learning system refined over 5+ years, built on the Finnish Educare, Reggio Emilia and Montessori philosophies.',
      icon: 'curriculum',
      accent: '#EB2027',
    },
    {
      title: 'Trusted Brand & Marketing',
      description:
        'Launch with a name parents already search for — backed by ready-to-use local launch campaigns and admission funnels.',
      icon: 'brand',
      accent: '#F69220',
    },
    {
      title: 'Recruitment & Teacher Training',
      description:
        'Hiring templates, structured onboarding and ongoing training workshops keep every VCare classroom to the same standard.',
      icon: 'recruit',
      accent: '#3BB44A',
    },
    {
      title: 'Admissions & Launch Playbook',
      description:
        'A step-by-step enrolment-drive system to help you fill your first batch fast, right from day one.',
      icon: 'launch',
      accent: '#006FB9',
    },
    {
      title: 'Safety & Compliance SOPs',
      description:
        'Documented safety protocols, hygiene checklists and incident-management procedures — ready to implement on day one.',
      icon: 'safety',
      accent: '#874D3E',
    },
    {
      title: 'Ongoing Quality Audits',
      description:
        'Regular centre assessments and continued access to the VCare operations team, for the entire life of your franchise.',
      icon: 'audit',
      accent: '#EB2027',
    },
  ];

  // ============================================================
  // WHY NOW / OPPORTUNITY
  // ============================================================

  readonly opportunities: OpportunityPoint[] = [
    {
      number: '01',
      title: 'Rising Demand for Quality Early Education',
      description:
        'Urban and semi-urban India is moving fast toward branded, structured preschools — away from unorganised neighbourhood daycares.',
    },
    {
      number: '02',
      title: 'A Differentiator No One Else Offers',
      description:
        "VCare's Zero Fee Refundable Deposit Model is a genuine parent magnet — no competing preschool brand offers anything like it.",
    },
    {
      number: '03',
      title: 'Lower Risk Than Starting Independently',
      description:
        'Skip years of trial and error. Launch with a tested curriculum, operational systems and a brand that already has admissions traction.',
    },
    {
      number: '04',
      title: 'A Model Proven On The Ground',
      description:
        'Our Karvenagar, Pune centre has already built a loyal parent community — you inherit a working blueprint, not a concept on paper.',
    },
  ];

  // ============================================================
  // PROCESS
  // ============================================================

  readonly steps: ProcessStep[] = [
    {
      number: '01',
      title: 'Enquire',
      description: 'Share your city and investment budget through our franchise enquiry form.',
    },
    {
      number: '02',
      title: 'Discovery Call',
      description:
        'Our franchise team walks you through the model, the numbers and the support structure.',
    },
    {
      number: '03',
      title: 'Site & Feasibility Check',
      description: 'We help assess your proposed location for demand, footfall and suitability.',
    },
    {
      number: '04',
      title: 'Agreement & Setup',
      description:
        'Sign the franchise agreement and get access to design, hiring and launch playbooks.',
    },
    {
      number: '05',
      title: 'Launch',
      description:
        'Open your VCare centre with our on-ground support through your first admission season.',
    },
  ];

  // ============================================================
  // FAQ
  // ============================================================

  readonly faqs: FaqItem[] = [
    {
      question: 'What is the minimum investment to open a VCare franchise?',
      answer:
        'Franchise investment starts at \u20B950 Lakhs for our Starter Campus tier, covering setup, licensing and initial launch support.',
    },
    {
      question: 'What kind of monthly earning can I expect?',
      answer:
        'Based on our operating centres, franchise partners can expect a minimum earning potential of \u20B91,00,000 per month at the Starter tier, scaling up to \u20B91,40,000+ at our Premier Campus tier.',
    },
    {
      question: 'Do I need prior experience in education?',
      answer:
        'No prior experience is required. VCare provides full training, recruitment support and an operational playbook so you can run your centre with confidence from day one.',
    },
    {
      question: 'What support does VCare provide after launch?',
      answer:
        "Ongoing quality audits, teacher-training refreshers, marketing toolkits and continued access to VCare's central operations team, for the entire life of your franchise.",
    },
    {
      question: 'How long does it take to open a VCare centre?',
      answer:
        'Typically between 3 to 6 months from signing the agreement, depending on how quickly your site is ready.',
    },
    {
      question: 'Is the Zero Fee Model available to franchise partners?',
      answer:
        'Yes — every VCare franchise operates under the same trusted Zero Fee Refundable Deposit Model that has built strong parent loyalty at our flagship centre.',
    },
  ];

  private readonly openFaqIndex = signal<number | null>(0);

  isFaqOpen(index: number): boolean {
    return this.openFaqIndex() === index;
  }

  toggleFaq(index: number): void {
    this.openFaqIndex.update((current) => (current === index ? null : index));
  }

  // ============================================================
  // ENQUIRY FORM
  // ============================================================

  readonly budgetOptions = [
    '\u20B950 Lakhs',
    '\u20B960 Lakhs',
    '\u20B970 Lakhs',
    'Above \u20B970 Lakhs',
  ];

  readonly formStatus = signal<FormStatus>('idle');
  readonly formErrorMessage = signal('');
  readonly form;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      city: ['', Validators.required],
      budget: ['', Validators.required],
      message: [''],
    });
  }

  get f() {
    return this.form.controls;
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

  // private async saveEnquiry(submission: FranchiseSubmission): Promise<void> {
  //   let response: Response;

  //   try {
  //     response = await fetch(`${this.authService.apiUrl}/franchise-enquiries.php`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(submission),
  //     });
  //   } catch (networkError) {
  //     console.error('Franchise enquiry network error:', networkError);
  //     throw new Error('Unable to reach the server. Please check your connection and try again.');
  //   }

  //   let result: { success?: boolean; message?: string };

  //   try {
  //     result = await response.json();
  //   } catch (parseError) {
  //     console.error('Franchise enquiry: invalid JSON response', parseError);
  //     throw new Error('Invalid server response.');
  //   }

  //   if (!response.ok || !result.success) {
  //     throw new Error(result.message ?? 'Unable to submit enquiry.');
  //   }
  // }

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
}
