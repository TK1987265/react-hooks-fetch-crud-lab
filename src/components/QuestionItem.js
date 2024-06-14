import React from 'react';

function QuestionItem({ question, onDeleteQuestion, onUpdateQuestion }) {
  // Function to handle when the delete button is clicked
  function handleDelete() {
    fetch(`http://localhost:4000/questions/${question.id}`, {
      method: 'DELETE'
    })
    .then(() => onDeleteQuestion(question.id))
    .catch(error => console.error('Error deleting question:', error));
  }

  // Function to handle changes in the correct answer dropdown
  function handleCorrectAnswerChange(event) {
    const newCorrectIndex = parseInt(event.target.value);
    fetch(`http://localhost:4000/questions/${question.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correctIndex: newCorrectIndex })
    })
    .then(response => response.json())
    .then(updatedQuestion => onUpdateQuestion(updatedQuestion))
    .catch(error => console.error('Error updating question:', error));
  }

  return (
    <li>
      <h4>Question {question.id}</h4>
      <h5>Prompt: {question.prompt}</h5>
      <label>
        Correct Answer:
        <select value={question.correctIndex} onChange={handleCorrectAnswerChange}>
          {question.answers.map((answer, index) => (
            <option key={index} value={index}>{answer}</option>
          ))}
        </select>
      </label>
      <button onClick={handleDelete}>Delete Question</button>
    </li>
  );
}

export default QuestionItem;
