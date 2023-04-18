import React, {useEffect, useState} from 'react'
import { Card, Table, 
	// Select,
	 Input, Button, 
	//  Badge, 
	 Menu } from 'antd';
// import ProductListData from "assets/data/product-list.data.json"
import { 
	// EyeOutlined, 
	DeleteOutlined, SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex'
import NumberFormat from 'react-number-format';
import { useNavigate } from "react-router-dom";
import utils from 'utils'

// const { Option } = Select

// const getStockStatus = stockCount => {
// 	if(stockCount >= 10) {
// 		return <><Badge status="success" /><span>In Stock</span></>
// 	}
// 	if(stockCount < 10 && stockCount > 0) {
// 		return <><Badge status="warning" /><span>Limited Stock</span></>
// 	}
// 	if(stockCount === 0) {
// 		return <><Badge status="error" /><span>Out of Stock</span></>
// 	}
// 	return null
// }

// const categories = ['Cloths', 'Bags', 'Shoes', 'Watches', 'Devices']

const ProductList = () => {
	const navigate = useNavigate();
	const [list, setList] = useState()
	// const [selectedRows, setSelectedRows] = useState([])
	// const [selectedRowKeys, setSelectedRowKeys] = useState([])


	useEffect(() => {
		const fetchData = async () =>{
			try {
				await fetch('http://54.162.109.130/watches')
					.then(response =>  response.json())
					.then((data) => {
						// console.log("result ==>" ,data)
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
			{/* <Menu.Item onClick={() => viewDetails(row)}>
				<Flex alignItems="center">
					<EyeOutlined />
					<span className="ml-2">View Details</span>
				</Flex>
			</Menu.Item> */}
			<Menu.Item onClick={() => deleteRow(row)}>
				<Flex alignItems="center">
					<DeleteOutlined />
					{/* <span className="ml-2">{selectedRows.length > 0 ? `Delete (${selectedRows.length})` : 'Delete'}</span> */}
					<span className="ml-2">{'Delete'}</span>
				</Flex>
			</Menu.Item>
		</Menu>
	);
	
	const addProduct = () => {
		navigate(`/app/apps/ecommerce/add-product`)
	}
	
	// const viewDetails = row => {
	// 	navigate(`/app/apps/ecommerce/edit-product/${row.id}`)
	// }
	
	const deleteRow = async (row) => {
		console.log("row", row)
		// if(selectedRows.length > 1) {
		// 	selectedRows.forEach(elm => {
		// 		data = utils.deleteArrayRow(data, objKey, elm.id)
		// 		setList(data)
		// 		setSelectedRows([])
		// 	})
		// } else {
		// 	data = utils.deleteArrayRow(data, objKey, row.id)
		// 	setList(data)
		// }
		try {
			const _id = row._id
			const requestOptions = {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ _id})
			};
			
				await fetch('http://54.162.109.130/watch', requestOptions)
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
			title: 'Owner',
			dataIndex: 'owner'
		},
		{
			title: 'Product',
			dataIndex: 'name',
			render: (_, record) => (
				<div className="d-flex">
					<AvatarStatus size={60} type="square" src={record.image} name={record.name}/>
				</div>
			),
			sorter: (a, b) => utils.antdTableSorter(a, b, 'name')
		},
		{
			// title: 'Category',
			// dataIndex: 'category',
			title: 'Model',
			dataIndex: 'model',
			// sorter: (a, b) => utils.antdTableSorter(a, b, 'category')
		},
		{
			title: 'Price',
			dataIndex: 'price',
			render: price => (
				<div>
					<NumberFormat
						displayType={'text'} 
						value={(Math.round(price * 100) / 100).toFixed(2)} 
						prefix={'$'} 
						thousandSeparator={true} 
					/>
				</div>
			),
			sorter: (a, b) => utils.antdTableSorter(a, b, 'price')
		},
		// {
		// 	title: 'Stock',
		// 	dataIndex: 'stock',
		// 	sorter: (a, b) => utils.antdTableSorter(a, b, 'stock')
		// },
		// {
		// 	title: 'Status',
		// 	dataIndex: 'stock',
		// 	render: stock => (
		// 		<Flex alignItems="center">{getStockStatus(stock)}</Flex>
		// 	),
		// 	sorter: (a, b) => utils.antdTableSorter(a, b, 'stock')
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
	
	// const rowSelection = {
	// 	onChange: (key, rows) => {
	// 		setSelectedRows(rows)
	// 		setSelectedRowKeys(key)
	// 	}
	// };

	const onSearch = e => {

		const value = e.currentTarget.value
		console.log("value",value)
		const searchArray = e.currentTarget.value ? list : list
		const data = utils.wildCardSearch(searchArray, value)
		setList(data)
		// setSelectedRowKeys([])
	}

	// const handleShowCategory = value => {
	// 	if(value !== 'All') {
	// 		const key = 'category'
	// 		const data = utils.filterArray(ProductListData, key, value)
	// 		setList(data)
	// 	} else {
	// 		setList(ProductListData)
	// 	}
	// }

	return (
		<Card>
			<Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
				<Flex className="mb-1" mobileFlex={false}>
					<div className="mr-md-3 mb-3">
						<Input placeholder="Search" prefix={<SearchOutlined />} onChange={e => onSearch(e)}/>
					</div>
					{/* <div className="mb-3">
						<Select 
							defaultValue="All" 
							className="w-100" 
							style={{ minWidth: 180 }} 
							onChange={handleShowCategory} 
							placeholder="Category"
						>
							<Option value="All">All</Option>
							{
								categories.map(elm => (
									<Option key={elm} value={elm}>{elm}</Option>
								))
							}
						</Select>
					</div> */}
				</Flex>
				<div>
					<Button onClick={addProduct} type="primary" icon={<PlusCircleOutlined />} block>Add product</Button>
				</div>
			</Flex>
			<div className="table-responsive">
				<Table 
					columns={tableColumns} 
					dataSource={list} 
					rowKey='id' 
					// rowSelection={{
					// 	selectedRowKeys: selectedRowKeys,
					// 	type: 'checkbox',
					// 	preserveSelectedRowKeys: false,
					// 	...rowSelection,
					// }}
				/>
			</div>
		</Card>
	)
}

export default ProductList
