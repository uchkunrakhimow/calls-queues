import { FC } from "react";
import { MemberActions } from "@/interfaces";

const MemberDuration: FC<MemberActions> = ({ member }) => {
  if (
    member.inCall &&
    member.incomingChannels.length > 0 &&
    member.incomingChannels[0].callerIdNum !== "<unknown>"
  ) {
    return member.incomingChannels[0].duration;
  } else if (
    member.inCall &&
    member.incomingChannels.length === 0 &&
    member.outgoingChannels.length > 0 &&
    member.outgoingChannels[0].connectedLineNum !== "<unknown>"
  ) {
    return member.outgoingChannels[0].duration;
  }
  return "";
};

export { MemberDuration };
