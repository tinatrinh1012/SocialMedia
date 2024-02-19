import { ChangeEvent, FormEvent, useState } from "react"
import { PostModel } from "../models/post";

interface Props {
    username: string;
    onPostCreate: (createdPost: PostModel) => void
}

export default function CreatePost({ username, onPostCreate }: Props) {
    const [text, setText] = useState<string>();

    function handleTextChange(e: ChangeEvent<HTMLTextAreaElement>) {
        setText(e.target.value);
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/posts/${username}/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({text: text}),
            })

            if (response.status === 201) {
                const createdPost = await response.json();
                onPostCreate(createdPost);
                setText('');
            }
        } catch (error) {
            console.error(error);
        }
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