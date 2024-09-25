import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { transfund_backend } from 'declarations/transfund_backend';
import { useNavigate } from 'react-router-dom';
import { json } from 'd3';

const AddFundraisingGoal = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [contributors, setContributors] = useState([]); // Store contributors fetched from backend
  const navigate = useNavigate();

  // Fetch contributors from the backend when the component mounts
  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const fetchedContributors = await transfund_backend.getContributors(); // Assuming there's a function to get all contributors
        setContributors(fetchedContributors);
      } catch (error) {
        setErrorMessage('Failed to load contributors.');
      }
    };

    fetchContributors();
  }, []);

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Function to handle adding a fundraising goal
  const handleAddGoal = async (values, { setSubmitting }) => {
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const { goal_name, goal_desc, goal_target, contributor_id, date } = values;
      const goal_id = Date.now(); // Generate an ID (or use a custom method if needed)
      await transfund_backend.addGoal(
        Number(goal_id),
        goal_name,
        goal_desc,
        Number(goal_target), // Ensure goal_target is a number
        parseInt(contributor_id), // Ensure contributor_id is a number
        date
      );
      setSuccessMessage('Fundraising goal successfully added!');
    } catch (error) {
        // const ii = parseInt(contributor_id);
    //   console.log(json.stringify({goal_id,goal_target,ii}));
      setErrorMessage('Failed to add fundraising goal. Please try again.'+ error);
    } finally {
      setSubmitting(false);
    }
  };

  // Form validation schema using Yup
  const validationSchema = Yup.object().shape({
    goal_name: Yup.string().required('Goal name is required'),
    goal_desc: Yup.string().required('Goal description is required'),
    goal_target: Yup.number().required('Goal target is required').positive('Target must be a positive number'),
    contributor_id: Yup.number().required('Contributor is required'), // Validate contributor selection
    date: Yup.string().required('Date is required'),
  });

  // Function to navigate to the View Goals page
  const handleViewGoals = () => {
    navigate('/admin/view-fundraising-goals');
  };

  return (
    <Row>
      <Col sm={12}>
        <Button variant="primary" onClick={handleViewGoals} className="mb-3">
          View Fundraising Goals
        </Button>
        <Card>
          <Card.Header>
            <Card.Title as="h5">Add Fundraising Goal</Card.Title>
          </Card.Header>
          <Card.Body>
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

            <Formik
              initialValues={{ goal_name: '', goal_desc: '', goal_target: '', contributor_id: '', date: getCurrentDate() }}
              validationSchema={validationSchema}
              onSubmit={handleAddGoal}
            >
              {({ values, handleChange, handleSubmit, errors, touched, isSubmitting }) => (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Goal Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="goal_name"
                      placeholder="Enter goal name"
                      value={values.goal_name}
                      onChange={handleChange}
                      isInvalid={!!touched.goal_name && !!errors.goal_name}
                    />
                    {touched.goal_name && errors.goal_name && (
                      <Form.Control.Feedback type="invalid">{errors.goal_name}</Form.Control.Feedback>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Goal Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="goal_desc"
                      placeholder="Enter goal description"
                      value={values.goal_desc}
                      onChange={handleChange}
                      isInvalid={!!touched.goal_desc && !!errors.goal_desc}
                    />
                    {touched.goal_desc && errors.goal_desc && (
                      <Form.Control.Feedback type="invalid">{errors.goal_desc}</Form.Control.Feedback>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Goal Target (Amount)</Form.Label>
                    <Form.Control
                      type="number"
                      name="goal_target"
                      placeholder="Enter goal target"
                      value={values.goal_target}
                      onChange={handleChange}
                      isInvalid={!!touched.goal_target && !!errors.goal_target}
                    />
                    {touched.goal_target && errors.goal_target && (
                      <Form.Control.Feedback type="invalid">{errors.goal_target}</Form.Control.Feedback>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Contributor</Form.Label>
                    <Form.Select
                      as="select"
                      name="contributor_id"
                      value={values.contributor_id}
                      onChange={handleChange}
                      isInvalid={!!touched.contributor_id && !!errors.contributor_id}
                    >
                        
                      <option value="">Select Contributor</option>

                      {contributors.map((contributor) => (
                        <option value={''+contributor.id+''}>
                          {contributor.id+' - '+contributor.name}
                        </option>
                      ))}
                    </Form.Select>
                    {touched.contributor_id && errors.contributor_id && (
                      <Form.Control.Feedback type="invalid">{errors.contributor_id}</Form.Control.Feedback>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="text"
                      name="date"
                      placeholder="Enter date (e.g. 2024-09-30)"
                      value={values.date}
                      onChange={handleChange}
                      isInvalid={!!touched.date && !!errors.date}
                    />
                    {touched.date && errors.date && (
                      <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
                    )}
                  </Form.Group>

                  <Button variant="primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Adding...' : 'Add Fundraising Goal'}
                  </Button>
                </Form>
              )}
            </Formik>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default AddFundraisingGoal;
