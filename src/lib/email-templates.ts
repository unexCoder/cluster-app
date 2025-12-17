// import { Montreal } from "../../public/fonts/Montreal.otf"

export const welcomeEmailTemplate = (email: string, confirmationToken?: string) => {
  // Usar la URL completa con protocolo
  const baseUrl = process.env.APP_URL || 'http://localhost:3000';
  const confirmationUrl = confirmationToken 
    ? `${baseUrl}/api/newsletter/confirm?token=${confirmationToken}`
    : null;

  return {
    subject: '¡Bienvenido a la red Cluster!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bienvenido</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #231123; padding: 40px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #CFCBCA; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 20px; text-align: center;">
                      <h1 style="margin: 0; color: #231123; font-size: 28px; font-weight: 600;">
                        ¡Bienvenido a la red Cluster!
                      </h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 20px 40px;">
                      <p style="margin: 0 0 20px; color: #231123; font-size: 16px; line-height: 1.6;">
                        Gracias por unirte a nuestro newsletter.
                      </p>
                      
                      ${confirmationUrl ? `
                        <p style="margin: 0 0 20px; color: #231123; font-size: 16px; line-height: 1.6;">
                          Para completar tu suscripción, por favor confirma tu email:
                        </p>
                        
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                          <tr>
                            <td align="center">
                              <a href="${confirmationUrl}" style="display: inline-block; padding: 14px 32px; background-color: #c30f45; color: #231123; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">
                                Confirmar mi email
                              </a>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="margin: 20px 0 0; color: #231123; font-size: 14px; line-height: 1.6;">
                          O copia y pega este enlace en tu navegador:<br>
                          <a href="${confirmationUrl}" style="color: #3b82f6; word-break: break-all;">${confirmationUrl}</a>
                        </p>
                        
                        <p style="margin: 20px 0 0; color: #718096; font-size: 14px;">
                          Este enlace expira en 24 horas.
                        </p>
                      ` : `
                        <p style="margin: 0 0 20px; color: #231123; font-size: 16px; line-height: 1.6;">
                          Ahora recibirás todas nuestras novedades, tips exclusivos y contenido especial directamente en tu inbox.
                        </p>
                      `}
                    </td>
                  </tr>
                  
                  <!-- Benefits -->
                  <tr>
                    <td style="padding: 20px 40px;">
                      <h2 style="margin: 0 0 20px; color: #231123; font-size: 20px; font-weight: 600;">
                        Qué vas a recibir:
                      </h2>
                      <ul style="margin: 0; padding: 0 0 0 20px; color: #231123; font-size: 15px; line-height: 1.8;">
                        <li>Noticias y recursos exclusivos</li>
                        <li>Novedades y actualizaciones importantes</li>
                        <li>Ofertas especiales solo para suscriptores</li>
                        <li>Contenido relevante y de calidad</li>
                      </ul>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; border-top: 1px solid #e2e8f0;">
                      <p style="margin: 0 0 10px; color: #231123; font-size: 14px; line-height: 1.6;">
                        Saludos,<br>
                        <strong>El equipo de Cluster</strong>
                      </p>
                      <p style="margin: 20px 0 0; color: #231123; font-size: 12px; line-height: 1.6;">
                        Si no te suscribiste a esta lista, puedes ignorar este email.<br>
                        Para dejar de recibir emails, <a href="${process.env.APP_URL}/unsubscribe" style="color: #3b82f6;">haz clic aquí</a>.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>      
    `,
    text: confirmationUrl 
      ? `¡Bienvenido a nuestra comunidad!\n\nGracias por unirte. Para completar tu suscripción, confirma tu email visitando:\n\n${confirmationUrl}\n\nEste enlace expirará en 24 horas.\n\nSaludos,\nEl equipo de Cluster`
      : `¡Bienvenido a nuestra comunidad!\n\nGracias por unirte. Ahora recibirás todas nuestras novedades directamente en tu inbox.\n\nSaludos,\nEl equipo de Cluster`
  };
};