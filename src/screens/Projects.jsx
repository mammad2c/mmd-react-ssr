import axios from 'axios';

const Projects = ({ initialData }) => {
  if (!initialData) {
    return null;
  }

  return (
    <div>
      <h1>Projects</h1>

      {initialData.map((item) => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <p>{item.email}</p>
          <p>{item.phone}</p>
          <p>
            <a href={item.website}>{item.website}</a>
          </p>
          <hr />
        </div>
      ))}
    </div>
  );
};

Projects.getInitialData = async ({ match, req, res, history, location }) => {
  const api = await axios.get('https://jsonplaceholder.typicode.com/users');

  return api.data;
};

export default Projects;
