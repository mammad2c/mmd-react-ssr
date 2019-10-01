# mmd-react-ssr
A React Server Side rendered application (isomorphic) with support fetch data like Next.js using React Router

🔥 Using React Router. 

🔥 Support Hot Reloading!!!

🔥 Code validation with `eslint` and `airbnb`.

🔥 Code formatting with `prettier`.

🔥 Style validation and formatter with `stylelint`.

🔥 Unit testing with `Jest` and `react-testing-library`.

🔥 Support `postCSS`.

🔥 Support `SASS/SCSS` by default. Import all your `SASS/SCSS` files in `styles/App.scss`.

🔥 You can extends configs and setup your needs. All webpack configs are in `webpacks` directory. 

## Requirements
- NodeJs v10 above
- `yarn`

note: for windows user please install `win-node-env` for supporting NODE_ENV.

## How to use
1- git clone this project.

2- remove `.git` folder.

3- `yarn install` || `npm install`

4- `yarn start` || `npm run start`

now start coding !!

you can see in `http://localhost:3000`.

## Production and Deployment
1- Run `yarn build` or `npm run build`. It will create a `build` folder ready for Deployment.

2- Now serve the `build` folder with `NodeJs`.

`node build/server.js`

note: Suggest using [`pm2`](http://pm2.keymetrics.io/)

## How to fetch data ssr
you can see example in `screens/Projects.jsx`

#### Steps:
1- add a `static async getInitialData` to a route component. example: 
```
static async getInitialData({ match, req, res, history, location }) {
    const api = await axios.get('https://jsonplaceholder.typicode.com/users');

    return { ...api.data };
  }
```

note: we use axios because support node.js and browser.

2- now you can access your fetched data as `initialData` component props;

## getInitialData parameters:
- match (matched route, both on server and client)
- req (request object ExpressJs, only server)
- res (response object ExpressJs, only server)
- history (react router history, only client)
- location (react router location, only client)

## How to manage `head`
you can use `react-helmet` like before in your components. 

## How to test
1- create folder `__tests__` under your component directory.

2- create file with `flename.test.js` or `filename.spec.js`. for example `Projects.spec.js`.

3- write tests.

4- enter `yarn test` || `npm run test` for run tests, or `yarn test:watch` || `npm run test:watch` to run in watch mode.

note: you can create test file without `__tests__` folder but for better file structure keep it in `__tests__`.

---

# Inspiration

- [razzle](https://github.com/jaredpalmer/razzle)
- [facebookincubator/create-react-app](https://github.com/facebookincubator/create-react-app)
- [zeit/next.js](https://github.com/zeit/next.js)
- [after.js](https://github.com/jaredpalmer/after.js)
- [jaredpalmer/react-router-nextjs-like-data-fetching](https://github.com/jaredpalmer/react-router-nextjs-like-data-fetching)

