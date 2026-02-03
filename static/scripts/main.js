const CACHE_KEY = "wf_latest_video";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

function getCachedVideoId() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const { videoId, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return videoId;
  } catch {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
}

function cacheVideoId(videoId) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ videoId, timestamp: Date.now() }));
  } catch {
    // Storage full or unavailable — ignore
  }
}

function embedVideo(videoId, container) {
  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube.com/embed/${videoId}`;
  iframe.title = "Latest Weekend Flier YouTube video";
  iframe.setAttribute("frameborder", "0");
  iframe.allowFullscreen = true;
  iframe.loading = "lazy";
  iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-presentation");
  iframe.classList.add("w-full", "aspect-video");
  container.appendChild(iframe);
}

function showFallback(container) {
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

async function fetchLatestVideo() {
  const container = document.getElementById("youtube-player");
  const cached = getCachedVideoId();

  if (cached) {
    embedVideo(cached, container);
    return;
  }

  const channelId = "UCknnHfBlDvDYeAZA2HmC1nw";
  const apiKey = "AIzaSyBuQqAcAZERg1rC8WXF1KiETu5AsGTNGjE";
  const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&order=date&part=snippet&type=video&maxResults=1`;

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

    cacheVideoId(latestVideoId);
    embedVideo(latestVideoId, container);
  } catch (error) {
    console.error("Error fetching the latest YouTube video:", error);
    showFallback(container);
  }
}

fetchLatestVideo();
