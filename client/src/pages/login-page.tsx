import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();

    async function login(e: FormEvent) {
        const username = 'alice';

        try {
            const result = await fetch(`http://localhost:3000/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: username, password: 'letmein' }),
            })

            if (result.status === 200) {
                navigate(`/user/${username}`);
            } else {
                window.alert('Unable to log in');
            }
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