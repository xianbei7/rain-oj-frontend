import { ref, watch } from "vue";

const getColor = (status: string) => {
  let color = "";
  if (status === "等待判题中") {
    color = "gray";
  } else if (status === "判题中") {
    color = "orange";
  } else if (status === "通过") {
    color = "#0b0";
  } else if (status == "失败") {
    color = "red";
  }
  return color;
};

export default {
  props: {
    status: String,
    type: String,
  },
  setup(props: { status: string; type: string }) {
    const color = getColor(props.status);
    let text = props.status;
    if (props.status === "失败") {
      text = `${props.status}（${props.type}）`;
    }
    const statusTag = ref(
      <div
        style={{
          color: color,
          fontWeight: "bold",
        }}
      >
        {text}
      </div>
    );
    return () => <div>{statusTag.value}</div>;
  },
};
