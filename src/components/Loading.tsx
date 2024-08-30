import { FC } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const LoadingSpinner: FC = () => {
  const loaderIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return (
    <div style={{ position: "fixed", top: "40%", left: "55%", transform: "translate(-50%, -50%" }}>
      <Spin indicator={loaderIcon} size="large" />
    </div>
  );
};

export { LoadingSpinner };
