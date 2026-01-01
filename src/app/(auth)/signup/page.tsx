// src/app/(auth)/signup/page.tsx
import RegisterForm from '@/app/components/auth/RegisterForm';
import styles from '../../components/auth/registerForm.module.css';

export const metadata = {
  title: 'Sign Up | Cluster App',
  description: 'Create a new account',
};

export default function SignupPage() {
  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1>Create Account</h1>
        <RegisterForm />
        <p className={styles.switchAuth}>
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
}