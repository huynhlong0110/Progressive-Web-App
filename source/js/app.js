if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
        .then((reg) => console.log('Service worker registered', reg))
        .catch((err) => console.log('Service worker is not registered', err));
}



function notify(message) {
    if ('Notification' in window) {
        Notification.requestPermission(function(permission) {
            if (permission === 'granted') {
                var notification = new Notification(message, {
                    body: 'Welcome to my world',
                    icon: '/images/icons-192.png'
                });
            }
        });
    } else {
        alert('This is not support notifications.');
    }
}

function navigate(target) {
    var contentArea = document.getElementById('content');
    contentArea.innerText = 'Loading…';

    fetch('content/' + target.replace(/\.\./g, '') + '.html')
        .then(function(response) {
            if (response.status !== 200) {
                throw new Error(response.status);
            }

            return response.text().then(function(text) {
                // Potentially hazardous, use sanitizer/real SPA framework.
                contentArea.innerHTML = text;
            });
        }).catch(function(err) {
            contentArea.innerText = ' Please retry later: ' + err.message;
        });
}

function updateHashLocation() {
    navigate(window.location.hash.substr(2));
}

window.addEventListener("hashchange", updateHashLocation);

if (!window.location.hash) {
    window.location.hash = '/index';
}

updateHashLocation();