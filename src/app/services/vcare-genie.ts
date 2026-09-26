import { Injectable } from '@angular/core';
import { AuthService } from './auth';

export interface GenieConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface GenieResponse {
  answer: string;
  needsContact: boolean;
}

interface GenieApiResponse {
  success?: boolean;
  message?: string;
  answer?: string;
  needs_contact?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class VCareGenieService {
  private readonly apiBaseUrl: string;

  constructor(private readonly authService: AuthService) {
    this.apiBaseUrl = this.authService.apiUrl;
  }

  async ask(messages: GenieConversationMessage[]): Promise<GenieResponse> {
    const cleanMessages = messages
      .slice(-10)
      .filter((message) => message.content.trim() !== '')
      .map((message) => ({
        role: message.role,
        content: message.content.trim().slice(0, 1000),
      }));

    if (cleanMessages.length === 0) {
      throw new Error('No valid chat messages were supplied.');
    }

    const response = await fetch(`${this.apiBaseUrl}/genie.php`, {
      method: 'POST',

      headers: {
        Accept: 'application/json',

        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        messages: cleanMessages,
      }),
    });

    let result: GenieApiResponse;

    try {
      result = (await response.json()) as GenieApiResponse;
    } catch {
      throw new Error('Invalid response from VCare Genie.');
    }

    if (!response.ok || result.success !== true) {
      throw new Error(result.message ?? 'VCare Genie is temporarily unavailable.');
    }

    if (typeof result.answer !== 'string' || result.answer.trim() === '') {
      throw new Error('VCare Genie returned an empty answer.');
    }

    return {
      answer: result.answer.trim(),
      needsContact: result.needs_contact === true,
    };
  }
}
