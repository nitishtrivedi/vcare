import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ScrollReveal } from '../../directives/scroll-reveal';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface ContactSubmission {
  name: string;
  email: string;
  phone: string;
  program: string;
  message: string;
}

interface ProgramOption {
  value: string;
  label: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, ScrollReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  // Background photo behind the form panel. Drop the real campus/hero shot
  // here — public/assets/images/contact/contact-hero.jpg. Until it exists,
  // the SCSS fallback gradient + glows keep this panel looking intentional.
  readonly formBackgroundImage = 'assets/images/contact/contact-image.jpg';

  readonly programOptions: ProgramOption[] = [
    { value: 'parent-toddler', label: 'Parent Toddler Program' },
    { value: 'playgroup', label: 'Playgroup' },
    { value: 'nursery', label: 'Nursery' },
    { value: 'junior-kg', label: 'Junior KG' },
    { value: 'senior-kg', label: 'Senior KG' },
    { value: 'after-school', label: 'After School Program' },
    { value: 'daycare', label: 'Daycare' },
    { value: 'zero-fee-model', label: 'Zero Fee Model Enquiry' },
    { value: 'other', label: 'Something Else' },
  ];

  readonly directionsUrl =
    'https://www.google.com/maps/dir/?api=1&destination=Jayshree+House%2C+Canal+Road%2C+Shivshahi+Colony+Rd%2C+Karvenagar%2C+Pune%2C+Maharashtra+411052';

  readonly formStatus = signal<FormStatus>('idle');
  readonly form;
  readonly mapEmbedUrl: SafeResourceUrl;

  constructor(
    private readonly fb: FormBuilder,
    private readonly sanitizer: DomSanitizer,
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      program: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });

    // this.mapEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    //   'https://www.google.com/maps?q=Survey+No+20%2F2%2B3%2C+Jayshree+Nivas%2C+Shivshahi+Colony%2C+Canal+Rd%2C+Karvenagar%2C+Pune%2C+Maharashtra+411052&output=embed',
    // );
    this.mapEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.google.com/maps?q=Jayshree+House%2C+Canal+Road%2C+Shivshahi+Colony+Rd%2C+Karvenagar%2C+Pune%2C+Maharashtra+411052&output=embed&z=18',
    );
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

    try {
      await this.saveEnquiry(this.form.getRawValue() as ContactSubmission);
      this.formStatus.set('success');
      this.form.reset();
    } catch {
      this.formStatus.set('error');
    }
  }

  dismissStatus(): void {
    this.formStatus.set('idle');
  }

  /**
   * Persists a contact enquiry. Currently a stub that just logs the payload —
   * wire this up to a real destination when ready, e.g.:
   *   - POST to a backend API (Node/Express, .NET, etc.)
   *   - Firestore / Supabase insert
   *   - A transactional email service (SendGrid, Resend) notifying the team
   * Keeping this as its own method means the form/UI code never has to change
   * when the persistence layer does.
   */
  private async saveEnquiry(submission: ContactSubmission): Promise<void> {
    // TODO: replace with real persistence.
    // console.log('New V Care contact enquiry:', submission);
    // await new Promise((resolve) => setTimeout(resolve, 900));
    const response = await fetch('/api/enquiries.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submission),
    });

    let result: {
      success?: boolean;
      message?: string;
    };

    try {
      result = await response.json();
    } catch {
      throw new Error('Invalid server response.');
    }

    if (!response.ok || !result.success) {
      throw new Error(result.message ?? 'Unable to submit enquiry.');
    }
  }

  isProgramDropdownOpen = false;

  programs = [
    {
      value: 'playgroup',
      name: 'Playgroup',
      description: 'A joyful start to early learning',
      icon: '🧸',
    },
    {
      value: 'nursery',
      name: 'Nursery',
      description: 'Learning through play & discovery',
      icon: '🌱',
    },
    {
      value: 'junior-kindergarten',
      name: 'Junior Kindergarten',
      description: 'Building confidence & independence',
      icon: '🎨',
    },
    {
      value: 'senior-kindergarten',
      name: 'Senior Kindergarten',
      description: 'Preparing children for the next step',
      icon: '🎓',
    },
    {
      value: 'after-school',
      name: 'After School Program',
      description: 'A safe and engaging space after school',
      icon: '🌈',
    },
  ];
}
