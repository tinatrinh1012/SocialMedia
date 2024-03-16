import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { PostModel } from "../models/post";
import { usePost } from "../hooks/usePost";

interface Props {
    username: string;
    onPostCreate: (createdPost: PostModel) => void
}

export default function CreatePost({ username, onPostCreate }: Props) {
    const [text, setText] = useState<string>();
    const { sendRequest: submitPost, status, data: createdPost } = usePost<PostModel>(`/posts/${username}/create`, {text: text});

    useEffect(() => {
        if (status === 201) {
            onPostCreate(createdPost);
            setText('');
        }
    }, [createdPost, onPostCreate, status])

    function handleTextChange(e: ChangeEvent<HTMLTextAreaElement>) {
        setText(e.target.value);
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        submitPost();
    }

    return (
        <div className="mb-3">
            <form>
                <div className="row mb-2">
                    <div className="col">
                        <textarea
                            className="form-control"
                            id="create-post-text"
                            rows={3}
                            placeholder="Update your status"
                            value={text}
                            onChange={handleTextChange}></textarea>
                    </div>
                </div>
                <div className="row">
                    <div className="col d-flex justify-content-center">
                        <button className="btn btn-primary w-100" onClick={handleSubmit}>
                            Post
                            <i className="bi bi-chevron-double-up ms-2"></i>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}