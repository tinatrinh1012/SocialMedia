import { useContext } from "react";
import { Link, useParams } from "react-router-dom"
import { UserModel } from "../models/user";
import { PostModel } from "../models/post";
import Post from "../components/post";
import CreatePost from "../components/create-post";
import { LoggedInUserContext } from "../App";
import { useGet } from "../hooks/useGet";

export default function UserPage() {
    // TODO: separate posts list and following list to their own component
    const { username } = useParams();
    const { data: currentUser} = useGet<UserModel>(`/users/${username}/profile`);
    const { data: userFollowing} = useGet<UserModel[]>(`/users/${username}/following`);
    const { data: userPosts, setData: setUserPosts } = useGet<PostModel[]>(`/posts/username?username=${username}`);
    const loggedInUser = useContext(LoggedInUserContext);

    function onPostCreate(createdPost: PostModel) {
        if (userPosts) {
            setUserPosts([createdPost, ...userPosts]);
        } else {
            setUserPosts([createdPost]);
        }
    }

    async function onPostUpdate(_id: string) {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/posts/id?_id=${_id}`);
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

    function isFollowing() {
        return loggedInUser.user?.following.includes(currentUser.username);
    }

    async function followUser() {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/users/${loggedInUser.user?.username}/following/add`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ followingUsername: currentUser.username }),
            })

            if (response.status === 200) {
                let updatedLoggedInUser = {...loggedInUser.user} as UserModel;
                updatedLoggedInUser?.following.push(currentUser.username);
                loggedInUser.setUser(updatedLoggedInUser);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function unfollowUser() {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/users/${loggedInUser.user?.username}/following/remove`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ followingUsername: currentUser.username }),
            })

            if (response.status === 200) {
                let updatedLoggedInUser = {...loggedInUser.user} as UserModel;
                updatedLoggedInUser!.following = updatedLoggedInUser.following.filter(_ => _ !== currentUser.username);
                loggedInUser.setUser(updatedLoggedInUser);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            {currentUser &&
                <div className="container">
                    <div className="d-flex justify-content-center mt-3">
                        <h2>
                            {currentUser.firstName} {currentUser.lastName}
                        </h2>
                    </div>
                    <div className="d-flex justify-content-center mb-3">
                        {loggedInUser.user?.username !== currentUser.username ? (
                            <>
                                {isFollowing() ? (
                                    <h3>
                                        <i className="bi bi-person-check ms-2"></i>
                                        <button type="button" className="btn btn-outline-danger btn-sm ms-2" onClick={unfollowUser}>Unfollow</button>
                                    </h3>
                                ) : (
                                    <button type="button" className="btn btn-outline-primary btn-sm" onClick={followUser}>Follow</button>
                                )}
                            </>
                        ) : (<></>)}

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
                            {userPosts && userPosts.map(post => (
                                <Post
                                    key={post._id}
                                    post={post}
                                    onPostDelete={onPostDelete}
                                    onPostUpdate={onPostUpdate}></Post>
                            ))}
                        </div>
                        {userFollowing &&
                            <div className="col-4">
                                <div className="card">
                                    <div className="card-header"><h5>Following ({userFollowing.length})</h5></div>
                                    <ul className="list-group list-group-flush">
                                        {userFollowing.map(user => (
                                            <li key={user._id} className="list-group-item">
                                                <Link to={`/user/${user.username}`}>{user.firstName} {user.lastName}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            }
        </>
    )
}