<template>
  <a-table
    :ref="tableRef"
    :columns="columns"
    :data="data"
    :pagination="{
      showTotal: true,
      showPageSize: true,
      pageSizeOptions: [5, 10, 20],
      pageSize: searchParams.pageSize,
      current: searchParams.current,
      total: total,
      simple: true,
    }"
    @sorter-change="handleSortChange"
    @page-change="handlePageChange"
    @page-size-change="handlePageSizeChange"
  >
    <template #difficulty="{ record }">
      <difficulty-tag :key="record.id" :difficulty="record.difficulty" />
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
    <template #createTime="{ record }">
      {{ moment(record.createTime).format("YY年M月D日H点") }}
    </template>
    <template #optional="{ record }">
      <a-space>
        <a-button @click="doUpdate(record)">
          <icon-edit />
        </a-button>
        <a-popconfirm
          content="确认是否删除？"
          position="tr"
          type="error"
          @ok="doDelete(record)"
        >
          <a-button status="danger">
            <template #icon>
              <icon-delete />
            </template>
          </a-button>
        </a-popconfirm>
      </a-space>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import { Question, QuestionControllerService } from "../../../generated";
import { Message } from "@arco-design/web-vue";
import { useRouter } from "vue-router";
import DifficultyTag from "@/components/DifficultyTag";
import moment from "moment";
import { TableData } from "@arco-design/web-vue/es/table/interface";

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
    dataIndex: "difficulty",
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
    slotName: "createTime",
    sortable: {
      sortDirections: ["ascend", "descend"],
      sorter: (
        a: TableData,
        b: TableData,
        extra: { dataIndex: string; direction: "ascend" | "descend" }
      ) => dateSorter(a.createTime, b.createTime, extra.direction),
    },
  },
  {
    title: "操作",
    align: "center",
    slotName: "optional",
  },
];
const handleSortChange = (dataIndex: string, direction: string) => {
  searchParams.value = {
    ...searchParams.value,
    sortField: dataIndex,
    sortOrder: direction,
  };
};
const handlePageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};
const handlePageSizeChange = (size: number) => {
  searchParams.value = {
    ...searchParams.value,
    pageSize: size,
  };
};
const dateSorter = (
  a: string,
  b: string,
  direction: "ascend" | "descend"
): number => {
  const dateA = new Date(a);
  const dateB = new Date(b);
  if (direction === "ascend") {
    return dateA.getTime() - dateB.getTime();
  } else {
    return dateB.getTime() - dateA.getTime();
  }
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
watchEffect(() => {
  loadData();
});
onMounted(() => {
  loadData();
});
</script>
