import { TransferDirection } from "antd/es/transfer";

export interface TabItem {
  key: string;
  label: string;
  children: React.ReactNode;
}

export interface RecordType {
  key: string;
  title: string;
  description: string;
}

export interface QueueColumnsProps {
  key: React.Key;
  status: JSX.Element;
  extNum: number;
  operatorName: number;
  client: number;
  duration: string;
  actions: JSX.Element;
}

export interface CustomersProps {
  queue: {
    callers: Array<{
      position: number;
      callerIdNum: string;
      callerIdName: string;
      wait: string;
    }>;
  };
}

export interface CallersProps {
  position: number;
  callerIdNum: string;
  callerIdName: string;
  wait: string;
}

export interface QueuesProps {
  queue: {
    queue: string;
    members: Array<{
      name: string;
      status: number;
      inCall: boolean;
      lastCall: number;
      lastPause: number;
      pausedReason: string;
      paused: boolean;
      penalty: number;
      location: string;
      membership: string;
      outgoingChannels: Array<any>;
      incomingChannels: Array<any>;
    }>;
  };
}

export interface InQueuesProps {
  queue: string;
  members: Array<{
    name: string;
    status: number;
    inCall: boolean;
    lastCall: number;
    lastPause: number;
    pausedReason: string;
    paused: boolean;
    penalty: number;
    location: string;
    membership: string;
    outgoingChannels: Array<any>;
    incomingChannels: Array<any>;
  }>;
}

export interface MembersProps {
  name: string;
  status: number;
  inCall: boolean;
  lastCall: number;
  lastPause: number;
  pausedReason: string;
  wrapuptime: string;
  paused: boolean;
  penalty: number;
  location: string;
  membership: string;
  outgoingChannels: Array<any>;
  incomingChannels: Array<any>;
}

export interface ActionsProps {
  member: MembersProps;
  queue: InQueuesProps;
  index: number;
}

export interface MemberActions {
  member: any;
}

export interface ErrorProps extends Error {
  name: string;
  message: string;
  stack?: string;
}

export interface QueueTabsProps {
  activeTabKey: string | undefined;
  handleTabClick: (key: string) => void;
  tabsItems: any[];
  activeQueue: any;
  showModal: () => void;
  performMemberAction: (actionPayload: any, successMessage: any) => void;
}

export interface TransferModalProps {
  isModalOpen: boolean;
  handleModalOk: () => void;
  handleModalCancel: () => void;
  resetTargetKeys: () => void;
  getDragProps: () => {
    onDragEnd: (fromIndex: number, toIndex: number) => void;
    nodeSelector: string;
  };
  mockData: { key: string; title: string; description: string }[];
  onTransferChange: (
    nextTargetKeys: string[],
    direction: TransferDirection,
    moveKeys: string[]
  ) => void;
  targetKeys: string[];
}

export interface TabsExtraContentProps {
  activeItem: string | undefined;
  showModal: () => void;
  activeQueue: any;
  performMemberAction: (actionPayload: any, successMessage: any) => void;
}
