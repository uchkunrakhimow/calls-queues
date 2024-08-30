import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { QueueColumnsProps } from "@/interfaces";

const queueColumns: ColumnsType<QueueColumnsProps> = [
  Table.EXPAND_COLUMN,
  { title: "Статус", dataIndex: "status", key: "name" },
  { title: "Вн. номер", dataIndex: "extNum", key: "extNum" },
  { title: "Имя оператора", dataIndex: "operatorName", key: "operatorName" },
  { title: "Клиент", dataIndex: "client", key: "client" },
  { title: "Длительность", dataIndex: "duration", key: "duration" },
];

export { queueColumns };
