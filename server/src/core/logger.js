/** Centralized logger — can be swapped for Winston/Pino without touching consumers (OCP) */
class Logger {
  info(message, ...args) {
    console.log(`[INFO] ${new Date().toISOString()} — ${message}`, ...args);
  }

  warn(message, ...args) {
    console.warn(`[WARN] ${new Date().toISOString()} — ${message}`, ...args);
  }

  error(message, ...args) {
    console.error(`[ERROR] ${new Date().toISOString()} — ${message}`, ...args);
  }

  debug(message, ...args) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[DEBUG] ${new Date().toISOString()} — ${message}`, ...args);
    }
  }
}

export default new Logger();
