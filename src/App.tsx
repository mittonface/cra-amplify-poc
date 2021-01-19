import React, { Suspense, lazy } from "react";
import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";
import { UserContext, UserProvider } from "./components/user";

import Amplify from "aws-amplify";
import { AmplifySignOut } from "@aws-amplify/ui-react";

const SignInPage = lazy(() => import("./pages/signin"));

const REALM_NAME_KEY = "custom:realmName";

Amplify.configure({
  Auth: {
    region: "us-east-1",
    userPoolId: "us-east-1_hQV2dRQX1",
    userPoolWebClientId: "6af7cqegskt5rhoc4ebce17hre",
  },
});

function MyApp() {
  return (
    <UserProvider>
      <Main />
    </UserProvider>
  );
}

const Main = () => {
  const { user } = React.useContext(UserContext);
  const [subdomain, setSubdomain] = React.useState("");

  React.useEffect(() => {
    const host = window.location.host.split(".");

    // if the length of `host` is 1, this probably means we're on localhost (no . in hostname)
    // if the length of `host` is 2, we're probably not on a subdomain (only one . in hostname)
    // if the length of `host` is three, the first item in the array is the subdomain
    if (host.length === 3) {
      setSubdomain(host[0]);
    }

    if (user && subdomain === "") {
      user.getUserAttributes((err, atts) => {
        if (err) {
          throw err;
        }

        if (atts) {
          const realmNameAttribute = atts.find(
            (attribute) => attribute.getName() === REALM_NAME_KEY
          );

          //@ts-ignore
          window.location = `https://${realmNameAttribute.getValue()}.mitten.dev/`;
        }
      });
    }
  }, []);

  if (user) {
    return <AuthRouter />;
  } else {
    return <UnauthRouter />;
  }
};

const AuthRouter = () => {
  return (
    <Router>
      <Suspense fallback="loading">
        <Switch>
          <Route path="/">
            <AmplifySignOut />
            <p>:)</p>
          </Route>
        </Switch>
      </Suspense>
    </Router>
  );
};

const UnauthRouter = () => {
  return (
    <Router>
      <Suspense fallback="loading">
        <Switch>
          <Route path="/signin">
            <SignInPage />
          </Route>
          <Route path="/">
            <Redirect to="/signin" />
          </Route>
        </Switch>
      </Suspense>
    </Router>
  );
};

export default MyApp;
