'use client';

import { Toaster } from 'react-hot-toast';

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#1a1a1a',
          color: '#f5f0eb',
          borderRadius: '8px',
          border: '1px solid rgba(201, 168, 76, 0.3)',
        },
        success: { iconTheme: { primary: '#c9a84c', secondary: '#fff' } },
        error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
      }}
    />
  );
}
