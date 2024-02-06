import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./components/nav-bar";
import { createContext, useEffect, useState } from "react";
import { UserModel } from "./models/user";

export const CurrentUserContext = createContext<UserModel | null | undefined>(null)

export default function App() {
    const [user, setUser] = useState<UserModel | null>();
    const navigate = useNavigate();

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

        getLoggedInUser();
    }, [navigate])

    return (
        <>
            <CurrentUserContext.Provider value={user}>
                <NavBar/>
                <div className="container">
                    <Outlet/>
                </div>
            </CurrentUserContext.Provider>
        </>
    )
}