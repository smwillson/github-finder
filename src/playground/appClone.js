import React, { useState, Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Alert from "./components/layout/Alert";
import Users from "./components/users/Users";
import User from "./components/users/User";
import Search from "./components/users/Search";
import About from "./components/pages/About";
import axios from "axios";
import GithubState from "./context/github/GithubState";
import "./App.css";

const App = () => {
  //initial state:setting defaults
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  //   state = {
  //     users: [],
  //     user: {},
  //     repos: [],
  //     loading: false,
  //     alert: null,
  //   };

  //async componentDidMount() {
  //   //console.log(process.env.REACT_APP_GITHUB_CLIENT_ID); sanity check
  //   setState({ loading: true });
  //   const response = await axios.get(
  //     `https://api.github.com/users?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&
  //     client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
  //   );
  //   setState({ users: response.data, loading: false });
  // }

  //Search for Github users:
  const searchUsers = async (text) => {
    setLoading(true);

    const response = await axios.get(
      `https://api.github.com/search/users?q=${text}&
      client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&
      client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
    );

    // setState({
    //   users: response.data.items,
    //   loading: false,
    // });

    setUsers(response.data.items);
    setLoading(false);
  };

  //Get a single Github user
  const getUser = async (username) => {
    // setState({ loading: true });
    setLoading(true);

    const response = await axios.get(
      `https://api.github.com/users/${username}?
      client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&
      client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
    );

    //setState({ user: response.data, loading: false });
    setUser(response.data);
    setLoading(false);
  };

  //Get users repos
  const getUserRepos = async (username) => {
    //setState({ loading: true });
    setLoading(true);

    const response = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&
      client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&
      client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
    );

    //setState({ repos: response.data, loading: false });
    setRepos(response.data);
    setLoading(false);
  };

  //Clear users from state
  const clearUsers = () =>
    //setState({ users: [], loading: false });
    {
      setUser([]);
      setLoading(false);
    };

  //Alert for validation
  const showAlert = (msg, type) => {
    setAlert({
      msg,
      type,
    });

    setTimeout(() => {
      setAlert(null);
    }, 5000);
  };

  return (
    <GithubState>
      <Router>
        <div className='App'>
          <Navbar title='Github Finder' icon='fab fa-github' />
          <div className='container'>
            <Alert alert={alert} />
            <Switch>
              <Route
                exact
                path='/'
                render={(props) => (
                  <Fragment>
                    <Search
                      searchUsers={searchUsers}
                      clearUsers={clearUsers}
                      showClear={users.length > 0 ? true : false}
                      setAlert={showAlert}
                    />
                    <Users loading={loading} users={users} />
                  </Fragment>
                )}
              />
              <Route exact path='/about' component={About} />
              <Route
                exact
                path='/user/:login'
                render={(props) => (
                  <User
                    {...props}
                    getUser={getUser}
                    getUserRepos={getUserRepos}
                    user={user}
                    repos={repos}
                    loading={loading}
                  />
                )}
              ></Route>
            </Switch>
          </div>
        </div>
      </Router>
    </GithubState>
  );
};

export default App;
