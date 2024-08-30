import { FC } from "react";
import { Button, Space, message } from "antd";
import {
  FaEarListen,
  FaMessage,
  FaComments,
  FaCirclePause,
  FaCircleStop,
  FaPhoneSlash,
} from "react-icons/fa6";
//@ts-ignore
import axios from "axios";
import * as config from "@/config";

import { ActionsProps, ErrorProps, MembersProps } from "@/interfaces";
import { flexCenter } from "@/styles";

const storedUserData: string | null = localStorage.getItem("userData");

const MemberActions: FC<ActionsProps> = ({ member, queue, index }) => {
  const [messageApi, contextHolder] = message.useMessage();

  const performMemberAction = (actionPayload: any, successMessage: any) => {
    axios
      .post(config.MEMBER_API_URL, actionPayload, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then(() => {
        messageApi.success(successMessage);
      })
      .catch((error: ErrorProps) => {
        messageApi.error("Запрос не удалось отправить, произошла ошибка");
        console.error(`Member err: ${error.message}`);
      });
  };

  const performChannelAction = (actionPayload: any, successMessage: any) => {
    axios
      .post(config.CHANNEL_API_URL, actionPayload, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then(() => {
        messageApi.success(successMessage);
      })
      .catch((error: ErrorProps) => {
        messageApi.error("Запрос не удалось отправить, произошла ошибка");
        console.error(`Channel err: ${error.message}`);
      });
  };

  const actionButtons = [];
  const safeLocation = (member: MembersProps) => {
    const locationData = member.location.split("/");
    if (locationData.length === 2) {
      return member.location;
    } else if (locationData.length === 3 && locationData[2] === "n") {
      return storedUserData + "/" + locationData[1].split("@")[0];
    }
  };

  // Channel actions
  if (member.inCall) {
    actionButtons.push(
      <Button
        key={`listen-${index}`}
        icon={<FaEarListen />}
        style={flexCenter}
        onClick={() => {
          performChannelAction(
            {
              action: "spy",
              interface: safeLocation(member),
              me: storedUserData,
              mode: "SPY",
            },
            `Подслушать ${safeLocation(
              member
            )} : вызов направлен на ${storedUserData}`
          );
        }}
      >
        Подслушать
      </Button>,
      <Button
        key={`message-${index}`}
        icon={<FaMessage />}
        style={flexCenter}
        onClick={() => {
          performChannelAction(
            {
              action: "spy",
              interface: safeLocation(member),
              me: storedUserData,
              mode: "WHISPER",
            },
            `Подсказать ${safeLocation(
              member
            )} : вызов направлен на ${storedUserData}`
          );
        }}
      >
        Подсказать оператору
      </Button>,
      <Button
        key={`comments-${index}`}
        icon={<FaComments />}
        style={flexCenter}
        onClick={() => {
          performChannelAction(
            {
              action: "spy",
              interface: safeLocation(member),
              me: storedUserData,
              mode: "BARGE",
            },
            `Вмешаться к ${safeLocation(
              member
            )} : вызов направлен на ${storedUserData}`
          );
        }}
      >
        Вмешаться в разговор
      </Button>
    );
  }

  // Pause actions
  if (!member.paused) {
    actionButtons.push(
      <Button
        key={`pause-${index}`}
        icon={<FaCirclePause />}
        style={flexCenter}
        onClick={() => {
          performMemberAction(
            {
              action: "pause",
              queue: queue.queue,
              member: member.name,
              paused: true,
            },
            `${member.location} : на паузе`
          );
        }}
      >
        Поставить на паузу
      </Button>
    );
  } else {
    actionButtons.push(
      <Button
        key={`pause-${index}`}
        icon={<FaCircleStop />}
        style={flexCenter}
        onClick={() => {
          performMemberAction(
            {
              action: "pause",
              queue: queue.queue,
              member: member.name,
              paused: false,
            },
            `${member.location} : снят с паузы`
          );
        }}
      >
        Снять с паузы
      </Button>
    );
  }

  // Hangup actions
  if (
    member.inCall &&
    member.incomingChannels.length === 0 &&
    member.outgoingChannels.length > 0
  ) {
    actionButtons.push(
      <Button
        key={`phoneSlash-${index}`}
        icon={<FaPhoneSlash />}
        style={flexCenter}
        onClick={() => {
          performChannelAction(
            {
              action: "hangup",
              name: member.outgoingChannels[0].channel,
              cause: "PBXRT",
            },
            `Вызов ${member.outgoingChannels[0].channel} завершен`
          );
        }}
      >
        Положить трубку
      </Button>
    );
  }

  if (member.inCall && member.incomingChannels.length > 0) {
    actionButtons.push(
      <Button
        key={`phoneSlash-${index}`}
        icon={<FaPhoneSlash />}
        style={flexCenter}
        onClick={() => {
          performChannelAction(
            {
              action: "hangup",
              name: member.incomingChannels[0].channel,
              cause: "PBXRT",
            },
            `Вызов ${member.incomingChannels[0].channel} завершен`
          );
        }}
      >
        Положить трубку
      </Button>
    );
  }

  // Member actions
  if (member.membership !== "static") {
    actionButtons.push(
      <Button
        key={`stop-${index}`}
        icon={<FaCircleStop />}
        style={flexCenter}
        onClick={() => {
          performMemberAction(
            {
              action: "remove",
              queue: queue.queue,
              member: member.name,
            },
            `Вызов ${member.location} : удален из очереди`
          );
        }}
      >
        Удалить
      </Button>
    );
  }
  return (
    <>
      {contextHolder}
      <Space wrap>{actionButtons}</Space>
    </>
  );
};

export { MemberActions };
