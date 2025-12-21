'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import '../globals.css'
import { color } from 'three/tsl';

function UnsubscribeResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason') || 'unknown';

  const messages: Record<string, { 
    title: string; 
    description: string; 
    icon: string;
    color: string;
  }> = {
    success: {
      title: '¡Desuscripción exitosa!',
      description: 'Ya no recibirás más correos de nuestra lista.',
      icon: '✓',
      color: 'green'
    },
    already_unsubscribed: {
      title: 'Ya estabas desuscrito',
      description: 'Tu correo ya ha sido removido de nuestra lista anteriormente.',
      icon: 'ℹ',
      color: 'blue'
    },
    not_found: {
      title: 'Suscripción no encontrada',
      description: 'No pudimos encontrar tu suscripción en nuestra base de datos.',
      icon: '✕',
      color: 'red'
    },
    missing_email: {
      title: 'Enlace inválido',
      description: 'El enlace de desuscripción no contiene un email válido.',
      icon: '✕',
      color: 'red'
    },
    update_failed: {
      title: 'Error al desuscribir',
      description: 'No pudimos procesar tu desuscripción. Por favor intenta nuevamente.',
      icon: '✕',
      color: 'red'
    },
    server_error: {
      title: 'Error del servidor',
      description: 'Ocurrió un error inesperado. Por favor intenta más tarde.',
      icon: '✕',
      color: 'red'
    },
    unknown: {
      title: 'Error desconocido',
      description: 'Ocurrió un error inesperado.',
      icon: '✕',
      color: 'red'
    }
  };

  const message = messages[reason] || messages.unknown;

  return (
    <div className='mainContainer'>
      <div className='logContainer'>
        <h1 className="title">{message.title}</h1>
        <div className='icon' style={{color:message.color}}>{message.icon}</div>
        <h3>{message.description}</h3>

        {message.color === 'green' && (
          <h4>Si cambiaste de opinión, siempre puedes volver a suscribirte en nuestra página principal.</h4>
        )}
        
        <button
          className='btn'
          onClick={() => router.push('/')}
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}

export default function UnsubscribeResultPage() {
  return (
    <Suspense fallback={
      <div>
        <div>Cargando...</div>
      </div>
    }>
      <UnsubscribeResultContent />
    </Suspense>
  );
}