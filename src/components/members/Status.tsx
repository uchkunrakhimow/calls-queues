//@ts-ignore
import { FC, useState } from "react";
import { Tooltip } from "antd";
import { FaCircle, FaPause, FaPhone } from "react-icons/fa6";
import { iconStyle } from "@/styles";
import { MemberActions, MembersProps } from "@/interfaces";
import { convertUnix } from "@/utils";
import { Hamburger } from "@/components/icons";

const getStatusLabel = (status: any) => {
  switch (status) {
    case 0:
      return "Неизвестен";
    case 1:
      iconStyle.color = "green";
      return "Свободен";
    case 2:
      iconStyle.color = "orange";
      return "Набор";
    case 3:
      iconStyle.color = "dark";
      return "Занято";
    case 4:
      iconStyle.color = "dark";
      return "Некорректен";
    case 5:
      iconStyle.color = "dark";
      return "Недоступен";
    case 6:
      iconStyle.color = "green";
      return "Звонит";
    case 7:
      iconStyle.color = "orange";
      return "В состоянии звонка";
    case 8:
      iconStyle.color = "orange";
      return "На удержании";
    default:
      iconStyle.color = "dark";
      return "Неизвестен";
  }
};

const getAdditionalStatus = (member: MembersProps) => {
  let status = "";
  if (member.inCall) {
    status += " (разговаривает)";
  }
  if (member.paused) {
    status += " (на паузе)";
  }
  if (member.penalty) {
    status += " (бан)";
  }
  return status;
};

// const secondsToHMS = (wrapuptime: any) => {
//   let hours: any = Math.floor(wrapuptime / 3600);
//   let minutes: any = Math.floor((wrapuptime % 3600) / 60);
//   let seconds: any = wrapuptime % 60;

//   hours = hours < 10 ? "0" + hours : hours;
//   minutes = minutes < 10 ? "0" + minutes : minutes;
//   seconds = seconds < 10 ? "0" + seconds : seconds;

//   return hours + ":" + minutes + ":" + seconds;
// };

const MemberStatus: FC<MemberActions> = ({ member }) => {
  let status: any;
  let statusField: any;
  let statusLabel = getStatusLabel(member.status);
  let additionalStatus = getAdditionalStatus(member);

  if (member.outgoingChannels && member.outgoingChannels.length > 0) {
    status = "";
  } else {
    statusField = member.paused ? member.lastPause : member.lastCall;

    if (member.status === 5 && statusField === 0) {
      status = "";
    } else if (statusField > 0) {
      status = convertUnix(statusField);
      iconStyle.color = "skyblue";

      if (status > "00:00:20") {
        statusLabel = "Обработка";
        iconStyle.color = "green";
      }
    }
  }

  let icon;
  if (member.pausedReason === "smoke") {
    icon = (
      <i style={iconStyle}>
        <i style={{ fontSize: "18px" }}>🚬</i>
      </i>
    );
    statusLabel = "smoke";
  } else if (member.pausedReason === "dinner") {
    icon = (
      <i style={{ verticalAlign: "middle", marginLeft: "-5px" }}>
        <Hamburger />
      </i>
    );
    statusLabel = "dinner";
  } else if (member.paused) {
    icon = <FaPause style={iconStyle} />;
  } else if (member.inCall) {
    icon = <FaPhone style={iconStyle} />;
  } else {
    icon = <FaCircle style={iconStyle} />;
  }

  return (
    <Tooltip title={statusLabel + additionalStatus}>
      <div>{icon}</div>
      <div>{status}</div>
    </Tooltip>
  );
};

export { MemberStatus };
