<template>
  <div id="RecordDetail">
    <a-card class="recordDetail">
      <div class="header">
        <icon-close class="closeIcon" @click="props.closeRecord" />
      </div>
      <div class="main">
        <a-scrollbar style="height: calc(100vh - 120px); overflow: auto">
          <div class="info">
            <a-row>
              <a-col :span="12">
                <div class="useInfo">
                  <a-avatar :size="35" style="background-color: #4080ff">
                    <img
                      v-if="userInfo.userAvatar"
                      src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp"
                    />
                    <span v-else>{{ userInfo.userName }}</span>
                  </a-avatar>
                  <div class="text">
                    <p class="userName">{{ userInfo.userName }}</p>
                    <p class="recordTime">
                      {{
                        moment(questionSubmit.createTime).format(
                          "YYYY.M.D HH:mm:ss"
                        )
                      }}
                    </p>
                  </div>
                </div>
              </a-col>
              <a-col :span="6" :offset="6">
                <div class="questionSubmitInfo">
                  <div
                    class="suc center"
                    v-if="questionSubmit.status === '通过'"
                  >
                    <icon-check-circle :style="{ fontSize: '24px' }" />
                    <span class="questionSubmitInfoText"> 回答正确 </span>
                  </div>
                  <div class="err center" v-else>
                    <icon-close-circle :style="{ fontSize: '24px' }" />
                    <span class="questionSubmitInfoText">
                      {{ questionSubmit.judgeResult?.type }}
                    </span>
                  </div>
                </div>
              </a-col>
            </a-row>
          </div>
          <div class="tag">
            <a-tag color="arcoblue" bordered size="small">
              {{ questionSubmit.language }}
            </a-tag>
          </div>
          <div class="message" v-if="questionSubmit?.status !== '通过'">
            <p class="label">错误信息</p>
            <div class="messageBox">
              {{ questionSubmit.judgeResult?.message }}
            </div>
          </div>
          <div class="code">
            <p class="label">提交代码</p>
            <MdViewer :value="codeContent" />
          </div>
        </a-scrollbar>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ViewQuestionSubmitVO } from "../../../generated";
import MdViewer from "@/components/MdViewer.vue";
import { computed, defineProps, ref, watchEffect } from "vue";
import moment from "moment";
import { useUserInfo } from "@/store/UserInfo";

const userInfo = useUserInfo();

interface Props {
  questionSubmitDetail: ViewQuestionSubmitVO;
  closeRecord: () => void;
}

const props = defineProps<Props>();
const codeContent = ref();
const v1 = "```";
const questionSubmit = computed(() => {
  return props.questionSubmitDetail;
});
watchEffect(
  () =>
    (codeContent.value = `${v1}${questionSubmit.value.language}\n${questionSubmit.value.code}\n${v1}`)
);
</script>

<style scoped>
:deep(.arco-card-body) {
  padding: 8px 16px;
}

#RecordDetail {
  height: 100%;
}

.recordDetail {
  height: 100%;
}

.header {
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
}

.closeIcon {
  color: gray;
  cursor: pointer;
}

.info {
  margin: 16px 0;
}

.useInfo {
  display: flex;
}

.avatar {
  margin-top: 6px;
  margin-right: 4px;
}

.avatar-image {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  object-fit: cover;
}

:deep(.arco-avatar) {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  object-fit: cover;
}

p {
  margin: 4px;
}

.userName {
  font-weight: 500;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.recordTime {
  color: rgb(var(--gray-10));
  font-size: 10px;
}

.questionSubmitInfo {
  margin-top: 8px;
}

.err {
  color: #ea2027;
}

.suc {
  color: green;
}

.center {
  display: flex;
  justify-content: center;
  align-content: center;
}

.questionSubmitInfoText {
  margin-left: 6px;
  font-size: 20px;
  font-weight: 600;
}

.label {
  margin: 16px 0 0 4px;
  font-size: 12px;
  color: rgb(var(--gray-10));
}

.messageBox {
  white-space: pre-wrap;
  background: #000a200d;
  padding: 12px;
  margin-top: 10px;
}

.message {
  margin: 20px 0;
}
</style>
