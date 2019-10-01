import React from 'react';
import axios from 'axios';

class Projects extends React.Component {
  static async getInitialData({ match, req, res }) {
    const api = await axios.get('https://jsonplaceholder.typicode.com/users');

    return { ...api.data };
  }

  render() {
    return <div>Projects</div>;
  }
}

export default Projects;
