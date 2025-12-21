import Link from 'next/link';
import '../globals.css';

export default function NewsletterConfirmed() {
  return (
    <div>
        <div className='mainContainer'>
          <div className="logContainer">
              <div className='icon'>✓</div>
              
              <h1 className='title'>Email Confirmado</h1>
              <h4>Tu dirección de correo ha sido verificada.</h4>
              <h3 style={{marginTop:'5px'}}>Bienvenido a la Red Cluster!</h3>
              <button className='btn'> 
                <Link href={'/'}>CONTINUAR</Link>
              </button>
          </div>
        </div>
    </div>
  )
}