import React from 'react';
import axios from 'axios';

class Projects extends React.Component {
  static async getInitialData({ match, req, res, history, location }) {
    const api = await axios.get('https://jsonplaceholder.typicode.com/users');

    return { ...api.data };
  }

  render() {
    return (
      <div>
        <h1>Projects</h1>
      </div>
    );
  }
}

export default Projects;
