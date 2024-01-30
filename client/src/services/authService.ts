const AuthService = {
    getLoggedInUser: async () => {
        const response = await fetch('http://localhost:3000/auth/current-user', { credentials: 'include' });
        if (response.status === 200) {
            const user = await response.json();
            return user;
        } else {
            return '';
        }
    }
}

export default AuthService;