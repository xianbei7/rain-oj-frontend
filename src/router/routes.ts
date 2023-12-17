import { RouteRecordRaw } from "vue-router";
import PERMISSIONS_ENUM from "@/permissions/permissionsEnum";
import UserLayout from "@/layouts/UserLayout.vue";
import BasicLayout from "@/layouts/BasicLayout.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "主页",
    component: () => import("../views/HomeView.vue"),
    meta: {
      hideInMenu: true,
      layout: BasicLayout,
    },
  },
  {
    path: "/user",
    name: "用户",
    component: UserLayout,
    children: [
      {
        path: "/user/login",
        name: "用户登录",
        component: () => import("../views/user/UserLoginView.vue"),
      },
      {
        path: "/user/register",
        name: "用户注册",
        component: () => import("../views/user/UserRegisterView.vue"),
      },
      {
        path: "/user/info/:userId",
        name: "用户信息",
        component: () => import("../views/user/UserInfoView.vue"),
        props: true,
        meta: {
          permissions: PERMISSIONS_ENUM.USER,
        },
      },
    ],
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: "/question/list",
    name: "题目列表",
    component: () => import("../views/question/QuestionListView.vue"),
  },
  {
    path: "/question/view/:id",
    name: "在线做题",
    component: () => import("../views/question/ViewQuestionView.vue"),
    props: true,
    meta: {
      permissions: PERMISSIONS_ENUM.USER,
      hideInMenu: true,
    },
  },
  {
    path: "/question/add",
    name: "创建题目",
    component: () => import("../views/question/AddQuestionView.vue"),
    meta: {
      permissions: PERMISSIONS_ENUM.USER,
    },
  },
  {
    path: "/question/update",
    name: "更新题目",
    component: () => import("../views/question/AddQuestionView.vue"),
    meta: {
      permissions: PERMISSIONS_ENUM.USER,
      hideInMenu: true,
    },
  },
  {
    path: "/question/manage",
    name: "管理题目",
    component: () => import("../views/question/ManageQuestionView.vue"),
    meta: {
      permissions: PERMISSIONS_ENUM.ADMIN,
    },
  },
  {
    path: "/question/submit/list",
    name: "提交记录",
    component: () => import("../views/question/QuestionSubmitListView.vue"),
  },
  {
    path: "/test",
    name: "测试",
    component: () => import("../views/TestView.vue"),
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: "/noAuth",
    name: "401",
    component: () => import("../views/error/NoAuth.vue"),
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: "/notFound",
    name: "404",
    component: () => import("../views/error/NotFound.vue"),
    meta: {
      hideInMenu: true,
      layout: BasicLayout,
    },
  },
  {
    path: "/:pathMatch(.*)", // 匹配所有路由
    redirect: "/notFound",
  },
];
