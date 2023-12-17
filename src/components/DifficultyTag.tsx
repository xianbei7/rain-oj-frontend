import { ref } from "vue";
import { Tag } from "@arco-design/web-vue";

const getColor = (difficulty: string) => {
  if (difficulty === "简单") {
    return "green";
  } else if (difficulty === "中等") {
    return "orange";
  } else if (difficulty === "困难") {
    return "red";
  }
};

export default {
  props: {
    difficulty: String,
  },
  setup(props: { difficulty: string }) {
    const color = getColor(props.difficulty);
    const difficultyTag = ref(
      <Tag color={color} bordered>
        {props.difficulty}
      </Tag>
    );
    return () => <div>{difficultyTag.value}</div>;
  },
};
