<template>
  <div style="max-width: 500px; margin: 0 auto">
    <h1 style="margin-bottom: 50px; margin-top: 100px">注册账号</h1>
    <a-form
      ref="registerForm"
      :model="form"
      layout="vertical"
      @submit="handleSubmit"
    >
      <a-form-item
        field="userAccount"
        :rules="[
          { required: true, message: '账号不能为空' },
          { minLength: 4, message: '账号最少4位' },
          { maxLength: 20, message: '账号至多20位' },
          { validator: commonValidate, required: true },
        ]"
        :validate-trigger="['change', 'blur', 'input']"
        hide-label
      >
        <a-input
          size="large"
          v-model="form.userAccount"
          placeholder="请输入账号（4到20位，不能包含特殊字符）"
        >
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="userName"
        :rules="[
          { required: true, message: '用户名不能为空' },
          { minLength: 2, message: '用户名最少2位' },
          { maxLength: 20, message: '用户名至多20位' },
        ]"
        :validate-trigger="['change', 'blur', 'input']"
        hide-label
      >
        <a-input
          size="large"
          v-model="form.userName"
          placeholder="请输入用户名（2到20位）"
        >
          <template #prefix>
            <icon-idcard />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="userPassword"
        :rules="[
          { required: true, message: '密码不能为空' },
          { minLength: 8, message: '账号最少8位' },
          { maxLength: 20, message: '账号至多20位' },
          { validator: commonValidate, required: true },
        ]"
        :validate-trigger="['change', 'blur', 'input']"
        hide-label
      >
        <a-input-password
          size="large"
          v-model="form.userPassword"
          placeholder="请输入密码（8到20位，不能包含特殊字符）"
          allow-clear
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item
        field="checkPassword"
        :rules="[
          { required: true, message: '密码不能为空' },
          {
            validator: confirmValidate,
            required: true,
          },
        ]"
        :validate-trigger="['change', 'blur', 'input']"
        hide-label
      >
        <a-input-password
          size="large"
          v-model="form.checkPassword"
          placeholder="请再次输入密码"
          allow-clear
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-button
        type="primary"
        size="large"
        shape="round"
        html-type="submit"
        long
      >
        注册
      </a-button>
    </a-form>
  </div>

  <a-modal v-model:visible="visible" @ok="handleOk" @cancel="handleOk">
    <template #title>请确认账号和密码！遗忘无法找回</template>
    <div style="text-align: center">
      <div>
        您的账号和密码：
        <a-tag size="large">{{ form.userAccount }}</a-tag>
        <a-tag size="large">{{ form.userPassword }}</a-tag>
      </div>
    </div>
  </a-modal>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { Message } from "@arco-design/web-vue";
import { ValidatedError } from "@arco-design/web-vue/es/form/interface";

import { UserControllerService, UserRegisterRequest } from "../../../generated";

const router = useRouter();
const visible = ref(false);
/**
 * 表单信息
 */
const form = reactive({
  userAccount: "",
  userName: "",
  userPassword: "",
  checkPassword: "",
} as UserRegisterRequest);
const commonValidate = (value: any, callback: any) => {
  const regex = /^[a-zA-Z0-9._]+$/; // 只允许字母、数字、下划线
  if (!regex.test(value)) {
    callback(new Error("账号不能包含特殊字符"));
  } else {
    callback();
  }
};
const confirmValidate = (value: any, callback: any) => {
  if (value !== form.userPassword) {
    callback(new Error("输入密码不一致"));
  } else {
    callback();
  }
};
const handleOk = () => {
  visible.value = false;
  Message.success("注册成功！");
  router.push({
    path: "/user/login",
    replace: true,
  });
};
const handleSubmit = async ({
  errors,
  values,
}: {
  errors: Record<string, ValidatedError> | undefined;
  values: Record<string, any>;
}) => {
  if (!errors) {
    const res = await UserControllerService.userRegisterUsingPost(values);
    // 注册成功，跳转到登录
    if (res.code === 0) {
      visible.value = true;
    } else {
      Message.error(`注册失败，${res.message}`);
    }
  }
};
</script>

<style lang="less" scoped></style>
