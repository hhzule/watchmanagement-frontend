import React, { useState, useEffect } from "react";
import {
  Input,
  Row,
  Col,
  Card,
  Form,
  Button,
  Upload,
  InputNumber,
  message,
  Select,
} from "antd";

import {
  AUTH_TOKEN,
  EMILUS_USER,
  AUTH_ROLE,
  EMILUS_USER_Email,
} from "../../../../../constants/AuthConstant";
import { useLocation } from "react-router-dom";
import { ImageSvg } from "assets/svg/icon";
import AvatarStatus from "components/shared-components/AvatarStatus";
import CustomIcon from "components/util-components/CustomIcon";
import { LoadingOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
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

const Create = (props) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [submitLoading, setSubmitLoading] = useState(false);
  const location = useLocation();
  const senderId = localStorage.getItem(AUTH_TOKEN);
  const senderEmail = localStorage.getItem(EMILUS_USER_Email);
  const senderRole = localStorage.getItem(AUTH_ROLE);
  const lastSegmentId = location.pathname.split("/").pop();
  const [watchData, setWatchData] = useState();
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        await fetch(
          `${process.env.REACT_APP_BASE_PATH}/watchid/${lastSegmentId}`
        )
          .then((response) => response.json())
          .then((data) => {
            setWatchData(data);
            console.log("result ==>", data);
          });
        // message.success(`Message sent`, [5]);
      } catch (error) {
        console.log("error", error);
      }
    };
    // const fetchOptions = async () => {
    //   try {
    //      // app.post('/api/message', MessageController.createMessageHandler)
    //   // app.post('/api/updatemessage', MessageController.updateHandler)
    //     await fetch(`${process.env.REACT_APP_BASE_PATH}/message`)
    //       .then((response) => response.json())
    //       .then((data) => {
    //         console.log("data", data);
    //         // return setOptionList(data);
    //       });
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
    fetchOptions();
  }, []);

  const onFinish = async () => {
    form
      .validateFields()
      .then((values) => {
        setTimeout(async () => {
          setSubmitLoading(true);
          console.log("senderEmail", senderEmail);
          const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              quote: values.quote,
              senderId: senderId,
              senderRole: senderRole,
              receiverId: watchData.creator,
              receiverRole: "string",
              acccept: false,
              reject: false,
              read: false,
              watchId: watchData._id,
              //   senderEmail: senderEmail,
              senderEmail: "hhzule@gmail.com",
            }),
          };
          try {
            console.log("reop", requestOptions);
            await fetch(
              `${process.env.REACT_APP_BASE_PATH}/message`,
              requestOptions
            )
              .then((response) => response.json())
              .then((data) => console.log("result ==>", data));
            setSubmitLoading(false);
            message.success(`Message sent`, [5]);
            // navigate(`/app/apps/watches/watch-list`);
          } catch (error) {
            console.log("error", error);
          }
        }, 500);
      })
      .catch((info) => {
        // console.log("info", info);
        message.error("Please enter all required field ");
      });
    setTimeout(async () => {
      form.setFieldsValue({
        quote: 0,
      });
    }, 800);
  };
  return (
    <Row gutter={16}>
      <Form
        layout="vertical"
        form={form}
        name="advanced_search"
        className="ant-advanced-search-form"
      >
        <Col xs={24} sm={24} md={17}>
          <Card title="Basic Info">
            <Form.Item name="quote" label="Quote" rules={rules.quote}>
              <Input placeholder="Give a quote" />
            </Form.Item>
            <Button
              type="primary"
              onClick={() => onFinish()}
              loading={submitLoading}
            >
              Send Message
            </Button>
          </Card>
        </Col>
      </Form>
    </Row>
  );
};

export default Create;
