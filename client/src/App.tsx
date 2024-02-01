import { Outlet } from "react-router-dom";
import NavBar from "./components/nav-bar";

export default function App() {
    return (
        <>
            <NavBar/>
            <div className="container">
                <Outlet/>
            </div>
        </>
    )
}