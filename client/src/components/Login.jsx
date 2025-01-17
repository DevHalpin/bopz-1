import axios from "axios";
import { Fragment, useEffect } from "react";

const Login = (props) => {
  // Look for the query string (everything after '?' in URL)
  const code = new URLSearchParams(window.location.search).get("code");

  useEffect(() => {
    const saveUser = () => {
      return (
        axios
          // Params sent as third argument (convention)
          .post(
            "/save_user",
            {},
            {
              params: {
                email: props.user.email,
                username: props.user.name,
              },
            }
          )
          .then((res) => {
            console.log("User email successfully updated in database");
          })
          .catch((err) => {
            console.log(err);
          })
      );
    };
    const userInfo = (token) => {
      return (
        axios
          // Pass the session token as a param to /user route, allows for API fetch
          // Session token must be passed to each route, fetch will be rejected otherwise
          .post("/user", { sessionToken: token })
          .then((res) => {
            console.log(res.data.body);
            props.setUser({
              name: res.data.body.display_name,
              email: res.data.body.email,
            });
            props.setLoggedIn(true);
          })
          .catch((err) => {
            console.log(err);
          })
      );
    };
    if (code) {
      axios.post("/login/callback", { code }).then((res) => {
        console.log("res.data", res.data);
        // Save the access_token in session storage (enables fetch across routes)
        props.setToken({
          access: res.data.access_token,
          refresh: res.data.refresh_token,
        });
        sessionStorage.setItem("access", res.data.access_token);
        sessionStorage.setItem("refresh", res.data.access_token);

        // Hide the query string after successful login
        window.history.pushState({}, null, "/");
        userInfo(res.data.access_token);
      });
    }

    if (props.loggedIn) {
      saveUser();
    }
  }, [code, props]);

  const change = () => {
    return axios
      .get("/login")
      .then((res) => {
        console.log("res", res);
        // window.open(res.data, 'test')
        window.location.href = res.data;
        console.log("successful redirect!");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Fragment>
      {/* // Check if user is logged in (based on session storage), displays login message accordingly */}
      {!sessionStorage.getItem("access" || !props.loggedIn) && (
        <button onClick={change}> Login to Spotify </button>
      )}

      {sessionStorage.getItem("access" || props.loggedIn) && (
        <h5> Logged in as: {props.user?.name} </h5>
      )}
    </Fragment>
  );
};

export default Login;

// location.reload to refresh the page (use after logout --> delete the session storage)
