import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button } from 'react-bootstrap';
import { transfund_backend } from 'declarations/transfund_backend';
import { useNavigate } from 'react-router-dom';

const ViewFundraisingGoals = () => {
  const [goals, setGoals] = useState([]);
  const [contributors, setContributors] = useState([]);
  const navigate = useNavigate(); // To handle navigation to "Add Goal" page

  // Fetch contributors and goals from the backend when the component loads
  useEffect(() => {
    const fetchGoalsAndContributors = async () => {
      try {
        const goalList = await transfund_backend.getGoals(); // Fetch fundraising goals
        const contributorList = await transfund_backend.getContributors(); // Fetch contributors
        const contributions = await transfund_backend.getAllContributions(); // Fetch contributions

        // Log the fetched data for debugging
        console.log('Goal List:', goalList);
        console.log('Contributor List:', contributorList);
        console.log('Contributions:', contributions);

        // Map goals to include the contributor name and total raised amount
        const goalsWithContributors = goalList.map(goal => {
          const contributor = contributorList.find(c => 
            BigInt(c.id) === BigInt(goal.contributor_id) // Compare as BigInt
          );

          // Calculate total raised amount for the current goal with payment status 'success'
          const totalRaised = contributions
            .filter(c => 
              BigInt(c.goal_id) === BigInt(goal.goal_id) && 
              c.payment_status === 'success'
            )
            .reduce((sum, contribution) => {
              const contributionAmount = typeof contribution.amount === 'bigint'
                ? contribution.amount
                : BigInt(contribution.amount); // Convert to BigInt if necessary
              return sum + contributionAmount;
            }, BigInt(0)); // Start with BigInt(0)

          return {
            ...goal,
            contributor_name: contributor ? contributor.name : 'Unknown',
            contributor_id: contributor ? contributor.id.toString() : 'Unknown',
            total_raised: totalRaised.toString() // Convert BigInt to string for display
          };
        });

        setGoals(goalsWithContributors);
      } catch (error) {
        console.error('Failed to fetch goals or contributors:', error);
      }
    };

    fetchGoalsAndContributors();
  }, []);

  // Navigate to the Add Goal page
  const handleAddGoal = () => {
    navigate('/admin/AddGoal');
  };

  // Navigate to the goal contributions page
  const handleViewContributions = (goal_id) => {
    navigate(`/admin/goal-contributions/${goal_id}`);
  };

  // Function to handle goal deletion
  const handleDeleteGoal = async (goal_id) => {
    const confirmation = window.confirm("Are you sure you want to delete this goal?");
    if (confirmation) {
      // Call the delete goal function from the backend
      const deleted = await transfund_backend.deleteGoal(goal_id);
      if (deleted) {
        alert("Goal deleted successfully!");
        // Refresh the goals list after deletion
        await fetchGoalsAndContributors(); // Re-fetch the goals
      } else {
        alert("Failed to delete the goal. It may not exist.");
      }
    }
  };

  return (
    <React.Fragment>
      <Row>
        <Col>
          {/* Add Goal Button */}
          <Button variant="primary" onClick={handleAddGoal} className="mb-3">
            Add Fundraising Goal
          </Button>

          <Card>
            <Card.Header>
              <Card.Title as="h5">Fundraising Goals</Card.Title>
              <span className="d-block m-t-5">
                List of all fundraising goals and their contributors.
              </span>
            </Card.Header>
            <Card.Body>
              <Table responsive hover striped>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Goal Name</th>
                    <th>Description</th>
                    <th>Target Amount</th>
                    <th>Total Raised Amount</th>
                    <th>Contributor Name</th>
                    <th>Contributor ID</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {goals.length > 0 ? (
                    goals.map((goal, index) => (
                      <tr key={goal.goal_id}>
                        <th scope="row">{index + 1}</th>
                        <td>{goal.goal_name}</td>
                        <td>{goal.goal_desc}</td>
                        <td>{parseFloat(goal.goal_target)}</td>
                        <td>{goal.total_raised}</td>
                        <td>{goal.contributor_name}</td>
                        <td>{goal.contributor_id}</td>
                        <td>{goal.date}</td>
                        <td>
                          <Button
                            variant="info"
                            onClick={() => handleViewContributions(goal.goal_id)}
                          >
                            View Contributions
                          </Button>
                          {/* Delete Goal Button, visible only if total raised is 0 */}
                          {parseFloat(goal.total_raised) === 0 && (
                            <Button
                              variant="danger"
                              onClick={() => handleDeleteGoal(goal.goal_id)}
                              className="ml-2"
                            >
                              Delete Goal
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center">
                        No fundraising goals found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default ViewFundraisingGoals;
