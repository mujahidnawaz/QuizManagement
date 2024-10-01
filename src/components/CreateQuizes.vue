<template>
  <div class="quiz-creation-container">
    <h2>Create Quiz</h2>

    <!-- Title and Description -->
    <div class="form-group">
      <label for="quizTitle">Quiz Title</label>
      <input type="text" v-model="quiz.title" placeholder="Enter quiz title" />
    </div>

    <div class="form-group">
      <label for="quizDescription">Quiz Description</label>
      <textarea v-model="quiz.description" placeholder="Enter quiz description"></textarea>
    </div>

    <!-- Dynamic Question Fields -->
    <div v-for="(question, index) in quiz.questions" :key="index" class="question-block">
      <h3>Question {{ index + 1 }}</h3>
      <input type="text" v-model="question.question" placeholder="Enter question" class="question-input" />

      <!-- Options for each question -->
      <div v-for="(option, optIndex) in question.options" :key="optIndex" class="option-block">
        <input type="text" v-model="question.options[optIndex]" placeholder="Enter option" class="option-input" />
      </div>

      <!-- Add more options -->
      <button class="add-option-btn" @click="addOption(index)">Add Option</button>

      <!-- Select correct answer -->
      <label for="correctAnswer" class="correct-answer-label">Correct Answer</label>
      <select v-model="question.correct_answer" class="correct-answer-select">
        <option v-for="(option, optIndex) in question.options" :key="optIndex" :value="option">
          {{ option }}
        </option>
      </select>

      <button @click="removeQuestion(index)" class="remove-question-btn">Remove Question</button>
    </div>

    <!-- Add New Question -->
    <button class="add-question-btn" @click="addQuestion">Add Question</button>

    <!-- Submit Quiz -->
    <button class="submit-btn" @click="submitQuiz">Submit Quiz</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

// Quiz data structure
const quiz = ref({
  title: '',
  description: '',
  questions: [
    {
      question: '',
      options: ['', '', '', ''],
      correct_answer: ''
    }
  ]
});

// Add a new question
const addQuestion = () => {
  quiz.value.questions.push({
    question: '',
    options: ['', ''],
    correct_answer: ''
  });
};

// Add a new option for a specific question
const addOption = (questionIndex) => {
  quiz.value.questions[questionIndex].options.push('');
};

// Remove a question
const removeQuestion = (index) => {
  quiz.value.questions.splice(index, 1);
};

// Submit the quiz using Vuex action
const submitQuiz = async () => {
  try {
    await store.dispatch('submitQuiz', { quiz: quiz.value });
    alert('Quiz submitted successfully!');
  } catch (error) {
    console.error('Error submitting quiz:', error);
    alert('Failed to submit quiz.');
  }
};
</script>



<style scoped>
.quiz-creation-container {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

h2 {
  color: #333;
  text-align: center;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: bold;
}

.form-group {
  margin-bottom: 20px;
}

label {
  font-weight: 500;
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
  display: block;
}

input[type="text"],
textarea,
select {
  width: 100%;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  color: #333;
  margin-top: 5px;
  transition: border-color 0.3s;
}

input[type="text"]:focus,
textarea:focus,
select:focus {
  border-color: #ff5e62;
  outline: none;
}

textarea {
  resize: none;
  height: 120px;
}

.question-block {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 5px;
  background-color: #f9f9f9;
}

h3 {
  color: #ff5e62;
  font-size: 22px;
  margin-bottom: 15px;
}

.option-block {
  margin-bottom: 10px;
}

button {
  cursor: pointer;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.add-option-btn,
.add-question-btn {
  background-color: #ff5e62;
  color: white;
  margin-top: 10px;
}

.remove-question-btn {
  background-color: #e74c3c;
  color: white;
  margin-top: 10px;
}

.add-option-btn:hover,
.add-question-btn:hover,
.remove-question-btn:hover {
  opacity: 0.8;
}

.submit-btn {
  background-color: #ff5e62;
  color: white;
  margin-top: 20px;
  width: 100%;
}

.submit-btn:hover {
  background-color: #e74c3c;
}

.correct-answer-select {
  margin-top: 10px;
  width: 100%;
  padding: 10px;
  font-size: 16px;
}

.correct-answer-label {
  display: block;
  margin-top: 20px;
  font-weight: 500;
}
</style>