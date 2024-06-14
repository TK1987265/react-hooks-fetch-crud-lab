import React, { useState, useEffect } from 'react';
import QuestionForm from './QuestionForm';
import QuestionList from './QuestionList';
import AdminNavBar from "./AdminNavBar"
function App() {
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState("List");

  const addQuestion = (newQuestion) => {
    setQuestions(prevQuestions => [...prevQuestions, newQuestion]);
};


  useEffect(() => {
    fetch('http://localhost:4000/questions')
      .then(res => res.json())
      .then(setQuestions)
      .catch(err => console.error("Failed to fetch questions:", err));
  }, []);

  function handleDeleteQuestion(id) {
    const updatedQuestions = questions.filter(q => q.id !== id);
    setQuestions(updatedQuestions);
    fetch(`http://localhost:4000/questions/${id}`, { method: 'DELETE' });
  }

  function handleUpdateQuestion(updatedQuestion) {
    const updatedQuestions = questions.map(q =>
      q.id === updatedQuestion.id ? updatedQuestion : q
    );
    setQuestions(updatedQuestions);
  }

  return (
    <main>
    <AdminNavBar onChangePage={setPage} />
    {page === "Form" ? <QuestionForm onAddQuestion={addQuestion}/> : <QuestionList   questions={questions}
        onDeleteQuestion={handleDeleteQuestion}
        onUpdateQuestion={handleUpdateQuestion} />}
  </main>
 
  );
}

export default App;
