import Groq from 'groq-sdk';
import { AIProvider } from './ai.provider.js';
import config from '../../../core/config.js';
import { AppError } from '../../../core/AppError.js';

/**
 * Concrete Groq implementation of AIProvider.
 * Follows LSP: fully substitutable wherever AIProvider is expected.
 */
export class GroqProvider extends AIProvider {
  constructor() {
    super();
    if (!config.groq.apiKey) {
      throw new Error('GROQ_API_KEY not configured');
    }
    this.client = new Groq({ apiKey: config.groq.apiKey });
    this.model = config.groq.model;
  }

  get name() {
    return 'Groq';
  }

  async complete(prompt, { temperature = 0.7, maxTokens = 500 } = {}) {
    try {
      const completion = await this.client.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: this.model,
        temperature,
        max_tokens: maxTokens,
      });
      return completion.choices[0].message.content;
    } catch (error) {
      throw AppError.badRequest(`AI provider error: ${error.message}`);
    }
  }
}
