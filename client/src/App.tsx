import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./components/nav-bar";
import { createContext, useEffect, useMemo, useState } from "react";
import { UserModel } from "./models/user";

type UserContextType = {
    user: UserModel | null | undefined,
    setUser: React.Dispatch<React.SetStateAction<UserModel | null | undefined>>
}

export const LoggedInUserContext = createContext<UserContextType>({user: null, setUser: () => {}})

export default function App() {
    const [user, setUser] = useState<UserModel | null>();
    const navigate = useNavigate();

    useEffect(() => {
        async function getLoggedInUser() {
            console.log("fetch current user");
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/current-user`, { credentials: 'include' });
            if (response.status === 200) {
                const user = await response.json();
                setUser(user);
            } else {
                navigate('/login');
            }
        }

        if (user == null) {
            getLoggedInUser();
        }

    }, [navigate, user])

    return (
        <>
            <LoggedInUserContext.Provider value={{user, setUser}}>
                <div className="sticky-top">
                    <NavBar/>
                </div>
                <div className="container">
                    <Outlet/>
                </div>
            </LoggedInUserContext.Provider>
        </>
    )
}