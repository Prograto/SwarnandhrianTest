document.addEventListener('DOMContentLoaded', function () {
    fetch(window.footerUrl)
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
});