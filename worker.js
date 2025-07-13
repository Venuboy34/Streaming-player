<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Universal Movie Player</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/shaka-player/4.6.0/shaka-player.compiled.js"></script>
  <style>
    body {
      background-color: #000;
      color: #fff;
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      height: 100vh;
    }
    #player-container {
      width: 100%;
      max-width: 1000px;
      margin: 20px;
    }
    video {
      width: 100%;
      height: auto;
      background: #000;
    }
    .controls {
      text-align: center;
      margin-top: 10px;
    }
    select, button {
      background: #222;
      color: white;
      border: none;
      padding: 10px 15px;
      margin: 5px;
      border-radius: 4px;
      font-size: 14px;
    }
    h1 {
      font-size: 18px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div id="player-container">
    <video id="video" controls autoplay></video>
    <div class="controls">
      <select id="audioSelect"></select>
      <select id="subtitleSelect"></select>
      <button onclick="downloadCurrent()">Download</button>
    </div>
  </div>

  <script>
    const video = document.getElementById('video');
    const player = new shaka.Player(video);
    const audioSelect = document.getElementById('audioSelect');
    const subtitleSelect = document.getElementById('subtitleSelect');

    // 🔗 Replace this with your actual dynamic video URL from query params or backend
    const videoURL = new URLSearchParams(window.location.search).get('video') || 'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd';

    async function initPlayer() {
      try {
        await player.load(videoURL);

        const tracks = player.getVariantTracks();
        const audioTracks = [...new Set(tracks.map(t => t.language))];

        audioSelect.innerHTML = '';
        audioTracks.forEach(lang => {
          const option = document.createElement('option');
          option.value = lang;
          option.text = lang.toUpperCase();
          audioSelect.appendChild(option);
        });

        audioSelect.addEventListener('change', () => {
          const selectedLang = audioSelect.value;
          const langTrack = tracks.find(t => t.language === selectedLang);
          if (langTrack) player.selectVariantTrack(langTrack, true);
        });

        // Subtitles
        const textTracks = player.getTextTracks();
        subtitleSelect.innerHTML = '<option value="">Off</option>';
        textTracks.forEach(track => {
          const option = document.createElement('option');
          option.value = track.id;
          option.text = track.language.toUpperCase();
          subtitleSelect.appendChild(option);
        });

        subtitleSelect.addEventListener('change', () => {
          const id = subtitleSelect.value;
          if (id === '') {
            player.setTextTrackVisibility(false);
          } else {
            const track = textTracks.find(t => t.id == id);
            if (track) {
              player.selectTextTrack(track);
              player.setTextTrackVisibility(true);
            }
          }
        });

      } catch (err) {
        console.error('Error loading video:', err);
        alert('Failed to load video.');
      }
    }

    function downloadCurrent() {
      window.open(videoURL, '_blank');
    }

    document.addEventListener('DOMContentLoaded', initPlayer);
  </script>
</body>
</html>
