export default {
  async fetch(request) {
    return new Response(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Universal Player</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/shaka-player/4.3.5/shaka-player.compiled.js"></script>
  <style>
    body {
      margin: 0;
      background: #000;
      color: #fff;
      font-family: Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    video {
      width: 100%;
      max-width: 1000px;
      height: auto;
      margin-top: 20px;
      border-radius: 12px;
    }
    .controls {
      margin-top: 10px;
      text-align: center;
    }
    button {
      padding: 10px 20px;
      background: #1db954;
      border: none;
      color: white;
      font-weight: bold;
      border-radius: 6px;
      cursor: pointer;
    }
    button:hover {
      background: #1ed760;
    }
  </style>
</head>
<body>
  <h2>🎬 Universal Player</h2>
  <video id="video" autoplay muted controls></video>
  <div class="controls">
    <button onclick="downloadVideo()">⬇️ Download</button>
  </div>
  <script>
    async function initPlayer() {
      const video = document.getElementById('video');
      const player = new shaka.Player(video);

      // Get movie URL from query param ?movie=your.m3u8
      const urlParams = new URLSearchParams(window.location.search);
      const movieUrl = urlParams.get('movie') || 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

      try {
        await player.load(movieUrl);
        console.log('Video loaded');
      } catch (e) {
        console.error('Error loading video:', e);
        alert('Failed to load video.');
      }
    }

    function downloadVideo() {
      const urlParams = new URLSearchParams(window.location.search);
      const directLink = urlParams.get('download') || '';
      if (!directLink) {
        alert('No download link provided in URL (?download=...)');
        return;
      }
      const a = document.createElement('a');
      a.href = directLink;
      a.download = '';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    document.addEventListener('DOMContentLoaded', initPlayer);
  </script>
</body>
</html>
    `, {
      headers: {
        'content-type': 'text/html; charset=UTF-8',
      },
    });
  },
};
