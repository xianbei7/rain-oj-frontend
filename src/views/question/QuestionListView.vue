<template>
  <a-input-group>
    <a-select
      style="width: 250px"
      size="large"
      placeholder="难度"
      :options="['简单', '中等', '困难']"
      v-model="searchParams.difficulty"
      allow-clear
    />
    <a-select
      style="min-width: 360px}"
      size="large"
      placeholder="标签"
      multiple
      :scrollbar="true"
      allow-search
      :options="tags"
      v-model="searchParams.tags"
    />
    <a-input-search
      style="min-width: 120px"
      size="large"
      placeholder="搜索题目、编号、内容"
      search-button
      v-model="searchParams.searchText"
      @search="doSearch"
    />
  </a-input-group>
  <a-divider />
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
    <template #title="{ record }">
      <a-link :href="`/question/view/${record.id}`" icon
        >{{ record.title }}
      </a-link>
    </template>

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
    <template #acceptedRate="{ record }">
      {{ `${record.acceptedRate}%(${record.acceptedNum}/${record.submitNum})` }}
    </template>
    <template #createTime="{ record }">
      {{ moment(record.createTime).format("YY年M月D日H点") }}
    </template>
    <template #thumb="{ record }">
      <span class="userAction" key="thumb" @click="onThumbChange(record.id)">
        <span v-if="record.hasThumb">
          <IconThumbUpFill style="color: #4080ff" />
        </span>
        <span v-else>
          <IconThumbUp />
        </span>
      </span>
      {{ record.thumbNum }}
    </template>
    <template #favour="{ record }">
      <span class="userAction" key="favour" @click="onFavourChange(record.id)">
        <span v-if="record.hasFavour">
          <IconStarFill style="color: #ffb400" />
        </span>
        <span v-else>
          <IconStar />
        </span>
      </span>
      {{ record.favourNum }}
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  QuestionControllerService,
  QuestionFavourControllerService,
  QuestionThumbControllerService,
  QuestionVO,
} from "../../../generated";
import { Message } from "@arco-design/web-vue";
import { TableData } from "@arco-design/web-vue/es/table/interface";
import DifficultyTag from "@/components/DifficultyTag";
import moment from "moment";

const tableRef = ref();
const data = ref([]);
const tags = ref([]);
const total = ref(0);
const searchParams = ref({
  difficulty: "",
  tags: [],
  searchText: "",
  pageSize: 10,
  current: 1,
  sortField: "",
  sortOrder: "",
});
const columns = [
  {
    title: "题号",
    align: "center",
    dataIndex: "number",
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
  },
  {
    title: "标题",
    align: "center",
    slotName: "title",
  },
  {
    title: "难度",
    align: "center",
    slotName: "difficulty",
    dataIndex: "difficulty",
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
    title: "通过率",
    align: "center",
    slotName: "acceptedRate",
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
    title: "点赞",
    align: "center",
    dataIndex: "thumbNum",
    slotName: "thumb",
    sortable: {
      sortDirections: ["descend"],
    },
  },
  {
    title: "收藏",
    align: "center",
    dataIndex: "favourNum",
    slotName: "favour",
    sortable: {
      sortDirections: ["descend"],
    },
  },
];
const onThumbChange = async (questionId: number) => {
  await QuestionThumbControllerService.doThumbUsingGet(questionId);
  loadData();
};
const onFavourChange = async (questionId: number) => {
  await QuestionFavourControllerService.doQuestionFavourUsingGet(questionId);
  loadData();
};
const doSearch = () => {
  searchParams.value = {
    ...searchParams.value,
    current: 1,
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
const handleSortChange = (dataIndex: string, direction: string) => {
  searchParams.value = {
    ...searchParams.value,
    sortField: dataIndex,
    sortOrder: direction,
  };
  console.log(searchParams.value);
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
const loadData = async () => {
  const resp = await QuestionControllerService.listQuestionVoByPageUsingPost(
    searchParams.value
  );
  if (resp.code === 0) {
    data.value = resp.data.records.map((record: QuestionVO) => {
      return {
        ...record,
        acceptedRate: (
          (record.submitNum
            ? (record.acceptedNum as number) / record.submitNum
            : 0) * 100
        ).toFixed(2),
      };
    });
    total.value = resp.data.total;
  } else {
    Message.error(`加载失败，${resp.message}`);
  }
};
const loadTags = async () => {
  const resp = await QuestionControllerService.getQuestionTagsUsingGet();
  if (resp.code === 0) {
    tags.value = resp.data;
  } else {
    Message.error(`加载失败，${resp.message}`);
  }
};

watchEffect(() => {
  loadData();
});
onMounted(() => {
  loadData();
  loadTags();
});
</script>
<style>
.userAction {
  display: inline-block;
  padding: 0 4px;
  color: var(--color-text-1);
  line-height: 24px;
  background: transparent;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.1s ease;
}

.userAction:hover {
  background: var(--color-fill-3);
}
</style>
