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
        // TODO: find a way to put new post on top without reloading the page
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/posts/${username}/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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
                <label className="form-label" htmlFor="create-post-text">Create a post</label>
                <div className="row mb-2">
                    <div className="col-6">
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
                    <div className="col-6">
                        <button className="btn btn-primary" onClick={handleSubmit}>Post</button>
                    </div>
                </div>
            </form>
        </div>
    )
}