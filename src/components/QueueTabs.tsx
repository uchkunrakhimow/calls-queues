import React from "react";
import { Tabs, Space } from "antd";
import { QuestionCircleFilled } from "@ant-design/icons";
import { TabsExtraData } from "./TabsExtraData";
import { QueueTabsProps } from "@/interfaces";

const QueueTabs: React.FC<QueueTabsProps> = ({
  activeTabKey,
  handleTabClick,
  tabsItems,
  activeQueue,
  showModal,
  performMemberAction,
}) => {
  return (
    <div>
      <Space>
        <h2 style={{ margin: "1.5rem 0" }}>Очереди</h2>
        <a
          style={{ fontSize: "16px" }}
          href="https://wiki.fetg.uz/doku.php?id=faq:pbxrealtime"
        >
          <QuestionCircleFilled />
        </a>
      </Space>
      <section className="boxStyle">
        <Tabs
          activeKey={activeTabKey}
          onTabClick={(key) => handleTabClick(key)}
          items={tabsItems}
          tabBarExtraContent={
            <TabsExtraData
              activeItem={activeTabKey}
              showModal={showModal}
              activeQueue={activeQueue}
              performMemberAction={performMemberAction}
            />
          }
          type="card"
          style={{ marginTop: ".5rem" }}
        />
      </section>
    </div>
  );
};

export { QueueTabs };
