import React from 'react';
import axios from 'axios';

const Projects = ({ initialData }) => {
  return (
    <div>
      <h1>Projects</h1>
    </div>
  );
};

Projects.getInitialData = async ({ match, req, res, history, location }) => {
  const api = await axios.get('https://jsonplaceholder.typicode.com/users');

  return { ...api.data };
};

export default Projects;
