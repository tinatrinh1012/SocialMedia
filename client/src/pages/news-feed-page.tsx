import { useContext, useEffect } from "react"
import { LoggedInUserContext } from "../App"

export default function NewsFeedPage() {
    const loggedInUser = useContext(LoggedInUserContext);

    useEffect(() => {
        async function getUserNewsFeed() {
            try {
                const response = await fetch('http://localhost:3000/posts/news', { credentials: 'include'});
            } catch (error) {

            }

        }

        getUserNewsFeed();
    }, [])

    return (
        <>
            <h2 className="mt-3">News Feed</h2>
        </>
    )
}