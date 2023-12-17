<template>
  <div id="viewQuestionView">
    <a-resize-box
      :directions="['right']"
      style="min-width: 335px; width: 50vw"
      v-model:width="resizeBoxWidth"
    >
      <div class="leftPart">
        <a-card id="leftPartCard">
          <a-scrollbar
            style="height: calc(100vh - 100px); overflow: auto; padding: 0 20px"
          >
            <a-tabs
              v-model:activeKey="activeKey"
              default-active-key="question"
              style="max-width: 700px"
            >
              <a-tab-pane key="question" title="题目">
                <a-card v-if="question" :title="question.title">
                  <MdViewer :value="question.content || ''" />
                  <a-descriptions
                    style="margin-top: 20px"
                    size="small"
                    :column="{ xs: 1, md: 2, lg: 3 }"
                  >
                    <a-descriptions-item label="时间限制">
                      <a-tag>
                        {{ question.judgeConfig?.timeLimit ?? 0 }}ms
                      </a-tag>
                    </a-descriptions-item>
                    <a-descriptions-item label="内存限制">
                      <a-tag>
                        {{ question.judgeConfig?.memoryLimit ?? 0 }}KB
                      </a-tag>
                    </a-descriptions-item>
                    <a-descriptions-item label="堆栈限制">
                      <a-tag>
                        {{ question.judgeConfig?.stackLimit ?? 0 }}KB
                      </a-tag>
                    </a-descriptions-item>
                  </a-descriptions>
                  <template #extra>
                    <a-space>
                      <span
                        class="userAction"
                        key="thumb"
                        @click="onThumbChange"
                      >
                        <span v-if="question.hasThumb">
                          <IconThumbUpFill style="color: #4080ff" />
                        </span>
                        <span v-else>
                          <IconThumbUp />
                        </span>
                        {{ question.thumbNum }}
                      </span>
                      <span
                        class="userAction"
                        key="favour"
                        @click="onFavourChange"
                      >
                        <span v-if="question.hasFavour">
                          <IconStarFill style="color: #ffb400" />
                        </span>
                        <span v-else>
                          <IconStar />
                        </span>
                      </span>
                      {{ question.favourNum }}
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
              <a-tab-pane key="submit" title="提交记录">
                <QuestionSubmitRecords
                  ref="questionSubmitRecords"
                  :question-id="props.id"
                  @change:show-detail="showQuestionSubmitDetail"
                />
              </a-tab-pane>
              <a-tab-pane key="answer" title="题解" disabled>
                <!-- <ProblemSolve /> -->
              </a-tab-pane>
            </a-tabs>
          </a-scrollbar>
        </a-card>
      </div>
    </a-resize-box>
    <div class="rightPart" :style="{ width: codeWidth + 'px' }">
      <div class="code" v-if="!isDetailShow">
        <a-space direction="horizontal" style="margin-bottom: 10px">
          <a-popover title="温馨提示" position="top">
            <a-select
              v-model="form.language"
              style="width: 200px"
              placeholder="选择编程语言"
            >
              <a-option v-for="language in languages" :key="language">
                {{ language }}
              </a-option>
            </a-select>
            <template #content>
              编程语言切换后，会导致代码重置，请谨慎切换！
            </template>
          </a-popover>
          <a-popover position="bottom">
            <a-button type="text">
              <span class="tips-dots"></span>
              <span style="color: #999">{{ question?.type }}</span>
            </a-button>
            <template #content>
              <div class="tipsTitle">
                {{ question?.type }}
                <span>
                  <icon-check-circle-fill
                    :style="{
                      fontSize: '12px',
                      color: '#065ACC',
                    }"
                  />
                </span>
              </div>
              <div class="tipsDesc">
                请通过代码实现题目，过程中的输入输出处理方式请参考题目输入输出描述
              </div>
            </template>
          </a-popover>
        </a-space>
        <CodeEditor
          :value="form.code as string"
          :language="form.language"
          :question-id="props.id"
          :handle-change="changeCode"
          :code-template="codeTemplate"
          id="codeEditor"
        />
        <a-resize-box
          :directions="['top']"
          :style="{ minHeight: minHeight + 'px', maxHeight: maxHeight + 'px' }"
          v-model:height="resizeBoxHeight"
        >
          <CodeCollapsePanels
            :result-data="resultData"
            :do-submit="doSubmit"
            :waiting="waiting"
            :do-run="doRun"
            :resize-box-height="resizeBoxHeight"
            :max-resize-box-height="maxHeight"
            @update:height="(height) => (resizeBoxHeight = height)"
            ref="controlRef"
          />
        </a-resize-box>
      </div>
      <RecordDetail
        :question-submit-detail="questionSubmitDetail"
        :close-record="closeRecord"
        v-if="isDetailShow"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref, watch, watchEffect } from "vue";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
import MdViewer from "@/components/MdViewer.vue";
import {
  DoQuestionVO,
  QuestionControllerService,
  QuestionFavourControllerService,
  QuestionSubmitAddRequest,
  QuestionSubmitControllerService,
  QuestionTemplateControllerService,
  QuestionThumbControllerService,
  ViewQuestionSubmitVO,
} from "../../../generated";
import { Message } from "@arco-design/web-vue";
import CodeCollapsePanels from "@/components/viewQuestion/CodeCollapsePanels.vue";
import QuestionSubmitRecords from "@/components/viewQuestion/QuestionSubmitRecords.vue";
import RecordDetail from "@/components/viewQuestion/RecordDetail.vue";

interface Props {
  id: number;
}

