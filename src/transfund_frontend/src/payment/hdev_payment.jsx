import axios from 'axios';

const API_URL = 'https://payment.hdevtech.cloud/api_pay/api/';

var urll = '';

// Set the API ID and API Key dynamically
export const setPaymentCredentials = (apiId, apiKey) => {
  axios.defaults.baseURL = `${API_URL}${apiId}/${apiKey}`;
  
  urll = `${API_URL}${apiId}/${apiKey}`;
};

// Call the payment API
export const initiatePayment = async (tel, amount, tx_ref, link) => {
  try {
    const formData = new FormData();
    formData.append('ref', 'pay');
    formData.append('tel', tel);
    formData.append('tx_ref', tx_ref);
    formData.append('amount', amount);
    formData.append('link', link);

    const response = await axios.post(urll, formData);
    return response.data;
  } catch (error) {
    console.error('Payment initiation failed', error);
    throw error;
  }
};

// Get payment status
export const getPaymentStatus = async (tx_ref) => {
  try {
    const formData = new FormData();
    formData.append('ref', 'read');
    formData.append('tx_ref', tx_ref);

    const response = await axios.post(urll, formData);
    return response.data;
  } catch (error) {
    console.error('Failed to get payment status', error);
    throw error;
  }
};
