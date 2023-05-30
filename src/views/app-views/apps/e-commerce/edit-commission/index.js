import React, { useState, useEffect } from "react";
import PageHeaderAlt from "components/layout-components/PageHeaderAlt";
import { Tabs, Form, Button, message } from "antd";
import Flex from "components/shared-components/Flex";
import CommissionField from "./CommissionField";
import { useNavigate } from "react-router-dom";
import { AUTH_TOKEN } from "constants/AuthConstant";

const EditCommission = (props) => {
  const navigate = useNavigate();

  const auth = localStorage.getItem(AUTH_TOKEN);
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [defaultCommission, setDefaultCommission] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetch(`${process.env.REACT_APP_BASE_PATH}/admin`)
          .then((response) => response.json())
          .then((data) => {
            console.log("result ==>", data[0].commission);
            setDefaultCommission(data[0].commission);
          });
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const onFinish = () => {
    setSubmitLoading(true);
    form
      .validateFields()
      .then((values) => {
        setTimeout(async () => {
          const postBody = {
            auth: auth,
            commission: defaultCommission,
          };

          try {
            const requestOptions = {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(postBody),
            };
            console.log(requestOptions);

            await fetch(
              `${process.env.REACT_APP_BASE_PATH}/adjustcommission`,
              requestOptions
            )
              .then((response) => response.json())
              .then((data) => console.log("add result ==>", data));
            setSubmitLoading(false);
            message.success(`Updated commission`, [3]);
            navigate(`/app/apps/dashboards/default`);
          } catch (error) {
            console.log(error);
            // message.success(`Created ${error.message} `);
          }
        }, 1500);
      })
      .catch((info) => {
        setSubmitLoading(false);
        console.log("info", info);
        message.error("Please enter all required field ");
      });
  };

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        name="advanced_search"
        className="ant-advanced-search-form"
        initialValues={{
          heightUnit: "cm",
          widthUnit: "cm",
          weightUnit: "kg",
        }}
        fields={[
          {
            name: ["commission"],
            value: defaultCommission,
          },
        ]}
      >
        <PageHeaderAlt className="border-bottom" overlap>
          <div className="container">
            <Flex
              className="py-2"
              mobileFlex={false}
              justifyContent="space-between"
              alignItems="center"
            >
              <h2 className="mb-3">{`Edit`} </h2>
              <div className="mb-3">
                {/* <Button className="mr-2">Discard</Button> */}
                <Button
                  type="primary"
                  onClick={() => onFinish()}
                  htmlType="submit"
                  loading={submitLoading}
                >
                  {`Save`}
                </Button>
              </div>
            </Flex>
          </div>
        </PageHeaderAlt>

        <div className="container">
          <Tabs
            defaultActiveKey="1"
            style={{ marginTop: 30 }}
            items={[
              {
                label: "General",
                key: "1",
                children: (
                  <CommissionField
                    setDefault={setDefaultCommission}
                    // defaultValue={defaultCommission}
                  />
                ),
              },
            ]}
          />
        </div>
      </Form>
    </>
  );
};
export default EditCommission;
