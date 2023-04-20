import React, {useEffect, useState} from 'react'
import { Card, Table, Input, Button, Menu } from 'antd';
import {DeleteOutlined, EditOutlined,SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex'
import { useNavigate } from "react-router-dom";
import utils from 'utils'

const CustomerList = () => {
	const navigate = useNavigate();
	const [list, setList] = useState()

	useEffect(() => {
		const fetchData = async () =>{
			try {
				await fetch('http://54.91.128.179/customers')
					.then(response =>  response.json())
					.then((data) => {
						 setList(data)
             console.log(data)
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


	
	const addCustomer = () => {
		navigate(`/app/apps/ecommerce/add-customer`)
	}

	const editRow =(row)=>{
		console.log("row", row)
		navigate(`/app/apps/ecommerce/edit-customer/${row._id}`)
	}

	const deleteRow = async (row) => {
		try {
			const _id = row._id
			const requestOptions = {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ _id})
			};
			
				await fetch('/api/customer', requestOptions)
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
			title: 'Customer',
			dataIndex: 'name'
		},
		{
			title: 'Email',
			dataIndex: 'email',
			// sorter: (a, b) => utils.antdTableSorter(a, b, 'name')
		},

		// {
		// 	title: 'Commission',
		// 	dataIndex: 'commission',
		// 	sorter: (a, b) => utils.antdTableSorter(a, b, 'price')
		// },

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
					<Button onClick={addCustomer} type="primary" icon={<PlusCircleOutlined />} block>Add customer</Button>
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

export default CustomerList