<template>
  <a-space>
    <a-input-group>
      <a-select
        style="width: 100px"
        size="large"
        placeholder="难度"
        :options="['简单', '中等', '困难']"
        v-model="searchParams.difficulty"
        @change="doDifficultyChange"
        allow-clear
      />
      <a-select
        style="width: 150px"
        size="large"
        placeholder="编程语言"
        :options="['java', 'c', 'cpp', 'python']"
        v-model="searchParams.language"
        @change="doLanguageChange"
        allow-clear
      />
      <a-select
        style="width: 150px"
        size="large"
        placeholder="提交状态"
        :options="['等待判题中', '判题中', '通过', '失败']"
        v-model="searchParams.status"
        @change="doStatusChange"
        allow-clear
      />
      <a-input
        style="width: 164px"
        size="large"
        placeholder="题目标题或编号"
        search-button
        v-model="searchParams.questionSearchText"
      />
      <a-input-search
        style="width: 200px"
        size="large"
        placeholder="用户名或学号"
        search-button
        v-model="searchParams.userSearchText"
        @search="doSearch"
      />
    </a-input-group>
    <a-button
      size="large"
      type="primary"
      shape="circle"
      @click="refreshSearchParams"
    >
      <template #icon>
        <icon-refresh />
      </template>
    </a-button>
  </a-space>
  <a-divider />
  <a-table
    :columns="columns"
    :data="dataList"
    :pagination="{
      showTotal: true,
      showPageSize: true,
      pageSizeOptions: [5, 10, 20],
      simple: true,
      pageSize: searchParams.pageSize,
      current: searchParams.current,
      total: total,
    }"
    @page-change="doPageChange"
    @page-size-change="doPageSizeChange"
  >
    <template #question="{ record }">
      <a-link :href="`/question/view/${record.questionId}`" target="_blank">
        {{ `${record.questionNumber}-${record.questionTitle}` }}
      </a-link>
    </template>
    <template #questionDifficulty="{ record }">
      <difficulty-tag :difficulty="record.questionDifficulty" />
    </template>
    <template #createTime="{ record }">
      {{ moment(record.createTime).format("YY年M月D日H点m分") }}
    </template>
    <template #status="{ record }">
      <status-detail
        :key="`${record.status}-${record.judgeResult.type}`"
        :status="record.status"
        :type="record.judgeResult.type"
      />
    </template>
    <template #user="{ record }">
      <a-space style="cursor: pointer" @click="toUserInfo(record.userVO.id)">
        <div>
          {{ `${record.userVO.userNumber}-${record.userVO.userName}` }}
        </div>
        <a-avatar :size="35" style="background-color: #4080ff">
          <img
            v-if="record.userVO.userAvatar"
            src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp"
          />
          <span v-else>{{ record.userVO.userName }}</span>
        </a-avatar>
      </a-space>
    </template>
    <template #details="{ record }">
      <a-button
        type="primary"
        @click="toSubmitDetail(record.id, record.userVO.id)"
      >
        提交记录详情
      </a-button>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import {
  QuestionSubmitControllerService,
  QuestionSubmitVO,
} from "../../../generated";
import { ref, onMounted, watchEffect } from "vue";
import { Message } from "@arco-design/web-vue";
import { useUserInfo } from "@/store/UserInfo";
import { useRouter } from "vue-router";
import PERMISSIONS_ENUM from "@/permissions/permissionsEnum";
import StatusDetail from "@/components/StatusDetail";
import DifficultyTag from "@/components/DifficultyTag";
import moment from "moment";

const router = useRouter();
const userInfo = useUserInfo();
const dataList = ref([]);
const total = ref(0);

const searchParams = ref({
  difficulty: "",
  language: "",
  status: "",
  userSearchText: "",
  questionSearchText: "",
  pageSize: 10,
  current: 1,
});
const columns = [
  {
    title: "题目",
    align: "center",
    slotName: "question",
  },
  {
    title: "题目难度",
    align: "center",
    slotName: "questionDifficulty",
  },
  {
    title: "编程语言",
    align: "center",
    dataIndex: "language",
  },
  {
    title: "提交状态",
    align: "center",
    slotName: "status",
  },
  {
    title: "提交时间",
    align: "center",
    slotName: "createTime",
  },
  {
    title: "提交用户",
    align: "center",
    slotName: "user",
  },
  {
    align: "center",
    slotName: "details",
  },
];
// 搜索相关
const doSearch = () => {
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
};
const refreshSearchParams = () => {
  loadData();
};
const doDifficultyChange = (difficulty: string) => {
  searchParams.value = {
    ...searchParams.value,
    difficulty: difficulty,
  };
};
const doLanguageChange = (language: string) => {
  searchParams.value = {
    ...searchParams.value,
    language: language,
  };
};
const doStatusChange = (status: string) => {
  searchParams.value = {
    ...searchParams.value,
    status: status,
  };
};
const doPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};
const doPageSizeChange = (size: number) => {
  searchParams.value = {
    ...searchParams.value,
    pageSize: size,
  };
};
const toSubmitDetail = (questionSubmitId: string, userId: string) => {
  if (userInfo.id) {
    if (
      userInfo.id !== userId &&
      userInfo.userRole !== PERMISSIONS_ENUM.ADMIN
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
const toUserInfo = (userId: string) => {
  if (userInfo.id) {
    router.push({ path: `/user/info/${userId}` });
  } else {
    Message.error("尚未登录！");
    router.push({ path: "/user/login" });
  }
};
const loadData = async () => {
  const res =
    await QuestionSubmitControllerService.listDetailedQuestionSubmitByPageUsingPost(
      searchParams.value
    );
  if (res.code === 0) {
    dataList.value = res.data.records.map((record: QuestionSubmitVO) => {
      return { ...record, key: record.id };
    });
    total.value = res.data.total;
  } else {
    Message.error("加载失败，" + res.message);
  }
};

watchEffect(() => {
  loadData();
});
onMounted(() => {
  loadData();
});
</script>

<style scoped></style>
