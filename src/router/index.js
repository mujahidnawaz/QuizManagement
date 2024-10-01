import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from '../components/LoginForm.vue';
import AdminDashboard from '../components/Dashboard.vue';
import StudentRequests from '../components/StudentsRequests.vue';
import ViewAndAssignQuizes from '../components/ViewAndAssignQuizes.vue'
import CreateQuizes from '../components/CreateQuizes.vue'
import AllStdQuizzesResult from '../components/AllStdQuizzesResult.vue'
import AssignRoles from '../components/AssignRoles.vue';
import StudentDetails from '../components/StudentDetails.vue';
import AssignedQuizzes from '../components/AssignedQuizzes.vue';
import PendingQuizzes from '../components/PendingQuizzes.vue';
import AttemptedQuizzes from '../components/AttemptedQuizzes.vue';
import QuizResults from '../components/QuizResults.vue';
import ApplicationForm from '../components/ApplicationForm.vue';
import SetPassword from '../components/SetPassword.vue';
import AttemptQuiz from '@/components/AttemptQuiz.vue';

import store from '../store';

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: LoginForm
  },
  {
    path: '/register',
    component: ApplicationForm
  },
  {
    path: '/set-password',
    component: SetPassword
  },
  {
    path: '/dashboard',
    component: AdminDashboard,
    meta: {
      requiresAuth: true,
      // role: 'admin'
    },
    children: [
      {
        path: 'student-requests',
        component: StudentRequests,
        meta: {
          permission: 'User can view/accept/reject student requests'
        }
      },
      {
        path: 'assign-roles',
        component: AssignRoles,
        meta: {
          permission: 'User can add manager'
        }
      },
      {
        path: 'view-quizzes',
        component: ViewAndAssignQuizes,
        meta: {
          permission: 'User can view all quizzes'
        }
      },
      {
        path: 'create-quizzes',
        component: CreateQuizes,
        meta: {
          permission: 'User can assign quizzes to students'
        }
      },
      {
        path: 'quizzes-result',
        component: AllStdQuizzesResult,
        meta: {
          permission: 'User can view quiz results'
        }
      },
      {
        path: 'student-details',
        component: StudentDetails,
        meta: {
          permission: 'User can view student details'
        }
      },
      {
        path: 'assigned-quizzes',
        component: AssignedQuizzes,
        meta: {
          permission: 'User can view Assigned Quizzes'
        }
      },
      {
        path: 'pending-quizzes',
        component: PendingQuizzes,
        meta: {
          permission: 'User can view Pending Quizzes'
        }
      },
      {
        path: 'attempted-quizzes',
        component: AttemptedQuizzes,
        meta: {
          permission: 'User can view Attempted Quizzes'
        }
      },
      {
        path: 'quiz-results',
        component: QuizResults,
        meta: {
          permission: 'User can view Assigned Quiz Results'
        }
      },
      // {
      //   path: 'attempt-quiz',
      //   component: AttemptQuiz,
      //   meta:{
      //     permission: 'User can attempt quizzes'
      //   }
      // },
      {
        path: '/dashboard/attempt-quiz/:quizId',
        name: 'AttemptQuiz',
        component: AttemptQuiz,  // This is your lazy-loaded component
        meta: {
          permission: 'User can attempt quizzes'
        },
        props: true
      },
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const user = store.state.auth.user;
  const permissions = store.getters.permissions;

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.getters.isAuthenticated) {
      next('/login');
    } else if (to.meta.role && user.role !== to.meta.role) {
      next('/login');
    } else if (to.meta.permission && !permissions.includes(to.meta.permission)) {
      alert('You do not have permission to access this page');
      next('/dashboard');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;