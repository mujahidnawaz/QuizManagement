<template>
    <div class="quiz-results-container mt-5">
      <h2 class="section-title">Quiz Results</h2>
  
      <!-- Quiz List Dropdown -->
      <div class="quiz-selection">
        <label for="quiz-select" class="quiz-label">Select a Quiz:</label>
        <select
          id="quiz-select"
          v-model="selectedQuizId"
          @change="onQuizSelect"
          class="quiz-dropdown"
        >
          <option value="" disabled>Select a quiz...</option>
          <option v-for="quiz in quizzes" :key="quiz.id" :value="quiz.id">
            {{ quiz.title }}
          </option>
        </select>
      </div>
  
      <!-- Show quiz results once a quiz is selected -->
      <div v-if="selectedQuizResults" class="quiz-details">
        <h3>Results for {{ selectedQuizResults.total_questions }} Questions</h3>
        <p>Correct Answers: {{ selectedQuizResults.correct_answers }}</p>
        <p>Score: {{ selectedQuizResults.score }}</p>
        <table class="quiz-results-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Attempted At</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="attempt in selectedQuizResults.attempts" :key="attempt.id">
              <td>{{ attempt.student_id }}</td>
              <td>{{ formatTime(attempt.attempted_at) }}</td>
              <td>{{ attempt.score }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const quizzes = ref([]); // Holds all quizzes
  const selectedQuizId = ref(null); // Holds the selected quiz ID
  const selectedQuizResults = ref(null); // Holds the results of the selected quiz
  const token = localStorage.getItem('token'); // Fetch the stored token
  
  // Fetch quizzes from the API
  const fetchQuizzes = async () => {
    try {
      const response = await axios.get('http://192.168.15.115:8000/api/all-quizzes');
      quizzes.value = response.data; // Populate quizzes list
    } catch (error) {
      console.error('Error fetching quizzes:', error.message);
      alert('Failed to load quizzes. Please try again later.');
    }
  };
  
  // Fetch quiz results for the selected quiz
  const fetchQuizResults = async (quizId) => {
    if (!quizId) return; // Exit if no quiz is selected
    try {
      const response = await axios.get(`http://192.168.15.115:8000/api/quizzes/${quizId}/results`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      selectedQuizResults.value = response.data; // Set the fetched results
    } catch (error) {
      console.error('Error fetching quiz results:', error.message);
      alert('Failed to load quiz results. Please try again later.');
    }
  };
  
  // Handle quiz selection from the dropdown
  const onQuizSelect = () => {
    fetchQuizResults(selectedQuizId.value); // Fetch results for the selected quiz ID
  };
  
  // Format time for display
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  // Fetch quizzes when the component mounts
  onMounted(() => {
    fetchQuizzes();
  });
  </script>
  
  <style scoped>
  .quiz-results-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .section-title {
    font-size: 1.8em;
    color: #ff5e62;
    text-align: center;
    margin-bottom: 20px;
  }
  
  .quiz-selection {
    margin-bottom: 20px;
  }
  
  .quiz-label {
    font-weight: bold;
  }
  
  .quiz-dropdown {
    width: 100%;
    padding: 8px;
    font-size: 1em;
  }
  
  .quiz-details {
    margin-top: 30px;
  }
  
  .quiz-results-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  .quiz-results-table th, .quiz-results-table td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: center;
  }
  
  .quiz-results-table th {
    background-color: #ff5e62;
    color: white;
  }
  </style>
  