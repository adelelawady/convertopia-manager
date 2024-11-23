// This is just a proxy file to load the actual FFmpeg core
const script = document.createElement('script');
script.src = 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/ffmpeg-core.js';
document.body.appendChild(script); 