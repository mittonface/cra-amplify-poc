import Amplify from "aws-amplify";
import React from "react";

const SignIn = () => {
  React.useEffect(() => {
    async function configure() {
      Amplify.configure({
        Auth: {
          region: "us-east-1",
          userPoolId: "us-east-1_hQV2dRQX1",
          userPoolWebClientId: "6af7cqegskt5rhoc4ebce17hre",
        },
      });
    }
    configure();
  }, []);

  return <p>Good Stuff</p>;
};

export default SignIn;
