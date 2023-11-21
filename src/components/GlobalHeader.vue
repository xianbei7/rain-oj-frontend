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
    <a-col flex="100px">
      <div>{{ userInfo.userName ?? "未登录" }}</div>
    </a-col>
  </a-row>
</template>
<script setup lang="ts">
import { routes } from "@/router/routes";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserInfo } from "@/store/UserInfo";
import checkPermissions from "@/permissions/checkPermissions";

const userInfo = useUserInfo();
const loginUser = userInfo.getLoginUser();
const visibleRoutes = computed(() => {
  return routes.filter((item, index) => {
    if (item.meta?.hideInMenu) {
      return false;
    }
    // todo 根据权限过滤菜单
    return checkPermissions(loginUser, item?.meta?.permissions as string);
  });
});

// 默认主页
const selectKeys = ref(["/"]);
const route = useRoute();
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
