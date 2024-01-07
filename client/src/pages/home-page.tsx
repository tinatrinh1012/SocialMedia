import { useEffect, useState } from "react"
import { UserModel } from "../models/user";
import { Link } from "react-router-dom";

export default function HomePage() {
    const [users, setUsers] = useState<UserModel[]>();

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await fetch('http://localhost:3000/users');
                const users: UserModel[] = await response.json();
                setUsers(users);
            } catch (error) {

            }
        }

        fetchUsers();
    }, [])

    return (
        <>
            <h2>Home page</h2>

            <h3>Users</h3>
            <ul>
                {users?.map((user) => (
                    <li key={user._id}>
                        <Link to={`user/${user.username}`}>{user.username} - {user.firstName} {user.lastName}</Link>
                    </li>
                ))}
            </ul>
        </>
    )
}