import { FormEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoggedInUserContext } from "../App";

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const loggedInUser = useContext(LoggedInUserContext);

    async function login(e: FormEvent) {
        e.preventDefault();
        try {
            const result = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ username: username, password: password }),
            })

            if (result.status === 200) {
                navigate(`/user/${username}`);
                const user = await result.json();
                loggedInUser.setUser(user);
            } else {
                window.alert('Unable to log in');
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="row">
            <h1>Log In</h1>
            <form className="col-sm-12 col-lg-10" onSubmit={login}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        className="form-control"
                        id="username"
                        placeholder="Enter username"
                        onChange={(e) => {setUsername(e.target.value)}}></input>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Password"
                        onChange={(e) => {setPassword(e.target.value)}}></input>
                </div>
                <button type="submit" className="btn btn-primary">Log in</button>
            </form>
        </div>
    )
}