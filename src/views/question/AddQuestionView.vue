<template>
  <div id="addQuestionView">
    <a-scrollbar
      style="height: 80vh; max-width: 850px; margin: 0 auto; overflow: auto"
    >
      <a-card style="">
        <template #title>
          <div style="text-align: center">
            <h2>{{ word }}题目</h2>
          </div>
        </template>
        <a-form :model="form" label-align="left" @submit="handleSubmit">
          <a-form-item
            field="title"
            label="标题"
            :rules="[{ required: true, message: '标题不能空' }]"
            :validate-trigger="('focus', 'blur')"
          >
            <a-input
              class="input-item"
              size="large"
              v-model="form.title"
              placeholder="请输入标题"
            />
          </a-form-item>
          <a-form-item
            field="number"
            label="编号"
            :rules="[
              { required: true, message: '编号不能空' },
              { min: 0, message: '编号最小为0' },
              { max: 10000, message: '编号最大为10000' },
            ]"
            :validate-trigger="('focus', 'blur', 'change', 'input')"
          >
            <a-input-number
              class="input-item"
              size="large"
              v-model="form.number"
              placeholder="请输入题目编号(0-10000)"
              mode="button"
              min="0"
              max="10000"
            />
          </a-form-item>
          <a-form-item
            field="type"
            label="类型"
            tooltip="ACM模式是指需要做题者自行接收输入。核心代码是指做题者只需学出核心代码即可。"
            :rules="[{ required: true, message: '类型不能空' }]"
            :validate-trigger="('focus', 'blur')"
          >
            <a-select
              class="input-item"
              size="large"
              placeholder="请选择类型"
              :options="['ACM模式', '核心代码模式', 'SQL']"
              v-model="form.type"
            />
          </a-form-item>
          <a-form-item
            field="difficulty"
            label="难度"
            :rules="[{ required: true, message: '难度不能空' }]"
            :validate-trigger="('focus', 'blur')"
          >
            <a-select
              class="input-item"
              size="large"
              placeholder="请选择难度"
              :options="['简单', '中等', '困难']"
              v-model="form.difficulty"
            />
          </a-form-item>
          <a-form-item field="tags" label="标签">
            <a-select
              size="large"
              placeholder="请选择标签"
              multiple
              :scrollbar="true"
              allow-search
              :options="tags"
              v-model="form.tags"
            />
          </a-form-item>
          <a-form-item
            label="判题信息配置"
            align="center"
            :content-flex="false"
            :merge-props="false"
          >
            <a-space direction="vertical" style="min-width: 400px">
              <a-form-item
                field="judgeConfig.timeLimit"
                label="时间限制"
                :rules="[{ required: true, message: '时间限制不能空' }]"
                :validate-trigger="('focus', 'blur')"
              >
                <a-input-number
                  class="input-item-judge"
                  v-model="form.judgeConfig.timeLimit"
                  placeholder="请输入时间限制"
                  mode="button"
                  min="0"
                  size="large"
                />
              </a-form-item>
              <a-form-item
                field="judgeConfig.memoryLimit"
                label="内存限制"
                :rules="[{ required: true, message: '空间限制不能空' }]"
                :validate-trigger="('focus', 'blur')"
              >
                <a-input-number
                  class="input-item-judge"
                  v-model="form.judgeConfig.memoryLimit"
                  placeholder="请输入内存限制"
                  mode="button"
                  min="0"
                  size="large"
                />
              </a-form-item>
              <a-form-item
                field="judgeConfig.stackLimit"
                label="堆栈限制"
                :rules="[{ required: true, message: '堆栈限制不能空' }]"
                :validate-trigger="('focus', 'blur')"
              >
                <a-input-number
                  class="input-item-judge"
                  v-model="form.judgeConfig.stackLimit"
                  placeholder="请输入堆栈限制"
                  mode="button"
                  min="0"
                  size="large"
                />
              </a-form-item>
            </a-space>
          </a-form-item>
          <a-form-item
            label="判题用例配置"
            field="judgeCase"
            align="center"
            :content-flex="false"
            :merge-props="false"
            :rules="[{ validator: validateJudgeCase, required: true }]"
          >
            <JudgeConfig
              :judgeCase="form.judgeCase"
              :handle-delete="handleDelete"
            />
            <a-button @click="handleAdd" class="addTest">
              <icon-plus :style="{ fontSize: '16px', marginRight: '4px' }" />
              新增测试用例
            </a-button>
          </a-form-item>
          <a-form-item
            label="内容"
            field="content"
            style="margin-top: 20px"
            :rules="[{ required: true, message: '题目内容不能空' }]"
            :validate-trigger="('focus', 'blur')"
          >
            <MdEditor :value="form.content" :handle-change="onContentChange" />
          </a-form-item>
          <a-form-item
            label="答案"
            field="answer"
            :rules="[{ required: true, message: '题目答案不能空' }]"
            :validate-trigger="('focus', 'blur')"
          >
            <MdEditor :value="form.answer" :handle-change="onAnswerChange" />
          </a-form-item>
          <a-form-item>
            <a-button
              type="primary"
              shape="round"
              html-type="submit"
              style="min-width: 200px; margin: 0 auto"
              >提交
            </a-button>
          </a-form-item>
        </a-form>
      </a-card>
    </a-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import MdEditor from "@/components/MdEditor.vue";
