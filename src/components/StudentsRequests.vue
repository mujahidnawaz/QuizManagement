<template>
    <div class="student-requests container-fluid my-5 p-4 shadow-sm bg-white rounded">
        <h1 class="text-center mb-5 section-header">Student Requests</h1>

        <!-- Filter Input -->
        <div class="mb-4">
            <input
                type="text"
                v-model="filter"
                class=""
                placeholder="Search by name..."
            />
        </div>

        <!-- Pending Applications Section -->
        <div class="section mb-5">
            <h2 class="section-title text-center mb-4">Pending Applications</h2>
            <div v-if="pendingApplications.length">
                <div class="table-container">
                    <table class="table table-hover table-responsive-md table-striped table-bordered rounded">
                        <thead class="thead-dark">
                            <tr>
                                <th>ID</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="user in filteredPendingApplications" :key="user.id">
                                <td>{{ user.id }}</td>
                                <td>{{ user.name }}</td>
                                <td>{{ user.email }}</td>
                                <td>{{ user.phone }}</td>
                                <td><span class="badge bg-warning text-dark">{{ user.status }}</span></td>
                                <td>
                                    <button @click="acceptApplication(user.id)" class="btn btn-success btn-sm me-2">Accept</button>
                                    <button @click="rejectApplication(user.id)" class="btn btn-danger btn-sm">Reject</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <p v-else class="text-muted text-center">No pending applications</p>
        </div>

        <!-- Accepted Applications Section -->
        <div class="section mb-5">
            <h2 class="section-title text-center mb-4">Accepted Applications</h2>
            <div v-if="acceptedApplications.length">
                <div class="table-container">
                    <table class="table table-hover table-responsive-md table-striped table-bordered rounded">
                        <thead class="thead-dark">
                            <tr>
                                <th>ID</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="user in filteredAcceptedApplications" :key="user.id">
                                <td>{{ user.id }}</td>
                                <td>{{ user.name }}</td>
                                <td>{{ user.email }}</td>
                                <td>{{ user.phone }}</td>
                                <td><span class="badge bg-success">{{ user.status }}</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <p v-else class="text-muted text-center">No accepted applications</p>
        </div>

        <!-- Rejected Applications Section -->
        <div class="section mb-5">
            <h2 class="section-title text-center mb-4">Rejected Applications</h2>
            <div v-if="rejectedApplications.length">
                <div class="table-container">
                    <table class="table table-hover table-responsive-md table-striped table-bordered rounded">
                        <thead class="thead-dark">
                            <tr>
                                <th>ID</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="user in filteredRejectedApplications" :key="user.id">
                                <td>{{ user.id }}</td>
                                <td>{{ user.name }}</td>
                                <td>{{ user.email }}</td>
                                <td>{{ user.phone }}</td>
                                <td><span class="badge bg-danger">{{ user.status }}</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <p v-else class="text-muted text-center">No rejected applications</p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const users = ref([]);
const filter = ref('');

const fetchUsers = async () => {
    await store.dispatch('fetchStudents');
    users.value = store.getters.students;
};

const pendingApplications = computed(() =>
    users.value.filter(user => user.status === 'pending')
);
const acceptedApplications = computed(() =>
    users.value.filter(user => user.status === 'accepted')
);
const rejectedApplications = computed(() =>
    users.value.filter(user => user.status === 'rejected')
);

// Filtered applications based on the input
const filteredPendingApplications = computed(() =>
    pendingApplications.value.filter(user => user.name.toLowerCase().includes(filter.value.toLowerCase()))
);
const filteredAcceptedApplications = computed(() =>
    acceptedApplications.value.filter(user => user.name.toLowerCase().includes(filter.value.toLowerCase()))
);
const filteredRejectedApplications = computed(() =>
    rejectedApplications.value.filter(user => user.name.toLowerCase().includes(filter.value.toLowerCase()))
);

const acceptApplication = async (userId) => {
    await store.dispatch('acceptStudentApplication', userId);
    fetchUsers();
};

const rejectApplication = async (userId) => {
    await store.dispatch('rejectStudentApplication', userId);
    fetchUsers();
};

onMounted(() => {
    fetchUsers();
});
</script>

<style scoped>
.student-requests {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 30px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
    font-weight: bold;
    text-transform: uppercase;
    color: #343a40;
}

.section-title {
    color: #ff5e62;
    font-size: 1.5rem;
    border-bottom: 2px solid #e9ecef;
    padding-bottom: 10px;
}

.table-container {
    max-height: 500px; /* Set max height */
    overflow-y: auto;  /* Enable vertical scroll */
}
input[type="text"]
{
  width: 100%;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  color: #333;
  margin-top: 5px;
  transition: border-color 0.3s;
}

input[type="text"]:focus {
  border-color: #ff5e62;
  outline: none;
}
.table {
    border-radius: 8px;
    overflow: hidden;
}

.table thead {
    background-color: #343a40;
    color: #fff;
}

.table tbody tr:hover {
    background-color: #f1f1f1;
    cursor: pointer;
}

.table tbody tr {
    transition: background-color 0.3s;
}

.btn {
    transition: all 0.3s;
}

.btn:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}

.btn-outline-dark {
    color: #343a40;
    border-color: #343a40;
}

.btn-outline-dark:hover {
    background-color: #343a40;
    color: #fff;
}
</style>
