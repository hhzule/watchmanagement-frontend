import React from 'react'
import { Input, Row, Col, Card, Form, Select} from 'antd';
const {Option} = Select

const rules = {
	name: [
		{
			required: true,
			message: 'Please enter name',
		}
	],
	email: [
		{
			type: 'email',
			message: 'The input is not valid E-mail!',
		  },
		{
			required: true,
			message: 'Please enter email',
		}
	],
	password: [
		{ min: 8, message: 'Password must have a minimum length of 8' },
		{
			required: true,
			message: 'Please enter password with atleast 8 character',
		}
	],
	// ---------------------
	businessName: [
		{
			required: true,
			message: 'Please enter business name',
		}
	],
	businessRegCertificate: [
		{
			required: true,
			message: 'Please enter business regestration certificate',
		}
	],
	phoneNumber: [
		{
			required: true,
			message: 'Please enter phone number',
		}
	],
	emergencyNumber: [
		{
			required: false,
			message: 'Please enter emergency number',
		}
	],
	businessAddress: [
		{
			required: true,
			message: 'Please enter business address',
		}
	],
	brandName: [
		{
			required: true,
			message: 'Please enter brand name',
		}
	],
	serialNumber: [
		{
			required: true,
			message: 'Please enter serial number',
		}
	],	
	model: [
		{
			required: true,
			message: 'Please enter watch model',
		}
	],
	offers: [
		{
			required: true,
			message: 'Please select offer',
		}
	],
}


const DealerField = props => {

	
	return(
	<Row gutter={16}>
		<Col xs={24} sm={24} md={17}>

			<Card title="Basic Info">
				<Form.Item name="name" label="Dealer name" rules={rules.name}>
					<Input placeholder="Dealer Name" />
				</Form.Item>
				<Form.Item name="email" label="E-mail" rules={rules.email}>    
					<Input placeholder="Email"/>
				</Form.Item>
               <Form.Item name="password" label="Password" 
				rules={rules.password}
		
				>
						<Input.Password placeholder="Password" 
							maxLength={16}
							minLength={8}
						/>
						</Form.Item>

						{/* added fields */}
						 <Form.Item name="businessName" label="Business name" rules={rules.businessName}>
					<Input placeholder="Business Name" />
				</Form.Item>
				<Form.Item name="businessRegCertificate" label="Business Registration Certificate" rules={rules.businessRegCertificate}>
					<Input placeholder="Business Registration Certificate" />
				</Form.Item>
				<Form.Item name="phoneNumber" label="Phone Number" rules={rules.phoneNumber}>
					<Input placeholder="Phone Number" />
				</Form.Item>
				<Form.Item name="emergencyNumber" label="Emergency Number" rules={rules.emergencyNumber}>
					<Input placeholder="Emergency Number" />
				</Form.Item>
			<Form.Item name="businessAddress" label="Business Address" rules={rules.businessAddress}>
					<Input placeholder="Business Address" />
				</Form.Item>
					<Form.Item name="brandName" label="Brand name" rules={rules.brandName}>
				<Select placeholder="Please select a brand Name">
						<Option value="Rolex">Rolex</Option>
						<Option value="Patek Philippe">Patek Philippe</Option>
						<Option value="Omega">Omega</Option>
						<Option value="Audemars Piguet">Audemars Piguet</Option>
						<Option value="Vacheron">Vacheron</Option>
           			 </Select>
				</Form.Item>
				<Form.Item name="serialNumber" label="Serial Number" rules={rules.serialNumber}>
					<Input placeholder="serial Number" />
				</Form.Item>
				<Form.Item name="model" label="Watch Model" rules={rules.model}>
					<Input placeholder="Watch Model" />
				</Form.Item>
				<Form.Item name="offers" label="Interested in receiving an offers or no" rules={rules.offers}>
				<Select placeholder="Select yes or no">
						<Option value="Yes">Yes</Option>
						<Option value="No">No</Option>
					
           			 </Select>
				</Form.Item>

			</Card>

		</Col>
		<Col xs={24} sm={24} md={7}>

		</Col>
	</Row>
)}

export default DealerField
