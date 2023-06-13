import React, { useState, useEffect } from "react";
import {
  Input,
  Row,
  Col,
  Card,
  Divider,
  Timeline,
  Form,
  Button,
  Upload,
  Tabs,
  InputNumber,
  message,
  Select,
} from "antd";
import { useLocation } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import {
  LoadingOutlined,
  DeleteOutlined,
  EuroCircleOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import {
  AUTH_TOKEN,
  AUTH_ROLE,
  EMILUS_USER_Email,
} from "../../../../../constants/AuthConstant";
const rules = {
  name: [
    {
      required: true,
      message: "Please enter name",
      validator: (_, value) => {
        if (/^[a-zA-Z0-9]+$/.test(value)) {
          return Promise.resolve();
        } else {
          return Promise.reject("Some message here");
        }
      },
    },
  ],
  quote: [
    {
      required: true,
      message: "Please enter model",
    },
  ],
};

const Sent = (props) => {
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [list, setList] = useState();
  let sender = localStorage.getItem(AUTH_TOKEN);
  const [toggle, setToggle] = useState();
  const [toggleB, setToggleB] = useState();
  const [again, setAgain] = useState();
  const senderId = localStorage.getItem(AUTH_TOKEN);
  const senderEmail = localStorage.getItem(EMILUS_USER_Email);
  const senderRole = localStorage.getItem(AUTH_ROLE);
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        await fetch(`${process.env.REACT_APP_BASE_PATH}/messagesent/${sender}`)
          .then((response) => response.json())
          .then((data) => {
            // console.log("data", data);
            return setList(data);
          });
      } catch (error) {
        console.log(error);
      }
    };
    fetchOptions();
  }, [toggleB]);

  const reply = () => {
    setToggleB(!toggleB);
  };
  const onFinish = async (itm, mode) => {
    form
      .validateFields()
      .then((values) => {
        setTimeout(async () => {
          setSubmitLoading(true);
          if (values.quote === "" && values.text === "") {
            message.error(`Please enter ${mode}`);
            setSubmitLoading(false);
            return;
          }
          let chatmessage = mode === "quote" ? values.quote : values.text;
          const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              firstUserId: senderId,
              secondUserId: itm.secondUserId,
              secondUserEmail: itm.secondUserEmail,
              Chat: [
                {
                  message: chatmessage,
                  type: mode,
                  fromId: senderId,
                  fromEmail: senderEmail,
                  toId: itm.secondUserId,
                  toEmail: itm.secondUserEmail,
                  accept: "string",
                  reject: "string",
                  read: false,
                  watchId: itm.Chat[0].watchId,
                },
              ],
            }),
          };
          try {
            console.log("reop", requestOptions);
            await fetch(
              `${process.env.REACT_APP_BASE_PATH}/updatemessage`,
              requestOptions
            )
              .then((response) => response.json())
              .then((data) => console.log("result ==>", data));
            setSubmitLoading(false);
            setToggleB(!toggleB);
            message.success(`Message sent`, [5]);
          } catch (error) {
            console.log("error", error);
          }
        }, 500);
      })
      .catch((info) => {
        // console.log("info", info);
        setSubmitLoading(false);
        message.error("Please enter all required field ");
      });
    setAgain(mode);
  };
  const handleCancel = () => {
    setToggleB(!toggleB);
  };

  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={17}>
        <Card title="Sent Messages">
          <Divider />
          {list &&
            list.map((itm, i) => {
              return (
                <>
                  <div key={i}>
                    <div className="d-flex flex-wrap justify-content-between">
                      <h5> Receiver{""} </h5>
                      <p>{itm.secondUserEmail}</p>
                    </div>
                    <div className="d-flex justify-content-end">
                      <button onClick={() => setToggle(!toggle)}>
                        {toggle ? " Show less" : " Show more"}
                      </button>
                    </div>
                    {toggle ? (
                      <>
                        <Timeline>
                          {itm.Chat.map((item) => {
                            return (
                              <div key={i}>
                                <items
                                  color={
                                    item.type === "quote" ? "red" : "green"
                                  }
                                >
                                  {item.type === "quote" ? (
                                    <EuroCircleOutlined className="img-fluid" />
                                  ) : (
                                    <MessageOutlined className="img-fluid" />
                                  )}
                                  {item.message}
                                </items>
                              </div>
                            );
                          })}
                          {toggleB ? null : (
                            <div className="d-flex justify-content-end my-1">
                              <button onClick={() => reply()}>Reply</button>
                            </div>
                          )}
                        </Timeline>

                        {toggleB ? (
                          <div>
                            <Tabs
                              defaultActiveKey="1"
                              items={[
                                {
                                  label: "Quote",
                                  key: "1",
                                  children: (
                                    <Form
                                      layout="vertical"
                                      form={form}
                                      name="advanced_search"
                                      className="ant-advanced-search-form"
                                    >
                                      <Col xs={24} sm={24} md={17}>
                                        <Form.Item
                                          name="quote"
                                          label="Quote"
                                          //  rules={rules.quote}
                                        >
                                          <Input placeholder="Give a quote" />
                                        </Form.Item>
                                        <Button
                                          type="primary"
                                          onClick={() => onFinish(itm, "quote")}
                                          loading={submitLoading}
                                        >
                                          Send Quote
                                        </Button>{" "}
                                        <Button
                                          type="primary"
                                          onClick={() => handleCancel()}
                                          disabled={submitLoading}
                                        >
                                          Cancel
                                        </Button>
                                      </Col>
                                    </Form>
                                  ),
                                },
                                {
                                  label: "Text",
                                  key: "2",
                                  children: (
                                    <Form
                                      layout="vertical"
                                      form={form}
                                      name="advanced_search"
                                      className="ant-advanced-search-form"
                                    >
                                      <Col xs={24} sm={24} md={17}>
                                        <Form.Item
                                          name="text"
                                          label="Text"
                                          //  rules={rules.quote}
                                        >
                                          <TextArea placeholder="Give a message" />
                                        </Form.Item>
                                        <Button
                                          type="primary"
                                          onClick={() =>
                                            onFinish(itm, "message")
                                          }
                                          loading={submitLoading}
                                        >
                                          Send Message
                                        </Button>{" "}
                                        <Button
                                          type="primary"
                                          onClick={() => handleCancel()}
                                          disabled={submitLoading}
                                        >
                                          Cancel
                                        </Button>
                                      </Col>
                                    </Form>
                                  ),
                                },
                              ]}
                            />
                          </div>
                        ) : null}
                      </>
                    ) : null}
                    <Divider />
                  </div>
                </>
              );
            })}
        </Card>
      </Col>
    </Row>
  );
};

export default Sent;
