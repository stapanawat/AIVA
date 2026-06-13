const secretKey = process.env.OMISE_SECRET_KEY || 'skey_dummy_key';
const isDevMode = process.env.PAYMENT_DEV_MODE === 'true' || 
                  !process.env.OMISE_SECRET_KEY || 
                  process.env.OMISE_SECRET_KEY.includes('YOUR_') ||
                  process.env.OMISE_SECRET_KEY === 'dummy';

const OMISE_API_URL = 'https://api.omise.co';

// Helper to construct Basic Auth header
const getAuthHeader = () => {
  return 'Basic ' + Buffer.from(secretKey + ':').toString('base64');
};

/**
 * Creates a PromptPay source in Omise
 * @param {number} amount - Amount in THB
 * @returns {Promise<object>} - Source object
 */
const createPromptPaySource = async (amount) => {
  if (isDevMode) {
    return {
      id: `src_mock_${Math.random().toString(36).substring(2)}`,
      type: 'promptpay',
      amount: Math.round(amount * 100)
    };
  }

  const response = await fetch(`${OMISE_API_URL}/sources`, {
    method: 'POST',
    headers: {
      'Authorization': getAuthHeader(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: 'promptpay',
      amount: Math.round(amount * 100),
      currency: 'thb'
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create Omise PromptPay source');
  }
  return data;
};

/**
 * Creates a charge with card token or source ID
 * @param {object} params - { amount, source, card, metadata, returnUri }
 * @returns {Promise<object>} - Charge object
 */
const createCharge = async ({ amount, source, card, metadata, returnUri }) => {
  if (isDevMode) {
    const chargeId = `chg_mock_${Math.random().toString(36).substring(2)}`;
    return {
      id: chargeId,
      status: 'pending',
      amount: Math.round(amount * 100),
      currency: 'thb',
      metadata: metadata || {},
      source: {
        type: 'promptpay',
        scannable_code: {
          image: {
            download_uri: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://aiva.sparexth.com/mock-pay/' + chargeId
          }
        }
      }
    };
  }

  const payload = {
    amount: Math.round(amount * 100),
    currency: 'thb',
    metadata: metadata || {}
  };

  if (source) {
    payload.source = source;
  } else if (card) {
    payload.card = card;
  }

  if (returnUri) {
    payload.return_uri = returnUri;
  }

  const response = await fetch(`${OMISE_API_URL}/charges`, {
    method: 'POST',
    headers: {
      'Authorization': getAuthHeader(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create Omise charge');
  }
  return data;
};

module.exports = {
  createPromptPaySource,
  createCharge,
  isDevMode
};
