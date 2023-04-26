import React, { useState , useEffect} from 'react'
import { Row, Col, Card,Form,InputNumber} from 'antd';
const rules = {
	commission: [
		{
			required: true,
            type: 'number',
			message: 'Please enter number',
		}
	]
}

const CommissionField = props =>{

	return (
	
	<Row gutter={16}>
		<Col xs={24} sm={24} md={17}>
			<Card title="Basic Info">
			
                <Form.Item name="commission" label="Commission" rules={rules.commission}>
					<InputNumber onChange={props.setDefault}/>
                   
				</Form.Item>
				
			</Card>
		</Col>
		<Col xs={24} sm={24} md={7}>

		</Col>
	</Row>
)}

export default CommissionField 