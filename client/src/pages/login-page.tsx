import { FormEvent, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoggedInUserContext } from "../App";
import { usePost } from "../hooks/usePost";
import { UserModel } from "../models/user";

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const loggedInUser = useContext(LoggedInUserContext);
    const { sendRequest: sendLoginRequest, data: loginUser, status: loginStatus, loading } = usePost<UserModel>(`/auth/login`, { username: username, password: password });

    useEffect(() => {
        if (loginStatus === 200) {
            navigate(`/news-feed`);
            loggedInUser.setUser(loginUser);
        }
    }, [loggedInUser, loginStatus, loginUser, navigate])

    async function login(e: FormEvent) {
        e.preventDefault();
        sendLoginRequest();
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
                <button type="submit" className="btn btn-primary mt-3">
                    Log in
                    {loading &&
                        <div className="spinner-border spinner-border-sm ms-2" role="status"></div>
                    }
                </button>
            </form>
        </div>
    )
}