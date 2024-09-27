import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { transfund_backend } from 'declarations/transfund_backend'; // Backend import

const DashDefault = () => {
  const [dashboardData, setDashboardData] = useState({
    contributorsCount: 0,
    goalsCount: 0,
    totalFundraised: 0,
    recentContributors: [],
    recentGoals: [],
    recentContributions: [],
    adminInfo: null, // To store admin name and username
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const storedAdmin = localStorage.getItem('user');
        console.log(storedAdmin);
  
        const admin = JSON.parse(storedAdmin);
        if (!admin) {
          setErrorMessage('No logged-in admin found. Please log in.');
          setLoading(false);
          return;
        }
        console.log(admin);
  
        // Fetch admin info from backend
        const adminInfo = await transfund_backend.getAdminById(Number(admin.id));
  
        // Fetch contributors, goals, and contributions
        const contributors = await transfund_backend.getContributors();
        const goals = await transfund_backend.getGoals();
        const contributions = await transfund_backend.getAllContributions();
  
        // Create a map of goal_id to goal_name
        const goalMap = {};
        goals.forEach(goal => {
          goalMap[goal.goal_id] = goal.goal_name;
        });
  
        // Filter data for recent entries
        const recentContributors = contributors.slice(-3);
        const recentGoals = goals.slice(-3);
        const recentContributions = contributions
          .filter(contribution => contribution.payment_status === 'success')
          .slice(-3)
          .map(contribution => ({
            ...contribution,
            goal_name: goalMap[contribution.goal_id], // Add goal_name to contribution
          }));
  
        // Count contributors and goals
        const contributorsCount = contributors.length;
        const goalsCount = goals.length;
  
        // Calculate total raised amount from successful contributions
        const totalFundraised = contributions
          .filter(contribution => contribution.payment_status === 'success')
          .reduce((sum, contribution) => sum + BigInt(contribution.amount), BigInt(0));
  
        // Update state with fetched data
        setDashboardData({
          contributorsCount,
          goalsCount,
          totalFundraised: totalFundraised.toString(), // Convert to string for display
          recentContributors,
          recentGoals,
          recentContributions,
          adminInfo: adminInfo ? adminInfo[0] : null,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setErrorMessage('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchDashboardData();
  }, []);
  

  const handleCardClick = (link) => {
    navigate(link);
  };

  const dashSalesData = [
    { title: 'Contributors', linkClick: '/admin/ViewContributors', amount: dashboardData.contributorsCount, icon: 'icon-arrow-up text-c-green', value: dashboardData.contributorsCount, class: 'progress-c-theme' },
    { title: 'Goals', linkClick: '/admin/view-fundraising-goals', amount: dashboardData.goalsCount, icon: 'icon-arrow-up text-c-green', value: dashboardData.goalsCount, class: 'progress-c-theme2' },
    { title: 'Fundraisings', linkClick: '/admin/view-fundraising-goals', amount: `${dashboardData.totalFundraised} Frw`, icon: 'icon-arrow-up text-c-green', value: `${dashboardData.totalFundraised} Frw`, class: 'progress-c-theme' }
  ];

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  if (errorMessage) {
    return <Alert variant="danger">{errorMessage}</Alert>;
  }

  return (
    <React.Fragment>
      {/* Admin Info Card */}
      {dashboardData.adminInfo && (
        <Row className="mb-4">
          <Col>
            <Card>
              <Card.Body>
                <h5>Admin Info</h5>
                <p><strong>Name:</strong> {dashboardData.adminInfo.name}</p>
                <p><strong>Username:</strong> {dashboardData.adminInfo.username}</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Dashboard Overview Cards */}
      <Row>
        {dashSalesData.map((data, index) => (
          <Col key={index} xl={6} xxl={4}>
            <Card onClick={() => handleCardClick(data.linkClick)}>
              <Card.Body>
                <h6 className="mb-4">{data.title}</h6>
                <div className="row d-flex align-items-center">
                  <div className="col-9">
                    <h3 className="f-w-300 d-flex align-items-center m-b-0">
                      <i className={`feather ${data.icon} f-30 m-r-5`} /> {data.amount}
                    </h3>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Recent Goals */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Recent Goals</Card.Title>
            </Card.Header>
            <Card.Body>
              <Table responsive hover striped>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Goal Name</th>
                    <th>Description</th>
                    <th>Target</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentGoals.length > 0 ? (
                    dashboardData.recentGoals.map((goal, index) => (
                      <tr key={goal.goal_id}>
                        <td>{index + 1}</td>
                        <td>{goal.goal_name}</td>
                        <td>{goal.goal_desc}</td>
                        <td>{parseFloat(goal.goal_target)} Frw</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">No recent goals found.</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Contributors */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Recent Contributors</Card.Title>
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
                  {dashboardData.recentContributors.length > 0 ? (
                    dashboardData.recentContributors.map((contributor, index) => (
                      <tr key={contributor.id}>
                        <td>{index + 1}</td>
                        <td>{contributor.name}</td>
                        <td>{contributor.username}</td>
                        <td>{contributor.phone_number}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">No recent contributors found.</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Contributions */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Recent Contributions</Card.Title>
            </Card.Header>
            <Card.Body>
              <Table responsive hover striped>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Goal Name</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentContributions.length > 0 ? (
                    dashboardData.recentContributions.map((contribution, index) => (
                      <tr key={contribution.contribution_id}>
                        <td>{index + 1}</td>
                        <td>{contribution.goal_name}</td>
                        <td>{parseFloat(contribution.amount)} Frw</td>
                        <td>{new Date(contribution.date).toLocaleDateString()}</td>
                        <td>{contribution.payment_status}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">No recent contributions found.</td>
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

export default DashDefault;
