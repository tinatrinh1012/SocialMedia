import { FormEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoggedInUserContext } from "../App";

export default function SignUpPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const loggedInUser = useContext(LoggedInUserContext);
    const navigate = useNavigate();

    async function signup(e: FormEvent) {
        e.preventDefault();
        try {
            const result = await fetch(`http://localhost:3000/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    username: username,
                    password: password,
                    firstName: firstName,
                    lastName: lastName
                }),
            })

            if (result.status === 200) {
                navigate(`/user/${username}`);
                const user = await result.json();
                loggedInUser.setUser(user);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="row">
            <h1>Sign up</h1>
            <form className="col-sm-12 col-lg-10" onSubmit={signup}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        className="form-control"
                        id="username"
                        placeholder="Enter username"
                        onChange={(e) => {setUsername(e.target.value)}}></input>
                </div>
                <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                        className="form-control"
                        id="firstName"
                        placeholder="Enter first name"
                        onChange={(e) => {setFirstName(e.target.value)}}></input>
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Last name</label>
                    <input
                        className="form-control"
                        id="lastName"
                        placeholder="Enter last name"
                        onChange={(e) => {setLastName(e.target.value)}}></input>
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
                <button type="submit" className="btn btn-primary">Sign Up</button>
            </form>
        </div>
    )
}