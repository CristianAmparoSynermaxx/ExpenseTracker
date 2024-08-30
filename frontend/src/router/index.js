import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
      meta: { requiresAuth: true, showNavbar: true },
    },
    {
      path: "/expense",
      name: "expense",
      component: () => import("../views/ExpensesView.vue"),
      meta: { requiresAuth: true, showNavbar: true },
    },

    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
      meta: { showNavbar: false },
    },
    {
      path: "/signup",
      name: "signup",
      component: () => import("../views/SignUpView.vue"),
      meta: { showNavbar: false },
    },
    {
      path: "/:catchAll(.*)",
      name: "NotFound",
      component: () => import("@/views/NotFoundView.vue"),
      meta: { requiresAuth: false, showNavbar: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const userData = JSON.parse(localStorage.getItem("userData")); // Retrieve user data from local storage

  if (to.meta.requiresAuth && !userData) {
    next({ name: "login" }); // Redirect to login
  } else if ((to.name === "login" || to.name === "signup") && userData) {
    next({ name: "home" }); // Redirect logged-in users
  } else {
    next();
  }
});

export default router;
