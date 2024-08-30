import { useState, useEffect, CSSProperties } from "react";
import axios from "axios";
import { Row, Col, message } from "antd";
import type { TransferDirection } from "antd/es/transfer";
import * as config from "@/config";
import {
  Customers,
  Members,
  QueueTabs,
  LoadingSpinner,
  NoDataMessage,
  TransferModal,
  Disaster,
} from "@/components";
import { TabItem, MembersProps, ErrorProps } from "@/interfaces";
import { container as containerStyles } from "@/styles";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [queueData, setQueueData] = useState<any>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tabsItems, setTabsItems] = useState<TabItem[]>([]);
  const [activeTabKey, setActiveTabKey] = useState<string>();
  const [moveTargetKeys, setMoveTargetKeys] = useState<any>();

  const [messageApi, contextHolder] = message.useMessage();

  const storedAvailableMembers: any = JSON.parse(
    localStorage.getItem("availableMembers") || "{}"
  );

  const storedNumbers: any = JSON.parse(
    localStorage.getItem("activeNumbers") || "[]"
  );

  const storedTargetItem: any = localStorage.getItem("targetItem");
  const storedCanMange = localStorage.getItem("canManage");

  storedNumbers?.forEach((number: any) => {
    if (!storedAvailableMembers?.hasOwnProperty(number)) {
      storedAvailableMembers[number] = number;
    }
  });

  const dataSource = storedAvailableMembers
    ? Object.entries(storedAvailableMembers).map(([key, value]) => ({
        key: key,
        title: key + " - " + value,
        description: `description of ${value}`,
      }))
    : [];

  const activeQueue = queueData?.queues?.find((queue: any) => {
    return queue.queue === activeTabKey;
  });

  const activeNumbers =
    activeQueue?.members?.map((member: MembersProps) =>
      member.location.replace("SIP/", "")
    ) || [];

  if (activeNumbers.length > 0) {
    localStorage.setItem("activeNumbers", JSON.stringify(activeNumbers));
    localStorage.setItem("targetItem", JSON.stringify(activeNumbers));
  }

  const initialTargetKeys = dataSource
    .filter((item) => {
      return storedNumbers?.includes(item.key);
    })
    .map((item) => item.key);

  const [targetKeys, setTargetKeys] = useState(initialTargetKeys);

  const resetTargetKeys = () => {
    setTargetKeys(initialTargetKeys);
  };

  const onSelectChange = (
    nextTargetKeys: string[],
    direction: TransferDirection,
    moveKeys: string[]
  ) => {
    setTargetKeys(nextTargetKeys);
    setMoveTargetKeys({ moveKeys, direction });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const getDragProps = () => ({
    onDragEnd: (fromIndex: number, toIndex: number) => {
      if (activeQueue.strategy === "linear") {
        const targetKeysCopy: string[] = targetKeys;
        const item = targetKeysCopy.splice(fromIndex, 1)[0];
        targetKeysCopy.splice(toIndex, 0, item);

        const dynamicMembers = targetKeysCopy
          .map((number) => `SIP/${number}`)
          .join(", ");

        localStorage.setItem("dynamicMembers", dynamicMembers);
      } else {
        messageApi.error(
          "Это можно сделать только тем, кто стоит в 'linear' очереди."
        );
      }
    },
    nodeSelector:
      ".ant-transfer-list:last-child .ant-transfer-list-content > li",
  });

  const handleModalOk = () => {
    const dynamicMembers = localStorage.getItem("dynamicMembers");

    if (moveTargetKeys) {
      const { moveKeys, direction } = moveTargetKeys;
      if (moveKeys) {
        moveKeys.forEach((key: number) => {
          const sipKey = `SIP/${key}`;
          const action = direction === "left" ? "remove" : "add";

          const actionObject = {
            action,
            queue: activeTabKey,
            member: sipKey,
            ...(action === "add" ? { wrapuptime: 0 } : {}),
          };

          performMemberAction(actionObject, "Изменения сохранены");
          setIsModalOpen(false);
        });
      }
    } else if (dynamicMembers && activeQueue.strategy === "linear") {
      const data = {
        queue: activeQueue.queue,
        members: dynamicMembers,
      };
      performPositionAction(data, "Порядок сохранен");
      setIsModalOpen(false);
    } else {
      messageApi.error("Операция не выполнено");
    }

    localStorage.removeItem("dynamicMembers");
  };

  const performMemberAction = (actionPayload: any, successMessage: any) => {
    axios
      .post(config.MEMBER_API_URL, actionPayload, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then(() => {
        if (successMessage !== null) {
          messageApi.success(successMessage);
        }
      })
      .catch((error: ErrorProps) => {
        messageApi.error("Запрос не удалось отправить, произошла ошибка");
        console.error(`Member err: ${error.message}`);
      });
  };

  const performPositionAction = (actionPayload: any, successMessage: any) => {
    axios
      .post(config.POSITIONS_API_URL, actionPayload, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then(() => {
        if (successMessage !== null) {
          messageApi.success(successMessage);
        }
      })
      .catch((error: ErrorProps) => {
        messageApi.error("Запрос не удалось отправить, произошла ошибка");
        console.error(`Member err: ${error.message}`);
      });
  };

  const handleTabClick = (key: string) => {
    resetTargetKeys();
    setActiveTabKey(key);
    localStorage.setItem("activeTabKey", key);
  };

  const fetchData = () => {
    axios
      .get(config.API_URL)
      .then((res: any) => {
        const response = res.data.data;
        const queueRes = response.queues.map((queue: any) => ({
          key: queue.queue,
          label: queue.queue,
          children: (
            <>
              {storedCanMange === "true" ? <Disaster /> : <> </>}
              <Row style={{ marginBottom: "1rem" }}>
                <Col span={14}>
                  <Members queue={queue} />
                </Col>
                <Col
                  span={9}
                  style={{
                    marginLeft: "1rem",
                  }}
                >
                  <Customers queue={queue} />
                </Col>
              </Row>
            </>
          ),
        }));

        setTabsItems(queueRes);
        setQueueData(response);
      })
      .catch((err: ErrorProps) => {
        messageApi.error("Невозможно подключиться к Graphql");
        console.error(`Error Graphql: ${err.message}`);
      });
  };

  const setTabKey = () => {
    const activeTabKey = localStorage.getItem("activeTabKey");
    localStorage.setItem("activeTabKey", activeTabKey as string);
    setActiveTabKey(activeTabKey as string);
  };

  const activeQueueName = localStorage.getItem("activeTabKey");

  const fetchGreeting = () => {
    axios
      .get(config.GREETING_API_URL + activeQueueName)
      .then((res: any) => {
        const { greetingFiles, greetingSettings } = res.data.data;

        localStorage.setItem("greetingFiles", JSON.stringify(greetingFiles));
        localStorage.setItem(
          "greetingSettings",
          JSON.stringify(greetingSettings)
        );
      })
      .catch((err: ErrorProps) => {
        console.log("Failed to connect Disaster", err.message);
        messageApi.error("Не удалось подключиться к Disaster");
      });
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      setTabKey();
    }, 2000);

    const handleRejection = (event: any) => {
      console.warn("Unhandled promise rejection:", event.reason);
    };

    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  useEffect(() => {
    resetTargetKeys();
  }, [storedTargetItem]);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  if (storedCanMange === "true") {
    useEffect(() => {
      const intervalId = setInterval(() => {
        fetchGreeting();
      }, 1000);
      return () => clearInterval(intervalId);
    }, [activeQueueName]);
  }
  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : tabsItems.length === 0 ? (
        <NoDataMessage />
      ) : (
        <main style={containerStyles as CSSProperties}>
          {contextHolder}
          <QueueTabs
            activeTabKey={activeTabKey}
            handleTabClick={handleTabClick}
            tabsItems={tabsItems}
            activeQueue={activeQueue}
            showModal={showModal}
            performMemberAction={performMemberAction}
          />
          <TransferModal
            isModalOpen={isModalOpen}
            handleModalOk={handleModalOk}
            handleModalCancel={handleModalCancel}
            resetTargetKeys={resetTargetKeys}
            mockData={dataSource}
            onTransferChange={onSelectChange}
            targetKeys={targetKeys}
            getDragProps={getDragProps}
          />
        </main>
      )}
    </>
  );
}
