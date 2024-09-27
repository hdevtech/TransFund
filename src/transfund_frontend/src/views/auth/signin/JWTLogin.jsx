import React, { useState, useEffect } from 'react';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { transfund_backend } from 'declarations/transfund_backend';
import { AuthClient } from "@dfinity/auth-client";

const JWTLogin = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [authClient, setAuthClient] = useState(null);

  const checkAndRegisterDefaultAdmin = async () => {
    try {
      const admins = await transfund_backend.getAdmins();
      if (admins.length === 0) {
        await transfund_backend.addAdmin(2580, 'admin', 'admin', 'admin123');
        console.log('Default admin added: Username: admin, Password: admin123');
      }
    } catch (error) {
      console.error('Error initializing default admin:', error);
      setErrorMessage('An error occurred while initializing the system. Please try again later.');
    } finally {
      setIsCheckingAdmin(false);
    }
  };

  useEffect(() => {
    checkAndRegisterDefaultAdmin();
    AuthClient.create().then(client => {
      setAuthClient(client);
    });
  }, []);

  const handleLogin = async (values, { setSubmitting }) => {
    setErrorMessage('');
    setLoading(true);

    try {
      const { username, password } = values;

      const isAdmin = await transfund_backend.adminLogin(username, password);
      const isContributor = await transfund_backend.contributorLogin(username, password);

      if (isAdmin && isAdmin.length > 0) {
        const adminUser = { id: username, role: 'admin' };
        localStorage.setItem('user', JSON.stringify(adminUser)); // Store user in localStorage
        navigate('/admin/dashboard');
      } else if (isContributor && isContributor.length > 0) {
        const contributorUser = { id: username, role: 'contributor' };
        localStorage.setItem('user', JSON.stringify(contributorUser)); // Store user in localStorage
        navigate('/contributor/dashboard');
      } else {
        setErrorMessage('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An error occurred during login. Please try again later.');
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  const signInWithInternetIdentity = async () => {
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

    // log  the principal
    console.log(principal.toString());

    // Check if the principal corresponds to a contributor
    const contributor = await transfund_backend.getContributorByPrincipal(principal);

    console.log(contributor);

    if (contributor) {
      const contributorUser = { id: principal.toString(), role: 'contributor' };
      localStorage.setItem('user', JSON.stringify(contributorUser)); // Store user in localStorage
      navigate('/contributor/dashboard');
    } else {
      setErrorMessage('You are not a registered contributor.');
    }
  };

  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required')
      })}
      onSubmit={handleLogin}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

          {isCheckingAdmin ? (
            <Alert variant="info">Checking system initialization...</Alert>
          ) : (
            <>
              <div className="form-group mb-3">
                <input
                  className="form-control"
                  name="username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
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

              <Row>
                <Col>
                  <Button
                    className="btn-block mb-4"
                    variant="primary"
                    disabled={isSubmitting || loading}
                    type="submit"
                  >
                    {isSubmitting || loading ? 'Logging in...' : 'Sign In'}
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button
                    className="btn-block mb-4"
                    variant="secondary"
                    onClick={signInWithInternetIdentity}
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Sign in with Internet Identity'}
                  </Button>
                </Col>
              </Row>
            </>
          )}
        </form>
      )}
    </Formik>
  );
};

export default JWTLogin;
