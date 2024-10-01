<template>
    <div class="assign-roles-container mt-5">
        <h2 class="text-center mb-4">Assign Roles</h2>
        <form @submit.prevent="handleSubmit" class="role-form">
            <div class="form-group">
                <label for="role">Role</label>
                <select id="role" v-model="role" class="custom-input">
                    <option value="" disabled selected>Select Role</option>
                    <option value="manager">Manager</option>
                    <option value="supervisor">Supervisor</option>
                </select>
            </div>
            <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" v-model="name" class="custom-input" placeholder="Enter Name" />
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" v-model="email" class="custom-input" placeholder="Enter Email" />
            </div>
            <!-- <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" v-model="password" class="custom-input" placeholder="Enter Password" />
            </div> -->
            <div class="text-center">
                <button type="submit" class="custom-button">
                    Submit
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';  // Import Vuex store

const role = ref('');
const name = ref('');
const email = ref('');
const store = useStore();
const handleSubmit = () => {
    if (role.value && name.value && email.value) {
        store.dispatch('register', { role: role.value, name: name.value, email: email.value });
    } else {
        alert('Please fill all the required fields.');
    }
};

</script>

<style scoped>
.assign-roles-container {
    max-width: 500px;
    margin: auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

h2 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 20px;
}

.role-form {
    display: flex;
    flex-direction: column;
}

.form-group {
    margin-bottom: 15px;
}

label {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 5px;
    color: #333;
}

.custom-input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.3s ease;
}

.custom-input:focus {
    border-color: #ff5e62;
}

.custom-input::placeholder {
    color: #aaa;
}

.custom-button {
    width: 100%;
    padding: 12px;
    background-color: #ff5e62;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.custom-button:hover {
    background-color: #f37c7e;
    border-color: #ff5e62;
}

.text-center {
    text-align: center;
}
</style>