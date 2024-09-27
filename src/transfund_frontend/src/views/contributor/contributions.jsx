import React, { useState, useEffect } from 'react';
import { Card, Table, Alert, Spinner } from 'react-bootstrap';
import { transfund_backend } from 'declarations/transfund_backend';

const MyContributions = () => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [loggedInUser, setLoggedInUser] = useState([]);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        
        const storedUser = localStorage.getItem('user');
        const my_user = JSON.parse(storedUser);
        
        if (storedUser) {
            console.log('Logged-in user:', loggedInUser);
            // Fetch contributions for the logged-in contributor
            const contributionsList = await transfund_backend.getContributionsByContributor(Number(storedUser.id));
            setContributions(contributionsList);
            
        } else {
            setErrorMessage('No logged-in user found. Please log in.');
            setLoading(false);
            return;
        }
      } catch (error) {
        console.error('Failed to fetch contributions:', error);
        setErrorMessage('Could not fetch contributions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : errorMessage ? (
        <Alert variant="danger" className="text-center">{errorMessage}</Alert>
      ) : (
        <Card>
          <Card.Header>
            <Card.Title as="h5">My Contributions</Card.Title>
          </Card.Header>
          <Card.Body>
            <Table responsive hover striped>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Goal Name</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {contributions.length > 0 ? (
                  contributions.map((contribution, index) => (
                    <tr key={contribution.contribution_id}>
                      <th scope="row">{index + 1}</th>
                      <td>{contribution.goal_name}</td> {/* Assuming you have goal_name in contribution object */}
                      <td>${Number(contribution.amount).toLocaleString()}</td>
                      <td>{new Date(contribution.date).toLocaleDateString()}</td>
                      <td>{contribution.payment_status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No contributions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default MyContributions;
