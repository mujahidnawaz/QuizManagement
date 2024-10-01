<template>
    <div class="container mx-auto mt-5">
        <h2>Pending Quizzes</h2>
        <div v-if="pendingQuizzes.length" class="mt-5">
            <div v-for="quiz in pendingQuizzes" :key="quiz.id" class="quiz-card">
                <h3>{{ quiz.title }}</h3>
                <p>{{ quiz.description || 'No description available' }}</p>
                <p>Activation Time: {{ quiz.activation_time }}</p>
                <p>Expiration Time: {{ quiz.expiration_time }}</p>
                <button @click="goToAttemptQuiz(quiz.id)" class="attempt-btn">
                    Attempt Quiz
                </button>
            </div>
        </div>
        <div v-else>
            No pending quizzes available.
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const pendingQuizzes = ref([]);
const token = localStorage.getItem('token');
const router = useRouter();

const fetchPendingQuizzes = async () => {
    try {
        const response = await axios.get('http://192.168.15.115:8000/api/student/pending-quizzes', {
            headers: { Authorization: `Bearer ${token}` }
        });
        pendingQuizzes.value = response.data.data;
    } catch (error) {
        console.error("Error fetching pending quizzes:", error);
    }
};

// Navigate to AttemptQuiz.vue with quiz ID
const goToAttemptQuiz = (quizId) => {
  router.push({
    name: 'AttemptQuiz',
    params: { quizId }
  });
};

onMounted(fetchPendingQuizzes);
</script>

<style scoped>
.pending-quizzes-container {
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
    margin-bottom: 10px;
}

.attempt-btn {
    background-color: #ff5e62;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.attempt-btn:hover {
    background-color: #d94a50;
}

.no-quizzes {
    text-align: center;
    color: #999;
    font-size: 1.2rem;
}
</style>