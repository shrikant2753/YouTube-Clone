// const apiKey = "AIzaSyC0lDc68z2wZ19AT7_ST7RQ2833ZIm1IyE";
const apiKey = "AIzaSyBeO62LE91qtWdztS8371MJi-OR8VGYqaM"; //shrikant api
const baseUrl = `https://www.googleapis.com/youtube/v3`;
const video_container = document.getElementById("video-container");
const selectedVideoId = localStorage.getItem("selectedVideoId");
const comments = document.getElementById("comments");
const c_replies = document.getElementById("c-replies");

window.onload = async () => {
  // const videoId = "28ewOqp-5ds"; // Replace with your desired video ID
  // const channelId = "UC2CxHEcxC9gY70FQe0GhC4Q"; // Replace with your desired channel ID

  await fetchVideoDetails();
  // const channelDetails = await fetchChannelDetails(channelId);

  // Call the function to populate the DOM with fetched data
  // addDeatailsOntoDOM(videoInfo, channelDetails);
};

async function fetchVideoDetails() {
  console.log(selectedVideoId);
  let url = `${baseUrl}/videos?key=${apiKey}&part=snippet,contentDetails,statistics&id=${selectedVideoId}`;

  const response = await fetch(url, { method: "GET" });
  const videoInfo = await response.json();
  console.log(videoInfo);
  const channelDetails = await fetchChannelDetails(
    videoInfo.items[0].snippet.channelId
  );
  const commentsDetails = await fetchCommentsDetails(selectedVideoId);
  // const playlist = await fetchPlaylistInfo(videoInfo.items[0].id)
  addDeatailsOntoDOM(videoInfo, channelDetails);
  addCommentsOntoDOM(commentsDetails.items);
}

async function fetchChannelDetails(channelId) {
  console.log(channelId);
  let url = `${baseUrl}/channels?key=${apiKey}&part=snippet,statistics&id=${channelId}`;
  const response = await fetch(url);
  const result = await response.json();
  console.log(result);
  return result;
}

//fetch comments on video
async function fetchCommentsDetails(videoId) {
  console.log(videoId);
  let url = `${baseUrl}/commentThreads?key=${apiKey}&part=id,snippet,replies&videoId=${videoId}&maxResults=20`;
  let response = await fetch(url, { method: "GET" });
  let result = await response.json();
  console.log(result);
  return result;
}

// Fetch playlist information for the video
async function fetchPlaylistInfo(playlisId) {
  console.log(playlisId);
  const url = `${baseUrl}/playlistItems?key=${apiKey}&part=snippet,contentDetails,id,status&playlistId=${playlisId}`;

  const response = await fetch(url);
  const result = await response.json();
  console.log(result);
  return result;
}

function addDeatailsOntoDOM(videoInfo, channelDetails) {
  const videoData = videoInfo.items[0].snippet;
  const statistics = videoInfo.items[0].statistics;
  const channelData = channelDetails.items[0].snippet;
  const cTime = videoData.publishedAt;
  const timeAgo = getTimeAgo(cTime);
  const viewsCount = abbreviateNumber(statistics.viewCount);
  const likesCount = abbreviateNumber(statistics.likeCount);
  const dislikesCount = abbreviateNumber(statistics.dislikeCount);
  const subscribersCount = abbreviateNumber(
    channelDetails.items[0].statistics.subscriberCount
  );

  let wrapper = document.createElement("div");
  wrapper.className = "wrapper";

  wrapper.innerHTML = `
    <div class="video">
        <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoInfo.items[0].id}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
      <div class="video-info">
          <div class="title">${videoData.title}</div>
          <div class="info">
              <div class="info-text">
                  <span class="views">${viewsCount} views</span>
                  <span class="time">${timeAgo}</span>
              </div>
              <div class="top-level">
                  <div class="like">
                      <button>
                          <span class="material-icons-outlined">thumb_up</span>
                      </button>
                      <span>${likesCount}</span>
                  </div>
                  <div class="dislike">
                      <button>
                          <span class="material-icons-outlined">thumb_down</span>
                      </button>
                      <span>${dislikesCount}</span>
                  </div>
                  <div class="share">
                      <button>
                          <span class="material-icons-outlined">share</span>
                      </button>
                      <span>share</span>
                  </div>
                  <div class="save">
                      <button>
                          <span class="material-icons-outlined">playlist_add_check</span>
                      </button>
                      <span>save</span>
                  </div>
              </div>
          </div>
      </div>
      <div class="video-desc">
          <div class="channel-info">
              <div class="left-info">
                  <img src="${channelData.thumbnails.default.url}" alt="" />
                  <span class="channel-title">
                      <div class="title">${channelData.title}</div>
                      <div class="sub-title">${subscribersCount} subscribers</div>
                  </span>
              </div>
              <div class="right-info">
                  <button>Subscribe</button>
              </div>
          </div>
          <div class="desc-text">
              ${videoData.description}
          </div>
      </div>
    `;

  video_container.append(wrapper);
}

