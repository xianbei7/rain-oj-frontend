<template>
  <a-table
    :ref="tableRef"
    :columns="columns"
    :data="data"
    :pagination="{
      showTotal: true,
      showPageSize: true,
      pageSize: searchParams.pageSize,
      current: searchParams.current,
      total: total,
    }"
    @page-change="doPageChange"
    @page-size-change="doPageSizeChange"
  >
    <template #difficulty="{ record }">
      <a-tag :color="showColor(record.difficulty)" bordered
        >{{ record.difficulty }}
      </a-tag>
    </template>

    <template #tags="{ record }">
      <a-tag
        v-for="(tag, index) of record.tags"
        :key="index"
        color="blue"
        bordered
        style="margin: 0 2px"
        >{{ tag }}
      </a-tag>
    </template>
    <template #optional="{ record }">
      <a-space>
        <a-button type="primary" @click="doUpdate(record)">修改</a-button>
        <a-popconfirm
          content="确认是否删除？"
          position="tr"
          type="error"
          @ok="doDelete(record)"
        >
          <a-button status="danger">删除</a-button>
        </a-popconfirm>
      </a-space>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import { Question, QuestionControllerService } from "../../../generated";
import { Message, TableChangeExtra, TableData } from "@arco-design/web-vue";
import { useRouter } from "vue-router";

const router = useRouter();
const tableRef = ref();
const data = ref([]);
const total = ref(0);
const searchParams = ref({
  pageSize: 10,
  current: 1,
  sortField: "",
  sortOrder: "",
});
// 标签、难度去掉
const columns = [
  {
    title: "编号",
    dataIndex: "number",
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
  },
  {
    title: "标题",
    align: "center",
    dataIndex: "title",
  },
  {
    title: "难度",
    align: "center",
    slotName: "difficulty",
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
  },
  {
    title: "标签",
    align: "center",
    slotName: "tags",
  },
  {
    title: "提交数目",
    align: "center",
    dataIndex: "submitNum",
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
  },
  {
    title: "通过数目",
    align: "center",
    dataIndex: "acceptedNum",
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
  },
  {
    title: "点赞数",
    align: "center",
    dataIndex: "thumbNum",
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
  },
  {
    title: "收藏数",
    align: "center",
    dataIndex: "favourNum",
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
  },
  {
    title: "创建用户",
    align: "center",
    dataIndex: "userVO.userName",
  },
  {
    title: "创建时间",
    align: "center",
    dataIndex: "createTime",
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
  },
  {
    title: "操作",
    align: "center",
    slotName: "optional",
  },
];
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
const doDelete = async (question: Question) => {
  const resp = await QuestionControllerService.deleteQuestionUsingPost({
    id: question.id,
  });
  if (resp.code === 0) {
    Message.success("删除成功");
    loadData();
  } else {
    Message.error(`删除失败，${resp.message}`);
  }
};
const doUpdate = (question: Question) => {
  router.push({
    path: "/question/update",
    query: {
      id: question.id,
    },
  });
};
const loadData = async () => {
  const resp = await QuestionControllerService.listQuestionVoByPageUsingPost(
    searchParams.value
  );
  if (resp.code === 0) {
    data.value = resp.data.records;
    total.value = resp.data.total;
  } else {
    Message.error(`加载失败，${resp.message}`);
  }
};
const showColor = (difficulty: string) => {
  if (difficulty === "简单") {
    return "green";
  } else if (difficulty === "中等") {
    return "orange";
  } else if (difficulty === "困难") {
    return "red";
  }
};
watchEffect(() => {
  loadData();
});
onMounted(() => {
  loadData();
});
</script>
