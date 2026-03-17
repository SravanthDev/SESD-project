/**
 * AI Provider Interface (Abstract Base)
 *
 * Follows OCP: open for extension (new providers), closed for modification.
 * Follows LSP: any concrete provider is substitutable here.
 * Follows DIP: AIService depends on this abstraction, not on Groq directly.
 */
export class AIProvider {
  /**
   * Generate a completion from a prompt
   * @param {string} prompt
   * @param {object} options - { temperature, maxTokens }
   * @returns {Promise<string>}
   */
  async complete(prompt, options = {}) {
    throw new Error('AIProvider.complete() must be implemented by subclass');
  }

  get name() {
    throw new Error('AIProvider.name must be implemented by subclass');
  }
}
