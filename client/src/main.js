import { createApp, reactive } from 'vue';
import App from './App.vue';
import router from './router';

const store = reactive({
  user: null,
  socket: null,
});

const app = createApp(App);

app.config.globalProperties.$store = store;
app.use(router).mount('#app');
