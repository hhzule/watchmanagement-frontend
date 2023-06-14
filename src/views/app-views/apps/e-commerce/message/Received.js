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
import TextArea from "antd/es/input/TextArea";
import {
  AUTH_TOKEN,
  AUTH_ROLE,
  EMILUS_USER_Email,
} from "../../../../../constants/AuthConstant";

const Sent = (props) => {
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [list, setList] = useState();
  let sender = localStorage.getItem(AUTH_TOKEN);
  const [toggle, setToggle] = useState();
  const [toggleB, setToggleB] = useState(false);
  const [toggleC, setToggleC] = useState(false);
  const senderId = localStorage.getItem(AUTH_TOKEN);
  const senderEmail = localStorage.getItem(EMILUS_USER_Email);
  const senderRole = localStorage.getItem(AUTH_ROLE);
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        await fetch(
          `${process.env.REACT_APP_BASE_PATH}/messagereceived/${sender}`
        )
          .then((response) => response.json())
          .then((data) => {
            console.log("first", data);
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
  const requote = () => {
    setToggleC(!toggleC);
  };
  const onFinish = async (itm, mode) => {
    console.log("itm", itm);
    form
      .validateFields()
      .then((values) => {
        setTimeout(async () => {
          setSubmitLoading(true);
          if (mode === "quote" && values.quote.length <= 0) {
            message.error(`Please enter ${mode}, must be numbers`);
            setSubmitLoading(false);
            // setIsModalOpen(false);
            return;
          }
          if (mode === "message" && values.text === "") {
            message.error(`Please enter ${mode}`);
            setSubmitLoading(false);
            // setIsModalOpen(false);
            return;
          }
          if (mode === "message" && values.text === undefined) {
            message.error(`Please enter ${mode}`);
            setSubmitLoading(false);
            // setIsModalOpen(false);
            return;
          }
          let chatmessage = mode === "quote" ? values.quote : values.text;
          const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              firstUserId: itm.firstUserId,
              firstUserEmail: itm.firstUserEmail,
              secondUserId: itm.secondUserId,
              secondUserEmail: itm.secondUserEmail,
              Chat: [
                {
                  message: chatmessage,
                  type: mode,
                  fromId: senderId,
                  fromEmail: senderEmail,
                  toId: itm.firstUserId,
                  toEmail: itm.firstUserEmaill,
                  accept: "string",
                  reject: "string",
                  switched: false,
                  watchId: itm.Chat[0].watchId,
                },
              ],
            }),
          };
          console.log("reqOpt", requestOptions);
          try {
            console.log("reop", requestOptions);
            await fetch(
              `${process.env.REACT_APP_BASE_PATH}/updatemessage`,
              requestOptions
            )
              .then((response) => response.json())
              .then((data) => console.log("result ==>", data));
            setSubmitLoading(false);
            setToggleB(false);
            setToggleC(false);
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
  };
  const handleCancel = () => {
    setToggleB(!toggleB);
  };

  const repond = async (itm, ans) => {
    let mess;
    let switchedState;
    let state = ans == "accept" ? "true" : "false";
    let stateT = ans == "reject" ? "true" : "false";
    if (ans === "accept") {
      mess = "your quote has been accepted";
      switchedState = true;
    } else {
      mess = "your quote has been rejected";
      switchedState = false;
    }
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstUserId: itm.firstUserId,
        firstUserEmail: itm.firstUserEmail,
        secondUserId: itm.secondUserId,
        secondUserEmail: itm.secondUserEmail,
        Chat: [
          {
            message: mess,
            type: "quote",
            fromId: senderId,
            fromEmail: senderEmail,
            toId: itm.secondUserId,
            toEmail: itm.secondUserEmail,
            accept: state,
            reject: stateT,
            switched: switchedState,
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
      setToggleB(false);
      setToggleC(false);
      message.success(`Message sent`, [5]);
    } catch (error) {
      console.log("error", error);
    }
  };
  const rules = {
    quote: [
      {
        required: true,
        message: "Number must be entered",
        pattern: new RegExp(/^[0-9]+$/),
      },
    ],
  };
  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={17}>
        <Card title="Received Messages">
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
                    <Divider />
                    {toggle ? (
                      <>
                        {itm.Chat.map((item) => {
                          return (
                            <Timeline
                              mode={
                                item.fromEmail != senderEmail ? "right" : "left"
                              }
                              key={i}
                            >
                              <div className="d-flex flex-wrap">
                                <items
                                  color={
                                    item.type === "quote" ? "green" : "green"
                                  }
                                >
                                  {item.message}
                                </items>
                                <br />
                                {item.type === "quote" &&
                                item.fromEmail != senderEmail ? (
                                  <>
                                    <div className="d-flex flex-wrap justify-content-end">
                                      <button
                                        className="d-flex"
                                        onClick={() => repond(itm, "accept")}
                                      >
                                        Accept
                                      </button>{" "}
                                      <button
                                        className="d-flex"
                                        onClick={() => repond(itm, "reject")}
                                      >
                                        Decline
                                      </button>
                                      <button
                                        className="d-flex"
                                        onClick={requote}
                                      >
                                        Requote
                                      </button>
                                    </div>
                                  </>
                                ) : null}
                                {item.type === "quote" &&
                                item.fromEmail === senderEmail ? (
                                  <>
                                    <span>
                                      Status:{" "}
                                      {item.accept === "string"
                                        ? "Pending..."
                                        : item.accept === "true"
                                        ? "Accepted"
                                        : "Rejected"}
                                    </span>
                                  </>
                                ) : null}
                              </div>
                            </Timeline>
                          );
                        })}
                        {toggleB ? null : (
                          <div className="d-flex justify-content-end my-1">
                            <button onClick={() => reply()}>Reply</button>
                          </div>
                        )}

                        {toggleB ? (
                          <div>
                            <Tabs
                              defaultActiveKey="1"
                              items={[
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
                        {toggleC ? (
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
                                          rules={rules.quote}
                                        >
                                          <InputNumber
                                            maxLength={6}
                                            controls={false}
                                          />
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
