<template>
  <div id="questionSubmitRecords">
    <a-table
      :columns="columns"
      :data="dataList"
      :pagination="false"
      @cell-click="
        (record) => {
          emit('change:showDetail', record);
        }
      "
    >
      <template #status="{ record }">
        <status-detail
          :key="`${record.status}-${record.judgeResult.type}`"
          :status="record.status"
          :type="record.judgeResult.type"
        />
      </template>
      <template #correctRate="{ record }">
        {{ `${record.judgeResult.correctRate | 0}%` }}
      </template>

      <template #language="{ record }">
        <a-tag bordered>{{ record.language }}</a-tag>
      </template>

      <template #executeTime="{ record }">
        <a-statistic
          :value="record.executeTime"
          :value-style="{ fontSize: 'small' }"
        >
          <template #prefix>
            <icon-clock-circle />
          </template>
          <template #suffix>ms</template>
        </a-statistic>
      </template>

      <template #executeMemory="{ record }">
        <a-statistic
          :value="record.executeTime"
          :value-style="{ fontSize: 'small' }"
        >
          <template #prefix>
            <svg
              viewBox="0 0 1024 1024"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor"
              class="arco-icon"
              stroke-width="4"
              stroke-linecap="butt"
              stroke-linejoin="miter"
            >
              <path
                d="M1002.917647 370.447059v-60.235294h-150.588235v-120.470589h-120.470588v-150.588235h-60.235295v150.588235h-60.235294v-150.588235h-60.235294v150.588235h-60.235294v-150.588235h-60.235294v150.588235h-60.235294v-150.588235h-60.235294v150.588235h-120.470589v120.470589h-150.588235v60.235294h150.588235v60.235294h-150.588235v60.235294h150.588235v60.235294h-150.588235v60.235294h150.588235v60.235294h-150.588235v60.235295h150.588235v120.470588h120.470589v150.588235h60.235294v-150.588235h60.235294v150.588235h60.235294v-150.588235h60.235294v150.588235h60.235294v-150.588235h60.235294v150.588235h60.235295v-150.588235h120.470588v-120.470588h150.588235v-60.235295h-150.588235v-60.235294h150.588235v-60.235294h-150.588235v-60.235294h150.588235v-60.235294h-150.588235v-60.235294h150.588235z m-210.823529 421.647059h-542.117647v-542.117647h542.117647v542.117647z"
                fill="#2c2c2c"
              ></path>
              <path
                d="M701.741176 340.329412h-361.411764v361.411764h361.411764v-361.411764z m-60.235294 301.17647h-240.941176v-240.941176h240.941176v240.941176z"
                fill="#2c2c2c"
              ></path>
            </svg>
          </template>
          <template #suffix>kb</template>
        </a-statistic>
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YY年M月D日H点m分") }}
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, defineExpose, h, onMounted, ref } from "vue";
import { Button, Message } from "@arco-design/web-vue";
import { IconRefresh } from "@arco-design/web-vue/es/icon";
import moment from "moment";
import {
  QuestionSubmitControllerService,
  ViewQuestionSubmitVO,
} from "../../../generated";
import StatusDetail from "@/components/StatusDetail";

interface Props {
  questionId: number;
  userId?: number;
}

const props = defineProps<Props>();
// 当点击后右边弹出代码页面运行的详细信息，
const emit = defineEmits(["change:showDetail"]);
const dataList = ref();
const columns = [
  {
    title: () => createRefreshButton(),
    align: "center",
    slotName: "status",
  },
  {
    title: "正确率",
    align: "center",
    slotName: "correctRate",
  },
  {
    title: "语言",
    align: "center",
    slotName: "language",
  },
  {
    title: "执行用时",
    align: "center",
    slotName: "executeTime",
  },
  {
    title: "消耗内存",
    align: "center",
    slotName: "executeMemory",
  },
  {
    title: "提交时间",
    align: "center",
    slotName: "createTime",
  },
];
const createRefreshButton = () => {
  return h(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
      },
    },
    [
      h("span", "状态"),
      h(
        Button,
        {
          size: "mini",
          shape: "circle",
          onClick: () => loadData(),
        },
        [h(IconRefresh, { slot: "icon" })]
      ),
    ]
  );
};

const loadData = async () => {
  const resp =
    await QuestionSubmitControllerService.listMyQuestionSubmitByIdUsingGet(
      props.questionId,
      props.userId
    );
  if (resp.code === 0) {
    dataList.value = resp.data?.map((record: ViewQuestionSubmitVO) => {
      return { ...record, key: record.id };
    });
  } else {
    Message.error(`加载失败，${resp.message}`);
  }
};
defineExpose({ loadData });
onMounted(() => {
  loadData();
});
</script>

<style>
#questionSubmitRecords tbody .arco-table-tr {
  cursor: pointer;
}
</style>
