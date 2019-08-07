import * as courseActions from "./courseActions";
import * as types from "./actionTypes";
import { courses } from "../../../tools/mockData";
import thunk from "redux-thunk";
import fetchMock from "fetch-mock";
import configureMockStore from "redux-mock-store";

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

describe("Async Actions", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  describe("createCourseSuccess", () => {
    it("should create a BEGIN_API_CALL and LOAD_COURSES_SUCCESS when loading courses", () => {
      fetchMock.mock("*", {
        body: courses,
        headers: { "content-type": "application/json" }
      });

      const expectedAction = [
        { type: types.BEGIN_API_CALL },
        { type: types.LOAD_COURSES_SUCCESS, courses }
      ];

      const store = mockStore({ courses: [] });
      return store.dispatch(courseActions.loadCourses()).then(() => {
        expect(store.getActions()).toEqual(expectedAction);
      });
    });
  });
});
