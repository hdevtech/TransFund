import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { transfund_backend } from 'declarations/transfund_backend';
import {setPaymentCredentials , initiatePayment } from '../../payment/hdev_payment'; // Import payment functions

const Contribute = () => {
  const { goal_id } = useParams();
  const [goal, setGoal] = useState(null);
  const [contributor, setContributor] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGoalDetails = async () => {
      try {
        const goalDetails = await transfund_backend.getGoalDetails(Number(goal_id));
        if (goalDetails) {
          setGoal(goalDetails[0]);

          const contributorDetails = await transfund_backend.getContributors();
          const matchedContributor = contributorDetails.find(
            (contributor) => contributor.id === goalDetails[0].contributor_id
          );
          setContributor(matchedContributor);
        }
      } catch (error) {
        setErrorMessage('Could not fetch goal details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const fetchLoggedInUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setLoggedInUser(JSON.parse(storedUser));
      } else {
        setErrorMessage('No logged-in user found. Please log in.');
      }
    };

    fetchGoalDetails();
    fetchLoggedInUser();
  }, [goal_id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    if (!loggedInUser) {
      setErrorMessage('You must be logged in to contribute.');
      setSubmitting(false);
      return;
    }

    const date = new Date().toISOString();
    const tx_ref = Math.random().toString(36).substring(2, 14);
    const link = `${window.location.origin}/receipt/${tx_ref}/view`;

    try {
        const set_it = await setPaymentCredentials('HDEV-cb85b130-ef54-4584-a6f4-32a0fd77b86c-ID','HDEV-bda7c1be-0933-4414-87ed-089020c1654e-KEY');
        // Initiate the payment process
        const paymentResponse = await initiatePayment(values.phone_number, values.amount, tx_ref, link);


      
      if (paymentResponse.status === 'success') {        
        // Save contribution in the backend
        await transfund_backend.addContribution(
            Date.now(),
            Number(loggedInUser.id),
            values.phone_number,
            Number(goal.goal_id),
            Number(values.amount),
            date,
            'none',
            tx_ref,
            'pending'
        );
        setSuccessMessage('Payment initiated, waiting for confirmation...');
        setTimeout(() => navigate(`/waiting/${tx_ref}`), 1000); // Redirect to waiting page
      } else {
        setErrorMessage(paymentResponse.message || 'Payment failed.');
      }
    } catch (error) {
        console.error('Contribution error:', error);
      setErrorMessage('Contribution or payment failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object().shape({
    amount: Yup.number().required('Amount is required').positive('Amount must be a positive number'),
    phone_number: Yup.string().required('Phone number is required'),
  });


  return (
    <React.Fragment>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : errorMessage ? (
        <Alert variant="danger" className="text-center">{errorMessage}</Alert>
      ) : (
        <>
        <Row>
            <Col>
            <Card className="mb-4">
                <Card.Body>
                <h5 className="mb-3">{goal.goal_name}</h5>
                <p>{goal.goal_desc}</p>
                <h4 className="f-w-300 m-b-0">{parseFloat(goal.goal_target).toFixed(2)} Frw</h4>
                </Card.Body>
                <Card.Footer>
                <small>Raised by: {contributor ? contributor.name : 'Unknown'}</small> {/* Show goal raiser's name */}
                </Card.Footer>
            </Card>
            </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <Card>
              <Card.Header>
                <Card.Title as="h5">Contribute to {goal.goal_name}</Card.Title>
              </Card.Header>
              <Card.Body>
                {successMessage && <Alert variant="success">{successMessage}</Alert>}
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                <Formik
                  initialValues={{ amount: '', phone_number: '' }}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ values, handleChange, handleSubmit, errors, touched, isSubmitting }) => (
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                          type="number"
                          name="amount"
                          placeholder="Enter amount"
                          value={values.amount}
                          onChange={handleChange}
                          isInvalid={!!touched.amount && !!errors.amount}
                        />
                        {touched.amount && errors.amount && (
                          <Form.Control.Feedback type="invalid">{errors.amount}</Form.Control.Feedback>
                        )}
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="phone_number"
                          placeholder="Enter your phone number"
                          value={values.phone_number}
                          onChange={handleChange}
                          isInvalid={!!touched.phone_number && !!errors.phone_number}
                        />
                        {touched.phone_number && errors.phone_number && (
                          <Form.Control.Feedback type="invalid">{errors.phone_number}</Form.Control.Feedback>
                        )}
                      </Form.Group>

                      <Button variant="primary" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Processing...' : 'Contribute'}
                      </Button>
                    </Form>
                  )}
                </Formik>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        </>
      )}
    </React.Fragment>
  );
};

export default Contribute;
