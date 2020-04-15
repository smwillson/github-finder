import React, { useReducer } from "react";
import axios from "axios";
import GithubContext from "./githubContext";
import GithubReducer from "./githubReducer";
import {
  SEARCH_USERS,
  SET_LOADING,
  CLEAR_USERS,
  GET_USER,
  GET_REPOS,
} from "../types";

let githubClientID, githubClientSecret;

if (process.env.NODE_ENV !== "production") {
  githubClientID = process.env.REACT_APP_GITHUB_CLIENT_ID;
  githubClientSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;
} else {
  githubClientID = process.env.GITHUB_CLIENT_ID;
  githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
}

const GitHubState = (props) => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false,
  };
  const [state, dispatch] = useReducer(GithubReducer, initialState);

  //Search for Github users:
  const searchUsers = async (text) => {
    setLoading();

    const response = await axios.get(
      `https://api.github.com/search/users?q=${text}&
      client_id=${githubClientID}&
      client_secret=${githubClientSecret}`
    );
    dispatch({
      type: SEARCH_USERS,
      payload: response.data.items,
    });
  };

  //Get a single Github user
  const getUser = async (username) => {
    setLoading();

    const response = await axios.get(
      `https://api.github.com/users/${username}?
      client_id=${githubClientID}&
      client_secret=${githubClientSecret}`
    );

    dispatch({
      type: GET_USER,
      payload: response.data,
    });
  };

  //Get users repos
  const getUserRepos = async (username) => {
    setLoading();

    const response = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&
      client_id=${githubClientID}&
      client_secret=${githubClientSecret}`
    );

    dispatch({
      type: GET_REPOS,
      payload: response.data,
    });
  };

  //Clear users from state
  const clearUsers = () => dispatch({ type: CLEAR_USERS });

  //Set loading
  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        user: state.user,
        repos: state.repos,
        loading: state.loading,
        searchUsers,
        clearUsers,
        getUser,
        getUserRepos,
      }}
    >
      {props.children}
    </GithubContext.Provider>
  );
};

export default GitHubState;
