
const API_URL = 'http://localhost:5000';

const form = document.getElementById('login-form');
const p = document.querySelector('.error');

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
        console.log('response:', response)

        const data = await response.json();
        console.log('api response:', data)
        if (!response.ok) {
            displayError(data)
            return;
        }



    } catch (err) {
        console.log('Error fetching data:', err)
    }

})