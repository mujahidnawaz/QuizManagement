<template>
    <div class="change-password-container">
        <h2>Set Password</h2>
        <form @submit.prevent="submitForm" novalidate>
            <div class="form-group">
                <label for="newPassword">New Password</label>
                <div class="input-wrapper">
                    <input type="password" id="newPassword" v-model="newPassword" @input="validatePassword"
                        :class="{ 'is-invalid': newPasswordError }" placeholder="Enter new password" />
                </div>
                <small v-if="newPasswordError" class="error-message">{{ newPasswordError }}</small>
            </div>

            <div class="form-group">
                <label for="confirmPassword">Confirm New Password</label>
                <div class="input-wrapper">
                    <input type="password" id="confirmPassword" v-model="confirmPassword"
                        @input="validateConfirmPassword" :class="{ 'is-invalid': confirmPasswordError }"
                        placeholder="Confirm new password" />
                </div>
                <small v-if="confirmPasswordError" class="error-message">{{ confirmPasswordError }}</small>
            </div>

            <button type="submit" class="submit-btn" :disabled="!isFormValid">Submit</button>
        </form>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const newPassword = ref('');
const confirmPassword = ref('');
const newPasswordError = ref(null);
const confirmPasswordError = ref(null);

const validatePassword = () => {
    if (newPassword.value.length < 8) {
        newPasswordError.value = 'Password must be at least 8 characters long.';
    } else {
        newPasswordError.value = null;
    }
};

const validateConfirmPassword = () => {
    if (confirmPassword.value !== newPassword.value) {
        confirmPasswordError.value = 'Passwords do not match.';
    } else {
        confirmPasswordError.value = null;
    }
};

const isFormValid = computed(() => {
    return (
        newPassword.value.length >= 8 &&
        confirmPassword.value === newPassword.value &&
        !newPasswordError.value &&
        !confirmPasswordError.value
    );
});

const submitForm = async () => {
    try {
        const response = await axios.put('http://192.168.15.115:8000/api/password/setup', {
            token: route.query.token,
            email: route.query.email,
            password: newPassword.value,
            password_confirmation: confirmPassword.value
        });

        alert('Password set successfully!');
        router.push('/login');
    } catch (error) {
        // Handle error (e.g., display error message)
        console.error('Error setting password:', error.response.data);
        alert('Failed to set password.');
    }
};
</script>

<style scoped>
.change-password-container {
    max-width: 400px;
    margin: 200px auto;
    padding: 30px;
    background-color: #fff;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
}

h2 {
    text-align: center;
    color: #333;
    margin-bottom: 20px;
    font-family: 'Helvetica Neue', sans-serif;
}

.form-group {
    margin-bottom: 20px;
}

label {
    font-weight: 600;
    font-size: 0.9rem;
    color: #555;
    display: block;
    margin-bottom: 8px;
}

.input-wrapper {
    position: relative;
}

input {
    width: 100%;
    padding: 12px 15px;
    font-size: 1rem;
    border: 2px solid #ddd;
    border-radius: 8px;
    transition: border-color 0.3s ease;
    outline: none;
    background-color: #f9f9f9;
}

input.is-invalid {
    border-color: #ff5e62;
}

input:focus {
    border-color: #ff5e62;
    background-color: #fff;
    box-shadow: 0px 4px 8px rgba(255, 94, 98, 0.2);
}

.error-message {
    color: #ff5e62;
    font-size: 0.85rem;
    margin-top: 5px;
}

.submit-btn {
    background-color: #ff5e62;
    color: #fff;
    padding: 12px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    width: 100%;
    font-weight: 600;
    font-size: 1rem;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.submit-btn:disabled {
    background-color: #ddd;
    cursor: not-allowed;
}

.submit-btn:hover:enabled {
    background-color: #e04d52;
    box-shadow: 0px 4px 12px rgba(224, 77, 82, 0.3);
}

input::placeholder {
    color: #999;
    font-size: 0.95rem;
}
</style>
