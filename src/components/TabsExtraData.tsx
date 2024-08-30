import { FC } from "react";
import { Button, Space, Dropdown } from "antd";
import { MembersProps } from "@/interfaces";
import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Hamburger } from "@/components/icons";
import { TabsExtraContentProps } from "@/interfaces";

const TabsExtraData: FC<TabsExtraContentProps> = ({
  activeItem,
  showModal,
  performMemberAction,
  activeQueue,
}) => {
  let activeExtraContent: JSX.Element | null = null;
  let defaultExtraContent: JSX.Element | null = null;
  const settingsButton = <Button onClick={showModal}>Настройки</Button>;
  const storedUserData: string | null = localStorage.getItem("userData");
  const canManage: any = localStorage.getItem("canManage");

  const settingsView = () => {
    if (canManage === "true") {
      return settingsButton;
    } else {
      return null;
    }
  };

  const defaultMember = () => {
    defaultExtraContent = (
      <Space wrap key="default">
        {settingsView()}
        <Button
          type="primary"
          style={{ backgroundColor: "green" }}
          onClick={() => {
            performMemberAction(
              {
                action: "add",
                queue: activeItem,
                member: storedUserData,
                wrapuptime: "20",
              },
              `${storedUserData}: зарегистрирован`
            );
          }}
        >
          Начать работу ({storedUserData})
        </Button>
      </Space>
    );
  };

  const itemsMethod: any = () => {
    performMemberAction(
      {
        action: "pause",
        queue: activeItem,
        member: storedUserData,
        paused: true,
        reason: "dinner",
      },
      `${storedUserData}: на паузе`
    );
  };

  const items: MenuProps["items"] = [
    {
      label: (
        <>
          <Hamburger /> Dinner
        </>
      ),
      key: "1",
      onClick: () => itemsMethod(),
    },
  ];

  const handlePause = (member: MembersProps, pausedReason: string) => {
    performMemberAction(
      {
        action: "pause",
        queue: activeItem,
        member: storedUserData,
        paused: !member.paused,
        reason: pausedReason,
      },
      `${storedUserData}: ${member.paused ? "снят с паузы" : "на паузе"}`
    );
  };

  const handleWrapTime = (wrapuptime: string) => {
    performMemberAction(
      {
        action: "remove",
        queue: activeItem,
        member: storedUserData,
      },
      null
    );

    setTimeout(() => {
      performMemberAction(
        {
          action: "add",
          queue: activeItem,
          member: storedUserData,
          wrapuptime,
        },
        `${storedUserData}: зарегистрирован`
      );
    }, 10);
  };

  activeQueue?.members.forEach((member: MembersProps) => {
    const activeMember = () => {
      activeExtraContent = (
        <Space wrap key={activeItem}>
          {settingsView()}

          {member.paused &&
          (member.pausedReason === "smoke" ||
            member.pausedReason === "dinner") ? (
            <Button onClick={() => handlePause(member, member.pausedReason)}>
              Продолжить
            </Button>
          ) : (
            <>
              <Dropdown.Button
                icon={<DownOutlined />}
                trigger={["click"]}
                menu={{ items }}
                onClick={() => handlePause(member, "smoke")}
              >
                🚬 Smoke
              </Dropdown.Button>

              {["1", "0"].includes(member.wrapuptime) ? (
                <Button
                  onClick={() => handleWrapTime("20")}
                  type="primary"
                  danger
                >
                  Тормоз
                </Button>
              ) : (
                <Button
                  type="primary"
                  onClick={() => handleWrapTime("1")}
                  style={{ backgroundColor: "green" }}
                >
                  Газ
                </Button>
              )}
            </>
          )}
          <Button
            type="primary"
            disabled={member.paused}
            onClick={() => {
              performMemberAction(
                {
                  action: "remove",
                  queue: activeItem,
                  member: storedUserData,
                },
                `${storedUserData}: снят с регистрации`
              );
            }}
            danger
          >
            Завершить работу ({storedUserData})
          </Button>
        </Space>
      );
    };

    if (activeQueue.queue === activeItem) {
      member.location === storedUserData ? activeMember() : defaultMember();
    }
  });

  activeQueue?.members?.length === 0 ? defaultMember() : null;

  return activeExtraContent || defaultExtraContent;
};

export { TabsExtraData };
