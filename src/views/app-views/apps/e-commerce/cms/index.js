import { useState, useEffect } from "react";
import PageHeaderAlt from "components/layout-components/PageHeaderAlt";
import { Tabs, Form, Button, message } from "antd";
import DealerField from "./DealerField";
import Flex from "components/shared-components/Flex";

const CustomForm = (props) => {
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [list, setList] = useState([{}]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetch(`${process.env.REACT_APP_BASE_PATH}/cms`)
          .then((response) => response.json())
          .then((data) => {
            setList(data);
          });
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [form]);

  const deleteFrom = async (e, label) => {
    let lab = label.toString();
    try {
      const elem = list[0][lab];
      const finalArr = elem.filter((el) => el !== e);
      let postBody = {};
      postBody["key"] = {};
      postBody["key"][lab] = finalArr;
      postBody["id"] = list[0]._id;
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postBody),
      };
      await fetch(
        `${process.env.REACT_APP_BASE_PATH}/updatecms`,
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          setList([data]);
        });
    } catch (error) {
      console.log(error);
    }
    // setList([{}]);
  };
  const addToList = async (e, label) => {
    form
      .validateFields()
      .then((values) => {
        setTimeout(async () => {
          setSubmitLoading(true);
          let lab = label.toString();
          if (values.name) {
            try {
              const finalArr = list[0][lab];
              finalArr.push(values.name);
              let postBody = {};
              postBody["key"] = {};
              postBody["key"][lab] = finalArr;
              postBody["id"] = list[0]._id;
              const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(postBody),
              };
              await fetch(
                `${process.env.REACT_APP_BASE_PATH}/updatecms`,
                requestOptions
              )
                .then((response) => response.json())
                .then((data) => {
                  setList([data]);
                });
            } catch (error) {
              console.log(error);
            }
          } else {
            message.error("Please enter field value");
          }
        }, 1500);
      })
      .catch((info) => {
        setSubmitLoading(false);
        message.error("Please enter all required field ");
      });
  };

  return (
    <>
      {list?.length > 0 ? (
        <Form
          layout="vertical"
          form={form}
          name="advanced_search"
          className="ant-advanced-search-form"
          fields={[
            {
              name: ["name"],
              value: list[0].name,
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
                <h2 className="mb-3">Edit</h2>
                {/* <div className="mb-3">
                  <Button className="mr-2" onClick={() => onDiscard()}>
                    Discard
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => onFinish()}
                    htmlType="submit"
                    loading={submitLoading}
                  >
                    Add
                  </Button>
                </div> */}
              </Flex>
            </div>
          </PageHeaderAlt>

          <div className="container">
            <Tabs
              defaultActiveKey="1"
              style={{ marginTop: 30 }}
              items={[
                {
                  label: "Brand",
                  key: "1",
                  children: (
                    <DealerField
                      renderList={list[0].brand}
                      add={addToList}
                      delete={deleteFrom}
                      label="brand"
                      loading={submitLoading}
                    />
                  ),
                },
                {
                  label: "Case Material",
                  key: "2",
                  children: (
                    <DealerField
                      renderList={list[0].caseMaterial}
                      add={addToList}
                      delete={deleteFrom}
                      label="caseMaterial"
                      loading={submitLoading}
                    />
                  ),
                },
                {
                  label: "Bracelet material",
                  key: "3",
                  children: (
                    <DealerField
                      renderList={list[0].braceletMaterial}
                      add={addToList}
                      delete={deleteFrom}
                      label="braceletMaterial"
                      loading={submitLoading}
                    />
                  ),
                },
                {
                  label: "Movement Mechanism",
                  key: "4",
                  children: (
                    <DealerField
                      renderList={list[0].movementMechanism}
                      add={addToList}
                      delete={deleteFrom}
                      label="movementMechanism"
                      loading={submitLoading}
                    />
                  ),
                },
                {
                  label: "Feature",
                  key: "5",
                  children: (
                    <DealerField
                      renderList={list[0].feature}
                      add={addToList}
                      delete={deleteFrom}
                      label="feature"
                      loading={submitLoading}
                    />
                  ),
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

export default CustomForm;
