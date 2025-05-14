type LogType = 'info' | 'success' | 'warning' | 'error' | 'debug';

export const logWithColor = (type: LogType, ...args: unknown[]): void => {
  const styles: Record<LogType, string> = {
    info: 'color: #2563EB; font-weight: bold',
    success: 'color: #059669; font-weight: bold',
    warning: 'color: #D97706; font-weight: bold',
    error: 'color: #DC2626; font-weight: bold',
    debug: 'color: #6D28D9; font-weight: bold',
  };

  const style = styles[type] || styles.info;
  console.log(`%c[${type.toUpperCase()}]`, style, ...args);
};

export const setupNetworkDebugger = (): void => {
  if (import.meta.env.MODE === 'development') {
    const originalFetch = window.fetch;

    window.fetch = async (...args: Parameters<typeof fetch>): Promise<Response> => {
      const [resource, config] = args;
      logWithColor('debug', `Fetch request to: ${resource}`);

      try {
        const response = await originalFetch(resource, config);
        const clone = response.clone();

        clone.text().then(text => {
          try {
            const data = JSON.parse(text);
            logWithColor('success', `Fetch response from: ${resource}`, data);
          } catch {
            logWithColor('success', `Fetch response from: ${resource}`, text);
          }
        });

        return response;
      } catch (error) {
        logWithColor('error', `Fetch error for: ${resource}`, error);
        throw error;
      }
    };

    logWithColor('info', 'Network debugger activated');
  }
};
