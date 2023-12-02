<template>
  <div id="viewQuestionView">
    <a-resize-box
      :directions="['right']"
      style="min-width: 335px; width: 50vw"
      v-model:width="resizeBoxWidth"
    >
      <div id="leftPart">
        <a-spin dot :loading="isLoad" style="width: 100%">
          <a-card>
            <a-scrollbar style="height: calc(100vh - 100px); overflow: auto">
              <a-tabs
                v-model:activeKey="activeKey"
                default-active-key="question"
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
                <a-tab-pane key="comment" title="评论" disabled
                  >评论区
                </a-tab-pane>
                <a-tab-pane key="answer" title="题解">
                  <!-- <ProblemSolve /> -->
                </a-tab-pane>
                <a-tab-pane key="submit" title="提交记录"></a-tab-pane>
              </a-tabs>
            </a-scrollbar>
          </a-card>
        </a-spin>
      </div>
    </a-resize-box>
    <div id="rightPart" :style="{ width: codeWidth + 'px' }">
      <div class="code" v-if="!isRecordShow">
        <a-form :model="form" layout="inline" auto-label-width="false">
          <a-form-item
            field="language"
            style="min-width: 240px; padding-left: 16px"
          >
            <a-popover title="温馨提示" position="right">
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
                编程语言修改会导致内容清空，请谨慎切换！
              </template>
            </a-popover>
          </a-form-item>
        </a-form>
        <CodeEditor
          :value="form.code as string"
          :language="form.language"
          :question-id="props.id"
          :handle-change="changeCode"
          :code-template="codeTemplate"
          id="codeEditor"
        />
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
        <!--        <a-resize-box
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
                    ref="controlRef"
                  />
                </a-resize-box>-->
      </div>
      <!--      <RecordDetail
              :record-content="recordData"
              :close-record="closeRecord"
              v-if="isRecordShow"
            />-->
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  onMounted,
  ref,
  withDefaults,
  defineProps,
  watchEffect,
  watch,
} from "vue";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
import MdViewer from "@/components/MdViewer.vue";
import {
  QuestionControllerService,
  QuestionFavourControllerService,
  QuestionSubmitAddRequest,
  QuestionSubmitControllerService,
  QuestionTemplateControllerService,
  QuestionThumbControllerService,
  QuestionVO,
} from "../../../generated";
import { Message } from "@arco-design/web-vue";
import CodeCollapsePanels from "@/components/CodeCollapsePanels.vue";

interface Props {
  id: string;
}

interface RunContent {
  input: string;
  runMode: number;
  activeKey: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});
const codeTemplate = ref<string>("");
const languages = ref([]);
const isLoad = ref(false);
const isRecordShow = ref(false);
const waiting = ref(false);
const resizeBoxWidth = ref(600);
const codeWidth = ref(0);
const resizeBoxHeight = ref(55);
const minHeight = ref(55);
const maxHeight = ref(800);
const activeKey = ref("question");
const question = ref<QuestionVO>();
const resultData = ref({
  result: "",
  message: "",
  time: 0,
  memory: 0,
});
const form = ref<QuestionSubmitAddRequest>({
  language: "",
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
/*const recordDetail = (rowData: any) => {
  recordData.value = rowData;
  isRecordShow.value = true;
};*/

const closeRecord = () => {
  isRecordShow.value = false;
};
const loadQuestionData = async () => {
  if (activeKey.value !== "question") {
    return;
  }
  isLoad.value = true;
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as any
  );
  if (res.code === 0) {
    question.value = res.data;
  } else {
    Message.error("加载失败" + res.message);
  }
  isLoad.value = false;
};
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
  waiting.value = true;
  const res = await QuestionSubmitControllerService.doQuestionSubmitUsingPost({
    ...form.value,
    questionId: question.value.id,
  });
  if (res.code === 0) {
    Message.success("提交成功");
    resultData.value = res.data;
    if (activeKey.value === "submit") {
      // await loadSubmitData();
    }
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
      props.id as any
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
  loadData();
  loadLanguages();
  loadCodeTemplate();
});
</script>
<style scoped>
#viewQuestionView {
  width: 100%;
  display: flex;
}

#viewQuestionView .arco-space-horizontal .arco-space-item {
  margin-bottom: 0 !important;
}

#description {
  margin-right: 10px;
}

#leftPart {
  margin-right: 10px;
  flex: 1;
}

#rightPart {
  height: calc(100vh - 70px);
  min-width: 335px;
  padding-left: 10px;
  flex: 1;
  /* width: 50vw; */
}

#codeEditor {
  flex: 1 1 0%;
  overflow: hidden;
}

.code {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-bg-3);
  border-radius: 2px;
}

.arco-collapse-item-header {
  padding-top: 4px;
  padding-bottom: 4px;
}

#CollapsePanels {
  width: 100%;
}

:deep(#CollapsePanels .arco-card-size-medium .arco-card-body) {
  padding: 0;
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

.selectForm {
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
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

.setting {
  padding: 5px;
  cursor: pointer;
}

.setting:hover {
  background-color: #000a200d;
}

.settingIcon {
  font-size: 16px;
  color: var(--color-text-1);
}
</style>
