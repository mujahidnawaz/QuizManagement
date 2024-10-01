import axios from 'axios';
import router from '../../router';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Interceptor to automatically add the token to headers if it exists
// api.interceptors.request.use(
//     (config) => {
//         // Get the token from localStorage
//         const token = localStorage.getItem('token');
//         if (token) {
//             config.headers['Authorization'] = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );
const state = {
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user')) || null,
    permissions: JSON.parse(localStorage.getItem('permissions')) || [],
    status: '',
    users: []
};

const mutations = {
    auth_request(state) {
        state.status = 'loading';
    },
    auth_success(state, {
        token,
        user,
        permissions
    }) {
        state.token = token;
        state.user = user;
        state.permissions = permissions;
        state.status = 'success';
    },
    auth_error(state) {
        state.status = 'error';
    },
    logout(state) {
        state.token = '';
        state.user = null;
        state.permissions = [];
    },
    set_users(state, users) {
        state.users = users;
    },
    update_user_status(state, {
        id,
        newStatus
    }) {
        const userIndex = state.users.findIndex(user => user.id === id);
        if (userIndex !== -1) {
            state.users[userIndex].status = newStatus;
        }
    }
};

const actions = {
    async login({
        commit
    }, userData) {
        commit('auth_request');
        try {
            const response = await api.post('/login', userData);
            const {
                token,
                role,
                permissions
            } = response.data.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(response.data.data));
            localStorage.setItem('permissions', JSON.stringify(permissions));

            commit('auth_success', {
                token,
                user: response.data.data,
                permissions
            });

            router.push('/dashboard');
        } catch (error) {
            commit('auth_error');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            alert('Invalid email or password');
        }
    },
    logout({
        commit
    }) {
        commit('logout');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('permissions');
        router.push('/login');
    },
    async fetchStudents({
        commit
    }) {
        try {
            const response = await api.get('/students');
            commit('set_users', response.data.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    },
    async acceptStudentApplication({
        commit
    }, submissionId) {
        try {
            const response = await api.post(`/submissions/${submissionId}/accept`);
            const updatedStudent = response.data.data;
            commit('update_user_status', {
                id: updatedStudent.id,
                newStatus: updatedStudent.status
            });
            alert(response.data.message);
        } catch (error) {
            console.error('Error accepting student application:', error);
            alert('Failed to accept the application. Please try again.');
        }
    },
    async rejectStudentApplication({
        commit
    }, submissionId) {
        try {
            const response = await api.post(`/submissions/${submissionId}/reject`);
            const updatedStudent = response.data.data;
            commit('update_user_status', {
                id: updatedStudent.id,
                newStatus: updatedStudent.status
            });
            alert(response.data.message);
        } catch (error) {
            console.error('Error rejecting student application:', error);
            alert('Failed to reject the application. Please try again.');
        }
    },
    async submitApplication({
        commit
    }, formData) {
        try {
            const response = await api.post('/submissions', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            alert('Message: ' + response.data.message);
        } catch (error) {
            console.error('Submission error:', error);
            alert('There was an issue submitting your application. Please try again.');
        }
    },
    async register({ commit }, { role, name, email }) {
        try {
            const response = await api.post('/admin/register', { role, name, email });
            alert('Message: ' + response.data.message);  // Show success message
        } catch (error) {
            // Check if there's a response from the server and log it
            if (error.response) {
                console.error('Error response data:', error.response.data);
                alert('Registration error: ' + (error.response.data.message || 'Unknown error'));
            } else {
                console.error('Error without response:', error.message);
                alert('Failed to connect to the server.');
            }
        }
    },
    
    async submitQuiz({ state }, { quiz }) {
        try {
            const response = await api.post('/quizzes', quiz);
            return response;
        } catch (error) {
            throw new Error('Error submitting quiz: ' + error.message);
        }
    },
};

const getters = {
    isAuthenticated: (state) => !!state.token,
    user: (state) => state.user,
    permissions: (state) => state.permissions,
    users: (state) => state.users,
    students: (state) => state.users
};

export default {
    state,
    mutations,
    actions,
    getters
};

// import axios from 'axios';
// import router from '../../router';

// // Base URL from .env file
// const api = axios.create({
//     baseURL: import.meta.env.VITE_API_BASE_URL,
// });

// // Interceptor to automatically add the token to headers if it exists
// api.interceptors.request.use(
//     (config) => {
//         // Get the token from localStorage
//         const token = localStorage.getItem('token');
//         if (token) {
//             config.headers['Authorization'] = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// const state = {
//     token: localStorage.getItem('token') || '',
//     user: JSON.parse(localStorage.getItem('user')) || null,
//     permissions: JSON.parse(localStorage.getItem('permissions')) || [],
//     status: '',
//     users: []
// };

// const mutations = {
//     auth_request(state) {
//         state.status = 'loading';
//     },
//     auth_success(state, { token, user, permissions }) {
//         state.token = token;
//         state.user = user;
//         state.permissions = permissions;
//         state.status = 'success';
//     },
//     auth_error(state) {
//         state.status = 'error';
//     },
//     logout(state) {
//         state.token = '';
//         state.user = null;
//         state.permissions = [];
//     },
//     set_users(state, users) {
//         state.users = users;
//     },
//     update_user_status(state, { id, newStatus }) {
//         const userIndex = state.users.findIndex(user => user.id === id);
//         if (userIndex !== -1) {
//             state.users[userIndex].status = newStatus;
//         }
//     }
// };

// const actions = {
//     async login({ commit }, userData) {
//         commit('auth_request');
//         try {
//             const response = await api.post('/login', userData);
//             const { token, role, permissions } = response.data.data;

//             localStorage.setItem('token', token);
//             localStorage.setItem('user', JSON.stringify(response.data.data));
//             localStorage.setItem('permissions', JSON.stringify(permissions));

//             commit('auth_success', { token, user: response.data.data, permissions });

//             router.push('/dashboard');
//         } catch (error) {
//             commit('auth_error');
//             localStorage.removeItem('token');
//             localStorage.removeItem('user');
//             alert('Invalid email or password');
//         }
//     },
//     logout({ commit }) {
//         commit('logout');
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         localStorage.removeItem('permissions');
//         router.push('/login');
//     },
//     async fetchStudents({ commit }) {
//         try {
//             const response = await api.get('/students');
//             commit('set_users', response.data.data);
//         } catch (error) {
//             console.error('Error fetching students:', error);
//         }
//     },
//     async acceptStudentApplication({ commit }, submissionId) {
//         try {
//             const response = await api.post(`/submissions/${submissionId}/accept`);
//             const updatedStudent = response.data.data;
//             commit('update_user_status', { id: updatedStudent.id, newStatus: updatedStudent.status });
//             alert(response.data.message);
//         } catch (error) {
//             console.error('Error accepting student application:', error);
//             alert('Failed to accept the application. Please try again.');
//         }
//     },
//     async rejectStudentApplication({ commit }, submissionId) {
//         try {
//             const response = await api.post(`/submissions/${submissionId}/reject`);
//             const updatedStudent = response.data.data;
//             commit('update_user_status', { id: updatedStudent.id, newStatus: updatedStudent.status });
//             alert(response.data.message);
//         } catch (error) {
//             console.error('Error rejecting student application:', error);
//             alert('Failed to reject the application. Please try again.');
//         }
//     },
//     async submitApplication({ commit }, formData) {
//         try {
//             const response = await api.post('/submissions', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 }
//             });
//             alert('Message: ' + response.data.message);
//         } catch (error) {
//             console.error('Submission error:', error);
//             alert('There was an issue submitting your application. Please try again.');
//         }
//     },
//     async register({ commit }, { role, name, email, password }) {
//         try {
//             const response = await api.post('/register', {
//                 role,
//                 name,
//                 email,
//                 password
//             });
//             alert('Message: ' + response.data.message);
//         } catch (error) {
//             console.error('Registration error:', error);
//         }
//     },

// };

// const getters = {
//     isAuthenticated: (state) => !!state.token,
//     user: (state) => state.user,
//     permissions: (state) => state.permissions,
//     users: (state) => state.users,
//     students: (state) => state.users
// };

// export default {
//     state,
//     mutations,
//     actions,
//     getters
// };