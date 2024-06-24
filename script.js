document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.querySelector('.login-button');
    const ctaButton = document.querySelector('.cta-button');
    const contact = document.querySelector('contact');

    loginButton.addEventListener('click', function() {
        window.location.href = 'https://www.chess.com/login';
    });

    ctaButton.addEventListener('click', function() {
        window.location.href = 'https://www.chess.com/game/live';
    });
    document.getElementById('contact').addEventListener('click', function(){
        event.preventDefault();
        window.location.href = 'https://www.linkedin.com/in/pranto-mollik-9a9a482a2';
    });
});
