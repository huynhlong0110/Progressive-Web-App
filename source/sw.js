importScripts('./cacheOfFill.js');
var cacheName = 'cache-v4';

const files = [
    '/',
    '/index.html',
    '/js/modernizr.js',
    '/js/jquery.flexslider.js',
    "/js/waypoints.js",
    "/js/jquery.fittext.js",
    "/js/magnific-popup.js",
    "/js/init.js",
    "/js/app.js",
    '/js/jquery-migrate-1.2.1.min.js',
    '/js/jquery-1.10.2.min.js',
    '/images/portfolio/img6.jpg',
    '/images/portfolio/console.jpg',
    '/images/portfolio/img7.jpg',
    '/images/portfolio/img8.png',
    '/images/header-background.jpg',
    '/images/icons-192.png',
    '/images/icons-152.png',
    '/images/overlay-bg.png',
    '/images/profilepic.jpg',
    '/images/push-on.png',
    '/images/PWA.jpg',
    '/images/sample-image.jpg',
    '/images/testimonials-bg.jpg',
];



self.addEventListener('install', (event) => {
    console.info('Event: Install');

    event.waitUntil(
        caches.open(cacheName)
        .then((cache) => {
            return cache.addAll(files)
                .then(() => {
                    console.info('All files are cached');
                    return self.skipWaiting();
                })
                .catch((error) => {
                    console.error('Failed to cache', error);
                })
        })
    );
});


async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || fetch(request);
}

async function networkFirst(request) {
    const dynamicCache = await caches.open(cacheName);
    try {
        const networkResponse = await fetch(request);
        dynamicCache.put(request, networkResponse.clone()).catch((err) => {
            console.warn(request.url + ': ' + err.message);
        });
        return networkResponse;
    } catch (err) {
        const cachedResponse = await dynamicCache.match(request);
        return cachedResponse;
    }
}


self.addEventListener('active', function(event) {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== cacheName) {
                        return caches.delete(cache);
                    }
                })
            );
        })
        .then(function() {
            console.info("It's cleared!");
            return self.clients.claim();
        })
    );
})

self.addEventListener('fetch', function(event) {
    var request = event.request;
    var url = new URL(request.url);
    if (url.origin === location.origin) {
        event.respondWith(cacheFirst(request));
    } else {
        event.respondWith(networkFirst(request));
    }

});