import React ,{ useState}from 'react'
import { Input, Row, Col, Card, Form,InputNumber} from 'antd';
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
	commission: [
		{
			required: true,
			message: 'Commission must be above 5% and below 16 %',
		}
	]
}

const CustomerField = props =>{
	const [number, setNumber] = useState();
	const [error, setError] = useState();
    const mode = props.mode == "EDIT" ? true : false
	const onNumberChange = (value) => {
	setError()
	if(value < 5){
		setError("Commission must be above 5")
		return
	}else if(value > 16){
		setError("Commission must be below 16")
		return
	}else{
		setNumber(value)
	}
	setError()
  };

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

						{ mode ? (
						<Form.Item name="commission" label="Commission" 
				rules={rules.commission}
			
				>    
					<InputNumber placeholder="Commission" 
				defaultValue={6} value={number} onChange={onNumberChange}/>
				
				</Form.Item>) : null}
				{error ? <p>{error}</p> : null } 
			</Card>
		</Col>
		<Col xs={24} sm={24} md={7}>

		</Col>
	</Row>
)}

export default CustomerField
