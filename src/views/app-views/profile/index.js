import React, { useState, useEffect } from "react";
import { Card, Row, Col } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AUTH_TOKEN, AUTH_ROLE } from "../../../constants/AuthConstant";

const backgroundStyle = {
  backgroundImage: "url(/img/others/img-17.jpg)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
};

const Profile = () => {
  const navigate = useNavigate();
  // const userData = useSelector((state) => state);
  // console.log("data from selector: " + JSON.stringify(userData));
  const token = localStorage.getItem(AUTH_TOKEN);
  const role = localStorage.getItem(AUTH_ROLE);
  const [profileData, setProfileData] = useState([]);

  const fetchData = async () => {
    if (role === "admin") {
      try {
        await fetch(`${process.env.REACT_APP_BASE_PATH}/admin`)
          .then((response) => response.json())
          .then((data) => {
            console.log("data from", data);
            if (data?.message) {
              localStorage.removeItem(AUTH_TOKEN);
              // navigate("/");
            } else {
              setProfileData([data[0]]);
            }
          });
      } catch (err) {
        console.log("error", err);
      }
    } else if (role === "customer") {
      try {
        await fetch(
          `${process.env.REACT_APP_BASE_PATH}/customerprofile/${token}`
        )
          .then((response) => response.json())
          .then((data) => {
            console.log("data from", data);
            if (data?.message) {
              localStorage.removeItem(AUTH_TOKEN);
              // navigate("/");
            } else {
              setProfileData([data]);
            }
          });
      } catch (err) {
        console.log("error", err);
      }
    } else {
      try {
        await fetch(`${process.env.REACT_APP_BASE_PATH}/dealersignin/${token}`)
          .then((response) => response.json())
          .then((data) => {
            console.log("data from", data);
            if (data?.message) {
              localStorage.removeItem(AUTH_TOKEN);
              // navigate("/");
            } else {
              setProfileData([data]);
            }
          });
      } catch (err) {
        console.log("error", err);
      }
    }
  };

  useEffect(() => {
    if (token == null) {
      navigate("/");
      console.log("first");
    } else {
      fetchData();
    }
  }, []);

  return (
    <main className="vh-100 py-5" style={backgroundStyle}>
      <div className="vh-100 vw-100 flex-column justify-content-center">
        <Row justify="center">
          <Col xs={20} sm={20} md={20} lg={10}>
            <Card>
              <div className="my-4 ">
                <div className="text-center">
                  <img
                    className="img-fluid"
                    src={`/img/logo-white.png`}
                    alt=""
                  />
                </div>
                <Row gutter={16} justify="center">
                  <Col>
                    <Card title="Profile Info">
                      {profileData &&
                        profileData.map((itm, i) => {
                          console.log("itm", itm);
                          return (
                            <div key={i}>
                              <h5>User Id</h5>
                              <p>{itm._id}</p>
                              <h5>User Email</h5>
                              <p>{itm.email}</p>
                              <h5>User Name</h5>
                              <p>{itm.name}</p>
                              <h5>User Wallet Address</h5>
                              <p>{itm.walletAddress}</p>
                            </div>
                          );
                        })}
                    </Card>
                  </Col>
                  {/* <Col xs={24} sm={24} md={7}></Col> */}
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </main>
  );
};

export default Profile;
