import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { Alert, Spinner, Button } from 'react-bootstrap';
import { transfund_backend } from 'declarations/transfund_backend'; // Import the backend
import { getPaymentStatus } from '../../payment/hdev_payment'; // Import the payment API functions
import Breadcrumb from '../../layouts/AdminLayout/Breadcrumb'; // Import Breadcrumb
import axios from 'axios'; // Import axios for sending the SMS

const WaitingPage = () => {
  const { tx_ref } = useParams(); // Get transaction reference from the URL
  const [status, setStatus] = useState('pending');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // Fetch payment status using the payment API
        const paymentResponse = await getPaymentStatus(tx_ref);

        // Set payment details from the response
        if (paymentResponse) {
          setPaymentDetails(paymentResponse); // Assuming the response contains payment details

          const paymentStatus = paymentResponse.status; // Adjust based on your actual response structure
          const transactionId = paymentResponse.tx_id;
          const transactionRef = paymentResponse.tx_ref;
          const amount = paymentResponse.amount;
          const customerName = 'Transfund Contributor';
          const customerPhone = paymentResponse.tel;

          if (paymentStatus === 'success') {
            // Update the status in the backend
            const updateStatusResult = await transfund_backend.updateContributionStatus(
              tx_ref, 
              transactionId,
              'success'
            );
            if (updateStatusResult) {
              setStatus('success');

              // Send confirmation SMS to the contributor
              await sendMessage(customerName, customerPhone, transactionId, amount, tx_ref);

              setTimeout(() => navigate(`/receipt/${tx_ref}/view`), 2000); // Redirect to receipt
            } else {
              setErrorMessage('Failed to update payment status.');
            }
          } else if (paymentStatus === 'failed') {
            // Update the status in the backend
            await transfund_backend.updateContributionStatus(
              tx_ref, 
              transactionId, 
              'failed'
            );
            setStatus('failed');
          } else {
            // If payment status is still pending, continue polling
            setTimeout(checkPaymentStatus, 5000); // Polling every 5 seconds
          }
        } else {
          setErrorMessage('Payment response not found.');
        }
      } catch (error) {
        setErrorMessage('Failed to retrieve payment status.');
      } finally {
        setLoading(false);
      }
    };

    checkPaymentStatus();
  }, [tx_ref, navigate]);

  // Function to send SMS to the contributor
  const sendMessage = async (customerName, customerPhone, transactionId, amount, tx_reff) => {
    const formData = new FormData();
    formData.append('sender_id', 'L7-IT');
    formData.append('ref', 'sms');
    formData.append('message', `Dear ${customerName}, your contribution has been received. Transaction ID: ${transactionId}, and Transaction reference : ${tx_reff} Amount: ${amount} Rwf. Thank you!`);
    formData.append('tel', customerPhone);

    try {
      const response = await axios.post(
        'https://sms-api.hdev.rw/v1/api/HDEV-36691687-9144-4e4c-b769-62443d655e15-ID/HDEV-2a1749da-be37-4421-b982-81f10cc53301-KEY',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      console.log('Message sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <React.Fragment>
      <Breadcrumb />
      <div className="auth-wrapper">
        <div className="auth-content">
          <div className="auth-bg">
            <span className="r" />
            <span className="r s" />
            <span className="r s" />
            <span className="r" />
          </div>
          <Card className="borderless">
            <Row className="align-items-center">
              <Col>
                <Card.Body className="text-center">
                  {loading && <Spinner animation="border" variant="primary" />}
                  
                  {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                  
                  {status === 'pending' && (
                    <>
                      <h4>Waiting for payment confirmation...</h4>
                      {paymentDetails && (
                        <div className="payment-details">
                          <h5>Payment Details:</h5>
                          <p><strong>Transaction Reference:</strong> {paymentDetails.tx_ref}</p>
                          <p><strong>Amount:</strong> {paymentDetails.amount}</p>
                          <p><strong>Phone Number:</strong> {paymentDetails.tel}</p>
                          {/* Add other payment details as needed */}
                        </div>
                      )}
                    </>
                  )}
                  
                  {status === 'success' && (
                    <Alert variant="success">Payment successful! Redirecting...</Alert>
                  )}
                  
                  {status === 'failed' && (
                    <Alert variant="danger">
                      Payment failed. 
                      <Button onClick={() => navigate('/contributor/view-fundraising-goals')} className="ml-2">Try Again</Button>
                    </Alert>
                  )}
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default WaitingPage;
