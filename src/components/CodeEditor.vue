<template>
  <div id="code-editor" ref="codeEditorRef" />
</template>
<script setup lang="ts">
import * as monaco from "monaco-editor";
import { onMounted, ref, toRaw, withDefaults, defineProps, watch } from "vue";

interface Props {
  value: string;
  language?: string;
  codeTemplate: string;
  handleChange: (v: string) => void;
}

let props = withDefaults(defineProps<Props>(), {
  value: () => "",
  language: () => "",
  codeTemplate: () => "",
  handleChange: (v: string) => {
    console.log(v);
  },
});

const codeEditorRef = ref();
const codeEditor = ref();

watch(
  () => props.language,
  () => {
    monaco.editor.setModelLanguage(
      toRaw(codeEditor.value).getModel(),
      props.language
    );
  }
);

watch(
  () => props.codeTemplate,
  (newVal) => {
    toRaw(codeEditor.value).setValue(newVal);
  }
);
onMounted(() => {
  if (!codeEditorRef.value) {
    return;
  }
  codeEditor.value = monaco.editor.create(codeEditorRef.value, {
    value: props.value,
    language: props.language,
    automaticLayout: true,
    colorDecorators: true,
    minimap: {
      enabled: true,
    },
    theme: "vs-dark",
  });

  codeEditor.value.onDidChangeModelContent(() => {
    props.handleChange(toRaw(codeEditor.value).getValue());
  });
});
</script>

<style scoped></style>
