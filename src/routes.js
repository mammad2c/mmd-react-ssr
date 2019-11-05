// Route components
import Home from './screens/Home';
import About from './screens/About';
import Projects from './screens/Projects';

// SSR HOC
import withSSR from './components/withSSR';

export default [
  {
    path: '/',
    exact: true,
    component: Home
  },
  {
    path: '/about',
    exact: true,
    component: About
  },
  {
    path: '/projects',
    exact: true,
    component: withSSR(Projects)
  }
];
