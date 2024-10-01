import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Set up Axios to use base URL
axios.defaults.baseURL = 'http://localhost:3000';

createApp(App).use(store).use(router).mount('#app');
