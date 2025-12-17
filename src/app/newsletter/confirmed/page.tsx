import Link from 'next/link';
// import { CheckCircle } from 'lucide-react';

export default function NewsletterConfirmed() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          {/* <CheckCircle className="w-12 h-12 text-green-600" /> */}
          check circle
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          ¡Suscripción Confirmada!
        </h1>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          Tu email ha sido verificado exitosamente. Ahora recibirás todas nuestras novedades, 
          tips exclusivos y contenido especial directamente en tu inbox.
        </p>
        
        <div className="bg-green-50 rounded-lg p-4 mb-6">
          <p className="text-green-800 text-sm font-medium">
            ¡Bienvenido a nuestra comunidad! 🎉
          </p>
        </div>
        
        <Link
          href="/"
          className="inline-block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}