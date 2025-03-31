
const API_URL = 'http://localhost:5000';

function navigate(route) {
    window.location.href = route;
}

function displayError(data) {
    document.querySelector('.error').innerHTML = `${data.errorMessage}`;
    document.querySelector('.error').style.display = 'block';

}

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('authToken');

    if (token) {
        try {
            const response = await fetch(`${API_URL}/admin/refresh`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` }
            })

            // console.log(response)
            const data = await response.json();

            if (!response.ok) {
                // console.log('failed to authenticate user:', data.errorMessage)
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
})
