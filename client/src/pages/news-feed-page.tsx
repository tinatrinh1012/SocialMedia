import { PostModel } from "../models/post";
import Post from "../components/post";
import { useGet } from "../hooks/useGet";

export default function NewsFeedPage() {
    const { data: feedPosts } = useGet<PostModel[]>('/posts/news-feed');

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