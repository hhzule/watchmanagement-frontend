import React, { useState } from "react";
import {
  Input,
  Row,
  Col,
  Card,
  Form,
  Upload,
  InputNumber,
  message,
  Select,
} from "antd";
import { ImageSvg } from "assets/svg/icon";
import CustomIcon from "components/util-components/CustomIcon";
import { LoadingOutlined } from "@ant-design/icons";

const { Dragger } = Upload;
const { Option } = Select;

const rules = {
  name: [
    {
      required: true,
      message: "Please enter product name",
    },
  ],
  description: [
    {
      required: true,
      message: "Please enter product model",
    },
  ],
  price: [
    {
      required: true,
      message: "Please enter product price",
    },
  ],
  owner: [
    {
      required: true,
      message: "Please enter product owner",
    },
  ],
  status: [
    {
      required: true,
      message: "Please select product status",
    },
  ],
  media: [
    {
      required: true,
      message: "Please upload picture",
    },
  ],
  serialNumber: [
    {
      required: true,
      message: "Please enter serial number",
    },
  ],
  caseMaterial: [
    {
      required: true,
      message: "Please select case material",
    },
  ],
  braceletMaterial: [
    {
      required: true,
      message: "Please select bracelet material",
    },
  ],
  movementModel: [
    {
      required: true,
      message: "Please enter movement model number",
    },
  ],
  movementSerial: [
    {
      required: true,
      message: "Please enter movement serial number",
    },
  ],
  movementMechanism: [
    {
      required: true,
      message: "Please select movement mechanism",
    },
  ],
  dialColor: [
    {
      required: true,
      message: "Please enter dial color",
    },
  ],
  hands: [
    {
      required: true,
      message: "Please enter hands type",
    },
  ],
  feature: [
    {
      required: true,
      message: "Please select feature",
    },
  ],
};

const imageUploadProps = {
  name: "file",
  multiple: false,
  listType: "picture-card",
  showUploadList: false,
  //   action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76'
};

const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

const GeneralField = (props) => {
  const [localVal, setLocalVal] = useState({});

  const getBase64 = (img, callback) => {
    console.log("img", img);
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  const handleUploadChange = (info) => {
    const vall = props.formVal.getFieldValue();
    console.log("first", vall);
    setLocalVal(vall);
    console.log("second", localVal);

    if (info.file.status === "uploading") {
      props.setUploadLoading(true);
      return;
    }
    if (info.file.status === "done") {
      console.log("info.file.originFileObj", info.file.originFileObj);
      props.setImgObj(info.file.originFileObj);
      getBase64(info.file.originFileObj, (imageUrl) => {
        props.setImage(imageUrl);
        props.setUploadLoading(false);
        props.setList([localVal]);
      });
    }
  };
  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={17}>
        <Card title="Basic Info">
          <Form.Item name="name" label="Brand name" rules={rules.name}>
            {/* <Input placeholder="Product Name" /> */}
            <Select placeholder="Please select a brand Name">
              <Option value="Rolex">Rolex</Option>
              <Option value="Patek Philippe">Patek Philippe</Option>
              <Option value="Omega">Omega</Option>
              <Option value="Audemars Piguet">Audemars Piguet</Option>
              <Option value="Vacheron">Vacheron</Option>
            </Select>
          </Form.Item>
          <Form.Item name="model" label="Model" rules={rules.description}>
            <Input placeholder="Model name and number" />
          </Form.Item>
          <Form.Item name="owner" label="Owner" rules={rules.owner}>
            <Input placeholder="Product Name" />
          </Form.Item>

          {/* <Form.Item name="status" label="Status" rules={rules.status}>
            <Select placeholder="Please select a status">
              <Option value="Pending">Pending</Option>
              <Option value="Stolen">Stolen</Option>
            </Select>
          </Form.Item> */}

          {/* addedd fields */}
          <Form.Item
            name="serialNumber"
            label="Serial Number"
            rules={rules.serialNumber}
          >
            <Input placeholder="Product Serial number" />
          </Form.Item>

          <Form.Item
            name="caseMaterial"
            label="Case Material"
            rules={rules.caseMaterial}
          >
            <Select placeholder="Please select a case material">
              <Option value="Gold">Gold</Option>
              <Option value="Stainless Steel">Stainless Steel</Option>
              <Option value="Titanium">Titanium</Option>
              <Option value="Bronze">Bronze</Option>
              <Option value="Ceramic">Ceramic</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="braceletMaterial"
            label="Bracelet Material"
            rules={rules.braceletMaterial}
          >
            <Select placeholder="Please select a bracelet material">
              <Option value="Leather">Leather</Option>
              <Option value="Plastic">Plastic</Option>
              <Option value="Rubber">Rubber</Option>
              <Option value="Cloth">Cloth</Option>
              <Option value="Metal">Metal</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="movementModel"
            label="Movement Model number"
            rules={rules.movementModel}
          >
            <Input placeholder="Movement Model number" />
          </Form.Item>

          <Form.Item
            name="movementSerial"
            label="Movement Serial number"
            rules={rules.movementSerial}
          >
            <Input placeholder="Movement serial number" />
          </Form.Item>

          <Form.Item
            name="movementMechanism"
            label="Movement Mechanism"
            rules={rules.movementMechanism}
          >
            <Select placeholder="Please select movement mechanism">
              <Option value="Auto">Auto</Option>
              <Option value="Manula">Manual</Option>
              <Option value="Quartz">Quartz</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="dialColor"
            label="Dial Color"
            rules={rules.dialColor}
          >
            <Input placeholder="Dial Color" />
          </Form.Item>

          <Form.Item name="hands" label="Hands" rules={rules.hands}>
            <Input placeholder="Hands" />
          </Form.Item>
          <Form.Item name="feature" label="Feature" rules={rules.feature}>
            <Select placeholder="Please select feature">
              <Option value="Time">Time</Option>
              <Option value="Date">Date</Option>
              <Option value="Chronograph">Chronograph</Option>
            </Select>
          </Form.Item>
        </Card>
        <Card title="Pricing">
          <Row gutter={16}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item name="price" label="Price" rules={rules.price}>
                <InputNumber
                  className="w-100"
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Col>
      <Col xs={24} sm={24} md={7}>
        <Card title="Media">
          <Dragger
            {...imageUploadProps}
            customRequest={dummyRequest}
            beforeUpload={beforeUpload}
            onChange={(e) => handleUploadChange(e)}
          >
            {props.uploadedImg ? (
              <img src={props.uploadedImg} alt="avatar" className="img-fluid" />
            ) : (
              <div>
                {props.uploadLoading ? (
                  <div>
                    <LoadingOutlined className="font-size-xxl text-primary" />
                    <div className="mt-3">Uploading</div>
                  </div>
                ) : (
                  <div>
                    <CustomIcon className="display-3" svg={ImageSvg} />
                    <p>Click or drag file to upload</p>
                  </div>
                )}
              </div>
            )}
          </Dragger>
        </Card>
        {/* <Card title="Organization">
				<Form.Item name="category" label="Category" >
					<Select className="w-100" placeholder="Category">
						{
							categories.map(elm => (
								<Option key={elm} value={elm}>{elm}</Option>
							))
						}
					</Select>
				</Form.Item>
				<Form.Item name="tags" label="Tags" >
				<Select mode="tags" style={{ width: '100%' }} placeholder="Tags">
					{tags.map(elm => <Option key={elm}>{elm}</Option>)}
				</Select>
				</Form.Item>
			</Card> */}
      </Col>
    </Row>
  );
};

export default GeneralField;
