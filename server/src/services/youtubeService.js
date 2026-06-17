/**
 * YouTube Data API v3 Service for AIVA
 */

/**
 * Reply to a specific YouTube comment thread (top-level comment)
 * @param {string} accessToken - OAuth2 access token for the channel
 * @param {string} parentId - The ID of the comment thread or parent comment to reply to
 * @param {string} text - The content of the reply
 * @returns {Promise<Object>} - The created comment resource from YouTube API
 */
async function replyToComment(accessToken, parentId, text) {
  if (!accessToken) {
    throw new Error('Access token is required to reply to YouTube comments.');
  }
  if (!parentId) {
    throw new Error('Parent Comment ID (parentId) is required to reply.');
  }
  if (!text) {
    throw new Error('Comment text is required.');
  }

  const response = await fetch('https://www.googleapis.com/youtube/v3/comments?part=snippet', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      snippet: {
        parentId: parentId,
        textOriginal: text
      }
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to reply to YouTube comment');
  }

  return data;
}

/**
 * Fetch comment threads for a channel
 * @param {string} accessToken
 * @param {string} channelId
 * @returns {Promise<Object>}
 */
async function getCommentThreads(accessToken, channelId) {
  if (!accessToken) {
    throw new Error('Access token is required.');
  }
  if (!channelId) {
    throw new Error('Channel ID is required.');
  }

  const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&allThreadsRelatedToChannelId=${channelId}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to fetch YouTube comment threads');
  }

  return data;
}

module.exports = {
  replyToComment,
  getCommentThreads
};
