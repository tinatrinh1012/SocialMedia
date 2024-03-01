import { useEffect, useState } from "react"
import { PostModel } from "../models/post";
import Post from "../components/post";

export default function NewsFeedPage() {
    const [feedPosts, setFeedPosts] = useState<PostModel[]>();

    useEffect(() => {
        async function getUserNewsFeed() {
            try {
                const response = await fetch('http://localhost:3000/posts/news-feed', { credentials: 'include'});
                const posts = await response.json();
                setFeedPosts(posts);
            } catch (error) {

            }

        }

        getUserNewsFeed();
    }, [])

    return (
        <>
            <h2 className="mt-3">News Feed</h2>
            <div>
                {feedPosts?.map(post => (
                    <Post
                        key={post._id}
                        post={post}
                        onPostDelete={() => {}}
                        onPostUpdate={() => {}}></Post>
                ))}
            </div>
        </>
    )
}