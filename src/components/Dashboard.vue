<template>
  <div>
    <h1 class="text-center title pt-1 pb-0 mb-0 border-bottom">Dashboard</h1>
    <div class="dashboard d-flex">
      <!-- Sidebar -->
      <div class="sidebar bg-light">
        <ul class="nav flex-column">
          <li class="nav-item mb-2" v-if="hasPermission('User can view/accept/reject student requests')">
            <router-link to="/dashboard/student-requests" class="nav-link border-bottom" active-class="active">
              <i class="fa-solid fa-code-pull-request"></i> Student Requests
            </router-link>
          </li>
          <li class="nav-item mb-2" v-if="hasPermission('User can add manager')">
            <router-link to="/dashboard/assign-roles" class="nav-link border-bottom" active-class="active">
              <i class="fa-brands fa-critical-role"></i>  Assign Roles
            </router-link>
          </li>
          <li class="nav-item mb-2" v-if="hasPermission('User can view all quizzes')">
            <router-link to="/dashboard/view-quizzes" class="nav-link border-bottom" active-class="active">
              <i class="fa-regular fa-file-lines"></i> Quizzes
            </router-link>
          </li>
          <li class="nav-item mb-2" v-if="hasPermission('User can add manager')">
            <router-link to="/dashboard/create-quizzes" class="nav-link border-bottom" active-class="active">
              <i class="fa-regular fa-square-plus"></i> Create Quiz
            </router-link>
          </li>
          <li class="nav-item mb-2" v-if="hasPermission('User can view quiz results')">
            <router-link to="/dashboard/quizzes-result" class="nav-link border-bottom" active-class="active">
              <i class="fa-solid fa-square-poll-vertical"></i> Quizzes Result
            </router-link>
          </li>
          <li class="nav-item mb-2" v-if="hasPermission('User can view student details')">
            <router-link to="/dashboard/student-details" class="nav-link border-bottom" active-class="active">
              <i class="fa-solid fa-building-columns"></i> Student Details
            </router-link>
          </li>
          <li class="nav-item mb-2" v-if="hasPermission('User can view Assigned Quizzes')">
            <router-link to="/dashboard/assigned-quizzes" class="nav-link" active-class="active"><i class="fa-regular fa-note-sticky"></i> Assigned Quizzes</router-link>
          </li>
          <li class="nav-item mb-2" v-if="hasPermission('User can view Pending Quizzes')">
            <router-link to="/dashboard/pending-quizzes" class="nav-link" active-class="active"><i class="fa-solid fa-spinner"></i> Pending Quizzes</router-link>
          </li>
          <!-- <li class="nav-item mb-2" v-if="hasPermission('User can attempt quizzes')">
            <router-link to="/dashboard/attempt-quiz" class="nav-link" active-class="active"><i class="fa-solid fa-user-pen"></i> Attempt Quiz</router-link>
          </li> -->
          <!-- <li class="nav-item mb-2" v-if="hasPermission('User can view Attempted Quizzes')">
            <router-link to="/dashboard/attempted-quizzes" class="nav-link" active-class="active"><i class="fa-regular fa-square-check"></i> Attempted Quizzes</router-link>
          </li> -->
          <li class="nav-item mb-2" v-if="hasPermission('User can view Assigned Quiz Results')">
            <router-link to="/dashboard/quiz-results" class="nav-link" active-class="active"><i class="fa-solid fa-square-poll-vertical"></i> Quiz Results</router-link>
          </li>
          <li class="nav-item mb-2 text-center">
            <button @click="logout" class="btn btn-outline-dark w-75 rounded-4">Logout</button>
          </li>
        </ul>
      </div>

      <!-- Main Content -->
      <!-- <div class="main-content py-0 flex-fill">
        <router-view></router-view>
      </div> -->
      <div class="main-content py-0 flex-fill">
        <router-view v-slot="{ Component }">
          <div v-if="Component">
            <component :is="Component"></component>
          </div>
          <div v-else class="mx-auto text-center mt-5 w-100">
            <h1>Welcome to the Dashboard!</h1>
            <p>.</p>
          </div>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex';
const store = useStore();

const logout = () => {
  store.dispatch('logout');
};

const hasPermission = (permission) => {
  return store.getters.permissions.includes(permission);
};
</script>

<style scoped>
.dashboard {
  display: flex;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.title {
  font-size: 2rem;
  color: #fff;
  background: linear-gradient(to right, #ff5e62, #ff9966);
  padding: 1rem;
}

.sidebar {
  width: 250px;
  background-color: #fff;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  padding-top: 1rem;
}

.sidebar .nav-item {
  list-style: none;
  margin-bottom: 1.5rem;
}

.sidebar .nav-link {
  font-size: 1rem;
  color: #333;
  padding: 0.75rem 1.25rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.sidebar .nav-link:hover {
  background-color: #f0f0f0;
}

.sidebar .nav-link.active {
  background-color: #ff5e62;
  color: #fff;
  font-weight: bold;
}

.btn-outline-dark {
  border-color: #ff5e62;
  color: #ff5e62;
  transition: all 0.3s ease;
}

.btn-outline-dark:hover {
  background-color: #ff5e62;
  color: #fff;
  border-color: #ff5e62;
}

.main-content {
  background-color: #fff;
  padding: 2rem;
  flex-grow: 1;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.05);
}

@media (max-width: 768px) {
  .sidebar {
    width: 200px;
  }

  .main-content {
    padding: 1.5rem;
  }
}
</style>
