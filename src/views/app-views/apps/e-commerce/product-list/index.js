import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Select,
  Input,
  InputNumber,
  Button,
  Checkbox,
  Modal,
  Col,
  Form,
  Tabs,
  message,
  Menu,
} from "antd";
import {
  // EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  EditOutlined,
  PlusCircleOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import AvatarStatus from "components/shared-components/AvatarStatus";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import Flex from "components/shared-components/Flex";
import NumberFormat from "react-number-format";
import { useNavigate } from "react-router-dom";
import utils from "utils";
import {
  AUTH_TOKEN,
  AUTH_ROLE,
  EMILUS_USER_Email,
} from "constants/AuthConstant";
import TextArea from "antd/es/input/TextArea";

const { Option } = Select;
const creatorId = localStorage.getItem(AUTH_TOKEN);
const role = localStorage.getItem(AUTH_ROLE);

const ProductList = () => {
  const navigate = useNavigate();
  const [list, setList] = useState();
  const [searchList, setSearchList] = useState();
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const categories = ["Approved", "Pending"];
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  // const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState();
  const [serialNumber, setSerialNumber] = useState();
  const [display, setDisplay] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowData, setRowData] = useState();
  const senderId = localStorage.getItem(AUTH_TOKEN);
  const senderEmail = localStorage.getItem(EMILUS_USER_Email);
  const senderRole = localStorage.getItem(AUTH_ROLE);
  useEffect(() => {
    setDisplay(false);
    const fetchData = async () => {
      // if (role === "admin")   {
      await fetch(`${process.env.REACT_APP_BASE_PATH}/watches`)
        .then((response) => response.json())
        .then((data) => {
          setList(data);
          setSearchList(data);
        });
      // } else {
      //   await fetch(`${process.env.REACT_APP_BASE_PATH}/watches/${creatorId}`)
      //     .then((response) => response.json())
      //     .then((data) => {
      //       setList(data);
      //       setSearchList(data);
      //     });
      // }
    };

    fetchData();
  }, []);
  const showModal = (row) => {
    form.setFieldsValue({
      quote: "",
    });
    setRowData(row);
    setIsModalOpen(true);
  };

  const onFinish = (mode) => {
    console.log("row", mode);
    form
      .validateFields()
      .then((values) => {
        setTimeout(async () => {
          setSubmitLoading(true);
          console.log("values.quote", values);
          console.log("values.text", values.text);
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
              firstUserId: senderId,
              firstUserEmail: senderEmail,
              secondUserId: rowData.owner,
              secondUserEmail: rowData.ownerEmail,
              Chat: [
                {
                  message: chatmessage,
                  type: mode,
                  fromId: senderId,
                  fromRole: senderRole,
                  fromEmail: senderEmail,
                  toId: rowData.owner,
                  toEmail: rowData.ownerEmail,
                  accept: "string",
                  reject: "string",
                  switched: false,
                  watchId: rowData._id,
                },
              ],
            }),
          };
          console.log("reqOpt", requestOptions);
          try {
            await fetch(
              `${process.env.REACT_APP_BASE_PATH}/message`,
              requestOptions
            )
              .then((response) => response.json())
              .then((data) => data);
            setSubmitLoading(false);
            message.success(`Message sent`, [5]);

            setIsModalOpen(false);
          } catch (error) {
            console.log("error", error);
          }
          // form.setFieldsValue({ quote: "", text: "" });
        }, 500);
      })
      .catch((info) => {
        // console.log("info", info);
        setSubmitLoading(false);
        setIsModalOpen(false);
        message.error("Please enter all required field ");
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const dropdownMenu1 = (row) => {
    return (
      <Menu>
        <Menu.Item onClick={() => deleteRow(row)}>
          <Flex alignItems="center">
            <DeleteOutlined />
            <span className="ml-2">{"Delete"}</span>
          </Flex>
        </Menu.Item>
        <Menu.Item onClick={() => editRow(row)}>
          <Flex alignItems="center">
            <EditOutlined />

            <span className="ml-2">{"Edit"}</span>
          </Flex>
        </Menu.Item>
        <Menu.Item onClick={() => trxRow(row)}>
          <Flex alignItems="center">
            <ApartmentOutlined />

            <span className="ml-2">{"Transtactions"}</span>
          </Flex>
        </Menu.Item>
        {senderEmail === row.ownerEmail ? null : (
          <>
            <Menu.Item onClick={() => messageF(row)}>
              <Flex alignItems="center">
                <EditOutlined />

                <span className="ml-2">{"Message"}</span>
              </Flex>
            </Menu.Item>
          </>
        )}
      </Menu>
    );
  };

  const dropdownMenu = (row) => {
    return (
      <Menu>
        <Menu.Item onClick={() => deleteRow(row)}>
          <Flex alignItems="center">
            <DeleteOutlined />
            <span className="ml-2">{"Delete"}</span>
          </Flex>
        </Menu.Item>
        <Menu.Item onClick={() => editRow(row)}>
          <Flex alignItems="center">
            <EditOutlined />

            <span className="ml-2">{"Edit"}</span>
          </Flex>
        </Menu.Item>
        {senderEmail === row.ownerEmail ? null : (
          <>
            <Menu.Item onClick={() => messageF(row)}>
              <Flex alignItems="center">
                <EditOutlined />

                <span className="ml-2">{"Message"}</span>
              </Flex>
            </Menu.Item>
          </>
        )}
      </Menu>
    );
  };
  const dropdownMenu2 = (row) => {
    return (
      <Menu>
        <Menu.Item onClick={() => deleteRow(row)}>
          <Flex alignItems="center">
            <DeleteOutlined />
            <span className="ml-2">{"Delete"}</span>
          </Flex>
        </Menu.Item>
        <Menu.Item onClick={() => editRow(row)}>
          <Flex alignItems="center">
            <EditOutlined />

            <span className="ml-2">{"Edit"}</span>
          </Flex>
        </Menu.Item>
        {senderEmail === row.ownerEmail ? null : (
          <>
            <Menu.Item onClick={() => messageF(row)}>
              <Flex alignItems="center">
                <EditOutlined />

                <span className="ml-2">{"Message"}</span>
              </Flex>
            </Menu.Item>
          </>
        )}
      </Menu>
    );
  };

  const approveWatch = async () => {
    setLoading(true);
    console.log("selected from approve", selected);
    if (selected.length === 0) {
      message.success(`Select Watch to approve`, [3]);
      setLoading(false);
      return;
    }
    try {
      console.log("approveran");
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auth: localStorage.getItem(AUTH_TOKEN),
          watches: selected,
        }),
      };
      await fetch(
        `${process.env.REACT_APP_BASE_PATH}/adminwatch`,
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          const listData = removeObjectWithId(list, data.id);
          setList(listData);
          setSelected([]);
        });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
    // setCategory("All");
  };

  const addProduct = () => {
    navigate(`/app/apps/watches/add-product`);
  };
  const editRow = (row) => {
    navigate(`/app/apps/watches/edit-product/${row._id}`);
  };

  const trxRow = (row) => {
    navigate(`/app/apps/watches/transactions/${row.tokenId}`);
  };

  const messageF = (row) => {
    showModal(row);
    // navigate(`/app/apps/watches/message/${row._id}`);
  };

  // const viewDetails = row => {
  // 	navigate(`/app/apps/ecommerce/edit-product/${row.id}`)
  // }

  function removeObjectWithId(arr, id) {
    const objWithIdIndex = arr.findIndex((obj) => obj.id === id);

    if (objWithIdIndex > -1) {
      arr.splice(objWithIdIndex, 1);
    }

    return arr;
  }

  const addToList = (elm) => {
    console.log("selected", selected);
    let res = selected.find((item) => item._id === elm._id);
    console.log("res", res);
    if (!res) {
      console.log("from if");
      setSelected((prev) => [...prev, elm]);
    } else {
      console.log("from else");
      let updatedArr = removeObjectWithId(selected, res.id);
      setSelected(updatedArr);
    }
  };

  const deleteRow = async (row) => {
    try {
      const _id = row._id;
      const requestOptions = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id }),
      };

      await fetch(`${process.env.REACT_APP_BASE_PATH}/watch`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          data = list.filter((item) => item[_id] !== _id);
          setList(data);
        });

      const data = list.filter((item) => item["_id"] !== _id);
      setList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const tableColumns = [
    {
      title: "Owner",
      dataIndex: "owner",
    },
    {
      title: "Email",
      dataIndex: "ownerEmail",
    },
    {
      title: "Watch",
      dataIndex: "name",
      render: (_, record) => {
        return (
          <div className="d-flex">
            <AvatarStatus
              size={60}
              type="square"
              src={record.imgUrl[0]}
              name={record.name}
            />
          </div>
        );
      },
      sorter: (a, b) => utils.antdTableSorter(a, b, "name"),
    },
    {
      title: "Model",
      dataIndex: "model",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status, elm, i, e) => {
        return (
          <>
            <div className="text-center">
              <p>{status}</p>
              {role && role == "admin" && status == "Pending" ? (
                <Checkbox onClick={() => addToList(elm, i)} />
              ) : null}
            </div>
          </>
        );
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (price) => (
        <div>
          <NumberFormat
            displayType={"text"}
            value={(Math.round(price * 100) / 100).toFixed(2)}
            prefix={"$"}
            thousandSeparator={true}
          />
        </div>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "price"),
    },
    {
      title: "Serial Number",
      dataIndex: "serialNumber",
    },
    {
      title: "Case Material",
      dataIndex: "caseMaterial",
    },
    {
      title: "Bracelet Material",
      dataIndex: "braceletMaterial",
    },
    {
      title: "Case Material",
      dataIndex: "caseMaterial",
    },
    {
      title: "Movement Model",
      dataIndex: "movementModel",
    },
    {
      title: "Movement Serial",
      dataIndex: "movementSerial",
    },
    {
      title: "Movement Mechanism",
      dataIndex: "movementMechanism",
    },
    {
      title: "Dial Color",
      dataIndex: "dialColor",
    },
    {
      title: "Hands",
      dataIndex: "hands",
    },
    {
      title: "Feature",
      dataIndex: "feature",
    },
    {
      title: "",
      dataIndex: "actions",
      render: (_, elm) => (
        <div className="text-right">
          {role && role == "admin" ? (
            elm.status === "Approved" ? (
              <EllipsisDropdown menu={dropdownMenu1(elm)} />
            ) : (
              <EllipsisDropdown menu={dropdownMenu(elm)} />
            )
          ) : (
            <EllipsisDropdown menu={dropdownMenu2(elm)} />
          )}
        </div>
      ),
    },
  ];

  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = e.currentTarget.value && list;
    const data = utils.wildCardSearch(searchArray, value);
    if (value.length === 0) {
      setList(searchList);
    } else if (data.length > 0) {
      setList(data);
    } else if (value.length > 0) {
      setList(searchList);
    }
  };

  const handleShowCategory = (value) => {
    // console.log("list1", list.length);
    // console.log("selected1", selected.length);
    // if (value !== "All") {
    //   const key = "status";
    //   const data = utils.filterArray(searchList, key, value);
    //   setList(data);
    //   console("list2", list.length);
    //   console.log("selected2", selected.length);
    // } else if (list.length < 1) {
    //   setList(searchList);
    //   console("list3", list.length);
    //   console.log("selected3", selected.length);
    // } else {
    //   setList(searchList);
    // }
    // *********************************
    if (value !== "All") {
      const key = "status";
      const data = utils.filterArray(searchList, key, value);
      setList(data);
    } else {
      setList(searchList);
    }
  };

  const handleShowModel = async (value) => {
    console.log("handleShowModel brand", brand);
    console.log("handleShowModel serial", serialNumber);
    let body;
    if (
      serialNumber === undefined ||
      serialNumber === null ||
      serialNumber === ""
    ) {
      body = [brand];
    } else {
      body = [brand, serialNumber];
    }
    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      };
      console.log("requestOptions", requestOptions);
      await fetch(
        `${process.env.REACT_APP_BASE_PATH}/watchsearch`,
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("data", data);
          if (body.length > 1) {
            setDisplay(true);
            setList(data);
          } else {
            setDisplay(false);
            setList(data);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
  // const rules = {
  //   quote: [
  //     {
  //       // required: true,
  //       message: "Number must be entered",
  //       pattern: new RegExp(/^[0-9]+$/),
  //     },
  //   ],
  // };

  return (
    <>
      <Card>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          mobileFlex={false}
        >
          <Flex className="mb-1" mobileFlex={false}>
            <div className="mr-md-3 mb-3">
              <Input
                placeholder="Brand Name"
                prefix={<SearchOutlined />}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
            <div className="mr-md-3 mb-3">
              <Input
                placeholder="Serial Number"
                prefix={<SearchOutlined />}
                onChange={(e) => setSerialNumber(e.target.value)}
              />
            </div>
          </Flex>
          <Flex>
            <Button
              onClick={handleShowModel}
              type="primary"
              icon={<PlusCircleOutlined />}
              disabled={loading}
            >
              Search
            </Button>
          </Flex>
        </Flex>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          mobileFlex={false}
        >
          <Flex className="mb-1" mobileFlex={false}>
            {/* <div className="mr-md-3 mb-3">
            <Input
              placeholder="Search"
              prefix={<SearchOutlined />}
              onChange={(e) => onSearch(e)}
            />
          </div> */}
            <div className="mb-3">
              <Select
                defaultValue="All"
                className="w-100"
                style={{ minWidth: 180 }}
                onChange={handleShowCategory}
                placeholder="Category"
              >
                <Option value="All">All Status</Option>
                {categories.map((elm) => (
                  <Option key={elm} value={elm}>
                    {elm}
                  </Option>
                ))}
              </Select>
            </div>
          </Flex>
          <Flex>
            {role == "admin" && (
              <>
                {/* <div> */}

                <Button
                  onClick={approveWatch}
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  disabled={loading}
                >
                  Approve
                </Button>

                {/* <Button
                onClick={addProduct}
                type="primary"
                icon={<PlusCircleOutlined />}
                block
              >
                Add watch
              </Button> */}
                {/* </div> */}
              </>
            )}

            {/* <div> */}

            {/* </div> */}
          </Flex>
        </Flex>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          mobileFlex={false}
        >
          <Flex>
            {role == "admin" && (
              <>
                <Button
                  onClick={addProduct}
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  block
                >
                  Add watch
                </Button>
                {/* </div> */}
              </>
            )}

            {/* <div> */}

            {/* </div> */}
          </Flex>
        </Flex>
        {display ? (
          <>
            {" "}
            <div className="vh-100 vw-100 flex-column justify-content-center">
              <div className="my-4 ">
                {list && (
                  <div>
                    <div>
                      <img
                        className="img-fluid  max-width: 20%; height: 20%"
                        src={list[0].imgUrl[0]}
                        alt=""
                      />
                    </div>
                    {/* <h5>Watch Id</h5>
                  <p>{list[0]._id}</p> */}
                    <h5>Name: {list[0].name} </h5>
                    <h5>Model :{list[0].model}</h5>
                    <h5>Owner : {list[0].owner} </h5>
                    <h5>Owner Email: {list[0].ownerEmail} </h5>
                    {/* <h5>Creator</h5>
                    <p>{list[0].creator}</p>
                    <h5>Case Material</h5>
                    <p>{list[0].caseMaterial}</p>
                    <h5>Bracelet Material</h5>
                    <p>{list[0].braseletMaterial}</p>
                    <h5>Dial Color</h5>
                    <p>{list[0].dialColor}</p>
                    <h5>Feature</h5>
                    <p>{list[0].feature}</p>
                    <h5>Hands</h5>
                    <p>{list[0].hands}</p>
                    <h5>Holder Address</h5>
                    <p>{list[0].holderAddress}</p>
                    <h5>Movement Mechanism</h5>
                    <p>{list[0].movementMechanism}</p>
                    <h5>Movement Model</h5>
                    <p>{list[0].movementModel}</p>
                    <h5>Movement Serial</h5>
                    <p>{list[0].movementSerial}</p>
                    <h5>Serial Number</h5>
                    <p>{list[0].serialNumber}</p>
                    <h5>Status</h5>
                    <p>{list[0].status}</p>
                    <h5>Price</h5>
                    <p>{list[0].price}</p> */}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="table-responsive">
              <Table columns={tableColumns} dataSource={list} rowKey="id" />
            </div>
          </>
        )}
      </Card>
      <Modal
        title="Quote/Message"
        open={isModalOpen}
        footer={null}
        // loading={submitLoading}
      >
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
                      <Form.Item name="quote" label="Quote">
                        <InputNumber maxLength={6} controls={false} />
                      </Form.Item>
                      <Button
                        type="primary"
                        onClick={() => onFinish("quote")}
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
                      <Form.Item name="text" label="Text">
                        <TextArea placeholder="Give a message" />
                      </Form.Item>
                      <Button
                        type="primary"
                        onClick={() => onFinish("message")}
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
      </Modal>
    </>
  );
};

export default ProductList;
