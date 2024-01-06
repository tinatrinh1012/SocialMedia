import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { User } from "../models/user";

export default function UserPage() {
    const { username } = useParams();
    const [user, setUser] = useState<User>();
    const [userFriends, setUserFriends] = useState<User[]>();

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await fetch(`http://localhost:3000/users/${username}/profile`);
                const user = await response.json();
                setUser(user);
            } catch (error) {
                console.error(error);
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

        fetchUser();
        fetchUserFriends();
    }, [username])

    return (
        <>
            <h2>{user?.firstName} {user?.lastName}</h2>
            <h4>{user?.username}</h4>
            <div>Friends</div>
            <ul>
                {userFriends?.map(friend => (
                    <li>{friend.firstName} {friend.lastName} ({friend.username})</li>
                ))}
            </ul>
        </>
    )
}