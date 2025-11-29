import { Injectable, signal } from '@angular/core';
import { Message, MessageSeverity } from '../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  #messagesSignal = signal<Message | null>(null);

  message = this.#messagesSignal.asReadonly();

  showMessage(text: string, severity: MessageSeverity) {
    this.#messagesSignal.set({
      text: text,
      severity: severity,
    });
  }

  clear() {
    this.#messagesSignal.set(null);
  }
}
