'use client'
import styles from './page.module.css'
import styles2 from '../../components/auth/registerForm.module.css'
import { useState } from "react"
import { useRouter } from "next/navigation"
import LoginForm from '@/app/components/auth/LoginForm'

export default function LoginPage() {
    return (
        <div className={styles.container}>
            <div className={styles2.formWrapper}>
                <h1>Sign In</h1>
                <LoginForm />
            </div>
        </div>
    );
}

// legacy
// return (
//     <div className={styles.mainContainer}>
//         <div className={styles.loginContainer}>
//             <h1>Login</h1>
//             <form onSubmit={handleSubmit}>
//                 <div className={styles.credentialsContainer}>
//                     <div className={styles.inputContainer}>
//                         <label>Email:</label>
//                         <input
//                             type="email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             required
//                             className={styles.input}
//                         />
//                     </div>
//                     <div className={styles.inputContainer}>
//                         <label>Password:</label>
//                         <input
//                             type="password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             required
//                             className={styles.input}
//                         />
//                     </div>
//                 </div>
//                 {error && <p className={styles.errorMsg}>{error}</p>}
//                 <button
//                     type="submit"
//                     disabled={isLoading}
//                     className={styles.submitBtn}
//                 >
//                     {isLoading ? "Signing in..." : "Sign In"}
//                 </button>
//             </form>
//         </div>
//     </div>
// )
