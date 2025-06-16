document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = form.querySelector('#email').value;
            const password = form.querySelector('#password').value;
            const isSignUp = form.querySelector('button[type="submit"]').textContent.trim() === 'Sign up';
            
            try {
                const endpoint = isSignUp ? '/sign-up' : '/sign-in';
                const response = await fetch(`http://localhost:3000${endpoint}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Something went wrong');
                }
                
                if (isSignUp) {
                    alert(data.message);
                    window.location.href = 'sign in.html';
                } else {
                    // Сохраняем токен и перенаправляем на главную страницу
                    localStorage.setItem('token', data.token);
                    window.location.href = 'dashboard.html'; // Создайте эту страницу позже
                }
            } catch (error) {
                alert(error.message);
                console.error('Error:', error);
            }
        });
    });
});