import { QuestionControllerService } from "../../../generated";
import { Message } from "@arco-design/web-vue";
import { useRoute, useRouter } from "vue-router";
import { ValidatedError } from "@arco-design/web-vue/es/form/interface";
import JudgeConfig from "@/components/JudgeConfig.vue";

interface judgeCase {
  input: string;
  output: string;
}

const router = useRouter();
const route = useRoute();
const updatePage = route.path.includes("update");
const tags = ref([]);
const word = ref("");
let form = ref({
  title: "",
  number: 0,
  tags: [],
  type: "ACM模式",
  difficulty: "简单",
  content: "",
  answer: "",
  judgeConfig: {
    memoryLimit: 1000,
    stackLimit: 1000,
    timeLimit: 1000,
  },
  judgeCase: [
    {
      input: "",
      output: "",
    },
  ],
});
const loadTags = async () => {
  const resp = await QuestionControllerService.getQuestionTagsUsingGet();
  if (resp.code === 0) {
    tags.value = resp.data;
  } else {
    Message.error(`加载失败，${resp.message}`);
  }
};
const loadOldData = async () => {
  const id = route.query.id;
  if (!id) {
    return;
  }
  const resp = await QuestionControllerService.getQuestionByIdUsingGet(id);
  if (resp.code === 0) {
    form.value = resp.data as any;
    if (!form.value.judgeCase) {
      form.value.judgeCase = [
        {
          input: "",
          output: "",
        },
      ];
    } else {
      form.value.judgeCase = JSON.parse(form.value.judgeCase as any);
    }
    if (!form.value.judgeConfig) {
      form.value.judgeConfig = {
        memoryLimit: 1000,
        stackLimit: 1000,
        timeLimit: 1000,
      };
    } else {
      form.value.judgeConfig = JSON.parse(form.value.judgeConfig as any);
    }
    if (!form.value.tags) {
      form.value.tags = [];
    } else {
      form.value.tags = JSON.parse(form.value.tags as any);
    }
  } else {
    Message.error(`加载失败，${resp.message}`);
  }
};
const handleAdd = () => {
  if (form.value.judgeCase) {
    form.value.judgeCase.push({
      input: "",
      output: "",
    });
  }
};
const handleDelete = (record: judgeCase) => {
  form.value.judgeCase.splice(record, 1);
};
const validateJudgeCase = (value: any, callback: any) => {
  if (value.some((item: judgeCase) => !item.input || !item.output)) {
    callback("判题用例不能为空");
  } else {
    callback();
  }
};
const handleSubmit = async ({
  errors,
  values,
}: {
  errors: Record<string, ValidatedError> | undefined;
  values: Record<string, any>;
}) => {
  if (!errors) {
    let resp;
    if (updatePage) {
      resp = await QuestionControllerService.updateQuestionUsingPost(values);
    } else {
      resp = await QuestionControllerService.addQuestionUsingPost(values);
    }
    if (resp.code === 0) {
      Message.success(`${word.value}成功`);
      router.push({
        path: "/question/manage",
      });
    } else {
      Message.error(`${word.value}失败，${resp.message}`);
    }
  } else {
    Message.error("题目不完整，无法提交");
  }
};
const onContentChange = (value: string) => {
  form.value.content = value;
};
const onAnswerChange = (value: string) => {
  form.value.answer = value;
};
onMounted(() => {
  loadOldData();
  loadTags();
  word.value = updatePage ? "修改" : "新增";
});
</script>

<style>
#addQuestionView .input-item {
  max-width: 300px;
  margin: 0 auto;
}

#addQuestionView .input-item-judge {
  min-width: 300px;
  margin-left: 80px;
}

.addTest {
  width: 100%;
  color: var(--color-text-2);
  background-color: var(--color-fill-2);
  border: 2px dashed var(--color-neutral-3);
}

#addQuestionView .arco-select-view-multiple {
  max-width: 300px;
  margin: 0 auto;
}
</style>
