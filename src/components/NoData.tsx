import { FC } from "react";
import { Empty } from "antd";

const NoDataMessage: FC = () => {
  return (
    <div style={{ padding: "5rem" }}>
      <Empty description="Данные не обнаружены, скоро все исправим" />
    </div>
  );
};

export { NoDataMessage };
