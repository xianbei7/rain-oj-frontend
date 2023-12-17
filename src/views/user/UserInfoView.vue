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
              size="large"
              @reach-bottom="loadDataList"
              :scrollbar="scrollbar"
            >
              <template #scroll-loading>
                <div v-if="bottom">已经到底了</div>
                <a-spin v-else />
              </template>
              <a-list-item
                v-for="favourQuestion in favourQuestionList"
                :key="favourQuestion.questionId"
                action-layout="vertical"
              >
                <a-list-item-meta align="left">
                  <template #title>
                    <a-link
                      :href="`/question/view/${favourQuestion.questionId}`"
                      icon
                      >{{ `${favourQuestion.number}-${favourQuestion.title}` }}
                    </a-link>
                  </template>
                  <template #description>
                    <a-space direction="horizontal">
                      <difficulty-tag :difficulty="favourQuestion.difficulty" />
                      <a-tag
                        v-for="(tag, index) of favourQuestion.tags"
                        :key="index"
                        color="blue"
                        bordered
                        >{{ tag }}
                      </a-tag>
                    </a-space>
                  </template>
                </a-list-item-meta>
                <template #extra>
                  <a-tag>
                    <template #icon>
                      <icon-clock-circle />
                    </template>
                    {{ moment(favourQuestion.favourTime).format("YY年M月D日") }}
                  </a-tag>
                </template>
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
                  </span>
                  {{ favourQuestion.favourNum }}
                </template>
              </a-list-item>
            </a-list>
          </a-tab-pane>
          <a-tab-pane key="submit">
            <template #title>
              <icon-history />
              提交记录
            </template>
            <!--题目标题、id、编号、提交语言、提交状态、提交时间、提交详情（管理员）即提交id            -->
            <a-list
              :max-height="450"
              :bordered="false"
              size="large"
              @reach-bottom="loadDataList"
              :scrollbar="scrollbar"
            >
              <template #scroll-loading>
                <div v-if="bottom">已经到底了</div>
                <a-spin v-else />
              </template>
              <a-list-item
                v-for="questionSubmit in questionSubmitList"
                :key="questionSubmit.questionId"
              >
                <a-list-item-meta align="left">
                  <template #title>
                    <a-link
                      :href="`/question/view/${questionSubmit.questionId}`"
                      icon
                    >
                      {{
                        `${questionSubmit.questionNumber}-${questionSubmit.questionTitle}`
                      }}
                    </a-link>
                  </template>
                  <template #description>
                    <a-space direction="horizontal">
                      <a-tag>{{ questionSubmit.language }}</a-tag>
                      <status-detail
                        :status="questionSubmit.status"
                        :type="questionSubmit.judgeResult?.type"
                      />
                    </a-space>
                  </template>
                </a-list-item-meta>
                <template #extra>
                  <a-space direction="vertical">
                    <a-tag>
                      <template #icon>
                        <icon-clock-circle />
                      </template>
                      {{
                        moment(questionSubmit.createTime).format(
                          "YY年M月D日m点"
                        )
                      }}
                    </a-tag>
                    <a-button
                      type="primary"
                      @click="toSubmitDetail(questionSubmit.id)"
                      >查看详情
                    </a-button>
                  </a-space>
                </template>
              </a-list-item>
            </a-list>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </a-col>
    <a-col :span="8">
      <a-card hoverable>
        <template #cover>
          <div style="margin: 10px auto">
            <a-avatar :size="50" :style="{ backgroundColor: '#4080ff' }"
              >{{ userInfo.userName }}
            </a-avatar>
          </div>
        </template>
        <a-card-meta :title="`${userInfo.userNumber}-${userInfo.userName}`">
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
  QuestionSubmitControllerService,
  QuestionSubmitVO,
  UserControllerService,
  UserVO,
} from "../../../generated";
import { defineProps } from "vue/dist/vue";
import moment from "moment";
import DifficultyTag from "@/components/DifficultyTag";
import StatusDetail from "@/components/StatusDetail";
import PERMISSIONS_ENUM from "@/permissions/permissionsEnum";
import { Message } from "@arco-design/web-vue";
import { useUserInfo } from "@/store/UserInfo";
import { useRouter } from "vue-router";

const router = useRouter();

interface Props {
  userId: number;
}

const props = defineProps<Props>();
const init = ref(true);
const bottom = ref(false);
const scrollbar = ref(true);
const current = ref(1);
const pages = ref(0);
const pageSize = 5;
const questionSubmitList = ref<QuestionSubmitVO[]>([]);
const favourQuestionList = ref<QuestionFavourVO[]>([]);
const userInfo = ref<UserVO>({});
const tabKey = ref("favour");
const selfInfo = useUserInfo();

const tabChange = (vaule: string) => {
  tabKey.value = vaule;
  if (tabKey.value === "favour") {
    favourQuestionList.value = [];
  } else {
    questionSubmitList.value = [];
  }
  current.value = 0;
  init.value = true;
  bottom.value = false;
  loadDataList();
};
const toSubmitDetail = (questionSubmitId: number) => {
  if (selfInfo.id) {
    if (
      selfInfo.id !== props.userId.toString() &&
      selfInfo.userRole !== PERMISSIONS_ENUM.ADMIN
    ) {
      Message.error("您没有权限查看该提交记录！");
      return;
    }
    router.push({ path: `/question/submit/${questionSubmitId}` });
  } else {
    Message.error("尚未登录！");
    router.push({ path: "/user/login" });
  }
};
const onFavourChange = async (questionId: number) => {
  await QuestionFavourControllerService.doQuestionFavourUsingGet(questionId);
  refreshData();
};
const refreshData = async () => {
  const resp = await fetchData(1, pageSize * current.value);
  if (resp.code === 0) {
    favourQuestionList.value = resp.data.records;
  }
};

const fillData = (dataList: []) => {
  if (tabKey.value === "favour") {
    favourQuestionList.value.push(...dataList);
  } else {
    questionSubmitList.value.push(...dataList);
  }
};

const loadDataList = async () => {
  const resp = await fetchData(current.value, pageSize);
  if (resp.code === 0) {
    if (init.value) {
      pages.value = resp.data.pages;
      init.value = false;
      fillData(resp.data.records);
      bottom.value = ++current.value > pages.value;
    } else {
      if (current.value <= pages.value) {
        current.value++;
        fillData(resp.data.records);
      } else {
        bottom.value = true;
      }
    }
  }
};
const fetchData = async (
  currentParams: number,
  pageSizeParams: number
): Promise<{
  code: number;
  data: any;
  message: string;
}> => {
  let resp;
  if (tabKey.value === "favour") {
    resp =
      await QuestionFavourControllerService.listFavourQuestionByPageUsingPost({
        current: currentParams,
        pageSize: pageSizeParams,
        userId: props.userId,
      });
  } else {
    resp =
      await QuestionSubmitControllerService.listUserQuestionSubmitByPageUsingPost(
        {
          current: currentParams,
          pageSize: pageSizeParams,
          userId: props.userId,
        }
      );
  }
  return resp;
};
const getUserInfo = async () => {
  const resp = await UserControllerService.getUserVoByIdUsingGet(props.userId);
  if (resp.code === 0) {
    userInfo.value = { ...resp.data };
  }
};
onMounted(() => {
  getUserInfo();
});
</script>

<style scoped></style>
