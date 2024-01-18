import { FormEvent } from "react";

export default function LoginPage() {

    async function login(e: FormEvent) {
        e.preventDefault();
        try {
            await fetch(`http://localhost:3000/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: 'alice', password: 'letmein' }),
            })
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <button className="btn btn-primary" onClick={login}>Log in</button>
        </div>
    )
}