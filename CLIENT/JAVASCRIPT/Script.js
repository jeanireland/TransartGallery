// Script.js

// Replace 'YOUR_ACCESS_TOKEN' with your actual Instagram access token
const accessToken = 'YOUR_ACCESS_TOKEN';

// Function to fetch and display Instagram profile and posts
async function fetchInstagramData() {
  try {
    const userProfileResponse = await fetch(`https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${accessToken}`);
    const userProfile = await userProfileResponse.json();

    document.getElementById('profile').innerHTML = `
      <h2>${userProfile.username}</h2>
      <p>Account Type: ${userProfile.account_type}</p>
      <p>Media Count: ${userProfile.media_count}</p>
    `;

    const userMediaResponse = await fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,thumbnail_url,timestamp&access_token=${accessToken}`);
    const userMedia = await userMediaResponse.json();

    const postsContainer = document.getElementById('posts');
    userMedia.data.forEach(post => {
      const postElement = document.createElement('div');
      postElement.className = 'col-md-4 mb-4';
      postElement.innerHTML = `
        <div class="card">
          <img src="${post.media_url}" class="card-img-top" alt="Post Image">
          <div class="card-body">
            <p class="card-text">${post.caption || ''}</p>
            <a href="${post.permalink}" target="_blank" class="btn btn-primary">View on Instagram</a>
          </div>
        </div>
      `;
      postsContainer.appendChild(postElement);
    });
  } catch (error) {
    console.error('Error fetching Instagram data', error);
  }
}

// Call the function to fetch and display Instagram data
fetchInstagramData();
