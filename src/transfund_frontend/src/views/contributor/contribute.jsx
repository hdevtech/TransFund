import React from 'react';
import { useParams } from 'react-router-dom';

const Contribute = () => {
  const { goal_id } = useParams();

  return (
    <div>
      <h1>Contribute to Goal: {goal_id}</h1>
      {/* Add your form or contribution logic here */}
    </div>
  );
};

export default Contribute;