function addCommentsOntoDOM(commentsDetails) {
  let wrapper = document.createElement("div");
  wrapper.className = "wrapper";

  commentsDetails.forEach((comment) => {
    const { snippet } = comment;
    const { topLevelComment } = snippet;
    const cTime = topLevelComment.snippet.publishedAt;
    const timeAgo = getTimeAgo(cTime);
    const likesCount = abbreviateNumber(topLevelComment.snippet.likeCount);
    const repliesCount = abbreviateNumber(snippet.totalReplyCount);

    const commentElement = document.createElement("div");
    commentElement.className = "c-user"; // Changed class name to "c-user"
    commentElement.innerHTML = `<div class="c-profile">
                <img src="${topLevelComment.snippet.authorProfileImageUrl}" alt="author profile" />
            </div>
            <div class="y-comment">
                <div class="c-header">
                    <div class="user-name">${topLevelComment.snippet.authorDisplayName}</div>
                    <div class="u-c-time">${timeAgo}</div>
                </div>
                <div class="c-text">
                    ${topLevelComment.snippet.textDisplay}
                </div>
                <div class="c-toolbar">
                    <div class="like">
                        <button>
                            <span class="material-icons-outlined">thumb_up</span>
                        </button>
                        <span class="etxt">${likesCount}</span>
                    </div>
                    <div class="dislike">
                        <button>
                            <span class="material-icons-outlined">thumb_down</span>
                        </button>
                        <span class="etxt"></span>
                    </div>
                    <div class="replay etxt">Replay</div>
                </div>
                <div class="c-replay">
                    <span class="material-icons-outlined">expand_more</span>
                    <span>${snippet.totalReplyCount} replies</span>
                </div>
                <div class="c-replies" id="c-replies"> <!-- This is the replies section -->
                    <!-- Add the replies here, you can use a similar loop as above -->
                    
                </div>
            </div>`;

        // Add event listener to "Replay" button
        const replayButton = commentElement.querySelector(".c-replay");
        replayButton.addEventListener("click", () => {
            console.log('on click replies trigger');
            let repliesSection = commentElement.querySelector(".c-replies");
            if(repliesSection.style.display==''){
                repliesSection.style.display='none'
            }
            console.log(repliesSection.style.display);
        
            // If repliesSection is currently hidden (display: none), show it and add replies
            if (!repliesSection || repliesSection.style.display === "none") {
                if (repliesSection) {
                    repliesSection.style.display = "block";
                } else {
                    // If repliesSection is not found, create and append a new one
                    repliesSection = document.createElement("div");
                    repliesSection.className = "c-replies";
                    repliesSection.style.display = "block";
                    commentElement.appendChild(repliesSection);
                }
                addCommentsRepliesOntoDOM(comment.replies.comments, repliesSection);
            } else {
                // If repliesSection is currently visible (display: block), hide it and remove from DOM
                repliesSection.style.display = "none";
                repliesSection.innerHTML = ""; // Clear the replies content
            }
        });
           
    wrapper.appendChild(commentElement);
  });

  comments.appendChild(wrapper);
}

function addCommentsRepliesOntoDOM(replies, repliesSection) {
  // Create a wrapper element for the replies
  const repliesWrapper = document.createElement("div");
  repliesWrapper.className = "replies-wrapper";

  replies.forEach((reply) => {
    const { snippet } = reply;
    const cTime = snippet.publishedAt;
    const timeAgo = getTimeAgo(cTime);
    const likesCount = abbreviateNumber(snippet.likeCount);

    const replyElement = document.createElement("div");
    replyElement.className = "c-user";
    replyElement.innerHTML = `
            <div class="c-profile">
                <img src="${snippet.authorProfileImageUrl}" alt="author profile" />
            </div>
            <div class="y-comment">
                <div class="c-header">
                    <div class="user-name">${snippet.authorDisplayName}</div>
                    <div class="u-c-time">${timeAgo}</div>
                </div>
                <div class="c-text">
                    ${snippet.textDisplay}
                </div>
                <div class="c-toolbar">
                    <div class="like">
                        <button>
                            <span class="material-icons-outlined">thumb_up</span>
                        </button>
                        <span class="etxt">${likesCount}</span>
                    </div>
                    <div class="dislike">
                        <button>
                            <span class="material-icons-outlined">thumb_down</span>
                        </button>
                        <span class="etxt"></span>
                    </div>
                    <div class="replay etxt">Replay</div>
                </div>
            </div>`;

    // Append the reply element to the replies wrapper
    repliesWrapper.appendChild(replyElement);
  });

  // Append the replies wrapper to the specified repliesSection
  repliesSection.appendChild(repliesWrapper);
  repliesWrapper.style.display = "block";
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
