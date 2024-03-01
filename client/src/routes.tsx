import { createBrowserRouter } from "react-router-dom"
import FindUsersPage from "./pages/find-users-page";
import ErrorPage from "./pages/error-page";
import UserPage from "./pages/user-page";
import LoginPage from "./pages/login-page";
import SignUpPage from "./pages/signup-page";
import App from "./App";
import NewsFeedPage from "./pages/news-feed-page";

const Router = createBrowserRouter([
	{
		path: "",
		element: <App/>,
		errorElement: <ErrorPage />,
		children: [
			{
				path: "news-feed",
				element: <NewsFeedPage />
			},
			{
				path: "find-users",
				element: <FindUsersPage />
			},
			{
				path: "user/:username",
				element: <UserPage />
			},
			{
				path: "login",
				element: <LoginPage />
			},
			{
				path: "signup",
				element: <SignUpPage />
			}
		]
	}
])

export default Router;