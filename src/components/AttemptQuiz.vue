<template>
  <div class="quiz-container mt-5" v-if="questions.length > 0">
    <!-- Video Preview (for user to see the video recording) -->
    <video ref="videoElement" autoplay muted></video>

    <h2 class="question-title">{{ currentQuestion.question }}</h2>
    <ul class="options-list">
      <li v-for="(option, index) in parsedOptions" :key="index">
        <label :class="{ selected: selectedOption === index }">
          <input type="radio" :value="index" v-model="selectedOption" class="hidden-radio" />
          {{ option }}
        </label>
      </li>
    </ul>
    <div class="navigation-buttons">
      <button @click="previousQuestion" :disabled="currentIndex === 0" class="prev-btn">
        Previous
      </button>
      <button v-if="!isLastQuestion" @click="nextQuestion" :disabled="selectedOption === null" class="next-btn">
        Next
      </button>
      <button v-else @click="submitQuiz" :disabled="selectedOption === null" class="submit-btn">
        Submit
      </button>
    </div>
    <div class="question-indicator">
      Question {{ currentIndex + 1 }} of {{ questions.length }}
    </div>
    <div v-if="message" class="submission-message">{{ message }}</div>
  </div>
  <div v-else>
    Loading quiz...
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const currentIndex = ref(0);
const selectedOption = ref(null);
const questions = ref([]);
const answers = ref([]);
const message = ref("");
const token = localStorage.getItem('token');

// For video recording
const videoElement = ref(null);
let mediaRecorder;
let recordedChunks = [];

import { defineProps } from 'vue';

const props = defineProps({
  quizId: {
    type: String,
    required: true
  }
});

// Fetch quiz questions
const fetchQuestions = async () => {
  try {
    const response = await axios.get(`http://192.168.15.115:8000/api/quizzes/${route.params.quizId}/attempt`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    questions.value = response.data.data;
    startVideoRecording(); // Start recording when quiz is fetched
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
};

onMounted(fetchQuestions);

// Get the current question
const currentQuestion = computed(() => questions.value[currentIndex.value] || { question: '', options: '[]' });

// Parse options from stringified JSON
const parsedOptions = computed(() => {
  return JSON.parse(currentQuestion.value.options || '[]');
});

// Navigate to the next question
const nextQuestion = () => {
  answers.value[currentIndex.value] = parsedOptions.value[selectedOption.value]; // Store selected answer
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++;
    selectedOption.value = null;
  }
};

// Navigate to the previous question
const previousQuestion = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    selectedOption.value = null;
  }
};

// Check if it's the last question
const isLastQuestion = computed(() => currentIndex.value === questions.value.length - 1);

// Submit the quiz
const submitQuiz = async () => {
  answers.value[currentIndex.value] = parsedOptions.value[selectedOption.value]; // Store the last answer
  try {
    const response = await axios.post(`http://192.168.15.115:8000/api/quizzes/${props.quizId}/submit`, {
      answers: answers.value
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    message.value = response.data.message + ". Your score: " + response.data.score;

    stopVideoRecording(); // Stop recording when the quiz is submitted
  } catch (error) {
    console.error("Error submitting quiz:", error);
  }
};

// Start video recording
const startVideoRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.value.srcObject = stream;
    
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };
    mediaRecorder.start();
  } catch (error) {
    console.error("Error accessing camera:", error);
  }
};

// Stop video recording
const stopVideoRecording = () => {
  mediaRecorder.stop();
  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    saveVideo(blob);
  };
};

// Save video to server
const saveVideo = async (blob) => {
  const formData = new FormData();
  formData.append("video", blob, "quiz_attempt.webm");

  try {
    await axios.post(`http://192.168.15.115:8000/api/quizzes/${props.quizId}/video`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
  } catch (error) {
    console.error("Error saving video:", error);
  }
};

// Cleanup on unmount
onUnmounted(() => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
});
</script>

<style scoped>
/* Your existing styles */
.quiz-container {
  max-width: 600px;
  margin: 0 auto;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

video {
  width: 100%;
  max-height: 200px;
  margin-bottom: 20px;
  border-radius: 8px;
}

.quiz-container {
  max-width: 600px;
  margin: 0 auto;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.question-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
}

.options-list {
  list-style: none;
  padding: 0;
  margin: 0 0 30px 0;
}

.options-list li {
  margin: 10px 0;
}

label {
  display: block;
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

label:hover {
  border-color: #008cba;
}

label.selected {
  background-color: #008cba;
  color: white;
}

.hidden-radio {
  display: none;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
}

.prev-btn,
.next-btn,
.submit-btn {
  background-color: #008cba;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.prev-btn:hover,
.next-btn:hover,
.submit-btn:hover {
  background-color: #005f8a;
}

.prev-btn:disabled,
.next-btn:disabled,
.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.question-indicator {
  margin-top: 20px;
  text-align: center;
  font-size: 1rem;
  font-weight: 500;
  color: #666;
}

.submission-message {
  margin-top: 20px;
  text-align: center;
  font-size: 1.2rem;
  color: green;
}
</style>
