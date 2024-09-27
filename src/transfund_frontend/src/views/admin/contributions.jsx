import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Table } from 'react-bootstrap';
import { transfund_backend } from 'declarations/transfund_backend';

const GoalContributions = () => {
  const { goal_id } = useParams(); // Get goal_id from URL parameters
  const [contributions, setContributions] = useState([]);
  const [goal, setGoal] = useState(null);
  const [contributorsMap, setContributorsMap] = useState({}); // Map for contributor IDs to names
  const [totalRaised, setTotalRaised] = useState(0); // State to hold total raised amount

  // Fetch contributions and goal details when the component mounts
  useEffect(() => {
    const fetchContributionsAndGoal = async () => {
      try {
        // Fetch contributions for the specified goal
        const contributionsList = await transfund_backend.getContributionsByGoal(Number(goal_id));
        setContributions(contributionsList);

        // Calculate total raised amount considering only successful payments
        const total = contributionsList
          .filter(contribution => contribution.payment_status === 'success') // Filter for successful payments
          .reduce((acc, contribution) => acc + Number(contribution.amount), 0); // Convert amount to Number
        setTotalRaised(total);

        // Fetch the goal details for displaying
        const goalDetails = await transfund_backend.getGoalDetails(Number(goal_id)); // Ensure goal_id is a Number
        // console.log('Goal Details:', goalDetails);
        setGoal(goalDetails[0]);

        // Fetch all contributors to map contributor IDs to names
        const allContributors = await transfund_backend.getContributors();
        const contributors = {};
        allContributors.forEach(contributor => {
          contributors[contributor.id] = contributor.name;
        });
        setContributorsMap(contributors);
      } catch (error) {
        console.error('Failed to fetch contributions or goal details:', error);
      }
    };

    fetchContributionsAndGoal();
  }, [goal_id]);

  return (
    <div>
      {goal ? (
        <Card className="mb-4">
          <Card.Header>
            <Card.Title as="h5">{goal.goal_name}</Card.Title>
            <span className="d-block m-t-5">{goal.goal_desc}</span>
          </Card.Header>
          <Card.Body>
            <p><strong>Target Amount:</strong> {Number(goal.goal_target).toLocaleString()}</p> {/* Format for better readability */}
            <p><strong>Date:</strong> {goal.date}</p>
            <p><strong>Total Raised Amount:</strong> {totalRaised.toLocaleString()}</p> {/* Format for better readability */}
          </Card.Body>
        </Card>
      ) : (
        <p>Loading goal details...</p>
      )}

      <Card>
        <Card.Header>
          <Card.Title as="h5">Contributions for {goal ? goal.goal_name : '...'}</Card.Title>
        </Card.Header>
        <Card.Body>
          <Table responsive hover striped>
            <thead>
              <tr>
                <th>#</th>
                <th>Contributor Name</th>
                <th>Contributor ID</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Payment Status</th>
                <th>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {contributions.length > 0 ? (
                contributions.map((contribution, index) => (
                  <tr key={contribution.contribution_id}>
                    <th scope="row">{index + 1}</th>
                    <td>{contributorsMap[contribution.contributor_id] || 'Unknown'}</td>
                    <td>{contribution.contributor_id}</td>
                    <td>{Number(contribution.amount).toLocaleString()}</td> {/* Format for better readability */}
                    <td>{contribution.date}</td>
                    <td>{contribution.payment_status}</td>
                    <td>{contribution.phone_number}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No contributions found for this goal.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default GoalContributions;
