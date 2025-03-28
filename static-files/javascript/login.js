
import { navigate, storeToken, displayError } from "./utils.js";

const API_URL = 'http://localhost:5000';

const form = document.getElementById('login-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const urlParams = new URLSearchParams(formData);
    const requestBody = Object.fromEntries(urlParams);

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });
        const data = await response.json();
        if (!response.ok) {
            displayError(data)
            return;
        }
        if (data.authToken) {
            storeToken(data.authToken);
        }
        navigate('/user/profile');




    } catch (err) {
        console.log('Error fetching data:', err)
    }

})