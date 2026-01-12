'use client'
import styles from './page.module.css'
import styles2 from '../../components/auth/registerForm.module.css'
import LoginForm from '@/app/components/auth/LoginForm'

export default function LoginPage() {
    return (
        <div className={styles.container}>
            <div className={styles2.formWrapper}>
                <h1>Iniciar sesión</h1>
                <LoginForm />
            </div>
        </div>
    );
}