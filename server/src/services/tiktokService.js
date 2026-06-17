/**
 * TikTok Open API / Shop API Service for AIVA
 */

/**
 * Send a direct message to a customer on TikTok
 * @param {string} accessToken - OAuth2 access token for the TikTok integration
 * @param {string} recipientOpenId - The open_id of the TikTok customer
 * @param {string} text - The message content
 * @returns {Promise<Object>} - The API response data
 */
async function sendMessage(accessToken, recipientOpenId, text) {
  if (!accessToken) {
    throw new Error('Access token is required to send TikTok messages.');
  }
  if (!recipientOpenId) {
    throw new Error('Recipient Open ID is required.');
  }
  if (!text) {
    throw new Error('Message text is required.');
  }

  const response = await fetch('https://open-api.tiktok.com/message/send/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Token': accessToken
    },
    body: JSON.stringify({
      recipient_open_id: recipientOpenId,
      message_content: { text: text }
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to send message to TikTok');
  }

  return data;
}

module.exports = {
  sendMessage
};
