import { createRouter, createWebHistory } from "vue-router";
import DashboardView from "../views/DashboardView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: DashboardView
    },
    {
      path: "/transactions",
      name: "transactions",
      component: () => import("../views/TransactionView.vue")
    },
    {
      path: "/settings",
      name: "settings",
      component: () => import("../views/SettingsView.vue")
    }
  ],
});

export default router;
