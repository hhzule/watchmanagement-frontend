import React, { useState } from "react";
import {
  Card,
  Table,
  Col,
  Row,
  // Select,
  message,
  Image,
} from "antd";
// import WatchTrxData from "assets/data/trx.data.json";

import { SearchOutlined } from "@ant-design/icons";
import AvatarStatus from "components/shared-components/AvatarStatus";
import Flex from "components/shared-components/Flex";
import NumberFormat from "react-number-format";
import utils from "utils";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const TransactionsList = () => {
  const [list, setList] = useState();
  const [detaii, setDetail] = useState();
  const location = useLocation();
  const [imgUrl, setImgUrl] = useState();
  const [qrcode, setQrcode] = useState();
  const [errorTx, setError] = useState();
  const [replace, setReplace] = useState();
  const lastSegmentId = location.pathname.split("/").pop();
  const res = location.pathname.includes("dealer");

  const tableColumns = [
    {
      title: "Hash",
      dataIndex: "hash",
      render: (_, record) => (
        <a
          href={`https://mumbai.polygonscan.com/tx/${record.hash}`}
          // to={`https://mumbai.polygonscan.com/tx/${record.hash}`}
          // src={`https://mumbai.polygonscan.com/tx/${record.hash}`}
          target="_blank"
        >
          <div className="d-flex">{`${record.hash.slice(
            0,
            4
          )}...${record.hash.slice(-4)}`}</div>
        </a>
      ),
    },
    {
      title: "From",
      dataIndex: "from",
      render: (_, record) => <div className="d-flex">{record.from}</div>,
    },
    {
      title: "TimeStamp",
      dataIndex: "time",
      render: (_, record) => {
        const dateString = record.time;
        const date = new Date(dateString);
        const options = {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        };
        const humanReadableDate = date.toLocaleString(options);
        return <div className="d-flex">{humanReadableDate}</div>;
      },
    },
    {
      title: "Token Id",
      dataIndex: "tokenId",
      // sorter: (a, b) => utils.antdTableSorter(a, b, 'value')
    },
    {
      title: "To",
      dataIndex: "to",
      render: (_, record) => <div className="d-flex">{record.to}</div>,
    },
  ];

  const tableColumns2 = [
    {
      title: "From",
      dataIndex: "from",
      render: (_, record) => <div className="d-flex">{record.from}</div>,
    },
    {
      title: "TimeStamp",
      dataIndex: "time",
      render: (_, record) => <div className="d-flex">{record.time}</div>,
      // sorter: (a, b) => utils.antdTableSorter(a, b, 'timeStamp')
    },
    {
      title: "Token Id",
      dataIndex: "tokenId",
      // sorter: (a, b) => utils.antdTableSorter(a, b, 'value')
    },
    {
      title: "To",
      dataIndex: "to",
      render: (_, record) => <div className="d-flex">{record.to}</div>,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetch(`${process.env.REACT_APP_BASE_PATH}/watch/${lastSegmentId}`)
          .then((response) => response.json())
          .then((data) => {
            console.log("result ==>", data);
            setImgUrl(data[0].imgUrl);
            setQrcode(data[0].qrcode);
            // setList(data?.transactions);
            setDetail(data);
          });
      } catch (error) {
        console.log(error);
      }
    };
    const fetchTrx = async () => {
      try {
        await fetch(
          `${process.env.REACT_APP_BASE_PATH}/transactions/${lastSegmentId}`
        )
          .then((response) => response.json())
          .then((data) => {
            console.log("result ==>", data);
            setList(data?.transactions);
            setError(data?.error);
          });
      } catch (error) {
        console.log("error,", error);
      }
    };

    fetchData();
    fetchTrx();
  }, []);

  //   const onSearch = (e) => {
  //     const value = e.currentTarget.value;
  //     console.log("value", value);
  //     const searchArray = e.currentTarget.value ? list : list;
  //     const data = utils.wildCardSearch(searchArray, value);
  //     setList(data);
  //     // setSelectedRowKeys([])
  //   };

  return (
    <Card>
      <Col>
        <Card>
          <div className="my-4 ">
            <div className="text-center"></div>
            <Row gutter={5} justify="center">
              <Col>
                <Card title="WatchNFT">
                  {" "}
                  {/* <Image
                    className="img-fluid  max-width: 100%; height: auto"
                    // width={400}
                    src={imgUrl}
                  /> */}
                </Card>
                <h5>Watch</h5>
                {detaii &&
                  detaii.map((itm, i) => {
                    return (
                      <div key={i}>
                        <Flex>
                          <div className="">
                            <h5>Name</h5>
                            <p>{itm.owner}</p>
                            <h5>Token Id</h5>
                            <p>{itm.tokenId}</p>
                            <h5>Holder Address</h5>
                            <p>{itm.holderAddress}</p>
                          </div>

                          {/* 8888888888888888888888888888888888888888888888888888888888888 */}

                          <div className="mr-md-3 mb-3 ">
                            <div className="d-flex">
                              <AvatarStatus
                                size={120}
                                type="square"
                                src={qrcode}
                              />
                            </div>
                          </div>
                        </Flex>
                      </div>
                    );
                  })}
              </Col>
              <Col xs={24} sm={24} md={7}></Col>
            </Row>
          </div>
        </Card>
      </Col>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        mobileFlex={false}
      >
        {/* <Flex className="mb-1" mobileFlex={false}>
          <div className="mr-md-3 mb-3">
            <Input
              placeholder="Search"
              prefix={<SearchOutlined />}
              onChange={(e) => onSearch(e)}
            />
          </div>
        </Flex> */}
      </Flex>
      <div className="table-responsive">
        {res === "dealer" ? (
          <Table columns={tableColumns2} dataSource={list} rowKey="id" />
        ) : (
          <Table columns={tableColumns} dataSource={list} rowKey="id" />
        )}
        {errorTx && <div>{errorTx}</div>}
      </div>
    </Card>
  );
};

export default TransactionsList;
