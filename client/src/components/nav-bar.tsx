import { FormEvent, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoggedInUserContext } from "../App";
import { usePost } from "../hooks/usePost";

export default function NavBar() {
    const navigate = useNavigate();
    const loggedInUser = useContext(LoggedInUserContext);
    const { sendRequest: sendLogoutRequest, status: logoutStatus } = usePost<any>(`/auth/logout`);

    useEffect(() => {
        if (logoutStatus === 200) {
            navigate('/login');
            loggedInUser.setUser(null);
        }
    }, [loggedInUser, logoutStatus, navigate])

    async function logout(e: FormEvent) {
        e.preventDefault();
        sendLogoutRequest();
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
                                        <Link to={`/news-feed`} className="nav-link">News Feed</Link>
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
                <h1 className="navbar-brand mb-0">
                    <Link to={`/user/${loggedInUser?.user?.username}`} className="nav-link">
                        { loggedInUser?.user?.firstName} { loggedInUser?.user?.lastName}
                    </Link>
                </h1>
            </nav>
        </div>
    )
}