import React, { useState, useEffect } from "react";
import { Card, Row, Col } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AUTH_TOKEN } from "../../../constants/AuthConstant";

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
  const [profileData, setProfileData] = useState([]);

  const fetchData = async () => {
    try {
      // const requestOptions = {
      //   method: "PATCH",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     id: token,
      //   }),
      // };
      await fetch(`${process.env.REACT_APP_BASE_PATH}/admin`)
        .then((response) => response.json())
        .then((data) => {
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
                              <p>{itm[0]._id}</p>
                              <h5>User Email</h5>
                              <p>{itm[0].email}</p>
                              <h5>User Name</h5>
                              <p>{itm[0].name}</p>
                              <h5>User Wallet Address</h5>
                              <p>{itm[0].walletAddress}</p>
                              <h5>User Encrypted Private Key</h5>
                              <p>{itm[0].encryptedPrivateKey}</p>
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
