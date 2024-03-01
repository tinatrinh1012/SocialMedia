import { useEffect, useState } from "react"
import { UserModel } from "../models/user";
import { Link } from "react-router-dom";

export default function FindUsersPage() {
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
            <h2 className="mt-3">Users</h2>
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