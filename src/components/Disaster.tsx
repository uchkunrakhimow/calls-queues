import { FC, useState, useLayoutEffect } from "react";
import { Select, Form, Checkbox, Button, Space, message, Upload } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { FaTrash, FaUpload } from "react-icons/fa6";
import axios from "axios";
import * as config from "@/config";
import type { UploadProps } from "antd";

const Disaster: FC = () => {
  const [selectedGreeting, setSelectedGreeting] = useState<string | undefined>(
    "noselect"
  );
  const [disasterChecked, setDisasterChecked] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  const greetingFiles: any = localStorage.getItem("greetingFiles");
  const greetingSettings: any = localStorage.getItem("greetingSettings");

  const parsedGreetingFiles = JSON.parse(greetingFiles);
  const parsedGreetingSettings = JSON.parse(greetingSettings);

  const handleChange = (value: string) => {
    setSelectedGreeting(value);
  };

  const checkDisaster = (e: CheckboxChangeEvent) => {
    setDisasterChecked(e.target.checked);
  };

  const activeQueueName = localStorage.getItem("activeTabKey");

  const fetchGreetingSettings = () => {
    if (parsedGreetingSettings && parsedGreetingSettings.disaster) {
      setDisasterChecked(true);
    } else {
      setDisasterChecked(false);
    }

    if (parsedGreetingSettings && parsedGreetingSettings.file) {
      setSelectedGreeting(parsedGreetingSettings.file.id);
    } else {
      setSelectedGreeting("noselect");
    }
  };

  const manageGreeting = () => {
    const data = {
      action: "select",
      queue: activeQueueName,
      disaster: disasterChecked,
      ...(selectedGreeting !== "noselect" && {
        fileId: Number(selectedGreeting),
      }),
    };

    axios
      .post(config.MANAGE_GREETING_API_URL, data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then(() => {
        messageApi.success(
          "Настройки сохранены и будут применены через несколько секунд"
        );
      })
      .catch(() => {
        messageApi.error("Произошла ошибка при удалении файла");
      });
  };

  const handleRemove = (id: any) => {
    setLoader(true);
    const data = {
      action: "remove",
      queue: activeQueueName,
      fileId: Number(id),
    };

    axios
      .post(config.MANAGE_GREETING_API_URL, data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then(() => {
        setSelectedGreeting("noselect");
        setLoader(false);
        messageApi.success("Файл удален");
      })
      .catch(() => {
        messageApi.error("Произошла ошибка при удалении файла");
      });
  };

  const props: UploadProps = {
    name: "file",
    showUploadList: false,
    customRequest: async ({ file }) => {
      setLoader(true);
      const formData = new FormData();
      formData.append("action", "add");
      formData.append("file", file);
      formData.append("queue", activeQueueName as string);

      await axios
        .post(config.MANAGE_GREETING_API_URL, formData, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then(() => {
          setLoader(false);
          message.success(
            `Файл загружен и будет доступен через несколько секунд`
          );
        })
        .catch(() => {
          setLoader(false);
          message.error(`Ошибка загрузки файла`);
        });
    },
  };

  useLayoutEffect(() => {
    fetchGreetingSettings();
  }, [greetingFiles]);

  return (
    <Form>
      {contextHolder}
      <Form.Item style={{ marginBottom: "0" }}>
        <text>Приветственное аудио</text>
      </Form.Item>
      <Form.Item style={{ marginBottom: "0" }}>
        <Space wrap>
          <Select
            defaultValue="noselect"
            value={selectedGreeting}
            onChange={handleChange}
            loading={loader}
            style={{ width: 200 }}
          >
            <Select.Option
              key="noselect"
              value="noselect"
              style={{ marginBottom: "5px" }}
            >
              -- Не выбрано --
            </Select.Option>
            <Select.Option key="upload" value="upload">
              <Upload {...props}>
                <span style={{ display: "flex", alignItems: "center" }}>
                  <FaUpload style={{ height: "16px" }} />
                  <span style={{ marginLeft: "5px" }}>Загрузить новый</span>
                </span>
              </Upload>
            </Select.Option>
            {parsedGreetingFiles.map((file: any) => (
              <Select.Option key={file.id} value={file.id}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#111",
                    padding: "5px",
                    marginTop: "5px",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                    }}
                  >
                    {file.name}
                  </span>
                  <span
                    onClick={() => {
                      handleRemove(file.id);
                    }}
                  >
                    <FaTrash />
                  </span>
                </div>
              </Select.Option>
            ))}
          </Select>
          <Button
            type="primary"
            style={{ backgroundColor: "green" }}
            htmlType="submit"
            onClick={() => {
              manageGreeting();
            }}
          >
            Сохранить
          </Button>
        </Space>
      </Form.Item>
      <Form.Item style={{ margin: "0 0 1rem 0" }}>
        <Checkbox
          onChange={checkDisaster}
          checked={disasterChecked}
          style={{ fontWeight: "400" }}
        >
          Disaster
        </Checkbox>
      </Form.Item>
    </Form>
  );
};

export { Disaster };
