import Link from "next/link";

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

  const colorClasses = {
    red: {
      bg: 'from-red-50 to-red-100',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      button: 'bg-red-600 hover:bg-red-700',
    },
    yellow: {
      bg: 'from-yellow-50 to-yellow-100',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      button: 'bg-yellow-600 hover:bg-yellow-700',
    },
    orange: {
      bg: 'from-orange-50 to-orange-100',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      button: 'bg-orange-600 hover:bg-orange-700',
    },
    gray: {
      bg: 'from-gray-50 to-gray-100',
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600',
      button: 'bg-gray-600 hover:bg-gray-700',
    },
  };

  const colors = colorClasses[error.color as keyof typeof colorClasses];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.bg} flex items-center justify-center p-4`}>
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className={`inline-flex items-center justify-center w-20 h-20 ${colors.iconBg} rounded-full mb-6`}>
          {/* <Icon className={`w-12 h-12 ${colors.iconColor}`} /> */}
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {error.title}
        </h1>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          {error.message}
        </p>
        
        <div className="space-y-3">
          <Link
            href="/"
            className={`inline-block w-full ${colors.button} text-white font-semibold py-3 px-6 rounded-lg transition duration-200`}
          >
            Volver al inicio
          </Link>
          
          {(errorReason === 'expired' || errorReason === 'not_found') && (
            <Link
              href="/#newsletter"
              className="inline-block w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg border-2 border-gray-200 transition duration-200"
            >
              Suscribirme nuevamente
            </Link>
          )}
        </div>
        
        <p className="text-gray-500 text-sm mt-6">
          ¿Necesitas ayuda?{' '}
          <a href="mailto:soporte@tudominio.com" className="text-blue-600 hover:underline">
            Contáctanos
          </a>
        </p>
      </div>
    </div>
  );
}