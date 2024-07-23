const API_URL = 'http://localhost:3000';

const deposit = async () => {
    const userId = document.getElementById('userId').value;
    const amount = document.getElementById('amount').value;
    try {
        const response = await fetch(`${API_URL}/deposit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, amount }),
        });
        const result = await response.json();
        document.getElementById('message').innerText = JSON.stringify(result);
    } catch (error) {
        document.getElementById('message').innerText = error.message;
    }
};

const withdraw = async () => {
    const userId = document.getElementById('userId').value;
    const amount = document.getElementById('amount').value;
    try {
        const response = await fetch(`${API_URL}/withdraw`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, amount }),
        });
        const result = await response.json();
        document.getElementById('message').innerText = JSON.stringify(result);
    } catch (error) {
        document.getElementById('message').innerText = error.message;
    }
};
