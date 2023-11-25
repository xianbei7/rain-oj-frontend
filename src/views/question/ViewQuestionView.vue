<template>
  <div id="viewQuestionView">
    <a-row :gutter="[24, 24]">
      <a-col :md="12" :xs="24">
        <a-tabs default-active-key="question">
          <a-tab-pane key="question" title="题目">
            <a-card v-if="question" :title="question.title">
              <a-descriptions
                title="判题条件"
                :column="{ xs: 1, md: 2, lg: 3 }"
              >
                <a-descriptions-item label="时间限制">
                  {{ question.judgeConfig.timeLimit ?? 0 }}
                </a-descriptions-item>
                <a-descriptions-item label="内存限制">
                  {{ question.judgeConfig.memoryLimit ?? 0 }}
                </a-descriptions-item>
                <a-descriptions-item label="堆栈限制">
                  {{ question.judgeConfig.stackLimit ?? 0 }}
                </a-descriptions-item>
              </a-descriptions>
              <MdViewer :value="question.content || ''" />
              <template #extra>
                <a-space>
                  <span class="userAction" key="thumb" @click="onThumbChange">
                    <span v-if="question.hasThumb">
                      <IconThumbUpFill style="color: #4080ff" />
                    </span>
                    <span v-else>
                      <IconThumbUp />
                    </span>
                    {{ question.thumbNum }}
                  </span>
                  <span class="userAction" key="favour" @click="onFavourChange">
                    <span v-if="question.hasFavour">
                      <IconStarFill style="color: #ffb400" />
                    </span>
                    <span v-else>
                      <IconStar />
                    </span>
                    {{ question.favourNum }}
                  </span>
                  <a-space>
                    <a-tag
                      v-for="(tag, index) of question.tags"
                      :key="index"
                      color="blue"
                      bordered
                      >{{ tag }}
                    </a-tag>
                  </a-space>
                </a-space>
              </template>
            </a-card>
          </a-tab-pane>
          <a-tab-pane key="comment" title="评论" disabled> 评论区</a-tab-pane>
          <a-tab-pane key="answer" title="答案"> 暂时无法查看答案</a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :md="12" :xs="24">
        <a-form :model="form" layout="horizontal" auto-label-width="false">
          <a-form-item field="language" style="min-width: 240px">
            <a-select
              :style="{ width: '320px' }"
              placeholder="选择编程语言"
              :options="languages"
              v-model="form.language"
            >
            </a-select>
          </a-form-item>
          <a-form-item field="code">
            <CodeEditor
              style="width: 100%"
              :value="form.code as string"
              :language="form.language"
              :handle-change="changeCode"
            />
          </a-form-item>
          <a-form-item>
            <a-popconfirm
              content="确认是否提交？提交后不可修改"
              position="top"
              type="warning"
              @ok="doSubmit"
            >
              <a-button
                type="primary"
                shape="round"
                style="min-width: 200px; margin: 0 auto"
              >
                提交代码
              </a-button>
            </a-popconfirm>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, withDefaults, defineProps } from "vue";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
import MdViewer from "@/components/MdViewer.vue";
import {
  QuestionControllerService,
  QuestionFavourControllerService,
  QuestionSubmitAddRequest,
  QuestionSubmitControllerService,
  QuestionThumbControllerService,
  QuestionVO,
} from "../../../generated";
import { Message } from "@arco-design/web-vue";

interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});
const languages = ref([]);
const question = ref<QuestionVO>();

const loadData = async () => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as any
  );
  if (res.code === 0) {
    question.value = res.data;
  } else {
    message.error("加载失败，" + res.message);
  }
};

const form = ref<QuestionSubmitAddRequest>({
  language: "java",
  code: "",
});

const onThumbChange = async () => {
  await QuestionThumbControllerService.doThumbUsingGet(question.value?.id);
  loadData();
};
const onFavourChange = async () => {
  await QuestionFavourControllerService.doQuestionFavourUsingGet(
    question.value?.id
  );
  loadData();
};

const doSubmit = async () => {
  if (!question.value?.id) {
    return;
  }

  const res = await QuestionSubmitControllerService.doQuestionSubmitUsingPost({
    ...form.value,
    questionId: question.value.id,
  });
  if (res.code === 0) {
    message.success("提交成功");
  } else {
    message.error("提交失败," + res.message);
  }
};
const loadLanguages = async () => {
  const resp =
    await QuestionSubmitControllerService.getQuestionSubmitLanguagesUsingGet();
  if (resp.code === 0) {
    languages.value = resp.data;
  } else {
    Message.error(`加载失败，${resp.message}`);
  }
};
onMounted(() => {
  loadData();
  loadLanguages();
});

const changeCode = (value: string) => {
  form.value.code = value;
};
</script>
<style scoped>
#viewQuestionView {
  max-width: 1400px;
  margin: 0 auto;
}

#viewQuestionView .arco-space-horizontal .arco-space-item {
  margin-bottom: 0 !important;
}
</style>
