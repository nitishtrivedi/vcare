import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  OnDestroy,
  ViewChild,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { gsap, prefersReducedMotion, registerGsap } from '../../shared/motion/gsap-setup';

export interface ContactSubmission {
  name: string;
  email: string;
  phone: string;
  program: string;
  message: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact implements AfterViewInit, OnDestroy {
  @ViewChild('root', { static: true }) private root!: ElementRef<HTMLElement>;

  private readonly fb = inject(FormBuilder);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly injector = inject(Injector);
  private ctx?: gsap.Context;

  readonly formBackgroundImage = 'assets/images/contact/contact-image.jpg';

  readonly programOptions = [
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

  readonly mapEmbedUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    'https://www.google.com/maps?q=Jayshree+House%2C+Canal+Road%2C+Shivshahi+Colony+Rd%2C+Karvenagar%2C+Pune%2C+Maharashtra+411052&output=embed&z=18',
  );

  readonly formStatus = signal<FormStatus>('idle');
  readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    program: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  constructor() {
    registerGsap();
  }

  get f() {
    return this.form.controls;
  }

  ngAfterViewInit(): void {
    if (prefersReducedMotion()) return;

    this.ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .from('.ct-form-col', { autoAlpha: 0, x: -40, duration: 0.9 })
        .from('.ct-info-col', { autoAlpha: 0, x: 40, duration: 0.9 }, '<')
        .from(
          '.ct-kicker, .ct-title, .ct-lead',
          { autoAlpha: 0, y: 24, stagger: 0.1, duration: 0.7 },
          '-=0.5',
        )
        .from('.ct-card', { autoAlpha: 0, y: 40, scale: 0.97, duration: 0.8 }, '-=0.5')
        .from('.ct-field', { autoAlpha: 0, y: 16, stagger: 0.07, duration: 0.5 }, '-=0.6')
        .from(
          '.ct-info__title, .ct-info__intro',
          { autoAlpha: 0, y: 20, stagger: 0.1, duration: 0.7 },
          '-=0.9',
        )
        .from('.ct-cards > li', { autoAlpha: 0, x: 26, stagger: 0.1, duration: 0.6 }, '-=0.4');

      // Illustration: marching-ants trail, plane flight loop, pulsing pin
      gsap.to('.ct-illus__trail', {
        strokeDashoffset: -120,
        duration: 3,
        repeat: -1,
        ease: 'none',
      });

      gsap
        .timeline({ repeat: -1, repeatDelay: 0.6 })
        .fromTo(
          '.ct-illus__plane',
          { x: 0, y: 0, rotation: -10, autoAlpha: 0 },
          { x: 70, y: -22, rotation: -16, autoAlpha: 1, duration: 1.3, ease: 'power1.inOut' },
        )
        .to('.ct-illus__plane', {
          x: 160,
          y: -48,
          rotation: -22,
          duration: 1.3,
          ease: 'power1.inOut',
        })
        .to('.ct-illus__plane', { x: 250, y: -72, rotation: -24, duration: 1.1, ease: 'power1.in' })
        .to('.ct-illus__plane', { autoAlpha: 0, duration: 0.3 });

      gsap.fromTo(
        '.ct-illus__ring',
        { scale: 0.3, opacity: 0.8, svgOrigin: '300 60' },
        { scale: 2.6, opacity: 0, duration: 2, repeat: -1, ease: 'power1.out', stagger: 0.8 },
      );

      gsap.to('.ct-illus__pin', {
        y: -6,
        duration: 1.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.ct-illus__star', {
        rotation: 360,
        svgOrigin: '330 30',
        duration: 6,
        repeat: -1,
        ease: 'none',
      });

      // Animated clock
      gsap.set(['.ct-clock__h', '.ct-clock__m'], { svgOrigin: '20 20' });
      gsap.to('.ct-clock__m', { rotation: 360, duration: 6, repeat: -1, ease: 'none' });
      gsap.to('.ct-clock__h', { rotation: 360, duration: 40, repeat: -1, ease: 'none' });

      // Floating aurora blobs
      gsap.to('.ct-blob--1', {
        x: 60,
        y: 40,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.ct-blob--2', {
        x: -50,
        y: -40,
        duration: 14,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.ct-blob--3', {
        x: 40,
        y: -30,
        duration: 16,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Map reveal
      gsap.from('.ct-map', {
        autoAlpha: 0,
        scale: 0.96,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.ct-map', start: 'top 85%' },
      });

      gsap.from('.ct-map__card', {
        autoAlpha: 0,
        x: -30,
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.ct-map', start: 'top 80%' },
      });
    }, this.root.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.formStatus.set('submitting');

    try {
      await this.saveEnquiry(this.form.getRawValue() as ContactSubmission);
      this.form.reset();
      this.formStatus.set('success');

      afterNextRender(() => this.drawSuccess(), { injector: this.injector });
    } catch {
      this.formStatus.set('error');
    }
  }

  dismissStatus(): void {
    this.formStatus.set('idle');
  }

  private drawSuccess(): void {
    if (prefersReducedMotion()) return;

    gsap.fromTo(
      '.ct-success__ring',
      { scale: 0.4, autoAlpha: 0 },
      { scale: 1, autoAlpha: 1, duration: 0.7, ease: 'back.out(1.8)' },
    );
    gsap.fromTo(
      '.ct-success__check path',
      { strokeDashoffset: 60 },
      { strokeDashoffset: 0, duration: 0.8, delay: 0.25, ease: 'power2.out' },
    );
    gsap.from('.ct-success__text > *', {
      autoAlpha: 0,
      y: 14,
      stagger: 0.1,
      delay: 0.5,
      duration: 0.5,
    });
  }

  /**
   * Same endpoint and contract as before. Replace with your real persistence
   * layer whenever needed; the UI code does not need to change.
   */
  private async saveEnquiry(submission: ContactSubmission): Promise<void> {
    const response = await fetch('/api/enquiries.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission),
    });

    let result: { success?: boolean; message?: string };

    try {
      result = await response.json();
    } catch {
      throw new Error('Invalid server response.');
    }

    if (!response.ok || !result.success) {
      throw new Error(result.message ?? 'Unable to submit enquiry.');
    }
  }
}
