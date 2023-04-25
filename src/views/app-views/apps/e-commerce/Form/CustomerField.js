import React from 'react'
import { Input, Row, Col, Card, Form} from 'antd';
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
	]
}

const CustomerField = props =>{

	return (
	
	<Row gutter={16}>
		<Col xs={24} sm={24} md={17}>
			<Card title="Basic Info">
				<Form.Item name="name" label="Customer name" rules={rules.name}>
					<Input placeholder="Customer Name" />
				</Form.Item>
				<Form.Item name="email" label="Email" 
				rules={rules.email}
				>
					<Input placeholder="Customer Email" />
				</Form.Item>
				<Form.Item name="password" label="Password" 
				rules={rules.password}
		
				>
						<Input.Password placeholder="Password" 
							maxLength={16}
							minLength={8}
						/>
						</Form.Item>
			</Card>
		</Col>
		<Col xs={24} sm={24} md={7}>

		</Col>
	</Row>
)}

export default CustomerField
