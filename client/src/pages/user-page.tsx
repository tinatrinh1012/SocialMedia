import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { UserModel } from "../models/user";
import { PostModel } from "../models/post";
import Post from "../components/post";
import CreatePost from "../components/create-post";

export default function UserPage() {
    const { username } = useParams();
    const [user, setUser] = useState<UserModel>();
    const [userFriends, setUserFriends] = useState<UserModel[]>();
    const [userPosts, setUserPosts] = useState<PostModel[]>();
    const [isCurrentUser, setIsCurrentUser] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await fetch(`http://localhost:3000/users/${username}/profile`, {credentials: 'include'});
                const json = await response.json();
                setUser(json.user);
                setIsCurrentUser(json.isCurrentUser);

                fetchUserFriends();
                fetchUserPosts();
            } catch (error) {
                navigate('/new-user/login');
                window.alert(`You're not authenticated. Please log in with username ${username}`);
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
    }, [navigate, username])

    function onPostCreate(createdPost: PostModel) {
        if (userPosts) {
            setUserPosts([createdPost, ...userPosts]);
        } else {
            setUserPosts([createdPost]);
        }
    }

    async function onPostUpdate(_id: string) {
        try {
            const response = await fetch(`http://localhost:3000/posts?_id=${_id}`);
            const updatedPost = await response.json();

            if (userPosts) {
                const indexToReplace = userPosts.findIndex(post => post._id === _id);
                if (indexToReplace !== -1) {
                    let updatedUserPosts = [...userPosts.slice(0, indexToReplace), updatedPost, ...userPosts.slice(indexToReplace + 1)];
                    setUserPosts(updatedUserPosts);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    function onPostDelete(_id: string) {
        if (userPosts && userPosts.length > 0) {
            let posts = userPosts.filter(post => post._id !== _id);
            setUserPosts(posts);
        } else {
            console.error("Unable to remove post");
        }
    }



    return (
        <div className="container">
            <h2>{user?.firstName} {user?.lastName} ({user?.username})</h2>

            <div>Friends</div>
            <ul>
                {userFriends?.map(friend => (
                    <li key={friend._id}>{friend.firstName} {friend.lastName} ({friend.username})</li>
                ))}
            </ul>

            {isCurrentUser ? (
                <CreatePost username={username!} onPostCreate={onPostCreate}></CreatePost>
            ) : <></>}


            {userPosts?.map(post => (
                <Post
                    key={post._id}
                    post={post}
                    onPostDelete={onPostDelete}
                    onPostUpdate={onPostUpdate}
                    allowEdit={isCurrentUser}></Post>
            ))}
        </div>
    )
}