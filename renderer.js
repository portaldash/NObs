const { ipcRenderer } = require('electron');

document.getElementById('download-button').addEventListener('click', () => {
  const url = document.getElementById('url-input').value;
  if (url) {
    ipcRenderer.invoke('download-video', url)
      .then(response => {
        document.getElementById('status').textContent = 'Download completed!';
        document.getElementById('status').style.color = 'green';
      })
      .catch(error => {
        document.getElementById('status').textContent = `Error: ${error}`;
        document.getElementById('status').style.color = 'red';
      });
  } else {
    document.getElementById('status').textContent = 'Please enter a video URL.';
  }
});
