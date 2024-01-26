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
])

export default Router;