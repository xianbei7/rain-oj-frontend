import { RouteRecordRaw } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import AdminView from "@/views/AdminView.vue";
import NoAuth from "@/views/NoAuth.vue";
import PERMISSIONS_ENUM from "@/permissions/permissionsEnum";
import UserLayout from "@/layouts/UserLayout.vue";
import UserRegisterView from "@/views/user/UserRegisterView.vue";
import UserLoginView from "@/views/user/UserLoginView.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/user",
    name: "用户",
    component: UserLayout,
    children: [
      {
        path: "/user/login",
        name: "用户登录",
        component: UserLoginView,
      },
      {
        path: "/user/register",
        name: "用户注册",
        component: UserRegisterView,
      },
    ],
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: "/",
    name: "浏览题目",
    component: HomeView,
  },
  {
    path: "/hide",
    name: "隐藏页面",
    component: HomeView,
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: "/noAuth",
    name: "无权限",
    component: NoAuth,
  },
  {
    path: "/admin",
    name: "仅管理员可见",
    component: AdminView,
    meta: {
      permissions: PERMISSIONS_ENUM.ADMIN,
    },
  },
  {
    path: "/about",
    name: "关于我的",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];