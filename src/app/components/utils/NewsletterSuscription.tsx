import{ useState } from 'react';

export default function NewsletterSubscription() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 2000);
      }
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  return (
    <div>
      <div>
        <h3>Newsletter</h3>
        <div style={{display:'flex', gap:'5px', minHeight:'22px' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="tu@email.com"
            disabled={status === 'loading' || status === 'success'}
          />
          <button
            onClick={handleSubmit}
            disabled={status === 'loading' || status === 'success'}
            style={{minWidth:'100px'}}
          >
            {status === 'loading' ? '...' : status === 'success' ? '✓' : 'Suscribirse'}
          </button>
        </div>
      </div>
      {status === 'error' && (
        <p>Error al suscribir</p>
      )}
      {status === 'success' && (
        <p>¡Gracias por suscribirte!</p>
      )}
    </div>
  );
}