<template>
    <div class="student-details container-fluid my-5 p-4 shadow-sm bg-white rounded">
        <h1 class="text-center mb-5 section-header">Student Details</h1>

        <!-- Accepted Applications Section -->
        <div v-if="acceptedApplications.length">
            <table class="table table-hover table-responsive-md table-striped table-bordered rounded">
                <thead class="thead-dark">
                    <tr>
                        <th>ID</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>CV</th>
                        <!-- <th>Status</th> -->
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in acceptedApplications" :key="user.id">
                        <td>{{ user.id }}</td>
                        <td>{{ user.name }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.phone }}</td>
                        <td> <a v-if="user.cv" :href="user.cv" target="_blank" class="btn btn-primary btn-sm">
                                View CV
                            </a>
                            <span v-else class="text-muted">No CV available</span>
                        </td>
                        <!-- <td><span class="badge bg-success">{{ user.status }}</span></td> -->
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- No Accepted Applications Message -->
        <p v-else class="text-muted text-center">No accepted applications</p>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

// Access Vuex store
const store = useStore();
const users = ref([]);

const fetchUsers = async () => {
    await store.dispatch('fetchStudents');
    users.value = store.getters.students;
};

const acceptedApplications = computed(() =>
    users.value.filter(user => user.status === 'accepted')
);

onMounted(() => {
    fetchUsers();
});
</script>

<style scoped>
.student-details {
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

p.text-muted {
    font-size: 1.2rem;
}
</style>