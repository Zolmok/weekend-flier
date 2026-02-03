async function fetchLatestVideo() {
  const channelId = "UCknnHfBlDvDYeAZA2HmC1nw";
  const apiKey = "AIzaSyBuQqAcAZERg1rC8WXF1KiETu5AsGTNGjE";
  const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&order=date&part=snippet&type=video&maxResults=1`;

  const container = document.getElementById("youtube-player");

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0 || !data.items[0].id || !data.items[0].id.videoId) {
      throw new Error("No videos found in API response");
    }

    const latestVideoId = data.items[0].id.videoId;

    if (!/^[a-zA-Z0-9_-]{11}$/.test(latestVideoId)) {
      throw new Error("Invalid video ID format");
    }

    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${latestVideoId}`;
    iframe.title = "Latest Weekend Flier YouTube video";
    iframe.frameBorder = "0";
    iframe.allowFullscreen = true;
    iframe.loading = "lazy";
    iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-presentation");
    iframe.classList.add("w-full", "aspect-video");

    container.appendChild(iframe);
  } catch (error) {
    console.error("Error fetching the latest YouTube video:", error);
    container.innerHTML = "";
    const fallback = document.createElement("p");
    fallback.className = "text-gray-500 mt-2";
    fallback.textContent = "Unable to load the latest video. ";
    const link = document.createElement("a");
    link.href = "https://weekendflier.tv";
    link.className = "text-blue-600 hover:underline";
    link.textContent = "Watch on YouTube";
    fallback.appendChild(link);
    container.appendChild(fallback);
  }
}

fetchLatestVideo();
