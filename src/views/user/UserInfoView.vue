<template>
  <a-row :gutter="10" style="width: 1000px; margin: 0 auto">
    <a-col :span="16">
      <a-card class="infinite-scroll">
        <a-tabs size="large" :active-key="tabKey" @change="tabChange" lazy-load>
          <a-tab-pane key="favour">
            <template #title>
              <icon-star-fill />
              收藏题目
            </template>
            <a-list
              :max-height="450"
              :bordered="false"
              @reach-bottom="fetchData"
              :scrollbar="scrollbar"
            >
              <template #scroll-loading>
                <div v-if="bottom">已经到底了</div>
                <a-spin v-else />
              </template>
              <a-list-item
                v-for="favourQuestion in favourQuestionList"
                :key="favourQuestion.questionId"
              >
                <a-list-item-meta
                  :title="`${favourQuestion.number}-${favourQuestion.title}`"
                  :description="favourQuestion.title"
                >
                </a-list-item-meta>
                <template #actions>
                  <span
                    class="userAction"
                    key="favour"
                    @click="onFavourChange(favourQuestion.questionId)"
                  >
                    <span v-if="favourQuestion.hasFavour">
                      <IconStarFill style="color: #ffb400" />
                    </span>
                    <span v-else>
                      <IconStar />
                    </span>
                    {{ favourQuestion.favourNum }}
                  </span>
                </template>
              </a-list-item>
            </a-list>
          </a-tab-pane>
          <a-tab-pane key="submit">
            <template #title>
              <icon-clock-circle />
              提交记录
            </template>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </a-col>
    <a-col :span="8">
      <a-card hoverable>
        <template #cover>
          <div style="margin: 10px auto">
            <a-avatar :size="50" :style="{ backgroundColor: '#4080ff' }">{{
              userInfo.userName
            }}</a-avatar>
          </div>
        </template>
        <a-card-meta :title="userInfo.userName">
          <template #description>
            {{ userInfo.userProfile }}
          </template>
        </a-card-meta>
      </a-card>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  QuestionFavourControllerService,
  QuestionFavourVO,
  QuestionSubmitVO,
  UserControllerService,
  UserVO,
} from "../../../generated";
import { defineProps } from "vue/dist/vue";

interface Props {
  id: number;
}

const props = defineProps<Props>();
const bottom = ref(false);
const scrollbar = ref(true);
const current = ref(1);
const pages = ref(0);
const pageSize = 6;
const questionSubmitList = ref<QuestionSubmitVO[]>([]);
const favourQuestionList = ref<QuestionFavourVO[]>([]);
const userInfo = ref<UserVO>({});
const tabKey = ref("favour");

const tabChange = (vaule: string) => {
  tabKey.value = vaule;
};
const onFavourChange = async (questionId: number) => {
  await QuestionFavourControllerService.doQuestionFavourUsingGet(questionId);
  refreshData();
};
const refreshData = async () => {
  const resp =
    await QuestionFavourControllerService.listFavourQuestionByPageUsingPost({
      current: 1,
      pageSize: pageSize * current.value,
      userId: props.id,
    });
  if (resp.code === 0) {
    favourQuestionList.value = resp.data.records;
  }
};
const fetchData = async () => {
  const resp =
    await QuestionFavourControllerService.listFavourQuestionByPageUsingPost({
      current: current.value,
      pageSize: pageSize,
      userId: props.id,
    });
  if (resp.code === 0) {
    if (current.value < pages.value) {
      favourQuestionList.value.push(...resp.data.records);
      current.value++;
    } else {
      bottom.value = true;
    }
  }
};
const initQuestionFavourList = async () => {
  const resp =
    await QuestionFavourControllerService.listFavourQuestionByPageUsingPost({
      current: 1,
      pageSize: pageSize,
      userId: props.id,
    });
  if (resp.code === 0) {
    pages.value = resp.data.pages;
    favourQuestionList.value.push(...resp.data.records);
    current.value = 3;
  }
};
const getUserInfo = async () => {
  const resp = await UserControllerService.getUserVoByIdUsingGet(props.id);
  if (resp.code === 0) {
    userInfo.value = resp.data;
  }
};
onMounted(() => {
  getUserInfo();
  initQuestionFavourList();
});
</script>

<style scoped></style>
