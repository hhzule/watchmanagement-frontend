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
  Tabs,
  Upload,
  InputNumber,
  message,
  Select,
} from "antd";
import {
  AUTH_TOKEN,
  AUTH_ROLE,
  EMILUS_USER_Email,
} from "../../../../../constants/AuthConstant";
import { MessageOutlined, EuroCircleOutlined } from "@ant-design/icons";

const Received = (props) => {
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [list, setList] = useState();
  let sender = localStorage.getItem(AUTH_TOKEN);
  const [toggle, setToggle] = useState();
  const [toggleB, setToggleB] = useState();
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
            console.log("data", data);
            return setList(data);
          });
      } catch (error) {
        console.log(error);
      }
    };
    fetchOptions();
  }, []);

  const reply = async (itm) => {
    console.log("itm", itm);
    // try {
    //   let requestOptions = {
    //     method: "PUT",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       firstUserId: senderId,
    //       secondUserId: rowData.creator,
    //       secondUserEmail: rowData.creatorEmail,
    //       Chat: [
    //         {
    //           message: "are you there",
    //           type: mode,
    //           fromId: senderId,
    //           fromRole: senderRole,
    //           fromEmail: senderEmail,
    //           toId: rowData.creator,
    //           toEmail: rowData.creatorEmail,
    //           accept: "string",
    //           reject: "string",
    //           read: false,
    //           watchId: rowData._id,
    //         },
    //       ],
    //     }),
    //   };
    //   await fetch(
    //     `${process.env.REACT_APP_BASE_PATH}/updatemessage`,
    //     requestOptions
    //   )
    //     .then((response) => response.json())
    //     .then((data) => {
    //       console.log("data", data);
    //       return setList(data);
    //     });
    // } catch (error) {
    //   console.log(error);
    // }
  };

  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={17}>
        <Card title="Received Messages">
          <Divider />
          {list &&
            list.map((itm, i) => {
              // console.log("item", itm);
              return (
                <>
                  <div key={i}>
                    <div className="d-flex flex-wrap justify-content-between">
                      <h5> Sender{""} </h5>
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
                          <div className="d-flex justify-content-end my-1">
                            <button onClick={() => reply(itm)}>Reply </button>
                          </div>
                        </Timeline>
                        <Divider />
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

export default Received;
