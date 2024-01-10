import { useEffect, useState } from "react";
import { PostModel } from "../models/post";
import { CommentModel } from "../models/comment";

interface PostProps {
    post: PostModel;
}

export default function Post({ post }: PostProps) {
    const [comments, setComments] = useState<CommentModel[]>();

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


    return (
        <div className="row">
            <div className="col-6">
                <div className="card">
                    <h5 className="card-header">
                        { post.createdBy }
                    </h5>
                    <div className="card-body">
                        <p className="card-text">{ post.text }</p>
                        <small className="text-body-secondary">Posted on { new Date(post.createdAt).toLocaleDateString() } at { new Date(post.createdAt).toLocaleTimeString() }</small>
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