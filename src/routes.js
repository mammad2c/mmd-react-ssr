import asyncComponent from './asyncComponent';

// route components
import Home from './screens/Home';
import About from './screens/About';
import NotFound from './components/NotFound';

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
    component: asyncComponent(() => import('./screens/Projects'))
  },
  {
    path: '*',
    component: NotFound
  }
];
