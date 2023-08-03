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

async function getVideoLikesCount(videoId) {
//   const baseUrl = "https://www.googleapis.com/youtube/v3/videos";
  const url = `${baseUrl}/videos?key=${apiKey}&part=statistics&id=${videoId}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.items.length > 0) {
      const likesCount = data.items[0].statistics.likeCount;
      return likesCount;
    } else {
      console.log("Video not found or statistics not available.");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
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
        // console.log(channelDetails);
            
        const likeno = await getVideoLikesCount(video.id.videoId)
        const likeCount = abbreviateNumber(likeno)
        console.log(channelDetails.items[0].snippet.thumbnails.high.url);
    
        let publishTime = getTimeAgo(snippet.publishedAt)

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
                                    <img src="${channelDetails.items[0].snippet.thumbnails.high.url}" alt="">
                                </div>
                                <div class="description">
                                    <div class="title">${snippet.title}</div>
                                    <div class="channel-info">
                                        <span>${snippet.channelTitle}</span>
                                        <div>
                                            <span>${likeCount} Likes</span>
                                            <span>${publishTime}</span>
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


function getTimeAgo(publishedTime) {
    const currentTime = new Date();
    const commentTime = new Date(publishedTime);
    const diff = currentTime - commentTime;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
  
    if (seconds < 60) {
      return `${seconds} seconds ago`;
    } else if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else if (days < 7) {
      return `${days} days ago`;
    } else if (weeks < 4) {
      return `${weeks} weeks ago`;
    } else if (months < 12) {
      return `${months} months ago`;
    } else {
      return `${years} years ago`;
    }
  }


  function abbreviateNumber(value) {
    const suffixes = ["", "k", "M", "B", "T"];
    const num = parseInt(value);
    const tier = (Math.log10(num) / 3) | 0;
  
    if (tier === 0) return num.toString();
  
    const suffix = suffixes[tier];
    const scale = Math.pow(10, tier * 3);
    const scaledValue = num / scale;
  
    // Limit to 1 decimal place
    const roundedValue = scaledValue.toFixed(1);
  
    return roundedValue + suffix;
  }
  