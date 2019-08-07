import React from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

const Header = ({ authors, courses }) => {
  const activeStyle = { color: "#F15B2A" };

  function getTotal(items) {
    const count = items.length;
    return count > 0 ? `(${items.length})` : "";
  }

  return (
    <nav>
      <NavLink to="/" activeStyle={activeStyle} exact>
        Home
      </NavLink>
      {" | "}
      <NavLink to="/courses" activeStyle={activeStyle} exact>
        Courses {getTotal(courses)}
      </NavLink>
      {" | "}
      <NavLink to="/authors" activeStyle={activeStyle} exact>
        Authors {getTotal(authors)}
      </NavLink>
      {" | "}
      <NavLink to="/about" activeStyle={activeStyle} exact>
        About
      </NavLink>
    </nav>
  );
};

Header.propTypes = {
  authors: PropTypes.array.isRequired,
  courses: PropTypes.array.isRequired
};

function mapStateToProps(state) {
  return {
    courses: state.courses,
    authors: state.authors
  };
}

export default connect(mapStateToProps)(Header);
