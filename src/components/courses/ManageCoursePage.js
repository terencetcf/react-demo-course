import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { loadCourses, saveCourse } from "../../redux/actions/courseActions";
import { loadAuthors } from "../../redux/actions/authorActions";
import PropTypes from "prop-types";
import CourseForm from "./CourseForm";
import { newCourse } from "../../../tools/mockData";
import Spinner from "../common/Spinner";
import { toast } from "react-toastify";
import PageNotFound from "../PageNotFound";
import { Prompt } from "react-router-dom";

function ManageCoursePage({
  courses,
  authors,
  loadAuthors,
  loadCourses,
  saveCourse,
  history,
  ...props
}) {
  const [course, setCourse] = useState({ ...props.course });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [formIsDirty, setFormIsDirty] = useState(false);

  useEffect(() => {
    if (courses.length === 0) {
      loadCourses().catch(error => {
        alert("Loading courses failed " + error);
      });
    } else {
      setCourse({ ...props.course });
    }

    if (authors.length === 0) {
      loadAuthors().catch(error => {
        alert("Loading authors failed " + error);
      });
    }
  }, [props.course]);

  function handleChange(event) {
    setFormIsDirty(true);
    const { name, value } = event.target;
    setCourse(prevCourse => ({
      ...prevCourse,
      [name]: name === "authorId" ? parseInt(value, 10) : value
    }));
  }

  function formIsValid() {
    const { title, authorId, category } = course;
    const errors = {};
    if (!title) errors.title = "Title is required";
    if (!authorId) errors.author = "Author is required";
    if (!category) errors.category = "Category is required";

    setErrors(errors);

    return Object.keys(errors).length === 0;
  }

  function handleSave(event) {
    event.preventDefault();
    if (!formIsValid()) return;
    setSaving(true);
    setFormIsDirty(false);
    saveCourse(course)
      .then(() => {
        toast.success("Course saved. ");
        history.push("/courses");
      })
      .catch(error => {
        setSaving(false);
        setErrors({ onSave: error.message });
      });
  }

  const handleBlockedNavigation = () => {
    if (
      confirm("Are you sure you want leave this course page without saving?")
    ) {
      return true;
    }

    return false;
  };

  return authors.length === 0 || courses.length === 0 ? (
    <Spinner />
  ) : Object.keys(course).length === 0 ? (
    <PageNotFound />
  ) : (
    <>
      <Prompt when={formIsDirty} message={handleBlockedNavigation} />
      <CourseForm
        course={course}
        errors={errors}
        authors={authors}
        onChange={handleChange.bind(this)}
        onSave={handleSave}
        saving={saving}
      />
    </>
  );
}

ManageCoursePage.propTypes = {
  course: PropTypes.object,
  authors: PropTypes.array.isRequired,
  courses: PropTypes.array.isRequired,
  loadCourses: PropTypes.func.isRequired,
  loadAuthors: PropTypes.func.isRequired,
  saveCourse: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

export function getCourseBySlug(courses, slug) {
  return courses.find(course => course.slug === slug) || null;
}

function mapStateToProps(state, ownProps) {
  const slug = ownProps.match.params.slug;
  const course =
    slug && state.courses.length > 0
      ? getCourseBySlug(state.courses, slug)
      : newCourse;

  return {
    course,
    courses: state.courses,
    authors: state.authors
  };
}

const mapDispatchToProps = {
  loadCourses,
  loadAuthors,
  saveCourse
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageCoursePage);
