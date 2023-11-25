import { RouteRecordRaw } from "vue-router";
import NoAuth from "@/views/NoAuth.vue";
import PERMISSIONS_ENUM from "@/permissions/permissionsEnum";
import UserLayout from "@/layouts/UserLayout.vue";
import UserRegisterView from "@/views/user/UserRegisterView.vue";
import UserLoginView from "@/views/user/UserLoginView.vue";
import AddQuestionView from "@/views/question/AddQuestionView.vue";
import ManageQuestionView from "@/views/question/ManageQuestionView.vue";
import QuestionListView from "@/views/question/QuestionListView.vue";
import ViewQuestionView from "@/views/question/ViewQuestionView.vue";
import UserInfoView from "@/views/user/UserInfoView.vue";

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
        path: "/user/register:id",
        name: "用户注册",
        component: UserRegisterView,
      },
      {
        path: "/user/info",
        name: "用户信息",
        component: UserInfoView,
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
    path: "/",
    name: "题目列表",
    component: QuestionListView,
  },
  {
    path: "/question/view/:id",
    name: "在线做题",
    component: ViewQuestionView,
    props: true,
    meta: {
      permissions: PERMISSIONS_ENUM.USER,
      hideInMenu: true,
    },
  },
  {
    path: "/question/add",
    name: "创建题目",
    component: AddQuestionView,
    meta: {
      permissions: PERMISSIONS_ENUM.USER,
    },
  },
  {
    path: "/question/update",
    name: "更新题目",
    component: AddQuestionView,
    meta: {
      permissions: PERMISSIONS_ENUM.USER,
      hideInMenu: true,
    },
  },
  {
    path: "/question/manage",
    name: "管理题目",
    component: ManageQuestionView,
    meta: {
      permissions: PERMISSIONS_ENUM.ADMIN,
    },
  },
  {
    path: "/noAuth",
    name: "无权限",
    component: NoAuth,
    meta: {
      hideInMenu: true,
    },
  },
];
