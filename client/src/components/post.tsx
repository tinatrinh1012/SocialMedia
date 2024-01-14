import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { PostModel } from "../models/post";
import { CommentModel } from "../models/comment";

interface PostProps {
    post: PostModel;
    onPostDelete: (_id: string) => void;
    onPostUpdate: (_id: string) => void;
}

export default function Post({ post, onPostDelete, onPostUpdate }: PostProps) {
    const [comments, setComments] = useState<CommentModel[]>();
    const [editMode, setEditMode ] = useState<boolean>(false);
    const [editText, setEditText] = useState<string>(post.text);

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
        setEditMode(false);

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
                body: JSON.stringify({ text: editText }),
            })

            if (response.status === 200) {
                onPostUpdate(post._id);
            }
        } catch (error) {
            console.error(error);
        }
    }

    function handleTextChange(e: ChangeEvent<HTMLTextAreaElement>) {
        setEditText(e.target.value);
    }

    return (
        <div className="row">
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

                        <small className="text-body-secondary">
                            Created on { new Date(post.createdAt).toLocaleDateString() } at { new Date(post.createdAt).toLocaleTimeString() }
                        </small>
                    </div>
                    <div className="card-footer text-body-secondary">
                        <h6>Likes: { post.likes }</h6>

                        <h6>Comments:</h6>
                        {comments?.map(comment => (
                            <p key={comment._id}>- {comment.text}</p>
                        ))}
                    </div>
                </div>
            </div>
        </div>

    )
}