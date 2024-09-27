import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { transfund_backend } from 'declarations/transfund_backend';
import { useNavigate } from 'react-router-dom';

const ViewFundraisingGoals = () => {
  const [goals, setGoals] = useState([]);
  const [contributors, setContributors] = useState([]);
  const navigate = useNavigate();

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

  // Handle goal selection (this can be customized to navigate to the contribution page)
  const handleSelectGoal = (goal_id) => {
    navigate(`/contribute/${goal_id}`); // Assuming you have a route to contribute
  };

  return (
    <React.Fragment>
      <Row>
        {goals.length > 0 ? (
          goals.map((goal, index) => (
            <Col key={goal.goal_id} xl={4} lg={6} md={6} sm={12}>
              <Card>
                <Card.Body>
                  <h6 className="mb-4">{goal.goal_name}</h6>
                  <p>{goal.goal_desc}</p>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="f-w-300 m-b-0">{parseFloat(goal.goal_target).toFixed(2)}</h4>
                    <p className="m-b-0">Creator : {goal.contributor_name}</p>
                  </div>
                </Card.Body>
                <Card.Footer>
                  <Button variant="primary" onClick={() => handleSelectGoal(goal.goal_id)}>
                    Contribute
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <p className="text-center">No fundraising goals found</p>
          </Col>
        )}
      </Row>
    </React.Fragment>
  );
};

export default ViewFundraisingGoals;
