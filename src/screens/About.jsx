import React from 'react';
import axios from 'axios';

const About = ({ match, req, res, history, location, initialData }) => {
  if (!initialData) {
    return null;
  }

  return (
    <div className="about">
      <h1>About</h1>
      {initialData.map(item => (
        <div key={item.id}>
          <h3>{item.title}</h3>
          <div>{item.body}</div>
          <hr />
        </div>
      ))}
    </div>
  );
};

About.getInitialData = async ({ match, req, res, history, location }) => {
  const api = await axios.get('https://jsonplaceholder.typicode.com/posts');

  return api.data;
};

export default About;
