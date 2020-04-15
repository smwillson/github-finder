import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import GithubContext from "../../context/github/githubContext";
import AlertContext from "../../context/alert/alertContext";

const Search = () => {
  //initilaize context:
  const githubContext = useContext(GithubContext);
  const alertContext = useContext(AlertContext);

  const { setAlert } = alertContext;

  const [text, setText] = useState("");

  const onChange = (event) => setText(event.target.value);

  const onSubmit = (event) => {
    event.preventDefault();
    if (text === "") {
      setAlert("Please enter a username", "light");
    } else {
      githubContext.searchUsers(text);
      setText("");
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit} className='form'>
        <input
          type='text'
          name='text'
          placeholder='Search Users...'
          value={text}
          onChange={onChange}
        />
        <input
          type='submit'
          value='Search'
          className='btn btn-dark btn-block'
        />
      </form>
      {githubContext.users.length > 0 && (
        <button
          className='btn btn-light btn-block'
          onClick={githubContext.clearUsers}
        >
          Clear Results
        </button>
      )}
    </div>
  );
};

Search.prototype = {
  setAlert: PropTypes.func.isRequired,
};

export default Search;
