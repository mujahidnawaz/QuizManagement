<template>
  <div class="quiz-list-container mt-5">
    <h2 class="text-center mb-4">View and Assign Quizzes</h2>

    <!-- Loading and error messages -->
    <div v-if="loading" class="loading-spinner">Loading quizzes and students...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-else>
      <div>
        <!-- Quiz Select Field -->
        <div class="mb-3">
          <label for="quizSelect" class="form-label">Select Quiz</label>
          <select v-model="selectedQuiz" id="quizSelect" class="form-select">
            <option value="" disabled>Select a quiz</option>
            <option v-for="quiz in quizzes" :key="quiz.id" :value="quiz.id">{{ quiz.title }}</option>
          </select>
        </div>

        <!-- Students List with Checkboxes -->
        <div class="mb-3">
          <label class="form-label">Select Students</label>
          <div v-if="students.length > 0" class="student-list">
            <div v-for="student in students" :key="student.id" class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                :value="student.id"
                v-model="selectedStudents"
                :id="'student-' + student.id"
              />
              <label :for="'student-' + student.id" class="form-check-label">
                {{ student.name }}
              </label>
            </div>
          </div>
          <div v-else>No students available.</div>
        </div>

        <!-- Button to Assign Quiz -->
        <button class="rounded p-1" style="background-color: #ff5e62; color: white; cursor: pointer;" @click="assignQuiz" :disabled="!selectedQuiz || selectedStudents.length === 0">
          Assign Quiz
        </button>
      </div>

      <!-- Quiz Cards -->
      <div v-if="quizzes.length > 0" class="mt-4">
        <div v-for="quiz in quizzes" :key="quiz.id" class="quiz-card mb-4 p-3 border rounded">
          <h3 class="quiz-title">{{ quiz.title }}</h3>
          <p class="quiz-description">{{ quiz.description }}</p>
          <p><strong>Activation Time:</strong> {{ formatDateTime(quiz.activation_time) }}</p>
          <p><strong>Expiration Time:</strong> {{ formatDateTime(quiz.expiration_time) }}</p>
          <p><strong>Total Questions:</strong> {{ quiz.questions.length }}</p>
        </div>
      </div>

      <!-- No quizzes available -->
      <div v-else class="alert alert-info">No quizzes available.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// State variables
const quizzes = ref([]);
const students = ref([]);
const selectedQuiz = ref(null);
const selectedStudents = ref([]);
const loading = ref(false);
const error = ref(null);

// Fetch quizzes and students when the component is mounted
const fetchData = async () => {
  loading.value = true;
  try {
    const [quizResponse, studentResponse] = await Promise.all([
      axios.get('http://192.168.15.115:8000/api/all-quizzes'),
      axios.get('http://192.168.15.115:8000/api/students/accepted')
    ]);
    quizzes.value = quizResponse.data;
    students.value = studentResponse.data;
  } catch (err) {
    error.value = 'Failed to load quizzes or students. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Assign quiz to selected students
const assignQuiz = async () => {
  try {
    const response = await axios.post('http://192.168.15.115:8000/api/quizzes/assign', {
      student_ids: selectedStudents.value,
      quiz_id: selectedQuiz.value
    });
    alert(response.data.message);
  } catch (err) {
    error.value = 'Failed to assign the quiz. Please try again.';
  }
};

// Format date and time
const formatDateTime = (dateTimeStr) => {
  const date = new Date(dateTimeStr);
  return date.toLocaleString(); // Customize the format as needed
};

onMounted(fetchData);
</script>

<style scoped>
.quiz-list-container {
  max-width: 800px;
  margin: 0 auto;
}

.quiz-card {
  background-color: #f9f9f9;
}

.loading-spinner {
  text-align: center;
  margin: 20px 0;
}

.quiz-title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.quiz-description {
  font-size: 1rem;
  color: #555;
}

.student-list {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
}
</style>
