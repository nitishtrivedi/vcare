import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

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
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './vcare-genie.html',
  styleUrl: './vcare-genie.scss',
})
export class VCareGenie {
  readonly isOpen = signal(false);

  readonly isSending = signal(false);

  readonly draft = signal('');

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

  @ViewChild('messagesContainer')
  private messagesContainer?: ElementRef<HTMLDivElement>;

  private nextMessageId = 2;

  constructor(private readonly genieService: VCareGenieService) {}

  toggle(): void {
    this.isOpen.update((open) => !open);

    if (this.isOpen()) {
      this.scrollToBottom();
    }
  }

  close(): void {
    this.isOpen.set(false);
  }

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

  async send(): Promise<void> {
    const text = this.draft().trim();

    if (!text || this.isSending()) {
      return;
    }

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

    try {
      const history: GenieConversationMessage[] = this.messages()
        .slice(-10)
        .map((message) => ({
          role: message.role,
          content: message.content,
        }));

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
    }
  }

  private scrollToBottom(): void {
    /*
     * The chat is created using @if().
     *
     * Therefore the ViewChild may not exist immediately
     * after opening the chatbot or adding a new message.
     *
     * setTimeout gives Angular time to render the updated DOM.
     */
    setTimeout(() => {
      const container = this.messagesContainer?.nativeElement;

      if (!container) {
        return;
      }

      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }, 0);
  }
}
