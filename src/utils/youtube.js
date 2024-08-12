
export const searchYouTube = async (query) => {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const endpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&key=${API_KEY}`;

    const response = await fetch(endpoint);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
        return data.items[0].id.videoId;
    } else {
        throw new Error('No video found');
    }
};
