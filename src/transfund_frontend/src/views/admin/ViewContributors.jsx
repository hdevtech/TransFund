import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button } from 'react-bootstrap';
import { transfund_backend } from 'declarations/transfund_backend';
import { useNavigate } from 'react-router-dom';

const ViewContributors = () => {
  const [contributors, setContributors] = useState([]);
  const navigate = useNavigate(); // To handle navigation to "Add Contributor" page

  // Fetch contributors from the backend when the component loads
  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const contributorList = await transfund_backend.getContributors(); // Assuming you have a getContributors function in the backend
        setContributors(contributorList);
      } catch (error) {
        console.error('Failed to fetch contributors:', error);
      }
    };

    fetchContributors();
  }, []);

  // Navigate to the Add Contributor page
  const handleAddContributor = () => {
    navigate('/admin/AddContributor');
  };

  return (
    <React.Fragment>
      <Row>
        <Col>
          {/* Add Contributor Button */}
          <Button variant="primary" onClick={handleAddContributor} className="mb-3">
            Add Contributor
          </Button>

          <Card>
            <Card.Header>
              <Card.Title as="h5">Contributors Table</Card.Title>
              <span className="d-block m-t-5">
                List of all contributors who can participate in Fundraising.
              </span>
            </Card.Header>
            <Card.Body>
              <Table responsive hover striped>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Phone Number</th>
                  </tr>
                </thead>
                <tbody>
                  {contributors.length > 0 ? (
                    contributors.map((contributor, index) => (
                      <tr key={contributor.id}>
                        <th scope="row">{index + 1}</th>
                        <td>{contributor.name}</td>
                        <td>{contributor.username}</td>
                        <td>{contributor.phone_number}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No contributors found
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

export default ViewContributors;
