<template>
    <div class="app-form-container d-flex align-items-center justify-content-center">
        <transition name="fade">
            <form @submit.prevent="handleSubmit" class="app-form rounded shadow-lg p-5">
                <h2 class="text-center mb-4 fw-bold">Job Application</h2>

                <div class="custom-form-group mb-3">
                    <label for="fullname" class="custom-label">Full Name</label>
                    <input type="text" id="fullname" class="custom-input" v-model="name" placeholder="Enter your Full Name" required />
                </div>

                <div class="custom-form-group mb-3">
                    <label for="email" class="custom-label">Email Address</label>
                    <input type="email" id="email" class="custom-input" v-model="email" placeholder="Enter your email" required />
                </div>

                <div class="custom-form-group mb-3">
                    <label for="phoneNumber" class="custom-label">Phone Number</label>
                    <input type="number" id="phone" class="custom-input" v-model="phone" placeholder="Enter your Phone Number" required />
                </div>

                <div class="custom-form-group mb-4">
                    <label for="cv" class="custom-label">Upload CV</label>
                    <input type="file" id="cv" class="custom-file-input ps-3" @change="handleFileUpload" accept=".pdf,.doc,.docx" required />
                    <small class="text-muted">Accepted formats: .pdf, .doc, .docx</small>
                </div>

                <div class="d-grid mb-4">
                    <button type="submit" class="btn btn-primary btn-lg fw-bold">Submit Application</button>
                </div>

                <p class="text-center">
                    <router-link to="/login" class="fw-bold back-login">Back to Login</router-link>
                </p>
            </form>
        </transition>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const name = ref('');
const email = ref('');
const phone = ref('');
const cvFile = ref(null);


const handleFileUpload = (event) => {
    const file = event.target.files[0];
    cvFile.value = file;
    console.log('Uploaded CV:', file);
};

// Handle form submission
const handleSubmit = async () => {
    if (cvFile.value) {
        const formData = new FormData();
        formData.append('name', name.value);
        formData.append('email', email.value);
        formData.append('phone', phone.value || '');
        formData.append('cv', cvFile.value);

        await store.dispatch('submitApplication', formData);
    } else {
        alert('Please upload your CV');
    }
};
</script>

<style scoped>
.app-form-container {
    background: linear-gradient(135deg, #ff9966, #ff5e62);
    height: 100vh;
}

.app-form {
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

.custom-input,
.custom-file-input {
    width: 100%;
    padding: 8px 0.75rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 30px;
    background-color: #f9f9f9;
    outline: none;
    transition: border-color 0.3s ease, background-color 0.3s ease;
}

.custom-input:focus,
.custom-file-input:focus {
    border-color: #ff5e62;
    background-color: #fff;
}

.custom-file-input {
    padding: 0.4rem;
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

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.6s ease-in-out;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.back-login {
    color: #ff5e62;
}

@media (max-width: 768px) {
    .app-form {
        padding: 2rem;
    }
}
</style>
