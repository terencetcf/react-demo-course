import React from "react";
import { connect } from "react-redux";
import * as authorActions from "../../redux/actions/authorActions";
import * as courseActions from "../../redux/actions/courseActions";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import AuthorList from "./AuthorList";
import Spinner from "../common/Spinner";
import { Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import TextInput from "../common/TextInput";

class AuthorsPage extends React.Component {
  state = {
    redirectToAddAuthorsPage: false,
    search: ""
  };

  componentDidMount() {
    const { authors, courses, actions } = this.props;

    if (authors.length === 0) {
      actions.loadAuthors().catch(error => {
        alert("Loading authors failed " + error);
      });
    }

    if (courses.length === 0) {
      actions.loadCourses().catch(error => {
        alert("Loading courses failed " + error);
      });
    }
  }

  handleDeleteAuthor = async author => {
    const isAuthorExistsInCourses = this.props.courses.some(
      course => course.authorId === author.id
    );

    if (isAuthorExistsInCourses) {
      toast.error(
        "Unable to delete author. Please delete the author's courses first."
      );
      return;
    }

    toast.success("Author deleted");
    try {
      await this.props.actions.deleteAuthor(author);
    } catch (error) {
      toast.error("Delete failed. " + error.message, { autoClose: false });
    }
  };

  getFilteredAuthors = () => {
    return this.props.authors.filter(author => {
      return author.name.search(new RegExp(this.state.search, "i")) > -1;
    });
  };

  render() {
    return (
      <>
        {this.state.redirectToAddAuthorPage && <Redirect to="/author" />}
        <h2>Authors</h2>
        {this.props.loading ? (
          <Spinner />
        ) : (
          <>
            <button
              style={{ marginBottom: 20 }}
              className="btn btn-primary add-author"
              onClick={() => this.setState({ redirectToAddAuthorPage: true })}
            >
              Add Author
            </button>
            <TextInput
              placeholder="Search..."
              onChange={({ target }) => this.setState({ search: target.value })}
              name="search"
              label=""
              value={this.state.search}
            />
            <AuthorList
              authors={this.getFilteredAuthors()}
              onDeleteClick={this.handleDeleteAuthor}
            />
          </>
        )}
      </>
    );
  }
}

AuthorsPage.propTypes = {
  courses: PropTypes.array.isRequired,
  authors: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    courses: state.courses,
    authors: state.authors,
    loading: state.apiCallsInProgress > 0
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      loadAuthors: bindActionCreators(authorActions.loadAuthors, dispatch),
      deleteAuthor: bindActionCreators(authorActions.deleteAuthor, dispatch),
      loadCourses: bindActionCreators(courseActions.loadCourses, dispatch)
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthorsPage);
