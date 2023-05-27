import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  // Select,
  Input,
  Button,
  Badge,
  Menu,
  Checkbox,
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

const ProductList = () => {
  const navigate = useNavigate();
  const [list, setList] = useState();
  const [searchList, setSearchList] = useState();
  const [selected, setSelected] = useState([]);
  // const [selectedRows, setSelectedRows] = useState([])
  // const [selectedRowKeys, setSelectedRowKeys] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetch(`${process.env.REACT_APP_BASE_PATH}/watches`)
          .then((response) => response.json())
          .then((data) => {
            // console.log("result ==>" ,data)
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
      <Menu.Item onClick={() => {}}>
        <Flex alignItems="center">
          <span className="ml-2">View Details</span>
        </Flex>
      </Menu.Item>
      <Menu.Item onClick={() => {}}>
        <Flex alignItems="center">
          <span className="ml-2">here</span>
        </Flex>
      </Menu.Item>
    </Menu>
  );

  const addToList = (elm) => {
    console.log("elm", elm);
    let res = selected.find((item) => item._id === elm._id);
    console.log("res", res);
    if (!res) {
      console.log("inside");
      setSelected((prev) => [...prev, { id: elm._id, creator: elm.creator }]);
    }
  };

  const addProduct = () => {
    navigate(`/app/apps/watches/add-product`);
  };

  const approveWatch = () => {
    console.log("first", selected);
  };

  const editRow = (row) => {
    console.log("row", row);
    navigate(`/app/apps/watches/edit-product/${row._id}`);
  };

  const trxRow = (row) => {
    console.log("row", row);
    navigate(`/app/apps/watches/transactions/${row._id}`);
  };

  // const viewDetails = row => {
  // 	navigate(`/app/apps/ecommerce/edit-product/${row.id}`)
  // }

  const deleteRow = async (row) => {
    console.log("row", row);
    // if(selectedRows.length > 1) {
    // 	selectedRows.forEach(elm => {
    // 		data = utils.deleteArrayRow(data, objKey, elm.id)
    // 		setList(data)
    // 		setSelectedRows([])
    // 	})
    // } else {
    // 	data = utils.deleteArrayRow(data, objKey, row.id)
    // 	setList(data)
    // }
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
      // sorter: (a, b) => utils.antdTableSorter(a, b, "name"),
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
              {status == "Pending" ? (
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
    // {
    //   title: "",
    //   dataIndex: "actions",
    //   render: (_, elm) => (
    //     <div className="text-right">
    //       <EllipsisDropdown menu={dropdownMenu(elm)} />
    //     </div>
    //   ),
    // },
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
    // setSelectedRowKeys([])
  };

  // const handleShowCategory = value => {
  // 	if(value !== 'All') {
  // 		const key = 'category'
  // 		const data = utils.filterArray(ProductListData, key, value)
  // 		setList(data)
  // 	} else {
  // 		setList(ProductListData)
  // 	}
  // }

  return (
    <Card>
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
          {/* <div className="mb-3">
						<Select 
							defaultValue="All" 
							className="w-100" 
							style={{ minWidth: 180 }} 
							onChange={handleShowCategory} 
							placeholder="Category"
						>
							<Option value="All">All</Option>
							{
								categories.map(elm => (
									<Option key={elm} value={elm}>{elm}</Option>
								))
							}
						</Select>
					</div> */}
        </Flex>
        {/* only admin  */}
        {/* <div>
          <Button
            onClick={addProduct}
            type="primary"
            icon={<PlusCircleOutlined />}
            block
          >
            Add watch
          </Button>
        </div> */}
        <div>
          <Button
            onClick={approveWatch}
            type="primary"
            icon={<PlusCircleOutlined />}
            block
          >
            Approve
          </Button>
        </div>
      </Flex>
      <div className="table-responsive">
        <Table
          columns={tableColumns}
          dataSource={list}
          rowKey="id"
          // rowSelection={{
          // 	selectedRowKeys: selectedRowKeys,
          // 	type: 'checkbox',
          // 	preserveSelectedRowKeys: false,
          // 	...rowSelection,
          // }}
        />
      </div>
    </Card>
  );
};

export default ProductList;
