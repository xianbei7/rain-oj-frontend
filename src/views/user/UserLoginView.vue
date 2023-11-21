<template>
  <div style="max-width: 500px; margin: 0 auto">
    <h1 style="margin-bottom: 50px; margin-top: 100px">登录账号</h1>
    <a-form
      ref="loginForm"
      :model="form"
      layout="vertical"
      @submit="handleSubmit"
    >
      <a-form-item
        field="userAccount"
        :rules="[
          { required: true, message: '账号不能为空' },
          { minLength: 4, message: '账号至少4位' },
          { maxLength: 20, message: '账号至多20位' },
        ]"
        :validate-trigger="['change', 'blur', 'input']"
        hide-label
      >
        <a-input
          size="large"
          v-model="form.userAccount"
          placeholder="请输入账号"
        >
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="userPassword"
        :rules="[
          { required: true, message: '密码不能为空' },
          { minLength: 8, message: '账号至少8位' },
          { maxLength: 20, message: '账号至多20位' },
        ]"
        :validate-trigger="['change', 'blur', 'input']"
        hide-label
      >
        <a-input-password
          size="large"
          v-model="form.userPassword"
          placeholder="请输入密码"
          allow-clear
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-space :size="16" direction="vertical">
        <a-button
          type="primary"
          size="large"
          shape="round"
          html-type="submit"
          long
        >
          登录
        </a-button>
        <a-button
          type="text"
          size="large"
          shape="round"
          long
          class="login-form-register-btn"
          @click="onRegister"
        >
          注册
        </a-button>
      </a-space>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { Message } from "@arco-design/web-vue";
import { ValidatedError } from "@arco-design/web-vue/es/form/interface";

import { useUserInfo } from "@/store/UserInfo";
import { UserControllerService, UserLoginRequest } from "../../../generated";

const router = useRouter();
const userInfo = useUserInfo();

/**
 * 表单信息
 */
const form = reactive({
  userAccount: "",
  userPassword: "",
} as UserLoginRequest);
const handleSubmit = async ({
  errors,
  values,
}: {
  errors: Record<string, ValidatedError> | undefined;
  values: Record<string, any>;
}) => {
  if (!errors) {
    const res = await UserControllerService.userLoginUsingPost(values);
    // 登录成功，跳转到主页
    if (res.code === 0) {
      await userInfo.getLoginUser();
      router.push({
        path: "/",
        replace: true,
      });
      Message.success("欢迎回来！");
    } else {
      Message.error("登录失败，" + res.message);
    }
  }
};
const onRegister = () => {
  router.push("/user/register");
};
</script>

<style lang="less" scoped></style>
