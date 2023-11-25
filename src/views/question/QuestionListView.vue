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
      simple: true,
      pageSize: searchParams.pageSize,
      current: searchParams.current,
      total: total,
    }"
    @page-change="doPageChange"
    @page-size-change="doPageSizeChange"
  >
    <template #title="{ record }">
      <a-link :href="`/question/view/${record.id}`" icon
        >{{ record.title }}
      </a-link>
    </template>

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
    <template #acceptedRate="{ record }">
      {{ `${record.acceptedRate}%(${record.acceptedNum}/${record.submitNum})` }}
    </template>
    <template #createTime="{ record }">
      {{ record.createTime }}
    </template>
    <template #hasThumb="{ record }">
      <span class="userAction" key="thumb" @click="onThumbChange(record.id)">
        <span v-if="record.hasThumb">
          <IconThumbUpFill style="color: #4080ff" />
        </span>
        <span v-else>
          <IconThumbUp />
        </span>
      </span>
    </template>
    <template #hasFavour="{ record }">
      <span class="userAction" key="favour" @click="onFavourChange(record.id)">
        <span v-if="record.hasFavour">
          <IconStarFill style="color: #ffb400" />
        </span>
        <span v-else>
          <IconStar />
        </span>
      </span>
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
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
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
    title: "通过率",
    align: "center",
    dataIndex: "acceptedRate",
    slotName: "acceptedRate",
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
  },
  {
    title: "创建时间",
    align: "center",
    slotName: "createTime",
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
  },
  {
    title: "点赞",
    align: "center",
    slotName: "hasThumb",
  },
  {
    title: "收藏",
    align: "center",
    slotName: "hasFavour",
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
const showColor = (difficulty: string) => {
  if (difficulty === "简单") {
    return "green";
  } else if (difficulty === "中等") {
    return "orange";
  } else if (difficulty === "困难") {
    return "red";
  }
};
const doSearch = () => {
  searchParams.value = {
    ...searchParams.value,
    current: 1,
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
