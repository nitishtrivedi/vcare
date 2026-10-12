import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';

import { gsap, prefersReducedMotion, registerGsap } from '../../shared/motion/gsap-setup';

import { GenieConversationMessage, VCareGenieService } from '../../services/vcare-genie';

interface GenieMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  needsContact?: boolean;
  error?: boolean;
}

@Component({
  selector: 'app-vcare-genie',
  imports: [RouterLink, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './vcare-genie.html',
  styleUrl: './vcare-genie.scss',
})
export class VCareGenie implements AfterViewInit, OnDestroy {
  // --------------------------------------------------------------------------
  // CHAT STATE
  // --------------------------------------------------------------------------

  readonly isOpen = signal(false);

  readonly isSending = signal(false);

  readonly draft = signal('');

  readonly justCast = signal(false);

  readonly quickQuestions = [
    'What programs do you offer?',
    'Tell me about the Zero Fee Model.',
    'What are your daycare timings?',
  ];

  readonly messages = signal<GenieMessage[]>([
    {
      id: 1,
      role: 'assistant',
      content:
        'Hi! I’m VCare Genie ✨ I can help you with basic questions about V Care Education, our programs, timings, safety, the Zero Fee Model and more.',
    },
  ]);

  // --------------------------------------------------------------------------
  // DOM REFERENCES
  // --------------------------------------------------------------------------

  private panelElement?: HTMLElement;

  private panelContext?: gsap.Context;

  private triggerFloat?: gsap.core.Tween;

  private nextMessageId = 2;

  private isClosing = false;

  @ViewChild('panel')
  set panelRef(ref: ElementRef<HTMLElement> | undefined) {
    if (!ref) {
      return;
    }

    this.panelElement = ref.nativeElement;

    this.animatePanelIn(ref.nativeElement);
  }

  @ViewChild('trigger', { static: true })
  private triggerButton!: ElementRef<HTMLButtonElement>;

  @ViewChild('sendButton')
  private sendButton?: ElementRef<HTMLButtonElement>;

  @ViewChild('messagesContainer')
  private messagesContainer?: ElementRef<HTMLDivElement>;

  // --------------------------------------------------------------------------
  // INITIALIZATION
  // --------------------------------------------------------------------------

  constructor(private readonly genieService: VCareGenieService) {
    //registerGsap();
  }

  ngAfterViewInit(): void {
    this.startTriggerFloat();
  }

  ngOnDestroy(): void {
    this.triggerFloat?.kill();
    this.panelContext?.revert();

    if (this.triggerButton?.nativeElement) {
      gsap.killTweensOf(this.triggerButton.nativeElement);
    }

    if (this.sendButton?.nativeElement) {
      gsap.killTweensOf(this.sendButton.nativeElement);
    }

    if (this.panelElement) {
      gsap.killTweensOf(this.panelElement);
    }
  }

  // --------------------------------------------------------------------------
  // GSAP — PANEL ENTRANCE
  // --------------------------------------------------------------------------

  private animatePanelIn(panel: HTMLElement): void {
    this.panelContext?.revert();
    this.panelContext = undefined;

    if (prefersReducedMotion()) {
      // The panel remains visible without waiting for animation.
      return;
    }

    this.panelContext = gsap.context(() => {
      const timeline = gsap.timeline();

      // Main window entrance.
      timeline.fromTo(
        panel,
        {
          autoAlpha: 0,
          y: 24,
          scale: 0.965,
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.44,
          ease: 'power3.out',
          clearProps: 'willChange',
        },
      );

      // Stagger the welcome content.
      const welcomeItems = panel.querySelectorAll(
        '.genie__hero-badge, ' +
          '.genie__hero-title, ' +
          '.genie__hero-text, ' +
          '.genie__quick-heading, ' +
          '.genie__hero-footnote',
      );

      if (welcomeItems.length) {
        timeline.fromTo(
          welcomeItems,
          {
            autoAlpha: 0,
            y: 14,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.32,
            stagger: 0.055,
            ease: 'power2.out',
          },
          '-=0.18',
        );
      }

      // Suggested question cards arrive one after another.
      const quickCards = panel.querySelectorAll('.genie__quick-card');

      if (quickCards.length) {
        timeline.fromTo(
          quickCards,
          {
            autoAlpha: 0,
            y: 12,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.28,
            stagger: 0.07,
            ease: 'power2.out',
          },
          '-=0.12',
        );
      }

      // Keep the illustrated mascot gently floating.
      const heroAvatar = panel.querySelector('.genie__hero-avatar');

      if (heroAvatar) {
        gsap.to(heroAvatar, {
          y: -5,
          duration: 2.1,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      }

      // Subtle movement for decorative stars.
      const stars = panel.querySelectorAll('.genie__scene-star');

      if (stars.length) {
        gsap.to(stars, {
          y: -5,
          duration: 1.6,
          ease: 'sine.inOut',
          stagger: 0.25,
          repeat: -1,
          yoyo: true,
        });
      }
    }, panel);
  }

  // --------------------------------------------------------------------------
  // GSAP — FLOATING LAUNCHER
  // --------------------------------------------------------------------------

  private startTriggerFloat(): void {
    const trigger = this.triggerButton?.nativeElement;

    if (!trigger || prefersReducedMotion() || this.isOpen()) {
      return;
    }

    this.triggerFloat?.kill();

    this.triggerFloat = gsap.to(trigger, {
      y: -4,
      duration: 2.2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
  }

  private stopTriggerFloat(): void {
    this.triggerFloat?.kill();
    this.triggerFloat = undefined;

    const trigger = this.triggerButton?.nativeElement;

    if (trigger) {
      gsap.to(trigger, {
        y: 0,
        duration: prefersReducedMotion() ? 0 : 0.2,
        ease: 'power2.out',
        overwrite: true,
      });
    }
  }

  // --------------------------------------------------------------------------
  // GSAP — MESSAGE ENTRANCE
  // --------------------------------------------------------------------------

  private animateLatestMessage(role: 'user' | 'assistant'): void {
    if (prefersReducedMotion()) {
      return;
    }

    // Allow Angular to finish rendering the signal-driven message list.
    setTimeout(() => {
      const container = this.messagesContainer?.nativeElement;

      if (!container) {
        return;
      }

      const rows = container.querySelectorAll(`.genie__message-row--${role}`);

      const latest = rows.item(rows.length - 1);

      if (!latest) {
        return;
      }

      gsap.fromTo(
        latest,
        {
          autoAlpha: 0,
          y: 10,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.32,
          ease: 'power2.out',
          overwrite: true,
        },
      );
    }, 0);
  }

  // --------------------------------------------------------------------------
  // OPEN / CLOSE
  // --------------------------------------------------------------------------

  toggle(): void {
    if (this.isOpen()) {
      this.close();
      return;
    }

    this.stopTriggerFloat();
    this.isOpen.set(true);

    this.scrollToTop();
  }

  private scrollToTop(): void {
    setTimeout(() => {
      const container = this.messagesContainer?.nativeElement;

      if (!container) {
        return;
      }

      container.scrollTo({
        top: 0,
        behavior: 'auto',
      });
    }, 0);
  }

  close(): void {
    if (!this.isOpen() || this.isClosing) {
      return;
    }

    const panel = this.panelElement;

    if (!panel || prefersReducedMotion()) {
      this.finishClose();
      return;
    }

    this.isClosing = true;

    // Animate out before removing the panel from the Angular view.
    gsap.to(panel, {
      autoAlpha: 0,
      y: 12,
      scale: 0.975,
      duration: 0.2,
      ease: 'power2.in',
      overwrite: true,
      onComplete: () => this.finishClose(),
    });
  }

  private finishClose(): void {
    this.panelContext?.revert();
    this.panelContext = undefined;
    this.panelElement = undefined;

    this.isClosing = false;
    this.isOpen.set(false);

    this.startTriggerFloat();
  }

  // --------------------------------------------------------------------------
  // MESSAGE INPUT
  // --------------------------------------------------------------------------

  setDraft(value: string): void {
    this.draft.set(value);
  }

  onInput(event: Event): void {
    const target = event.target;

    if (!(target instanceof HTMLTextAreaElement)) {
      return;
    }

    this.draft.set(target.value);
  }

  onComposerKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' || event.shiftKey) {
      return;
    }

    event.preventDefault();

    void this.send();
  }

  useQuickQuestion(question: string): void {
    this.draft.set(question);

    void this.send();
  }

  // --------------------------------------------------------------------------
  // SEND BUTTON FEEDBACK
  // --------------------------------------------------------------------------

  private playCastBurst(): void {
    this.justCast.set(true);

    const button = this.sendButton?.nativeElement;

    if (button && !prefersReducedMotion()) {
      gsap.fromTo(
        button,
        {
          scale: 0.9,
          rotate: -7,
        },
        {
          scale: 1,
          rotate: 0,
          duration: 0.38,
          ease: 'back.out(2)',
          overwrite: true,
        },
      );
    }

    setTimeout(() => {
      this.justCast.set(false);
    }, 500);
  }

  // --------------------------------------------------------------------------
  // SEND MESSAGE — EXISTING API CONTRACT PRESERVED
  // --------------------------------------------------------------------------

  async send(): Promise<void> {
    const text = this.draft().trim();

    if (!text || this.isSending()) {
      return;
    }

    this.playCastBurst();

    // Add the user's message immediately.
    this.messages.update((current) => [
      ...current,
      {
        id: this.nextMessageId++,
        role: 'user',
        content: text,
      },
    ]);

    this.draft.set('');
    this.isSending.set(true);

    this.scrollToBottom();
    this.animateLatestMessage('user');

    try {
      const history: GenieConversationMessage[] = this.messages()
        .slice(-10)
        .map((message) => ({
          role: message.role,
          content: message.content,
        }));

      // Existing service and backend API are unchanged.
      const response = await this.genieService.ask(history);

      this.messages.update((current) => [
        ...current,
        {
          id: this.nextMessageId++,
          role: 'assistant',
          content: response.answer,
          needsContact: response.needsContact,
        },
      ]);
    } catch {
      this.messages.update((current) => [
        ...current,
        {
          id: this.nextMessageId++,
          role: 'assistant',
          content:
            'I’m sorry, VCare Genie is temporarily unavailable. Please use our Contact page and our team will be happy to help.',
          needsContact: true,
          error: true,
        },
      ]);
    } finally {
      this.isSending.set(false);

      this.scrollToBottom();
      this.animateLatestMessage('assistant');
    }
  }

  // --------------------------------------------------------------------------
  // SCROLL CHAT TO THE LATEST MESSAGE
  // --------------------------------------------------------------------------

  private scrollToBottom(): void {
    setTimeout(() => {
      const container = this.messagesContainer?.nativeElement;

      if (!container) {
        return;
      }

      container.scrollTo({
        top: container.scrollHeight,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });
    }, 0);
  }
}
