'use client'
import styles from './page.module.css'
import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false
            })

            if (!result?.ok) {
                setError(result?.error || "Login failed")
                return
            }

            router.push("/dashboard")
        } catch (err) {
            setError("An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={styles.mainContainer}>
            <div className={styles.loginContainer}>
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputContainer}>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.inputContainer}>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className={styles.input}
                        />
                    </div>
                    {error && <p className={styles.errorMsg}>{error}</p>}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={styles.submitBtn}
                    >
                        {isLoading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    )
}
