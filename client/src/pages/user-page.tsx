import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"
import { UserModel } from "../models/user";
import { PostModel } from "../models/post";
import Post from "../components/post";
import CreatePost from "../components/create-post";
import { LoggedInUserContext } from "../App";
import { useGet } from "../hooks/useGet";
import { Response } from "../models/Response";

export default function UserPage() {
    // TODO: separate posts list and following list to their own component
    const { username } = useParams();
    const pageUserResponse: Response<UserModel> = useGet<UserModel>(`/users/${username}/profile`);
    const userFollowingResponse: Response<UserModel[]> = useGet<UserModel[]>(`/users/${username}/following`);
    const userPostsResponse: Response<PostModel[]> = useGet<PostModel[]>(`/posts/username?username=${username}`);
    const [userPosts, setUserPosts] = useState<PostModel[]>(userPostsResponse.data);
    const navigate = useNavigate();
    const loggedInUser = useContext(LoggedInUserContext);

    useEffect(() => {
        async function fetchUserPosts() {
            try {
                const response = await fetch(`http://localhost:3000/posts/username?username=${username}`);
                const userPosts = await response.json();
                setUserPosts(userPosts);
            } catch (error) {
                console.error(error);
            }
        }

        fetchUserPosts();
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
            const response = await fetch(`http://localhost:3000/posts/id?_id=${_id}`);
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
        return pageUserResponse && loggedInUser.user?.following.includes(pageUserResponse.data.username);
    }

    async function followUser() {
        try {
            const response = await fetch(`http://localhost:3000/users/${loggedInUser.user?.username}/following/add`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ followingUsername: pageUserResponse.data.username }),
            })

            if (response.status === 200) {
                let updatedLoggedInUser = {...loggedInUser.user} as UserModel;
                updatedLoggedInUser?.following.push(pageUserResponse.data.username);
                loggedInUser.setUser(updatedLoggedInUser);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function unfollowUser() {
        try {
            const response = await fetch(`http://localhost:3000/users/${loggedInUser.user?.username}/following/remove`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ followingUsername: pageUserResponse.data.username }),
            })

            if (response.status === 200) {
                let updatedLoggedInUser = {...loggedInUser.user} as UserModel;
                updatedLoggedInUser!.following = updatedLoggedInUser.following.filter(_ => _ !== pageUserResponse.data.username);
                loggedInUser.setUser(updatedLoggedInUser);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="container">
            <div className="d-flex justify-content-center mt-3">
                <h2>
                    {pageUserResponse.data.firstName} {pageUserResponse.data.lastName}
                </h2>
            </div>
            <div className="d-flex justify-content-center mb-3">
                {loggedInUser.user?.username !== pageUserResponse.data.username ? (
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
                <div className="col-4">
                    <div className="card">
                        <div className="card-header"><h5>Following ({userFollowingResponse.data.length})</h5></div>
                        <ul className="list-group list-group-flush">
                            {userFollowingResponse.data && userFollowingResponse.data.map(user => (
                                <li key={user._id} className="list-group-item">
                                    <Link reloadDocument to={`/user/${user.username}`}>{user.firstName} {user.lastName}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}