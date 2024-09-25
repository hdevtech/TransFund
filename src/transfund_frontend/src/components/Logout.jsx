import React, { useEffect, useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { NavLink, Link, useNavigate } from 'react-router-dom';

import Breadcrumb from '../layouts/AdminLayout/Breadcrumb';

const Logout = () => {
  const [loggingOut, setLoggingOut] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = () => {
      // Remove user data from local storage
      localStorage.removeItem('user');
      // Redirect to the login page after a short delay to show the message
      setTimeout(() => {
        navigate('/login');
      }, 2000); // 2 seconds delay
    };

    handleLogout();
  }, [navigate]);

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
                  <div className="mb-4">
                    <i className="feather icon-user-minus auth-icon" />
                  </div>
                  <h3 className="mb-4">{loggingOut ? 'Logging out...' : 'You have been logged out.'}</h3>
                  <p>Please wait, you will be redirected to the login page shortly.</p>
                  {/* Optional: You can add a loading spinner or similar here */}
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Logout;
