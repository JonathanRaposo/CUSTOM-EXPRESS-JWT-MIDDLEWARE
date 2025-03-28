
const API_URL = 'http://localhost:5000';

function displayError(data) {
    document.querySelector('.error').innerHTML = `${data.errorMessage}`;
    document.querySelector('.error').style.display = 'block';

}

function storeToken(token) {
    localStorage.setItem('authToken', token);
}

function removeToken() {
    localStorage.removeItem('authToken');
}

function logoutUser() {
    removeToken();
    navigate('/');
}

function navigate(route) {
    window.location.href = route;
}

async function authenticateUser() {
    const token = localStorage.getItem('authToken');

    if (token) {
        try {
            const response = await fetch(`${API_URL}/refresh`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` }
            })

            // console.log(response)
            const data = await response.json();

            if (!response.ok) {
                console.log('failed to authenticate user:', data.errorMessage)
                document.querySelector('#profile-wrapper').style.display = 'none';
                displayError(data)
                setTimeout(() => {
                    navigate('/');
                }, 3000)
                return;
            }
            document.querySelector('#profile-wrapper h3').innerHTML = `Welcome back ${data.name}!`

        } catch (err) {
            console.log('Error fetching user profile:', err);
        }

    } else {
        console.log('no token found. Redirecting to login... ')
        navigate('/login');
    }
}
export { storeToken, navigate, displayError, authenticateUser, logoutUser };