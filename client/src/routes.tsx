import { createBrowserRouter } from "react-router-dom"
import HomePage from "./pages/home-page";
import ErrorPage from "./pages/error-page";
import UserPage from "./pages/user-page";
import LoginPage from "./pages/login-page";
import SignUpPage from "./pages/signup-page";

const Router = createBrowserRouter([
	{
		path: "/",
		element: <HomePage />,
		errorElement: <ErrorPage />
	},
	{
		path: "/login",
		element: <LoginPage />
	},
	{
		path: "/signup",
		element: <SignUpPage />
	},
	{
		path: "/user/:username",
		element: <UserPage />
	}
	// TODO: wrap nav bar in router using outlet,
	// once nav bar stops reloading every time, then only need to request current logged in user once
])

export default Router;