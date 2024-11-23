// Add Cross-Origin-Embedder-Policy: require-corp
const addCOEPHeader = async (request) => {
  const response = await fetch(request);
  const newHeaders = new Headers(response.headers);
  newHeaders.set("Cross-Origin-Embedder-Policy", "require-corp");
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
};

// Add Cross-Origin-Opener-Policy: same-origin
const addCOOPHeader = async (request) => {
  const response = await fetch(request);
  const newHeaders = new Headers(response.headers);
  newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
};

// Handle fetch events
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  
  // Skip if request is not from our origin
  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(
    (async () => {
      // Add both headers
      const responseWithCOEP = await addCOEPHeader(event.request);
      const responseWithBothHeaders = await addCOOPHeader(
        new Request(event.request.url, {
          headers: responseWithCOEP.headers,
        })
      );
      
      return responseWithBothHeaders;
    })()
  );
}); 