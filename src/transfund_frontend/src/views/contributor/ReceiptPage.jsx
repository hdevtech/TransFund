import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Card, Table, Button } from 'react-bootstrap';
import { transfund_backend } from 'declarations/transfund_backend'; // Import the backend
import Breadcrumb from '../../layouts/AdminLayout/Breadcrumb'; // Import Breadcrumb

const ReceiptPage = () => {
  const { tx_ref } = useParams(); // Get transaction reference from the URL
  const [contribution, setContribution] = useState(null);
  const [goal, setGoal] = useState(null);
  const [contributor, setContributor] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchContributionDetails = async () => {
      try {
        // Fetch all contributions, goals, and contributors
        const contributions = await transfund_backend.getAllContributions();
        const goals = await transfund_backend.getGoals();
        const contributors = await transfund_backend.getContributors();

        // Find the contribution by tx_ref
        const foundContribution = contributions.find(c => c.tx_ref === tx_ref);

        if (foundContribution) {
          setContribution(foundContribution);

          // Find the associated goal
          const foundGoal = goals.find(g => g.goal_id === foundContribution.goal_id);
          setGoal(foundGoal);

          // Find the associated contributor
          const foundContributor = contributors.find(contrib => contrib.id === foundContribution.contributor_id);
          setContributor(foundContributor);
        } else {
          setErrorMessage('Contribution not found.');
        }
      } catch (error) {
        setErrorMessage('Failed to retrieve contribution details.');
      }
    };

    fetchContributionDetails();
  }, [tx_ref]);

  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h3, h5 { text-align: center; }
            .receipt { width: 80%; margin: auto; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
              .receipt { width: 100%; }
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <h3>TransFund Receipt</h3>
            ${errorMessage ? `<p class="text-danger">${errorMessage}</p>` : ''}
            ${contribution ? `
              <table>
                <tr>
                  <th>Transaction Reference</th>
                  <td>${contribution.tx_ref}</td>
                </tr>
                <tr>
                  <th>Amount</th>
                  <td>$${parseFloat(contribution.amount).toFixed(2)}</td>
                </tr>
                <tr>
                  <th>Phone Number</th>
                  <td>${contribution.phone_number}</td>
                </tr>
                <tr>
                  <th>Payment Status</th>
                  <td>${contribution.payment_status}</td>
                </tr>
                <tr>
                  <th>Date</th>
                  <td>${new Date(contribution.date).toLocaleString()}</td>
                </tr>
              </table>
              ${goal ? `
                <h5>Goal Details</h5>
                <table>
                  <tr>
                    <th>Goal Name</th>
                    <td>${goal.goal_name}</td>
                  </tr>
                  <tr>
                    <th>Goal Description</th>
                    <td>${goal.goal_desc}</td>
                  </tr>
                  <tr>
                    <th>Target Amount</th>
                    <td>$${parseFloat(goal.goal_target).toFixed(2)}</td>
                  </tr>
                </table>
              ` : ''}
              ${contributor ? `
                <h5>Contributor Details</h5>
                <table>
                  <tr>
                    <th>Contributor Name</th>
                    <td>${contributor.name}</td>
                  </tr>
                  <tr>
                    <th>Contributor Phone Number</th>
                    <td>${contributor.phone_number}</td>
                  </tr>
                </table>
              ` : ''}
              <h5>Thank you for your contribution!</h5>
            ` : ''}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Receipt</Card.Title>
              <span className="d-block m-t-5">Details of your contribution.</span>
            </Card.Header>
            <Card.Body>
              {errorMessage && <p className="text-danger">{errorMessage}</p>}
              {contribution && (
                <div>
                  <Table responsive hover striped>
                    <tbody>
                      <tr>
                        <th>Transaction Reference</th>
                        <td>{contribution.tx_ref}</td>
                      </tr>
                      <tr>
                        <th>Amount</th>
                        <td>${parseFloat(contribution.amount).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <th>Phone Number</th>
                        <td>{contribution.phone_number}</td>
                      </tr>
                      <tr>
                        <th>Payment Status</th>
                        <td>{contribution.payment_status}</td>
                      </tr>
                      <tr>
                        <th>Date</th>
                        <td>{new Date(contribution.date).toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </Table>

                  {goal && (
                    <div>
                      <h5>Goal Details</h5>
                      <Table responsive hover striped>
                        <tbody>
                          <tr>
                            <th>Goal Name</th>
                            <td>{goal.goal_name}</td>
                          </tr>
                          <tr>
                            <th>Goal Description</th>
                            <td>{goal.goal_desc}</td>
                          </tr>
                          <tr>
                            <th>Target Amount</th>
                            <td>${parseFloat(goal.goal_target).toFixed(2)}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  )}

                  {contributor && (
                    <div>
                      <h5>Contributor Details</h5>
                      <Table responsive hover striped>
                        <tbody>
                          <tr>
                            <th>Contributor Name</th>
                            <td>{contributor.name}</td>
                          </tr>
                          <tr>
                            <th>Contributor Phone Number</th>
                            <td>{contributor.phone_number}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  )}
                </div>
              )}
              <Button variant="primary" onClick={handlePrint}>Print Receipt</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default ReceiptPage;
