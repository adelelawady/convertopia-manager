// Add required headers to all responses
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    // Handle FFmpeg worker requests
     if (url.href.includes('@ffmpeg/') || url.href.includes('ffmpeg-core')  || url.href.includes('assets') ) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const newHeaders = new Headers(response.headers);
          newHeaders.set('Cross-Origin-Embedder-Policy', 'require-corp');
          newHeaders.set('Cross-Origin-Resource-Policy', 'cross-origin');
          newHeaders.set('Access-Control-Allow-Origin', '*');
          
          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders,
          });
        })
    );
    return;
  }
  
    if (event.request.mode === 'navigate') {
      event.respondWith(
        fetch(event.request)
          .then(response => {
            const newHeaders = new Headers(response.headers);
            newHeaders.set('Cross-Origin-Embedder-Policy', 'require-corp');
            newHeaders.set('Cross-Origin-Opener-Policy', 'same-origin');
            newHeaders.set('Cross-Origin-Resource-Policy', 'cross-origin');
            newHeaders.set('Access-Control-Allow-Origin', '*');
  
            return new Response(response.body, {
              status: response.status,
              statusText: response.statusText,
              headers: newHeaders,
            });
          })
      );
    } else {
      event.respondWith(
        fetch(event.request)
          .then(response => {
            const newHeaders = new Headers(response.headers);
            newHeaders.set('Cross-Origin-Resource-Policy', 'cross-origin');
            newHeaders.set('Access-Control-Allow-Origin', '*');
            
            return new Response(response.body, {
              status: response.status,
              statusText: response.statusText,
              headers: newHeaders,
            });
          })
      );
    }
  });
  
  // ... rest of the service worker code remains the same ...
