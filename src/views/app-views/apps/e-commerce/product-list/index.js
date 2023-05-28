import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Select,
  Input,
  Button,
  Checkbox,
  //  Badge,
  message,
  Menu,
} from "antd";
import WatchImg from "../../../../../assets/svg/watch.jpeg";
// import ProductListData from "assets/data/product-list.data.json"
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
import { AUTH_TOKEN, AUTH_ROLE } from "constants/AuthConstant";

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

  useEffect(() => {
    const fetchData = async () => {
      if (role === "admin") {
        await fetch(`${process.env.REACT_APP_BASE_PATH}/watches`)
          .then((response) => response.json())
          .then((data) => {
            setList(data);
            setSearchList(data);
          });
      } else {
        await fetch(`${process.env.REACT_APP_BASE_PATH}/watches/${creatorId}`)
          .then((response) => response.json())
          .then((data) => {
            setList(data);
            setSearchList(data);
          });
      }
    };

    fetchData();
  }, [selected]);

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
      </Menu>
    );
  };

  const dropdownMenu = (row) => {
    console.log("row", row.status);
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
      </Menu>
    );
  };

  const approveWatch = async () => {
    setLoading(true);
    console.log("selected", selected);
    if (selected.length === 0) {
      message.success(`Select Watch to approve`, [5]);
      setLoading(false);
      return;
    }
    console.log("approve ran");
    try {
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
          console.log("result ==>", data);

          setList((prev) => [data, ...prev]);
          setSelected([]);
        });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const addProduct = () => {
    navigate(`/app/apps/watches/add-product`);
  };
  const editRow = (row) => {
    console.log("row", row);
    navigate(`/app/apps/watches/edit-product/${row._id}`);
  };

  const trxRow = (row) => {
    // console.log("row", row);
    navigate(`/app/apps/watches/transactions/${row.tokenId}`);
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
    let res = selected.find((item) => item._id === elm._id);
    console.log("res", res);
    if (!res) {
      console.log("inside");
      setSelected((prev) => [...prev, elm]);
    } else {
      console.log("outside");
      let updatedArr = removeObjectWithId(selected, res.id);
      console.log("updatedArr", updatedArr);
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
          console.log("result ==>", data);
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
      title: "Watch",
      dataIndex: "name",
      render: (_, record) => {
        return (
          <div className="d-flex">
            <AvatarStatus
              size={60}
              type="square"
              src={record.imgUrl}
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
      // sorter: (a, b) => utils.antdTableSorter(a, b, 'category')
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
          ) : null}
        </div>
      ),
    },
  ];

  // const rowSelection = {
  // 	onChange: (key, rows) => {
  // 		setSelectedRows(rows)
  // 		setSelectedRowKeys(key)
  // 	}
  // };

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
    if (value !== "All") {
      console.log("if");
      const key = "status";
      const data = utils.filterArray(searchList, key, value);
      console.log("data", data);
      setList(data);
    } else if (list.length < 1) {
      setList(searchList);
    } else {
      console.log("else");
      setList(searchList);
    }
  };

  return (
    <Card>
      {/* <h1>hello</h1> */}
      <Flex
        alignItems="center"
        justifyContent="space-between"
        mobileFlex={false}
      >
        <Flex className="mb-1" mobileFlex={false}>
          <div className="mr-md-3 mb-3">
            <Input
              placeholder="Search"
              prefix={<SearchOutlined />}
              onChange={(e) => onSearch(e)}
            />
          </div>
          <div className="mb-3">
            <Select
              defaultValue="All"
              className="w-100"
              style={{ minWidth: 180 }}
              onChange={handleShowCategory}
              placeholder="Category"
            >
              <Option value="All">All</Option>
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
      <div className="table-responsive">
        <Table columns={tableColumns} dataSource={list} rowKey="id" />
      </div>
    </Card>
  );
};

export default ProductList;
