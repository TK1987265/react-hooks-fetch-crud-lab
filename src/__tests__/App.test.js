import React from "react";
import "whatwg-fetch";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { server } from "../mocks/server";

import App from "../components/App";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("displays question prompts after fetching", async () => {
  render(<App />);

  fireEvent.click(screen.queryByText(/View Questions/));

  expect(await screen.findByText(/lorem testum 1/g)).toBeInTheDocument();
  expect(await screen.findByText(/lorem testum 2/g)).toBeInTheDocument();
});

test("creates a new question when the form is submitted", async () => {
  render(<App />);

  // wait for first render of list (otherwise we get a React state warning)
  await screen.findByText(/lorem testum 1/g);

  // click form page
  fireEvent.click(screen.queryByText("New Question"));

  // fill out form
  fireEvent.change(screen.queryByLabelText(/Prompt/), {
    target: { value: "Test Prompt" },
  });
  fireEvent.change(screen.queryByLabelText(/Answer 1/), {
    target: { value: "Test Answer 1" },
  });
  fireEvent.change(screen.queryByLabelText(/Answer 2/), {
    target: { value: "Test Answer 2" },
  });
  fireEvent.change(screen.queryByLabelText(/Correct Answer/), {
    target: { value: "1" },
  });


// After submitting the form
fireEvent.submit(screen.getByText(/Add Question/));

// Navigate back to view questions if necessary
fireEvent.click(screen.getByText(/View Questions/));
const testPromptElement = await screen.findByText(/Test Prompt/g);
expect(testPromptElement).toBeInTheDocument();


});

test("deletes the question when the delete button is clicked", async () => {
  const { rerender } = render(<App />);

  fireEvent.click(screen.queryByText(/View Questions/));

  await screen.findByText(/lorem testum 1/g);

  fireEvent.click(screen.queryAllByText("Delete Question")[0]);

  await waitForElementToBeRemoved(() => screen.queryByText(/lorem testum 1/g));

  rerender(<App />);

  await screen.findByText(/lorem testum 2/g);

  expect(screen.queryByText(/lorem testum 1/g)).not.toBeInTheDocument();
});

test("updates the answer when the dropdown is changed", async () => {
  const { rerender } = render(<App />);

  // Wait for the options to be available and interactable
  await screen.findByText(/View Questions/);
  fireEvent.click(screen.getByText(/View Questions/));

  // Ensure the question data is loaded
  await screen.findByText(/lorem testum 2/);

  // Find the dropdown for the correct answer and change its value
  const correctAnswerDropdown = screen.getAllByLabelText(/Correct Answer/)[0];
  fireEvent.change(correctAnswerDropdown, { target: { value: "3" } });

  // Use waitFor to handle asynchronous state updates or re-rendering
  await waitFor(() => {
    expect(correctAnswerDropdown.value).toBe("3");
  });

  // Optionally re-render the component to reflect state changes
  rerender(<App />);
  expect(screen.getAllByLabelText(/Correct Answer/)[0].value).toBe("3");
});
