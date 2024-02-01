import { FormEvent, useEffect, useState } from "react";
import Router from "../routes";
import AuthService from "../services/authService";
import { UserModel } from "../models/user";
import { Link } from "react-router-dom";

export default function NavBar() {
    const [user, setUser] = useState<UserModel>();

    useEffect(() => {
        async function setCurrentUser() {
            const user = await AuthService.getLoggedInUser();
            setUser(user);
        }

        setCurrentUser();
    }, [])

    async function logout(e: FormEvent) {
        try {
            const result = await fetch(`http://localhost:3000/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            })

            if (result.status === 200) {
                Router.navigate('/login');
            } else {
                throw Error('Error logging out');
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary" style={{color: "white"}}>
                <div className="container-fluid">
                    <h1 className="navbar-brand mb-0">JustLikeFacebook</h1>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link to={'/'} className="nav-link">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link to={"/login"} className="nav-link">Log in</Link>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link" onClick={logout}>Log out</button>
                            </li>
                            <li className="nav-item">
                                <Link to={"/signup"} className="nav-link">Sign up</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <h1 className="navbar-brand mb-0">{ user?.username }</h1>
            </nav>
        </div>
    )
}