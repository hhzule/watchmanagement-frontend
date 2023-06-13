import React, { useState, useEffect } from "react";
import PageHeaderAlt from "components/layout-components/PageHeaderAlt";
import { Card, Tabs, Form, Button, message, Row, Col } from "antd";
import Flex from "components/shared-components/Flex";
import { useLocation } from "react-router-dom";
import { AUTH_TOKEN, EMILUS_USER } from "../../../../../constants/AuthConstant";
import Create from "./Create";
import Sent from "./Sent";
import Received from "./Received";
import { useNavigate } from "react-router-dom";

const MessageForm = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const lastSegmentId = location.pathname.split("/").pop();
  const [form] = Form.useForm();
  const [tabKey, setTabKey] = useState();
  const [list, setList] = useState([{}]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        await fetch(`${process.env.REACT_APP_BASE_PATH}/cms`)
          .then((response) => response.json())
          .then((data) => {
            // return setOptionList(data);
          });
      } catch (error) {
        console.log(error);
      }
    };

    // fetchOptions();
  }, [form, tabKey]);

  const onFinish = async () => {
    form
      .validateFields()
      .then((values) => {
        setTimeout(async () => {
          //   setSubmitLoading(true);

          const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              //   _id: lastSegmentId,
              //   name: values.name,
              //   model: values.model,
              //   owner: localStorage.getItem(EMILUS_USER),
              //   price: values.price,
              //   imgUrl: img[0].imgUrl,
              //   status: values.status,
              //   serialNumber: values.serialNumber,
              //   caseMaterial: values.caseMaterial,
              //   braceletMaterial: values.braceletMaterial,
              //   movementModel: values.movementModel,
              //   movementSerial: values.movementSerial,
              //   movementMechanism: values.movementMechanism,
              //   dialColor: values.dialColor,
              //   hands: values.hands,
              //   feature: values.feature,
            }),
          };
          try {
            await fetch(
              `${process.env.REACT_APP_BASE_PATH}/watch`,
              requestOptions
            )
              .then((response) => response.json())
              .then((data) => console.log("result ==>", data));
            // setSubmitLoading(false);
            message.success(`Edited ${values.name} to watches list`, [5]);
            navigate(`/app/apps/watches/watch-list`);
          } catch (error) {
            console.log("error", error);
          }
        }, 1500);
      })
      .catch((info) => {
        // console.log("info", info);
        message.error("Please enter all required field ");
      });
  };
  console.log("tab", tabKey);
  return (
    <>
      {list?.length > 0 ? (
        <Form
          layout="vertical"
          form={form}
          name="advanced_search"
          className="ant-advanced-search-form"
        >
          <PageHeaderAlt className="border-bottom" overlap>
            <div className="container">
              <Flex
                className="py-2"
                mobileFlex={false}
                justifyContent="space-between"
                alignItems="center"
              >
                <h2 className="mb-3">add</h2>
                <div className="mb-3"></div>
              </Flex>
            </div>
          </PageHeaderAlt>
          <div className="container">
            <Tabs
              defaultActiveKey="1"
              style={{ marginTop: 30 }}
              items={[
                {
                  label: "Received",
                  key: "1",
                  children: <Received />,
                },
                {
                  label: "Sent",
                  key: "2",
                  children: <Sent />,
                },
              ]}
            />
          </div>
        </Form>
      ) : (
        <>
          {" "}
          <div></div>
        </>
      )}
    </>
  );
};

export default MessageForm;
