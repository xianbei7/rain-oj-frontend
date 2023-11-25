<template>
  <a-modal
    :visible="visible"
    title="修改个人信息"
    @cancel="emit('update:visible', false)"
    @before-ok="handleBeforeOk"
  >
    <a-form :model="form">
      <a-form-item field="userName" label="用户名">
        <a-input v-model="form.userName" />
      </a-form-item>
      <a-form-item field="userProfile" label="用户简介">
        <a-textarea v-model="form.userProfile" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, withDefaults, defineProps, defineEmits } from "vue";
import { useUserInfo } from "@/store/UserInfo";
import { UserControllerService } from "../../generated";

const emit = defineEmits(["update:visible"]);

interface Props {
  visible: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
});

const userInfo = useUserInfo();
const form = reactive({
  userName: userInfo.userName,
  userProfile: userInfo.userProfile,
});

const handleBeforeOk = () => {
  UserControllerService.updateMyUserUsingPost(form);
};
</script>

<style scoped></style>
