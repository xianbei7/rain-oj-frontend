<template>
  <a-row id="globalHeader" align="center" :wrap="false">
    <a-col flex="auto">
      <div>
        <a-menu
          mode="horizontal"
          :selected-keys="selectKeys"
          @menu-item-click="doMenuClick"
        >
          <a-menu-item
            key="0"
            :style="{ padding: 0, marginRight: '38px' }"
            disabled
          >
            <div class="title-bar">
              <img class="logo" src="../assets/logo.svg" />
              <div class="title">雨 OJ</div>
            </div>
          </a-menu-item>
          <a-menu-item v-for="item in visibleRoutes" :key="item.path">
            {{ item.name }}
          </a-menu-item>
        </a-menu>
      </div>
    </a-col>
    <a-col flex="80px">
      <a-dropdown trigger="click">
        <a-avatar
          :size="40"
          :style="{
            backgroundColor: '#4080ff',
            cursor: 'pointer',
          }"
        >
          {{ userInfo.userName || "未登录" }}
        </a-avatar>
        <template #content>
          <a-doption>
            <a-space @click="toUserLogin">
              <icon-import />
              登录账号
            </a-space>
          </a-doption>
          <a-doption>
            <a-space @click="toUserInfo">
              <icon-user />
              用户主页
            </a-space>
          </a-doption>
          <a-doption>
            <a-space @click="handleSetting">
              <icon-settings />
              用户设置
            </a-space>
          </a-doption>
          <a-doption>
            <a-space @click="handleLogout">
              <icon-export />
              退出登录
            </a-space>
          </a-doption>
        </template>
      </a-dropdown>
    </a-col>
  </a-row>
  <UpdateUserModal :visible="visible" v-model:visible="visible" />
</template>
<script setup lang="ts">
import { routes } from "@/router/routes";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserInfo } from "@/store/UserInfo";
import checkPermissions from "@/permissions/checkPermissions";
import { UserControllerService } from "../../generated";
import { Message } from "@arco-design/web-vue";
import UpdateUserModal from "@/components/UpdateUserModal.vue";

const userInfo = useUserInfo();
const visible = ref(false);
const visibleRoutes = computed(() => {
  return routes.filter((item, index) => {
    if (item.meta?.hideInMenu) {
      return false;
    }
    return checkPermissions(userInfo, item?.meta?.permissions as string);
  });
});

// 默认主页
const selectKeys = ref(["/"]);
const router = useRouter();

// 路由跳转后，更新对应的选择菜单项
router.afterEach((to, from, failure) => {
  selectKeys.value = [to.path];
});
const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};
const toUserLogin = () => {
  router.push({ path: "/user/login" });
};
const toUserInfo = () => {
  if (userInfo.userName) {
    router.push({
      path: "/user/info/1726913181595181058",
    });
  } else {
    Message.error("尚未登录！");
    toUserLogin();
  }
};
const handleSetting = () => {
  if (userInfo.userName) {
    visible.value = true;
  } else {
    Message.error("尚未登录！");
    router.push({
      path: "/user/login",
    });
  }
};
const handleLogout = async () => {
  if (userInfo.userName) {
    const resp = await UserControllerService.userLogoutUsingPost();
    if (resp.code === 0) {
      Message.success("退出成功，欢迎再来！");
      location.reload();
    } else {
      Message.error(`退出失败，${resp.message}`);
    }
  } else {
    Message.success("尚未登录！");
  }
};
</script>
<style scoped>
.title {
  color: #444;
  margin-left: 16px;
}

.logo {
  height: 48px;
}

.title-bar {
  display: flex;
  align-items: center;
}
</style>
