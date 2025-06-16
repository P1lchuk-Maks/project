function animateButton() {
            const button = document.querySelector('.circle-button');
            const effect = document.getElementById('clickEffect');
            
            // Анимация кнопки
            button.classList.add('clicked');
            setTimeout(() => {
                button.classList.remove('clicked');
            }, 300);
            
            // Эффект вспышки
            effect.style.animation = 'none';
            void effect.offsetWidth; // Trigger reflow
            effect.style.animation = 'ripple 0.6s forwards';
            
            // Вращение изображения
            const img = button.querySelector('img');
            img.style.transform = 'rotate(5deg)';
            setTimeout(() => {
                img.style.transform = 'rotate(-5deg)';
                setTimeout(() => {
                    img.style.transform = 'rotate(0)';
                }, 100);
            }, 100);
        }