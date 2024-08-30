import { FC } from "react";
import { Divider, Row, Col, Typography } from "antd";
import { CustomersProps, CallersProps } from "@/interfaces";
import { secondsToTime } from "@/utils";

const { Text } = Typography;

const Customers: FC<CustomersProps> = ({ queue }) => {
  return (
    <>
      <Divider orientation="left">
        Клиенты в очереди ({queue.callers.length})
      </Divider>
      <Row gutter={16}>
        {queue.callers.map((caller: CallersProps, index: number) => (
          <Col
            span={12}
            style={{ marginBottom: "1rem", paddingLeft: "1rem" }}
            key={index}
          >
            <Text>
              {caller.position}. <Text strong>{caller.callerIdNum}</Text>
            </Text>{" "}
            <br />
            <Text>
              ({caller.callerIdName}) {secondsToTime(parseInt(caller.wait))}
            </Text>
          </Col>
        ))}
      </Row>
    </>
  );
};

export { Customers };
