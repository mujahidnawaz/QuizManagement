<template>
    <div class="assigned-quizzes-container">
      <h2 class="title">Assigned Quizzes</h2>
      <div v-if="quizzes.length" class="quizzes-list">
        <div v-for="quiz in quizzes" :key="quiz.id" class="quiz-card">
          <h3 class="quiz-title">{{ quiz.title }}</h3>
          <p class="quiz-description">{{ quiz.description }}</p>
          <p class="quiz-timing">
            <strong>Activation:</strong> {{ formatDate(quiz.activation_time) }} <br />
            <strong>Expiration:</strong> {{ formatDate(quiz.expiration_time) }}
          </p>
        </div>
      </div>
      <div v-else class="no-quizzes">No quizzes assigned yet.</div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const quizzes = ref([]);
  const token = localStorage.getItem('token');
  
  // Fetch quizzes assigned to the student
  const fetchAssignedQuizzes = async () => {
    try {
      const response = await axios.get('http://192.168.15.115:8000/api/student/quizzes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      quizzes.value = response.data.data;
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };
  
  // Format date to a readable string
  const formatDate = (datetime) => {
    const date = new Date(datetime);
    return date.toLocaleString();
  };
  
  // Fetch quizzes on component mount
  onMounted(fetchAssignedQuizzes);
  </script>
  
  <style scoped>
  .assigned-quizzes-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f4f4f9;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .title {
    text-align: center;
    color: #333;
    font-size: 2rem;
    margin-bottom: 20px;
  }
  
  .quizzes-list {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .quiz-card {
    background-color: white;
    border-left: 5px solid #ff5e62;
    padding: 20px;
    border-radius: 8px;
    transition: transform 0.3s ease;
  }
  
  .quiz-card:hover {
    transform: translateY(-5px);
  }
  
  .quiz-title {
    font-size: 1.5rem;
    color: #333;
  }
  
  .quiz-description {
    font-size: 1rem;
    color: #666;
    margin-bottom: 10px;
  }
  
  .quiz-timing {
    font-size: 0.9rem;
    color: #999;
  }
  
  .no-quizzes {
    text-align: center;
    color: #999;
    font-size: 1.2rem;
  }
  </style>
  