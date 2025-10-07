
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

async function loadRuntimeConfig() {
  if (typeof window === 'undefined') {
    return;
  }

  const globalWindow = window as Window & {
    __APP_CONFIG__?: Record<string, unknown>;
  };

  if (!globalWindow.__APP_CONFIG__) {
    globalWindow.__APP_CONFIG__ = {};
  }

  try {
    const response = await fetch('/app-config.json', {
      cache: 'no-store',
    });

    if (response.ok) {
      const config = (await response.json()) as Record<string, unknown>;
      globalWindow.__APP_CONFIG__ = {
        ...globalWindow.__APP_CONFIG__,
        ...config,
      };
    }
  } catch (error) {
    console.warn('Unable to load runtime app configuration. Falling back to defaults.', error);
  }
}

async function bootstrap() {
  await loadRuntimeConfig();

  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Could not find root element to mount to');
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

bootstrap();
