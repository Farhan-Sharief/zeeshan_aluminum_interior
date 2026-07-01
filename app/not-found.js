import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f0eb',
      color: '#1a1a1a',
      fontFamily: 'var(--font-body), sans-serif',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <h1 style={{
        fontSize: '6rem',
        fontWeight: 200,
        margin: 0,
        lineHeight: 1,
        color: '#c9a84c',
        fontFamily: 'var(--font-heading), serif',
      }}>
        404
      </h1>
      <div style={{
        width: '60px',
        height: '2px',
        backgroundColor: '#c9a84c',
        margin: '1.5rem 0',
      }} />
      <h2 style={{
        fontSize: '1.25rem',
        fontWeight: 500,
        marginBottom: '0.5rem',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
      }}>
        Page Not Found
      </h2>
      <p style={{
        color: '#6b7280',
        fontSize: '0.875rem',
        marginBottom: '2rem',
        maxWidth: '400px',
      }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        style={{
          display: 'inline-block',
          padding: '0.75rem 2rem',
          border: '1px solid #c9a84c',
          color: '#c9a84c',
          textDecoration: 'none',
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          letterSpacing: '0.15em',
          fontWeight: 500,
          transition: 'all 0.3s',
        }}
      >
        Back to Home
      </Link>
    </div>
  );
}
