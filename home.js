// const apiKey = "AIzaSyC0lDc68z2wZ19AT7_ST7RQ2833ZIm1IyE";
const apiKey = "AIzaSyBeO62LE91qtWdztS8371MJi-OR8VGYqaM";//shrikant api
const baseUrl = `https://www.googleapis.com/youtube/v3`;
/**
 * 
 * searchString is the value typed by the user in the input box.
 * @param {String} searchString 
 */

const searchButton = document.getElementById("search");
const searchInput = document.getElementById("search-input");
const thumbnail = document.getElementsByClassName("thumbnail")[0];

searchButton.addEventListener("click", () => {
    let searchString = searchInput.value.trim();
    if (searchString === "") {
        return;
    }
    thumbnail.innerHTML = "";
    getSearchResults(searchString);
})

window.onload = () => {
    getSearchResults("trending");
};

async function getSearchResults(searchString) {
    // make a call to the search API and return the results from here.
    // data need to be sent: apiKey , searchString
    let url = `${baseUrl}/search?key=${apiKey}&q=${searchString}&part=snippet&maxResults=100`
    const response = await fetch(url, { method: "GET" });
    const result = await response.json();
    console.log(result)
    addDataOntoUI(result.items);
}

async function fetchChannelDetails(channelId = "UC2CxHEcxC9gY70FQe0GhC4Q"){
    let url = `${baseUrl}/channels?key=${apiKey}&part=snippet,statistics&id=${channelId}`
    const response = await fetch(url);
    const result = await response.json();
    console.log(result);
    return result ;
}


async function addDataOntoUI(videosList) {
    // videosList.forEach((video) => {
    let count = 0;
    for (let i = 0; i < videosList.length; i++) {
            const video = videosList[i];
            if (!video || !video.id || !video.id.videoId || !video.snippet.channelId) {
                // If video data is missing or doesn't have video ID or channel ID, continue to the next video.
                continue;
            }
            count++;
            if(count==21){
                break;
            }
        const { snippet } = video;
        let channelId = snippet.channelId;
        const channelDetails = await fetchChannelDetails(channelId);
        console.log(channelDetails);

        const videoElement = document.createElement("div");
        videoElement.className = "thumbnail-item";
        videoElement.innerHTML =
                        `<div class="thumbnail-video">
                        <a class="img" href="javascript:void(0);" onclick="openVideoPage('${video.id.videoId}');">
                        <img class="img"src="${snippet.thumbnails.high.url}">
                    </a>
                                <div class="video-time"></div>
                            </div>
                            <div class="thumbnail-profile-desc">
                                <div class="t-profile">
                                    <img src="${channelDetails.items[0].snippet.thumbnails.high}" alt="">
                                </div>
                                <div class="description">
                                    <div class="title">${snippet.title}</div>
                                    <div class="channel-info">
                                        <span>${snippet.channelTitle}</span>
                                        <div>
                                            <span>1.7k</span>
                                            <span>${snippet.publishedAt}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>`
        videoElement.onclick = function () {
            // Store the video_id in localStorage
            localStorage.setItem("selectedVideoId", video.id.videoId);
            // Navigate to the video details page
            window.location.href = "video.html";

            // localStorage.setItem("playlist", video.id.playlistId);
            // window.location.href ="video.html";
        };
        thumbnail.appendChild(videoElement)
    }
    // )
}

function openVideoPage(videoId) {
    window.location.href = `video.html?videoId=${videoId}`;
}

