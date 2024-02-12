import { Outlet, useLocation, useNavigate } from "react-router-dom";
import NavBar from "./components/nav-bar";
import { createContext, useEffect, useState } from "react";
import { UserModel } from "./models/user";

export const LoggedInUserContext = createContext<UserModel | null | undefined>(null)

export default function App() {
    const [user, setUser] = useState<UserModel | null>();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        async function getLoggedInUser() {
            const response = await fetch('http://localhost:3000/auth/current-user', { credentials: 'include' });
            if (response.status === 200) {
                const user = await response.json();
                setUser(user);
            } else {
                setUser(null);
                navigate('/new-user/login');
            }
        }

        if (!location.pathname.includes('new-user')) {
            getLoggedInUser();
        }

    }, [location, navigate])

    return (
        <>
            <LoggedInUserContext.Provider value={user}>
                <NavBar/>
                <div className="container">
                    <Outlet/>
                </div>
            </LoggedInUserContext.Provider>
        </>
    )
}