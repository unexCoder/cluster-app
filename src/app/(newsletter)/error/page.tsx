import Link from "next/link";
import '../globals.css'

export default async function NewsletterError({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  // Await the entire searchParams object first
  const { reason } = await searchParams;
  const errorReason = reason || 'unknown';

  const errorMessages = {
    invalid_token: {
      title: 'Token Inválido',
      message: 'El enlace de confirmación no es válido. Por favor, verifica que hayas copiado la URL completa.',
      color: 'red',
    },
    not_found: {
      title: 'Token No Encontrado',
      message: 'No pudimos encontrar tu solicitud de suscripción. Es posible que ya hayas confirmado tu email.',
      color: 'yellow',
    },
    expired: {
      title: 'Token Expirado',
      message: 'El enlace de confirmación ha expirado. Los enlaces son válidos por 24 horas. Por favor, suscríbete nuevamente.',
      color: 'orange',
    },
    server_error: {
      title: 'Error del Servidor',
      message: 'Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente más tarde.',
      color: 'red',
    },
    unknown: {
      title: 'Error Desconocido',
      message: 'Algo salió mal. Por favor, intenta nuevamente o contáctanos si el problema persiste.',
      color: 'gray',
    },
  };

  const error = errorMessages[errorReason as keyof typeof errorMessages] || errorMessages.unknown;

  return (
    <div className="mainContainer">
      <div className="logContainer">
        <div className="icon">✕</div>
        <h1 className="title">Algo salió mal</h1>
        <p>{error.title}</p>
        <h4 style={{marginTop:'5px'}}>No pudimos procesar tu suscripción. Por favor verifica tu correo electrónico.</h4>
        <button className='btn'>
          <a href="#">INTENTA NUEVAMENTE</a>
        </button>
      </div>
    </div>
  );
}