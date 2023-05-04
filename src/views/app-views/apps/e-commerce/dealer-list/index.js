import React, {useEffect, useState} from 'react'
import { Card, Table, Input, Button, Menu } from 'antd';
import {DeleteOutlined,EditOutlined, SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex'
import { useNavigate } from "react-router-dom";
import utils from 'utils'

const DealerList = () => {
	const navigate = useNavigate();
	const [list, setList] = useState()
	const auth = localStorage.getItem("auth_token")
	useEffect(() => {
		const fetchData = async () =>{
			try {

				
				const requestOptions = {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ auth})
				};
				await fetch('http://54.91.128.179/dealers', requestOptions)
					// await fetch('/api/dealers', requestOptions)
							.then(response =>  response.json())
							.then((data) => {
								console.log("result ==>" ,data)
								 setList(data)
							});	
			} catch (error) {
				console.log(error)	
			}
		}

        fetchData()
	}, [])
	
	const dropdownMenu = row => (
		<Menu>
			<Menu.Item onClick={() => deleteRow(row)}>
				<Flex alignItems="center">
					<DeleteOutlined />
					{/* <span className="ml-2">{selectedRows.length > 0 ? `Delete (${selectedRows.length})` : 'Delete'}</span> */}
					<span className="ml-2">{'Delete'}</span>
				</Flex>

			</Menu.Item>
			<Menu.Item onClick={() => editRow(row)}>
			<Flex alignItems="center">
	<EditOutlined/>
	
	<span className="ml-2">{'Edit'}</span>
</Flex>

			</Menu.Item>
		</Menu>
	);
	
	const addDealer = () => {
		navigate(`/app/apps/watches/add-dealer`)
	}
	const editRow =(row)=>{
		console.log("row", row)
		navigate(`/app/apps/watches/edit-dealer/${row._id}`)
	}

	const deleteRow = async (row) => {
		try {
			const _id = row._id
			console.log("id", _id)
			console.log("auth", auth)
			const requestOptions = {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ 
					_id,
					auth
				})
			};
			
				await fetch('/api/dealer', requestOptions)
						.then(response =>  response.json())
						.then((data) => {
							console.log("result ==>" ,data)
							data = list.filter(item => item[_id] !== _id)
							 setList(data)
						});	
						
					const data = list.filter(item => item["_id"] !== _id)
					setList(data)	
		} catch (error) {
			console.log(error)
		}
	}
	

	const tableColumns = [
		{
			title: 'Dealer',
			dataIndex: 'name'
		},
		{
			title: 'Email',
			dataIndex: 'email',
		
		},	
		{
			title: 'Business Name',
			dataIndex: 'businessName'
		},
		{
			title: 'Registration Certificate',
			dataIndex: 'businessRegCertificate',
			
		},		{
			title: 'Phone Number',
			dataIndex: 'phoneNumber'
		},
		{
			title: 'Emergency Number',
			dataIndex: 'emergencyNumber',
			
		},		{
			title: 'Business Address',
			dataIndex: 'businessAddress'
		},
		{
			title: 'Brand Name',
			dataIndex: 'brandName'
		},		{
			title: 'Serial Number',
			dataIndex: 'serialNumber'
		},
		{
			title: 'Model',
			dataIndex: 'model'
		},		{
			title: 'Offers',
			dataIndex: 'offers'
		},
		{
			title: '',
			dataIndex: 'actions',
			render: (_, elm) => (
				<div className="text-right">
					<EllipsisDropdown menu={dropdownMenu(elm)}/>
				</div>
			)
		}
	];

	const onSearch = e => {

		const value = e.currentTarget.value
		console.log("value",value)
		const searchArray = e.currentTarget.value ? list : list
		const data = utils.wildCardSearch(searchArray, value)
		setList(data)

	}


	return (
		<Card>
			<Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
				<Flex className="mb-1" mobileFlex={false}>
					<div className="mr-md-3 mb-3">
						<Input placeholder="Search" prefix={<SearchOutlined />} onChange={e => onSearch(e)}/>
					</div>
				</Flex>
				<div>
					<Button onClick={addDealer} type="primary" icon={<PlusCircleOutlined />} block>Add Dealer</Button>
				</div>
			</Flex>
			<div className="table-responsive">
				<Table 
					columns={tableColumns} 
					dataSource={list} 
					rowKey='id' 
				/>
			</div>
		</Card>
	)
}

export default DealerList