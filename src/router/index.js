import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import DashboardView from '@/views/DashboardView.vue';
import PacientesView from '@/views/PacientesView.vue';
import MedicosView from '@/views/MedicosView.vue';
import CitasView from '@/views/CitasView.vue';
import CitaDetalleView from '@/views/CitaDetalleView.vue';

const routes = [
  { path: '/login', component: LoginView, meta: { requiresAuth: false } },
  { path: '/register', component: RegisterView, meta: { requiresAuth: false } },
  { path: '/', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/pacientes', component: PacientesView, meta: { requiresAuth: true } },
  { path: '/medicos', component: MedicosView, meta: { requiresAuth: true } },
  { path: '/citas', component: CitasView, meta: { requiresAuth: true } },
  { path: '/cita/:id', component: CitaDetalleView, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (!to.meta.requiresAuth && authStore.isAuthenticated && (to.path === '/login' || to.path === '/register')) {
    next('/');
  } else {
    next();
  }
});

export default router;