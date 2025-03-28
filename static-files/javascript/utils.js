
function displayError(data) {
    errorParah.innerHTML = `${data.errorMessage}`;
    errorParah.style.display = 'block';
}

async function authenticateUser() {
    const token = localStorage.getItem('authToken');

    if (token) {
        const response = await fetch(`${API_URL}/auth/verify`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` }
        })

        console.log(response)
        const data = await response.json();
        if (!response.ok) {
            displayError(data);
            return;
        }
        console.log('data:', data)
    }
}

function storeToken(token) {
    localStorage.setItem('authToken', token);
}

function removeToken() {
    localStorage.removeItem('authToken');
}


function logoutUser() {
    removeToken()
}

function navigate(route) {
    window.location.href = route;
}