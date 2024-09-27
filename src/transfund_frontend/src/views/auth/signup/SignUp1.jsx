import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { transfund_backend } from 'declarations/transfund_backend'; // Import the backend actor
import { AuthClient } from "@dfinity/auth-client"; // Import AuthClient

const JWTSignup = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [authClient, setAuthClient] = useState(null);

  // Initialize the AuthClient when the component mounts
  useEffect(() => {
    AuthClient.create().then(client => {
      setAuthClient(client);
    });
  }, []);

  const handleSignup = async (values, { setSubmitting }) => {
    setErrorMessage('');
    setLoading(true);

    try {
      const { name, username, password, phone_number } = values;

      // Authenticate with Internet Identity to get the principal
      if (!authClient) return;
      
      const internetIdentityUrl = import.meta.env.PROD
        ? undefined
        : `http://localhost:4943/?canisterId=${process.env.INTERNET_IDENTITY_CANISTER_ID}`;

      await new Promise((resolve) => {
        authClient.login({
          identityProvider: internetIdentityUrl,
          onSuccess: () => resolve(undefined),
        });
      });

      const identity = authClient.getIdentity();
      const principal = identity.getPrincipal();

      // Log the principal for debugging purposes
      console.log('Principal:', principal.toString());

      // Call backend to add the new contributor, passing the principal
      await transfund_backend.addContributorWithPrincipal(
        Date.now(), // Using timestamp as ID, you can choose your ID logic
        name,
        username,
        password,
        phone_number,
        principal
      );
      alert('Signup successful!'); // Show success message
      // After successful signup, redirect to login or dashboard
      navigate('/login'); // Redirect to login page after signup
    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage('An error occurred during signup. Please try again later.');
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <Formik
      initialValues={{
        name: '',
        username: '',
        password: '',
        phone_number: ''
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().required('Name is required'),
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required'),
        phone_number: Yup.string().required('Phone number is required')
      })}
      onSubmit={handleSignup}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <div className="form-group mb-3">
            <input
              className="form-control"
              name="name"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.name}
              placeholder="Enter Name"
            />
            {touched.name && errors.name && (
              <small className="text-danger form-text">{errors.name}</small>
            )}
          </div>
          <div className="form-group mb-3">
            <input
              className="form-control"
              name="username"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.username}
              placeholder="Enter Username"
            />
            {touched.username && errors.username && (
              <small className="text-danger form-text">{errors.username}</small>
            )}
          </div>
          <div className="form-group mb-4">
            <input
              className="form-control"
              name="password"
              onBlur={handleBlur}
              onChange={handleChange}
              type="password"
              value={values.password}
              placeholder="Enter Password"
            />
            {touched.password && errors.password && (
              <small className="text-danger form-text">{errors.password}</small>
            )}
          </div>
          <div className="form-group mb-4">
            <input
              className="form-control"
              name="phone_number"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.phone_number}
              placeholder="Enter Phone Number"
            />
            {touched.phone_number && errors.phone_number && (
              <small className="text-danger form-text">{errors.phone_number}</small>
            )}
          </div>
          <Row>
            <Col>
              <Button
                className="btn-block mb-4"
                variant="primary"
                disabled={isSubmitting || loading}
                type="submit"
              >
                {isSubmitting || loading ? 'Signing up...' : 'Sign Up'}
              </Button>
            </Col>
          </Row>
        </form>
      )}
    </Formik>
  );
};

export default JWTSignup;
