import { FC } from "react";
import { Transfer, Button, Modal } from "antd";
import ReactDragListView from "react-drag-listview";
import { TransferModalProps, RecordType } from "@/interfaces";
// import { MenuOutlined } from "@ant-design/icons";

const TransferModal: FC<TransferModalProps> = ({
  isModalOpen,
  handleModalOk,
  handleModalCancel,
  resetTargetKeys,
  mockData,
  onTransferChange,
  targetKeys,
  getDragProps,
}) => {
  return (
    <Modal
      title="Настройки"
      open={isModalOpen}
      onOk={handleModalOk}
      onCancel={handleModalCancel}
      width={800}
      footer={[
        <Button key="back" onClick={resetTargetKeys}>
          Сброс
        </Button>,
        <Button key="submit" type="primary" onClick={handleModalOk}>
          Сохранить
        </Button>,
      ]}
    >
      <ReactDragListView {...getDragProps()}>
        <Transfer
          titles={["Доступные", "В очереди"]}
          dataSource={mockData}
          targetKeys={targetKeys}
          // @ts-ignore
          onChange={onTransferChange}
          render={(item: RecordType) => (
            <>
              {item.title}
              {/* <MenuOutlined style={{ marginLeft: 8 }} /> */}
            </>
          )}
          showSearch={true}
          listStyle={{
            width: 500,
            height: 400,
          }}
        />
      </ReactDragListView>
    </Modal>
  );
};

export { TransferModal };
