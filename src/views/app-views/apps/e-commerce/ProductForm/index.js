
import React, { useState, useEffect } from "react";
import PageHeaderAlt from "components/layout-components/PageHeaderAlt";
import { Card, Tabs, Form, Button, message, Row, Col } from "antd";
import Flex from "components/shared-components/Flex";
import GeneralField from "./GeneralField";
import { useLocation } from "react-router-dom";
import { AUTH_TOKEN, EMILUS_USER } from "../../../../../constants/AuthConstant";
import WatchImg from "../../../../../assets/svg/watch.jpeg";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";

// Create a root reference
const storage = getStorage();

const ADD = "ADD";
const EDIT = "EDIT";

const ProductForm = (props) => {
  const navigate = useNavigate();
  const { mode = ADD, param } = props;
  const location = useLocation();
  const lastSegmentId = location.pathname.split("/").pop();
  const [form] = Form.useForm();
  const [uploadedImg, setImage] = useState("");
  const [imgObj, setImgObj] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [list, setList] = useState([{}]);

  useEffect(() => {
    if (mode === EDIT) {
      const fetchData = async () => {
        try {
          await fetch(`${process.env.REACT_APP_BASE_PATH}/watches`)
            .then((response) => response.json())
            .then((data) => {
              // console.log("result ==>" ,data.filter(obj=> obj._id == lastSegmentId))
              const fetchedValues = data.filter(
                (obj) => obj._id == lastSegmentId
              );
              setImage(fetchedValues[0].imgUrl);

              return setList(fetchedValues);
            });
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    }
  }, [form]);

  const onDiscard = async () => {
    Promise.all([setList([{}]), setImage()]);
  };

  const onFinish = async () => {
    form
      .validateFields()
      .then((values) => {
        // console.log("values", values);
        setTimeout(async () => {
          setSubmitLoading(true);
          if (mode === ADD) {
            if (imgObj) {
              try {
                // Create a reference to 'image'
                const imgRef = ref(storage, imgObj.name);
                const uploadTask = await uploadString(
                  imgRef,
                  uploadedImg,
                  "data_url"
                ).then((snapshot) => {
                  // console.log('Uploaded a data_url string!');
                });
                await getDownloadURL(imgRef)
                  .then(async (url) => {
                    // console.log("url", url);
                    setFileUrl(url);
                    const creator = localStorage.getItem(AUTH_TOKEN);
                    const requestOptions = {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        name: values.name,
                        model: values.model,
                        owner: localStorage.getItem(EMILUS_USER),
                        price: values.price,
                        imgUrl: url,
                        status: "Pending",
                        creator: creator,
                        serialNumber: values.serialNumber,
                        caseMaterial: values.caseMaterial,
                        braceletMaterial: values.braceletMaterial,
                        movementModel: values.movementModel,
                        movementSerial: values.movementSerial,
                        movementMechanism: values.movementMechanism,
                        dialColor: values.dialColor,
                        hands: values.hands,
                        feature: values.feature,
                        holderAddress: localStorage.getItem("WALLAT_ADDRRESS"),
                      }),

                      // body: JSON.stringify({
                      //   name: "values.name",
                      //   model: "values.model",
                      //   owner: "values.owner",
                      //   price: 111,
                      //   imgUrl: url,
                      //   status: "Pending",
                      //   creator: creator,
                      //   serialNumber: "values.serialNumber",
                      //   caseMaterial: "values.caseMaterial",
                      //   braceletMaterial: " values.braceletMaterial",
                      //   movementModel: "values.movementModel",
                      //   movementSerial: "values.movementSerial",
                      //   movementMechanism: "values.movementMechanism",
                      //   dialColor: "values.dialColor",
                      //   hands: "values.hands",
                      //   feature: "values.feature",
                      //   holderAddress: localStorage.getItem("WALLAT_ADDRRESS"),
                      // }),
                    };

                    await fetch(
                      `${process.env.REACT_APP_BASE_PATH}/watch`,
                      requestOptions
                    )
                      .then((response) => response.json())
                      .then((data) => console.log("result ==>", data));
                    setSubmitLoading(false);
                    message.success(`Created ${values.name} to watches list`, [
                      5,
                    ]);
                    navigate(`/app/apps/watches/watch-list`);
                  })
                  .catch((error) => {
                    // A full list of error codes is available at
                    // https://firebase.google.com/docs/storage/web/handle-errors
                    switch (error.code) {
                      case "storage/object-not-found":
                        // File doesn't exist
                        break;
                      case "storage/unauthorized":
                        // User doesn't have permission to access the object
                        break;
                      case "storage/canceled":
                        // User canceled the upload
                        break;

                      // ...

                      case "storage/unknown":
                        // Unknown error occurred, inspect the server response
                        break;
                    }
                  });
              } catch (error) {
                message.success(`${error} creating list`);
              }
            } else {
              setSubmitLoading(false);
              message.error("Please upload media");
            }
          }
          if (mode === EDIT) {
            if (imgObj) {
              // console.log("imgObj", imgObj)
              // console.log("uploadedImg", uploadedImg)
              try {
                const imgRef = ref(storage, imgObj.name);
                const uploadTask = await uploadString(
                  imgRef,
                  uploadedImg,
                  "data_url"
                ).then((snapshot) => {
                  // console.log("Uploaded a data_url string!");
                });
                await getDownloadURL(imgRef).then(async (url) => {
                  // console.log("url", url);
                  setFileUrl(url);
                  const requestOptions = {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      _id: lastSegmentId,
                      name: values.name,
                      model: values.model,
                      owner: localStorage.getItem(EMILUS_USER),
                      price: values.price,
                      imgUrl: url,
                      status: values.status,
                      serialNumber: values.serialNumber,
                      caseMaterial: values.caseMaterial,
                      braceletMaterial: values.braceletMaterial,
                      movementModel: values.movementModel,
                      movementSerial: values.movementSerial,
                      movementMechanism: values.movementMechanism,
                      dialColor: values.dialColor,
                      hands: values.hands,
                      feature: values.feature,
                    }),
                  };

                  await fetch(
                    `${process.env.REACT_APP_BASE_PATH}/watch`,
                    requestOptions
                  )
                    .then((response) => response.json())
                    .then((data) => console.log("result ==>", data));
                  setSubmitLoading(false);
                  message.success(`Edited ${values.name} to watches list`, [5]);
                  navigate(`/app/apps/watches/product-list`);
                });
              } catch (error) {
                // message.success(`Product saved`);
                console.log(error);
              }
            } else {
              // console.log("list", list)
              const img = list?.filter((obj) => obj._id == lastSegmentId);

              const requestOptions = {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  _id: lastSegmentId,
                  name: values.name,
                  model: values.model,
                  owner: localStorage.getItem(EMILUS_USER),
                  price: values.price,
                  imgUrl: img[0].imgUrl,
                  status: values.status,
                  serialNumber: values.serialNumber,
                  caseMaterial: values.caseMaterial,
                  braceletMaterial: values.braceletMaterial,
                  movementModel: values.movementModel,
                  movementSerial: values.movementSerial,
                  movementMechanism: values.movementMechanism,
                  dialColor: values.dialColor,
                  hands: values.hands,
                  feature: values.feature,
                }),
              };
              try {
                await fetch(
                  `${process.env.REACT_APP_BASE_PATH}/watch`,
                  requestOptions
                )
                  .then((response) => response.json())
                  .then((data) => console.log("result ==>", data));
                setSubmitLoading(false);
                message.success(`Edited ${values.name} to watches list`, [5]);
                navigate(`/app/apps/watches/watch-list`);
              } catch (error) {
                console.log("error", error);
              }
            }
          }
        }, 1500);
      })
      .catch((info) => {
        // console.log("info", info);
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
          initialValues={{
            name: list[0].name,
            model: list[0].model,
            price: list[0].price,
            owner: list[0].owner,
            status: list[0].status,
            media: list[0].imgUrl,
            serialNumber: list[0].serialNumber,
            caseMaterial: list[0].caseMaterial,
            braceletMaterial: list[0].braceletMaterial,
            movementModel: list[0].movementModel,
            movementSerial: list[0].movementSerial,
            movementMechanism: list[0].movementMechanism,
            dialColor: list[0].dialColor,
            hands: list[0].hands,
            featue: list[0].feature,
          }}
          fields={[
            {
              name: ["serialNumber"],
              value: list[0].serialNumber,
              
            },
            {
              name: ["caseMaterial"],
              value: list[0].caseMaterial,
            },
            {
              name: ["braceletMaterial"],
              value: list[0].braceletMaterial,
            },
            {
              name: ["movementModel"],
              value: list[0].movementModel,
            },
            {
              name: ["movementSerial"],
              value: list[0].movementSerial,
            },
            {
              name: ["movementMechanism"],
              value: list[0].movementMechanism,
            },
            {
              name: ["dialColor"],
              value: list[0].dialColor,
            },
            {
              name: ["hands"],
              value: list[0].hands,
            },
            {
              name: ["featue"],
              value: list[0].featue,
            },

            {
              name: ["name"],
              value: list[0].name,
            },
            {
              name: ["model"],
              value: list[0].model,
            },
            {
              name: ["price"],
              value: list[0].price,
            },
            {
              name: ["owner"],
              value: list[0].owner,
            },
            {
              name: ["status"],
              value: list[0].status,
            },
            {
              name: ["media"],
              value: list[0].imgUrl,
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
                <h2 className="mb-3">
                  {mode === "ADD" ? "Add New Watch" : `Edit Watch`}{" "}
                </h2>
                <div className="mb-3">
                  <Button className="mr-2" onClick={() => onDiscard()}>
                    Discard
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => onFinish()}
                    htmlType="submit"
                    loading={submitLoading}
                  >
                    {mode === "ADD" ? "Add" : `Save`}
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
                    <GeneralField
                      uploadedImg={uploadedImg}
                      uploadLoading={uploadLoading}
                      // handleUploadChange={handleUploadChange}
                      setUploadLoading={setUploadLoading}
                      setImage={setImage}
                      setImgObj={setImgObj}
                      setList={setList}
                      formVal={form}
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

export default ProductForm;

import React, { useState, useEffect } from 'react'
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import { Tabs, Form, Button, message } from 'antd';
import Flex from 'components/shared-components/Flex'
import GeneralField from './GeneralField'
import VariationField from './VariationField'
import ShippingField from './ShippingField'
import ProductListData from "assets/data/product-list.data.json"

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

const ADD = 'ADD'
const EDIT = 'EDIT'

const ProductForm = props => {

	const { mode = ADD, param } = props

	const [form] = Form.useForm();
	const [uploadedImg, setImage] = useState('')
	const [uploadLoading, setUploadLoading] = useState(false)
	const [submitLoading, setSubmitLoading] = useState(false)

	useEffect(() => {
    	if(mode === EDIT) {
			console.log('is edit')
			console.log('props', props)
			const { id } = param
			const produtId = parseInt(id)
			const productData = ProductListData.filter( product => product.id === produtId)
			const product = productData[0]
			form.setFieldsValue({
				comparePrice: 0.00,
				cost: 0.00,
				taxRate: 6,
				description: 'There are many variations of passages of Lorem Ipsum available.',
				category: product.category,
				name: product.name,
				price: product.price
			});
			setImage(product.image)
		}
  	}, [form, mode, param, props]);

	const handleUploadChange = info => {
		if (info.file.status === 'uploading') {
			setUploadLoading(true)
			return;
		}
		if (info.file.status === 'done') {
			getBase64(info.file.originFileObj, imageUrl =>{
				setImage(imageUrl)
				setUploadLoading(true)
			});
		}
	};

	const onFinish = () => {
		setSubmitLoading(true)
		form.validateFields().then(values => {
			setTimeout(async() => {
				setSubmitLoading(false)
				if(mode === ADD) {
					try {
						console.log("first", values)
						const requestOptions = {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({  
					       "name": values.name,
							"model": values.description,
							"owner": values.category,
							"price": values.price,
							"status": "pending approval" })
						};
						await fetch('http://54.162.109.130/watch', requestOptions )
							.then(response =>  response.json())
							.then(data => console.log("result ==>" ,data));
						//message.success(`Created ${values.name} to product list`);
					} catch (error) {
						message.success(`Created ${error} to product list`);
					}
					
				}
				if(mode === EDIT) {
					message.success(`Product saved`);
				}
			}, 1500);
		}).catch(info => {
			setSubmitLoading(false)
			console.log('info', info)
			message.error('Please enter all required field ');
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
					heightUnit: 'cm',
					widthUnit: 'cm',
					weightUnit: 'kg'
				}}
			>
				<PageHeaderAlt className="border-bottom" overlap>
					<div className="container">
						<Flex className="py-2" mobileFlex={false} justifyContent="space-between" alignItems="center">
							<h2 className="mb-3">{mode === 'ADD'? 'Add New Product' : `Edit Product`} </h2>
							<div className="mb-3">
								<Button className="mr-2">Discard</Button>
								<Button type="primary" onClick={() => onFinish()} htmlType="submit" loading={submitLoading} >
									{mode === 'ADD'? 'Add' : `Save`}
								</Button>
							</div>
						</Flex>
					</div>
				</PageHeaderAlt>
				<div className="container">
					<Tabs 
						defaultActiveKey="1" 
						style={{marginTop: 30}}
						items={[
							{
								label: 'General',
								key: '1',
								children: <GeneralField 
									uploadedImg={uploadedImg} 
									uploadLoading={uploadLoading} 
									handleUploadChange={handleUploadChange}
								/>,
							},
							{
								label: 'Variation',
								key: '2',
								children: <VariationField />,
							},
							{
								label: 'Shipping',
								key: '3',
								children: <ShippingField />,
							},
						]}
					/>
				</div>
			</Form>
		</>
	)
}

export default ProductForm

