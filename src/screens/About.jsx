import React, { useEffect } from 'react';
import axios from 'axios';

const About = ({ match, req, res, history, location, initialData }) => {
  useEffect(() => {
    if (!initialData) {
      About.getInitialData(match, req, res, history, location);
    }
  }, []);

  return (
    <div className="about">
      <h1>About</h1>
    </div>
  );
};

About.getInitialData = async ({ match, req, res, history, location }) => {
  const api = await axios.get('https://jsonplaceholder.typicode.com/posts');

  return { ...api.data };
};

export default About;
