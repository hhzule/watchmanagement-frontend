import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Select,
  Input,
  Button,
  //  Badge,
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
import { AUTH_TOKEN } from "constants/AuthConstant";

const { Option } = Select;

const ProductList = () => {
  const navigate = useNavigate();
  const [list, setList] = useState();
  const [searchList, setSearchList] = useState();
  const categories = ["Approved", "Pending"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const creatorId = localStorage.getItem(AUTH_TOKEN);
        await fetch(`${process.env.REACT_APP_BASE_PATH}/watches/${creatorId}`)
          .then((response) => response.json())
          .then((data) => {
            setList(data);
            setSearchList(data);
          });
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const dropdownMenu = (row) => (
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

  const dropdownMenu1 = (row) => (
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

  const addProduct = () => {
    navigate(`/app/apps/watches/add-product`);
  };
  const editRow = (row) => {
    navigate(`/app/apps/watches/edit-product/${row._id}`);
  };

  const trxRow = (row) => {
    navigate(`/app/apps/watches/transactions/${row.tokenId}`);
  };

  // const viewDetails = row => {
  // 	navigate(`/app/apps/ecommerce/edit-product/${row.id}`)
  // }

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
      // sorter: (a, b) => utils.antdTableSorter(a, b, 'category')
    },
    {
      title: "Status",
      dataIndex: "status",
      // sorter: (a, b) => utils.antdTableSorter(a, b, 'category')
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
      render: (_, elm) => {
        return (
          <div className="text-right">
            {elm.status === "Approved" ? (
              <EllipsisDropdown menu={dropdownMenu(elm)} />
            ) : (
              <EllipsisDropdown menu={dropdownMenu1(elm)} />
            )}
          </div>
        );
      },
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
    const searchArray = e.currentTarget.value ? list : list;
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
    // console("list", list.length);
    if (value !== "All") {
      const key = "status";
      const data = utils.filterArray(searchList, key, value);
      setList(data);
      // console("list", list.length);
    } else {
      setList(searchList);
    }
    // else if (list.length < 1) {
    //   // setList(searchList);
    // }
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
        <div>
          <Button
            onClick={addProduct}
            type="primary"
            icon={<PlusCircleOutlined />}
            block
          >
            Add watch
          </Button>
        </div>
      </Flex>
      <div className="table-responsive">
        <Table columns={tableColumns} dataSource={list} rowKey="id" />
      </div>
    </Card>
  );
};

export default ProductList;
