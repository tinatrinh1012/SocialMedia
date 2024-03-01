import { FormEvent, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoggedInUserContext } from "../App";

export default function NavBar() {
    const navigate = useNavigate();
    const loggedInUser = useContext(LoggedInUserContext);

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
                loggedInUser.setUser(null);
                navigate('/login');
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
                            {loggedInUser.user ? (
                                <>
                                    <li className="nav-item">
                                        <Link to={`/user/${loggedInUser.user.username}`} className="nav-link">My Profile</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to={'/find-users'} className="nav-link">Find Users</Link>
                                    </li>
                                    <li className="nav-item">
                                        <button className="nav-link" onClick={logout}>Log out</button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link to={"/login"} className="nav-link">Log in</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to={"/signup"} className="nav-link">Sign up</Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
                <h1 className="navbar-brand mb-0">{ loggedInUser?.user?.firstName} { loggedInUser?.user?.lastName}</h1>
            </nav>
        </div>
    )
}