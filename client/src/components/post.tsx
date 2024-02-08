import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import { PostModel } from "../models/post";
import { CommentModel } from "../models/comment";
import { LoggedInUserContext } from "../App";
import "./post.css";

interface PostProps {
    post: PostModel;
    onPostDelete: (_id: string) => void;
    onPostUpdate: (_id: string) => void;
}

export default function Post({ post, onPostDelete, onPostUpdate }: PostProps) {
    const [comments, setComments] = useState<CommentModel[]>([]);
    const [editMode, setEditMode ] = useState<boolean>(false);
    const [editText, setEditText] = useState<string>(post.text);
    const [commentText, setCommentText] = useState<string>('');
    const loggedInUser = useContext(LoggedInUserContext);

    useEffect(() => {
        async function fetchPostComments() {
            try {
                const response = await fetch(`http://localhost:3000/comments/${post._id}`);
                const comments = await response.json();
                setComments(comments);
            } catch (error) {
                console.error(error);
            }
        }

        fetchPostComments();
    }, [post._id])

    // TODO: add delete confirmation popup dialog
    async function deletePost() {
        try {
            const response = await fetch(`http://localhost:3000/posts/${post._id}/delete`, {
                method: 'DELETE'
            })

            if (response.status === 200) {
                window.alert('Deleted post');
                onPostDelete(post._id);
            }
        } catch (error) {
            console.error(error);
        }
    }

    function editPost() {
        setEditMode(true);
    }

    async function savePost(e: FormEvent) {
        e.preventDefault();

        try {
            if (editText == null || editText.length === 0) {
                window.alert('Post text cannot be empty');
                setEditMode(false);
                setEditText(post.text);
                throw new Error('Post text cannot be empty');
            }

            const response = await fetch(`http://localhost:3000/posts/${post._id}/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ text: editText }),
            })

            if (response.status === 200) {
                onPostUpdate(post._id);
            } else {
                setEditText(post.text);
                window.alert('Unable to update post');
            }
        } catch (error) {
            console.error(error);
        }
        setEditMode(false);
    }

    function handleTextChange(e: ChangeEvent<HTMLTextAreaElement>) {
        setEditText(e.target.value);
    }

    function liked(): boolean {
        if (loggedInUser) {
            return post.likes.indexOf(loggedInUser.username) > -1;
        }
        return false;
    }

    function allowEditPost(): boolean {
        return loggedInUser?.username === post.createdBy;
    }

    async function likePost() {
        try {
            const response = await fetch(`http://localhost:3000/posts/${post._id}/like`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            })

            if (response.status === 200) {
                onPostUpdate(post._id);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function unlikePost() {
        try {
            const response = await fetch(`http://localhost:3000/posts/${post._id}/unlike`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            })

            if (response.status === 200) {
                onPostUpdate(post._id);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function addComment() {
        try {
            const response = await fetch(`http://localhost:3000/comments/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    postId: post._id,
                    text: commentText
                })
            })

            const comment = await response.json();
            setComments([...comments, comment]);
            setCommentText('');
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="row mb-4">
            <div className="col-8">
                <div className="card">
                    <h5 className="card-header">
                        { post.createdBy }
                    </h5>
                    <div className="card-body">
                        { editMode ? (
                            <textarea
                                className="form-control"
                                rows={3}
                                value={editText}
                                onChange={handleTextChange}></textarea>
                        ) : (
                            <p className="card-text">{ editText }</p>
                        )}

                        {allowEditPost() ? (
                            <div>
                                { editMode ? (
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary me-2"
                                        onClick={savePost}
                                    >
                                        Save <i className="bi bi-check-lg"></i>
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary me-2"
                                        onClick={editPost}
                                    >
                                        Edit <i className="bi bi-pencil"></i>
                                    </button>
                                )}

                                <button
                                    type="button"
                                    className="btn btn-outline-danger"
                                    onClick={deletePost}
                                >
                                    Delete <i className="bi bi-trash"></i>
                                </button>
                            </div>
                        ) : <></>}

                        <small className="text-body-secondary">
                            Created on { new Date(post.createdAt).toLocaleDateString() } at { new Date(post.createdAt).toLocaleTimeString() }
                        </small>
                    </div>
                    <div className="card-footer text-body-secondary">
                        <h6>
                            { liked() ? (
                                <div><i onClick={unlikePost} className="bi bi-suit-heart-fill like-icon text-danger"></i> { post.likes.length }</div>
                            ) : (
                                <div><i onClick={likePost} className="bi bi-suit-heart like-icon"></i> { post.likes.length }</div>
                            )}
                        </h6>

                        <h6>Comments</h6>
                        {comments?.map(comment => (
                            <p key={comment._id}>- {comment.text}</p>
                        ))}

                        <div className="input-group">
                            <input value={commentText} onChange={ e => setCommentText(e.target.value) } type="text" className="form-control" placeholder="Add comment"></input>
                            <div className="input-group-append">
                                <button onClick={addComment} className="btn btn btn-outline-primary" type="button">Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}