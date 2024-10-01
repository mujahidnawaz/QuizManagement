<template>
    <div class="results-container">
      <h2>Quiz Results</h2>
      <div v-if="quizResults.length > 0">
        <div
          v-for="(quiz, index) in uniqueQuizResults"
          :key="index"
          class="quiz-result-card"
        >
          <h3>{{ quiz.quiz_title }}</h3>
          <p><strong>Attempted at:</strong> {{ quiz.attempted_at }}</p>
          <p><strong>Score:</strong> {{ quiz.score }}</p>
          <p><strong>Correct Answers:</strong> {{ quiz.correct_answers }}</p>
          <p><strong>Total Questions:</strong> {{ quiz.total_questions }}</p>
        </div>
      </div>
      <div v-else>
        <p>No quiz results available.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';  // Add computed to the import
  import axios from 'axios';
  
  const quizResults = ref([]);
  const token = localStorage.getItem('token');
  
  // Fetch quiz results from the API
  const fetchQuizResults = async () => {
    try {
      const response = await axios.get('http://192.168.15.115:8000/api/student/quiz-results', {
        headers: { Authorization: `Bearer ${token}` }
      });
      quizResults.value = response.data.data;
    } catch (error) {
      console.error("Error fetching quiz results:", error);
    }
  };
  
  // Get unique quiz results by filtering out duplicates
  const uniqueQuizResults = computed(() => {
    const seen = new Set();
    return quizResults.value.filter(quiz => {
      const isDuplicate = seen.has(quiz.quiz_title);
      seen.add(quiz.quiz_title);
      return !isDuplicate;
    });
  });
  
  onMounted(fetchQuizResults);
  </script>
  
  <style scoped>
  .results-container {
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .quiz-result-card {
    background-color: #f5f5f5;
    padding: 15px;
    margin-bottom: 15px;
    border-left: 5px solid #ff5e62;
  }
  
  h3 {
    color: #ff5e62;
  }
  
  p {
    margin: 5px 0;
  }
  </style>
  