<template>
  <div id="codeCollapsePanels">
    <a-card class="controlCard">
      <div
        class="container"
        v-show="isShow"
        :style="{ height: containerHeight + 'px' }"
      >
        <a-tabs size="mini" v-model:activeKey="runContent.activeKey">
          <a-tab-pane key="1" title="自测运行">
            <a-textarea
              v-model="runContent.input"
              class="testText"
              placeholder="请输入示例或自行输入测试用例"
              :style="{ height: textAreaHeight + 'px' }"
            />
          </a-tab-pane>
          <a-tab-pane key="2" title="执行结果">
            <a-scrollbar
              :style="{ height: containerHeight + 'px', overflow: 'auto' }"
            >
              <a-spin
                :loading="waiting"
                style="width: 100%"
                tip="运行中，请稍后..."
              >
                <div v-if="resultData && resultData.result">
                  <p
                    v-if="resultData.result === '成功'"
                    :style="{ color: 'green' }"
                    class="result"
                  >
                    {{ resultData.result }}
                  </p>
                  <p v-else :style="{ color: 'red' }" class="result">
                    {{ resultData.result }}
                  </p>
                  <span class="info">
                    执行用时：
                    <p class="info" v-if="resultData.time">
                      {{ resultData.time }}ms
                    </p>
                    <p class="info" v-else>N/A</p>
                  </span>
                  <span class="info">
                    消耗内存：
                    <p class="info" v-if="resultData.time">
                      {{ resultData.memory }}KB
                    </p>
                    <p class="info" v-else>N/A</p>
                  </span>
                  <div class="message">
                    <p class="label">message</p>
                    <div class="messageBox">{{ resultData.message }}</div>
                  </div>
                </div>
                <div v-else style="padding-top: 12px">
                  <p class="runText">
                    提交之后，这里将会显示运行结果,请先执行代码
                  </p>
                </div>
              </a-spin>
            </a-scrollbar>
          </a-tab-pane>
        </a-tabs>
      </div>
      <div class="title">
        <a-button @click="toggleShow" type="text" size="mini">
          控制台
          <span class="btn-icon">
            <icon-up
              :class="{ arrowTransform: isShow, arrowTransformReturn: !isShow }"
            />
          </span>
        </a-button>
        <div>
          <a-button size="mini" @click="doRun(runContent)" class="btn-run">
            <icon-play-arrow
              :style="{ marginRight: '2px', fontSize: '10px' }"
            />
            自测运行
          </a-button>
          <a-popconfirm
            content="确认是否提交？提交后不可修改"
            position="tr"
            type="warning"
            @ok="doSubmit"
          >
            <a-button type="primary" size="mini"> 提交</a-button>
          </a-popconfirm>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  toRefs,
  withDefaults,
  defineProps,
  defineExpose,
  defineEmits,
  onUnmounted,
} from "vue";

interface ResultData {
  result: string;
  message: string;
  time: number;
  memory: number;
}

interface RunContent {
  input: string;
  runMode: number;
  activeKey: string;
}

interface Props {
  waiting: boolean;
  resultData: ResultData;
  resizeBoxHeight: number;
  maxResizeBoxHeight: number;
  doSubmit: () => void;
  doRun: (runContent: RunContent) => void;
}

const emit = defineEmits(["update:height"]);

const props = withDefaults(defineProps<Props>(), {
  waiting: () => false,
});

const runContent = ref<RunContent>({
  input: "",
  runMode: 2,
  activeKey: "1",
});
const titleHeight = 50;
const containerHeight = ref(75);
const textAreaHeight = ref(40);
const tabsHeight = 35;
const showBoxMinHeight = 75;
const isShow = ref(false);
const resultData = computed(() => props.resultData);
const { resizeBoxHeight, maxResizeBoxHeight } = toRefs(props);

watch([resizeBoxHeight, maxResizeBoxHeight], () => {
  if (
    resizeBoxHeight.value > 145 &&
    resizeBoxHeight.value < maxResizeBoxHeight.value
  ) {
    containerHeight.value = resizeBoxHeight.value - 45;
  } else if (resizeBoxHeight.value < 145) {
    containerHeight.value = showBoxMinHeight;
  }
  textAreaHeight.value = containerHeight.value - tabsHeight;
});

// 计算属性获取 isShow
const isShowComputed = computed(() => {
  return resizeBoxHeight.value > titleHeight;
});

const toggleShow = () => {
  isShow.value = !isShow.value;
  emit("update:height", isShow.value ? 150 : 30);
};

watch(
  () => isShowComputed.value,
  () => {
    isShow.value = isShowComputed.value;
  }
);

// 使用defineExpose暴露isShow
defineExpose({
  isShow,
});
onUnmounted(() => {
  emit("update:height", 30);
});
</script>

<style>
#codeCollapsePanels .arco-card-size-medium .arco-card-body {
  padding: 0;
}

#codeCollapsePanels :deep(.arco-tabs-content) {
  padding-top: 0;
}

#codeCollapsePanels .controlCard {
  border-bottom: 0;
}

#codeCollapsePanels .arrowTransform {
  transition: 0.2s;
  transform-origin: center;
  transform: rotateZ(180deg);
}

#codeCollapsePanels .arrowTransformReturn {
  transition: 0.2s;
  transform-origin: center;
  transform: rotateZ(0deg);
}

#codeCollapsePanels .title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
}

#codeCollapsePanels .btn-run {
  margin-right: 6px;
}

#codeCollapsePanels .container {
  bottom: 50px;
  padding: 0 12px 16px 12px;
  border-bottom: 1px solid #efefef;
  overflow: hidden;
}

#codeCollapsePanels .testText {
  margin-bottom: 15px;
}

#codeCollapsePanels .btn-icon {
  margin-left: 4px;
}

#codeCollapsePanels .result {
  font-size: 18px;
  margin-bottom: 0;
}

#codeCollapsePanels .info {
  display: inline-block;
  font-size: 8px;
  margin-right: 10px;
}

#codeCollapsePanels .label {
  margin: 4px 0 8px 4px;
  font-size: 12px;
  color: var(--color-text-1);
}

#codeCollapsePanels .messageBox {
  background: #000a200d;
  padding: 12px;
}

#codeCollapsePanels .runText {
  text-align: center;
  color: var(--color-text-1);
}
</style>
