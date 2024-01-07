import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { UserModel } from "../models/user";
import { PostModel } from "../models/post";
import Post from "../components/post";

export default function UserPage() {
    const { username } = useParams();
    const [user, setUser] = useState<UserModel>();
    const [userFriends, setUserFriends] = useState<UserModel[]>();
    const [userPosts, setUserPosts] = useState<PostModel[]>();

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await fetch(`http://localhost:3000/users/${username}/profile`);
                const user = await response.json();
                setUser(user);
            } catch (error) {
                console.error(error);
            }
        }

        async function fetchUserFriends() {
            try {
                const response = await fetch(`http://localhost:3000/users/${username}/friends`);
                const userFriends = await response.json();
                setUserFriends(userFriends);
            } catch (error) {
                console.error(error);
            }
        }

        async function fetchUserPosts() {
            try {
                const response = await fetch(`http://localhost:3000/posts/${username}`);
                const userPosts = await response.json();
                setUserPosts(userPosts);
            } catch (error) {
                console.error(error);
            }
        }

        fetchUser();
        fetchUserFriends();
        fetchUserPosts();
    }, [username])

    return (
        <div className="container">
            <h2>{user?.firstName} {user?.lastName} ({user?.username})</h2>
            <div>Friends</div>
            <ul>
                {userFriends?.map(friend => (
                    <li key={friend._id}>{friend.firstName} {friend.lastName} ({friend.username})</li>
                ))}
            </ul>

            {userPosts?.map(post => (
                <Post post={ post }></Post>
            ))}
        </div>
    )
}