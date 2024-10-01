<template>
  <div class="login-container d-flex align-items-center justify-content-center">
    <transition name="fade">
      <form @submit.prevent="handleSubmit" class="login-form rounded shadow-lg p-5">
        <h2 class="text-center mb-4 fw-bold">Sign In</h2>

        <div class="custom-form-group mb-3">
          <label for="email" class="custom-label">Email address</label>
          <input type="email" id="email" class="custom-input" v-model="email" placeholder="Enter your email" required />
        </div>
        <div class="custom-form-group mb-4">
          <label for="password" class="custom-label">Password</label>
          <input type="password" id="password" class="custom-input" v-model="password" placeholder="Enter your password"
            required />
        </div>
        <div class="d-grid mb-4">
          <button type="submit" class="btn btn-primary btn-lg fw-bold">Login</button>
        </div>

        <p class="mt-4 text-center">Don't Registerd Yet? <router-link to="/register"><span
              class="fw-bold register">Register</span></router-link></p>
      </form>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';

const email = ref('');
const password = ref('');
const store = useStore();

const handleSubmit = () => {
  const userData = {
    email: email.value,
    password: password.value,
  };
  store.dispatch('login', userData);
};
</script>

<style scoped>
.login-container {
  background: linear-gradient(135deg, #ff9966, #ff5e62);
  height: 100vh;
}

.login-form {
  max-width: 500px;
  width: 100%;
  background-color: white;
}

.custom-form-group {
  position: relative;
}

.custom-label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
}

.custom-input {
  width: 100%;
  padding: 8px 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 30px;
  background-color: #f9f9f9;
  outline: none;
  transition: border-color 0.3s ease, background-color 0.3s ease;
}

.custom-input:focus {
  border-color: #ff5e62;
  background-color: #fff;
}

.btn-primary {
  background-color: #ff5e62;
  border-color: #ff5e62;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  border-radius: 30px;
}

.btn-primary:hover {
  background-color: #f37c7e;
  border-color: #ff5e62;
}

.social-icon {
  width: 24px;
  height: 24px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease-in-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.register {
  color: #ff5e62;
}

@media (max-width: 768px) {
  .login-form {
    padding: 2rem;
  }
}
</style>