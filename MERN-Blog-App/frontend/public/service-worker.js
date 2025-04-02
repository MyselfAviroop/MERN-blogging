const cacheName = "v25";

// Install a service worker
self.addEventListener("install", (event) => {
    console.log("Service Workers: Installed");
});

// Cache and return requests
self.addEventListener("fetch", (event) => {
    // Skip caching for non-GET requests
    if (event.request.method !== 'GET') {
        return event.respondWith(fetch(event.request));
    }

    event.respondWith(
        fetch(event.request)
            .then((res) => {
                // Only cache successful responses
                if (!res || res.status !== 200 || res.type !== 'basic') {
                    return res;
                }

                // Make clone of response
                const resClone = res.clone();
                // Open cache
                caches.open(cacheName).then((cache) => {
                    // Add response to the cache
                    cache.put(event.request, resClone);
                });
                return res;
            })
            .catch((err) => {
                console.error('Fetch failed:', err);
                return caches
                    .match(event.request)
                    .then((res) => res)
                    .catch((err) => {
                        console.error('Cache match failed:', err);
                        return new Response('Network error occurred', {
                            status: 503,
                            statusText: 'Service Unavailable'
                        });
                    });
            })
    );
});

// Update a service worker
self.addEventListener("activate", (event) => {
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
    );
});
