import { FC, useState } from "react";
import { Table } from "antd";
import { MembersProps, QueuesProps } from "@/interfaces";
import { queueColumns } from "@/constants";
import { MemberActions, MemberStatus, MemberClient, MemberDuration } from ".";

const Members: FC<QueuesProps> = ({ queue }) => {
  const canManage: any = localStorage.getItem("canManage");
  const [expandedRowKey, setExpandedRowKey] = useState<number | null>(null);

  const getExpandedRowKeys = () =>
    expandedRowKey !== null ? [expandedRowKey] : [];
  const extractMemberName = (member: MembersProps) =>
    member.location.replace("SIP/", "");

  const extractOperatorName = (member: MembersProps) => {
    const availableMembers = JSON.parse(
      localStorage.getItem("availableMembers") || "{}"
    );
    const replaceName = member.location.replace("SIP/", "");
    const fullName = availableMembers[replaceName] || replaceName;
    return fullName;
  };

  const handleExpand = (recordKey: number) => {
    if (expandedRowKey === recordKey) {
      setExpandedRowKey(null);
    } else {
      setExpandedRowKey(recordKey);
    }
  };

  const transformMemberData = (members: any) => {
    return members.map((member: MembersProps, index: number) => {
      return {
        key: index + 1,
        status: <MemberStatus member={member} />,
        extNum: extractMemberName(member),
        operatorName: extractOperatorName(member),
        client: (
          <b>
            <MemberClient member={member} />
          </b>
        ),
        duration: <MemberDuration member={member} />,
        actions: <MemberActions member={member} queue={queue} index={index} />,
      };
    });
  };

  const expandableView = () => {
    return canManage === "true" ? true : false;
  };

  return (
    <Table
      columns={queueColumns}
      dataSource={transformMemberData(queue.members)}
      bordered={false}
      size="small"
      tableLayout={"auto"}
      pagination={false}
      expandable={{
        expandedRowKeys: getExpandedRowKeys(),
        onExpand: (_, record: any) => {
          handleExpand(record.key);
        },
        expandRowByClick: expandableView(),
        expandedRowRender: (record) => {
          if (record.key === expandedRowKey) {
            return <div>{record.actions}</div>;
          }
          return null;
        },
        expandIcon: () => null,
        columnWidth: 12,
      }}
    />
  );
};

export { Members };
