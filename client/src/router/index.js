import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Subreddit from '../views/Subreddit.vue';
import All from '../views/All.vue';
import User from '../views/User.vue';
import Discover from '../views/Discover.vue';
import Search from '../views/Search.vue';
import Post from '../views/Post.vue';
import CreatePost from '../views/CreatePost.vue';
import CreateSubreddit from '../views/CreateSubreddit.vue';
import ErrorPage from '../views/ErrorPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/r/:name',
    name: 'Subreddit',
    component: Subreddit,
  },
  {
    path: '/all',
    name: 'All',
    component: All,
  },
  {
    path: '/user',
    name: 'User',
    component: User,
  },
  {
    path: '/discover',
    name: 'Discover',
    component: Discover,
  },
  {
    path: '/search',
    name: 'Search',
    component: Search,
  },
  {
    path: '/post/:id',
    name: 'Post',
    component: Post,
  },
  {
    path: '/r/:name/create',
    name: 'CreatePost',
    component: CreatePost,
  },
  {
    path: '/create',
    name: 'CreateSubreddit',
    component: CreateSubreddit,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'ErrorPage',
    component: ErrorPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
