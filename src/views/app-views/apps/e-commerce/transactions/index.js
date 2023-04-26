import React, {useState} from 'react'
import { Card, Table, 
	// Select,
	 Input} from 'antd';
import WatchTrxData from "assets/data/trx.data.json"
import { SearchOutlined} from '@ant-design/icons';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import Flex from 'components/shared-components/Flex'
import NumberFormat from 'react-number-format';
import utils from 'utils'


const TransactionsList = () => {

	const [list, setList] = useState(WatchTrxData)

	const tableColumns = [
		{
			title: 'Hash',
			dataIndex: 'transactionHash',
            render: (_, record) => (
				<div className="d-flex">{`${record.transactionHash.slice(0,4)}...${record.transactionHash.slice(-4)}`}</div>
			),
		},
		{
			title: 'Status',
			dataIndex: 'status',
			// sorter: (a, b) => utils.antdTableSorter(a, b, 'status')
		},
		{
			title: 'TimeStamp',
			dataIndex: 'timeStamp',
			// sorter: (a, b) => utils.antdTableSorter(a, b, 'timeStamp')
		},
		{
			title: 'Value',
			dataIndex: 'value',
			// sorter: (a, b) => utils.antdTableSorter(a, b, 'value')
		},
		{
			title: 'From',
			dataIndex: 'from',
            render: (_, record) => (
				<div className="d-flex">{`${record.from.slice(0,4)}...${record.from.slice(-4)}`}</div>
			),
			// sorter: (a, b) => utils.antdTableSorter(a, b, 'from')
		},
        {
			title: 'To',
			dataIndex: 'to',
            render: (_, record) => (
				<div className="d-flex">{`${record.to.slice(0,4)}...${record.to.slice(-4)}`}</div>
			),
			// sorter: (a, b) => utils.antdTableSorter(a, b, 'to')
		},
        {
			title: 'TrxFee',
			dataIndex: 'trxFee',
			// sorter: (a, b) => utils.antdTableSorter(a, b, 'to')
		},

	];
	

	const onSearch = e => {

		const value = e.currentTarget.value
		console.log("value",value)
		const searchArray = e.currentTarget.value ? list : list
		const data = utils.wildCardSearch(searchArray, value)
		setList(data)
		// setSelectedRowKeys([])
	}

	return (
		<Card>
			<Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
				<Flex className="mb-1" mobileFlex={false}>
					<div className="mr-md-3 mb-3">
						<Input placeholder="Search" prefix={<SearchOutlined />} onChange={e => onSearch(e)}/>
					</div>
				</Flex>
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

export default TransactionsList
