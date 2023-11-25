<template>
  <div class="header">
    <a-space :size="8" direction="vertical" align="center">
      <a-avatar
        :size="64"
        :style="{
          backgroundColor: '#4080ff',
          cursor: 'pointer',
        }"
      >
        {{ userInfo.userName || "未登录" }}
      </a-avatar>
      <a-typography-title :heading="6" style="margin: 0">
        {{ userInfo.userName }}
      </a-typography-title>
      <div class="user-msg">
        <a-space :size="18">
          <div>
            <icon-message />
            <a-typography-text>{{ userInfo.userProfile }}</a-typography-text>
          </div>
        </a-space>
      </div>
    </a-space>
  </div>
  <!--  <a-card class="general-card" title="提交题目">
      <a-list :bordered="false">
        <a-list-item
          v-for="questionSubmit in questionSubmitList"
          :key="questionSubmit.id"
          action-layout="horizontal"
        >
          <a-list-item-meta :description="questionSubmit.status as string">
            <template #avatar>
              <a-avatar></a-avatar>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </a-list>
    </a-card>-->
</template>

<script setup lang="ts">
import { useUserInfo } from "@/store/UserInfo";

const userInfo = useUserInfo();
import { onMounted, ref } from "vue";
import {
  QuestionSubmitControllerService,
  QuestionSubmitVO,
} from "../../../generated";
import { defineProps } from "vue/dist/vue";

interface Props {
  id: number;
}

const props = defineProps<Props>();
const questionSubmitList = ref<QuestionSubmitVO[]>([]);
const fetchData = async () => {
  console.log(111);
  const { data } =
    await QuestionSubmitControllerService.listQuestionSubmitByPageUsingPost1({
      userId: props.id as number,
    });
  questionSubmitList.value = data;
};
onMounted(() => {
  // fetchData();
});
</script>

<style scoped lang="less">
.header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--gray-10);
  border-radius: 4px;

  :deep(.arco-avatar-trigger-icon-button) {
    color: rgb(var(--arcoblue-6));

    :deep(.arco-icon) {
      vertical-align: -1px;
    }
  }

  .user-msg {
    .arco-icon {
      color: rgb(var(--gray-10));
    }

    .arco-typography {
      margin-left: 6px;
    }
  }
}

.latest-activity {
  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.general-card :deep(.arco-list-item) {
  padding-left: 0;
  border-bottom: none;

  .arco-list-item-meta-content {
    flex: 1;
    padding-bottom: 27px;
    border-bottom: 1px solid var(--color-neutral-3);
  }

  .arco-list-item-meta-avatar {
    padding-bottom: 27px;
  }

  .skeleton-item {
    margin-top: 10px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--color-neutral-3);
  }
}
</style>
