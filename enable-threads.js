// Check if the page is already cross-origin isolated
if (!crossOriginIsolated) {
    // If not cross-origin isolated, reload the page with the service worker
    if (window.location.href.includes("?serviceworker=1")) {
      // If we're already using the service worker and it's still not working, show an error
      console.error("Cross-Origin Isolation is not working properly");
    } else {
      // Register the service worker that will enable cross-origin isolation
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./serviceworker.js')
          .then(() => {
            // Reload the page with a flag to prevent infinite reloads
            window.location.href = window.location.href + "?serviceworker=1";
          })
          .catch(error => {
            console.error('Service Worker registration failed:', error);
          });
      }
    }
  } else {
    console.log("Cross-Origin Isolation is enabled");
  }