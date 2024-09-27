import React, { useState, useEffect } from 'react';
import { Card, Table, Alert, Spinner } from 'react-bootstrap';
import { transfund_backend } from 'declarations/transfund_backend';

const MyContributions = () => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchContributionsWithGoals = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const my_user = JSON.parse(storedUser);

        if (!my_user) {
          setErrorMessage('No logged-in user found. Please log in.');
          setLoading(false);
          return;
        }

        // Fetch contributions for the logged-in contributor
        const contributionsList = await transfund_backend.getContributionsByContributor(Number(my_user.id));

        // Fetch the goal details for each contribution
        const contributionsWithGoals = await Promise.all(
          contributionsList.map(async (contribution) => {
            const goalDetails = await transfund_backend.getGoalDetails(Number(contribution.goal_id));
            return {
              ...contribution,
              goal_name: goalDetails ? goalDetails[0].goal_id+' - '+goalDetails[0].goal_name : 'Unknown Goal', // Fallback in case goal is not found
            };
          })
        );

        setContributions(contributionsWithGoals);
      } catch (error) {
        console.error('Failed to fetch contributions:', error);
        setErrorMessage('Could not fetch contributions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchContributionsWithGoals();
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
                      <td>{contribution.goal_name}</td> {/* Displaying goal name */}
                      <td>{Number(contribution.amount).toLocaleString()} Frw</td>
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
