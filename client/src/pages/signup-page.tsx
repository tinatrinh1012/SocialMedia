import { FormEvent, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoggedInUserContext } from "../App";
import { usePost } from "../hooks/usePost";
import { UserModel } from "../models/user";

export default function SignUpPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const loggedInUser = useContext(LoggedInUserContext);
    const navigate = useNavigate();
    const {sendRequest: sendSignupRequest, data: signedUpUser, status, loading} = usePost<UserModel>('/auth/signup',
        {
            username: username,
            password: password,
            firstName: firstName,
            lastName: lastName
        })

    useEffect(() => {
        if (status === 200) {
            navigate(`/user/${username}`);
            loggedInUser.setUser(signedUpUser);
        }
    }, [navigate, signedUpUser, status, username])

    async function signup(e: FormEvent) {
        e.preventDefault();
        sendSignupRequest();
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
                <button type="submit" className="btn btn-primary mt-3">
                    Sign Up
                    {loading &&
                        <div className="spinner-border spinner-border-sm ms-2" role="status"></div>
                    }
                </button>
            </form>
        </div>
    )
}