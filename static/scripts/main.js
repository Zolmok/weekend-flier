async function fetchLatestVideo() {
  const channelId = "UCknnHfBlDvDYeAZA2HmC1nw";
  const apiKey = "AIzaSyBJzxVYNZObf_en1euxEtxhb5FPlth3cpQ";
  const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&order=date&part=snippet&type=video&maxResults=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const latestVideoId = data.items[0].id.videoId;

    document.getElementById("youtube-player").innerHTML = `
        <iframe 
          width="560" 
          height="315" 
          src="https://www.youtube.com/embed/${latestVideoId}" 
          frameborder="0" 
          allowfullscreen>
        </iframe>`;
  } catch (error) {
    console.error("Error fetching the latest YouTube video:", error);
  }
}

fetchLatestVideo();
