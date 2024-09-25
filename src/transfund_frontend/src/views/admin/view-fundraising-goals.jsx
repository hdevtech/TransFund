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

        // Map goals to include the contributor name and ID
        const goalsWithContributors = goalList.map(goal => {
          const contributor = contributorList.find(c => c.id === goal.contributor_id);
          return {
            ...goal,
            contributor_name: contributor ? contributor.name : 'Unknown',
            contributor_id: contributor ? contributor.id : 'Unknown'
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
                    <th>Contributor Name</th>
                    <th>Contributor ID</th>
                    <th>Date</th>
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
                        <td>{goal.contributor_name}</td>
                        <td>{parseInt(goal.contributor_id)}</td>
                        <td>{goal.date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
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
