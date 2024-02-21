import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"
import { UserModel } from "../models/user";
import { PostModel } from "../models/post";
import Post from "../components/post";
import CreatePost from "../components/create-post";
import { LoggedInUserContext } from "../App";

export default function UserPage() {
    // TODO: potentially separate posts list and friends list to their own component
    const { username } = useParams();
    const [user, setUser] = useState<UserModel>();
    const [userFriends, setUserFriends] = useState<UserModel[]>();
    const [userPosts, setUserPosts] = useState<PostModel[]>();
    const navigate = useNavigate();
    const loggedInUser = useContext(LoggedInUserContext);

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await fetch(`http://localhost:3000/users/${username}/profile`, {credentials: 'include'});
                const user = await response.json();
                setUser(user);

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

    function allowCreatePost() {
        return loggedInUser?.user?.username === username;
    }

    function isFriend() {
        if (loggedInUser.user && user) {
            return loggedInUser.user.friends.includes(user.username)
            && user.friends.includes(loggedInUser.user.username)
        }
        return false;
    }

    return (
        <div className="container">
            <div className="d-flex justify-content-center mt-3 mb-3">
                <h2>
                    {user?.firstName} {user?.lastName}
                    {isFriend() ? (
                        <i className="bi bi-person-check ms-2"></i>
                    ) : (<></>)}

                </h2>
            </div>
            <div className="row">
                <div className="col">
                    {allowCreatePost() ? (
                        <CreatePost username={username!} onPostCreate={onPostCreate}></CreatePost>
                    ) : <></>}
                </div>
            </div>
            <div className="row">
                <div className="col-8">
                    {userPosts?.map(post => (
                        <Post
                            key={post._id}
                            post={post}
                            onPostDelete={onPostDelete}
                            onPostUpdate={onPostUpdate}></Post>
                    ))}
                </div>
                <div className="col-4">
                    <div className="card">
                        <div className="card-header"><h5>Friends ({userFriends?.length})</h5></div>
                        <ul className="list-group list-group-flush">
                            {userFriends?.map(friend => (
                                <li key={friend._id} className="list-group-item">
                                    <Link to={`/user/${friend.username}`}>{friend.firstName} {friend.lastName}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}