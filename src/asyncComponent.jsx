import React from 'react';
import loadable from '@loadable/component';

// This make debugging easier. Components will show as SSR(MyComponent) in
// react-dev-tools.
function getDisplayName(WrappedComponent) {
  return (
    (WrappedComponent &&
      (WrappedComponent.displayName || WrappedComponent.name)) ||
    'Component'
  );
}

const AsyncComponentLoadable = loadable(props => props.loader());

export default function asyncComponent(loader) {
  let Component = null;

  class SSR extends React.Component {
    static async load() {
      const res = await AsyncComponentLoadable.load({ loader });
      Component = res.default || res;
    }

    static getInitialData(ctx) {
      // Need to call the wrapped components getInitialData if it exists
      if (!Component) {
        return Promise.resolve(null);
      }

      return Component.getInitialData
        ? Component.getInitialData(ctx)
        : Promise.resolve(null);
    }

    constructor(props) {
      super(props);
      this.state = {
        data: props.initialData,
        isLoading: false,
        Component
      };

      this.ignoreLastFetch = false;
    }

    componentDidMount() {
      SSR.load().then(this.updateState);
    }

    componentWillUnmount() {
      this.ignoreLastFetch = true;
    }

    updateState = () => {
      const { Component: ComponentState } = this.state;
      // Only update state if we don't already have a reference to the
      // component, this prevent unnecessary renders.
      if (ComponentState !== Component) {
        const { data } = this.state;

        if (!data) {
          this.fetchData();
        }

        this.setState({
          Component
        });
      }
    };

    fetchData = () => {
      // if this.state.data is null, that means that the we are on the client.
      // To get the data we need, we just call getInitialData again on mount.
      if (!this.ignoreLastFetch) {
        const { match, history, location } = this.props;
        this.setState({ isLoading: true });
        SSR.getInitialData({ match, history, location }).then(
          data => {
            this.setState({ data, isLoading: false });
          },
          error => {
            this.setState(() => ({
              data: { error },
              isLoading: false
            }));
          }
        );
      }
    };

    render() {
      // Flatten out all the props.
      const { initialData, ...rest } = this.props;
      const { data, isLoading, Component: ComponentState } = this.state;

      //  if we wanted to create an app-wide error component,
      //  we could also do that here using <HTTPStatus />. However, it is
      //  more flexible to leave this up to the Routes themselves.
      //
      // if (rest.error && rest.error.code) {
      //   <HttpStatus statusCode={rest.error.code || 500}>
      //     {/* cool error screen based on status code */}
      //   </HttpStatus>
      // }
      if (!ComponentState) {
        return <div>loading ...</div>;
      }

      return (
        <ComponentState
          {...rest}
          reFetch={this.fetchData}
          isLoading={isLoading}
          initialData={data}
        />
      );
    }
  }

  SSR.displayName = `SSR(${getDisplayName(Component)})`;
  return SSR;
}