interface RunContent {
  input: string;
  runMode: number;
  activeKey: string;
}

const props = defineProps<Props>();
const codeTemplate = ref<string>("");
const questionSubmitRecords = ref<any>();
const languages = ref([]);
const isDetailShow = ref(false);
const waiting = ref(false);
const resizeBoxWidth = ref(750);
const codeWidth = ref(0);
const resizeBoxHeight = ref(30);
const minHeight = ref(30);
const maxHeight = ref(800);
const activeKey = ref("question");
const question = ref<DoQuestionVO>();
const questionSubmitDetail = ref<ViewQuestionSubmitVO>();
const resultData = ref({
  result: "",
  message: "",
  time: 0,
  memory: 0,
});
const form = ref<QuestionSubmitAddRequest>({
  language: "java",
  code: "",
});
watchEffect(() => {
  codeWidth.value = window.innerWidth - resizeBoxWidth.value - 70;
  maxHeight.value = window.innerHeight - 180;
});
watch(
  () => form.value.language,
  () => {
    loadCodeTemplate();
  }
);
const closeRecord = () => {
  isDetailShow.value = false;
};
const showQuestionSubmitDetail = (record: ViewQuestionSubmitVO) => {
  questionSubmitDetail.value = record;
  isDetailShow.value = true;
};
const loadQuestionData = async () => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id
  );
  if (res.code === 0) {
    question.value = res.data;
  } else {
    message.error("加载失败，" + res.message);
  }
};

const onThumbChange = async () => {
  await QuestionThumbControllerService.doThumbUsingGet(question.value?.id);
  loadQuestionData();
};
const onFavourChange = async () => {
  await QuestionFavourControllerService.doQuestionFavourUsingGet(
    question.value?.id
  );
  loadQuestionData();
};

const doSubmit = async () => {
  if (!question.value?.id) {
    return;
  }
  waiting.value = true;
  const res = await QuestionSubmitControllerService.doQuestionSubmitUsingPost({
    ...form.value,
    questionId: question.value.id,
  });
  if (res.code === 0) {
    Message.success("提交成功");
    resultData.value = res.data;
    activeKey.value = "submit";
    questionSubmitRecords.value.loadData();
  } else {
    Message.error("提交失败" + res.message);
    resultData.value = res.data;
  }
  waiting.value = false;
};
const doRun = async (runContent: RunContent) => {
  /*let runMode = 0;
  const result = computed(() => runContent.input.replace(/\n/g, ","));
  runInputList.value = result.value.split(",");
  if (!question.value?.id) {
    return;
  }
  if (!result.value) {
    Message.warning("请输入测试用例");
    return;
  }
  controlRef.value!.isShow = true;
  runContent.activeKey = "2";
  waiting.value = true;
  if (codeMode.value === "1") {
    runMode = runContent.runMode;
  } else {
    runMode = 4;
  }
  const res = await QuestionControllerService.doQuestionSubmitUsingPost({
    ...form.value,
    questionId: question.value.id,
    model: runMode,
    inputList: runInputList.value,
  });
  if (res.code === 0) {
    resultData.value = res.data;
  } else {
    Message.error("运行失败: " + res.message);
    resultData.value = res.data;
  }*/
  waiting.value = false;
};
const changeCode = (value: string) => {
  form.value.code = value;
};
const loadCodeTemplate = async () => {
  const resp =
    await QuestionTemplateControllerService.getQuestionTemplateUsingGet(
      form.value.language,
      props.id as never
    );
  if (resp.code === 0) {
    codeTemplate.value = resp.data;
  } else {
    Message.error(`加载失败，${resp.message}`);
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
window.addEventListener("resize", () => {
  // 窗口大小改变时,手动触发更新
  codeWidth.value = window.innerWidth - resizeBoxWidth.value - 60;
  maxHeight.value = window.innerHeight - 180;
});
onMounted(() => {
  loadQuestionData();
  loadLanguages();
  loadCodeTemplate();
});
</script>
<style>
#viewQuestionView {
  width: 100%;
  display: flex;
  height: calc(90vh - 60px);
}

#viewQuestionView .arco-space-horizontal .arco-space-item {
  margin-bottom: 0 !important;
}

#viewQuestionView .leftPart {
  margin-right: 10px;
  flex: 1;
}

#viewQuestionView .rightPart {
  height: 100%;
  min-width: 335px;
  padding-left: 10px;
  flex: 1;
}

#codeEditor {
  flex: 1 1 0;
  overflow: hidden;
}

.code {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-bg-3);
  border-radius: 2px;
}

#leftPartCard {
  padding: 0;
}

.arco-collapse-item-header {
  padding-top: 4px;
  padding-bottom: 4px;
}

#CollapsePanels {
  width: 100%;
}

:deep(.arco-radio-label) {
  margin-right: 8px;
}

.descTangName {
  font-weight: 600;
  color: #005bb7;
  padding-left: 6px;
}

.recordTxt {
  font-weight: 600;
}

.runInfo {
  display: inline-block;
  margin: 0;
}

.tips-dots {
  background: #2ecc71;
  border-radius: 50%;
  display: block;
  height: 4px;
  left: 6px;
  margin-right: 4px;
  top: 9px;
  width: 4px;
}

.tipsTitle {
  align-items: center;
  color: var(--color-text-1);
  font-size: 12px;
  line-height: 8px;
  font-weight: 400;
}

.tipsDesc {
  color: var(--color-text-3);
  font-size: 12px;
  line-height: 21px;
  margin-top: 4px;
}
</style>
