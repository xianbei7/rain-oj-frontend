<template>
  <Editor
    :value="value"
    :mode="mode"
    :locale="zhHans"
    :plugins="plugins"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import { Editor } from "@bytemd/vue-next";
import zhHans from "bytemd/locales/zh_Hans.json";
import zh_Hans from "@bytemd/plugin-gfm/locales/zh_Hans.json";
import { withDefaults, defineProps } from "vue";

interface Props {
  value: string;
  mode?: string;
  handleChange: (v: string) => void;
}

const plugins = [gfm({ locale: zh_Hans }), highlight()];
const props = withDefaults(defineProps<Props>(), {
  value: () => "",
  mode: () => "split",
  handleChange: (v: string) => {
    console.log(v);
  },
});
</script>

<style>
.bytemd-toolbar-icon.bytemd-tippy.bytemd-tippy-right:last-child {
  display: none;
}
</style>
