import { UserModel } from "../models/user";
import { Link } from "react-router-dom";
import { useGet } from "../hooks/useGet";

export default function FindUsersPage() {
    const { data: users } = useGet<UserModel[]>('/users');

    return (
        <>
            <h2 className="mt-3">Users</h2>
            <ul>
                {users?.map((user) => (
                    <li key={user._id}>
                        <Link to={`/user/${user.username}`}>{user.username} - {user.firstName} {user.lastName}</Link>
                    </li>
                ))}
            </ul>
        </>
    )
}