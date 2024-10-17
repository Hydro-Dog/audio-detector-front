import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Input, Card, Tooltip } from 'antd'; // Import Tooltip from antd
import { fetchCallHistory, RootState } from '@store/index'; // Update the path as necessary

export const CallHistory = () => {
  const dispatch = useDispatch();
  const { callHistory } = useSelector((state: RootState) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [sorter, setSorter] = useState({ field: 'date', order: 'ascend' });

  useEffect(() => {
    dispatch(
      fetchCallHistory({
        search: searchTerm,
        page: pagination.current,
        limit: pagination.pageSize,
        sort: sorter.field,
        order: sorter.order === 'ascend' ? 'asc' : 'desc',
      }),
    );
  }, [searchTerm, pagination, sorter, dispatch]);

  useEffect(() => {
    if (callHistory?.totalPages) {
      setPagination((prev) => ({ ...prev, total: callHistory?.totalPages * 10 }));
    }
  }, [callHistory?.totalPages]);

  const historyColumns = [
    { title: 'Date', dataIndex: 'date', key: 'date', sorter: true },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      render: (text) => (
        <Tooltip title={text}>
          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      sorter: true,
      render: (text) => (
        <Tooltip title={text}>
          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      sorter: true,
      render: (text) => (
        <Tooltip title={text}>
          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
  ];

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleTableChange = (newPagination, filters, newSorter) => {
    setPagination(newPagination);
    setSorter(newSorter);
  };

  return (
    <Card title="Call History">
      <Input.Search
        placeholder="Search call history"
        onSearch={handleSearch}
        style={{ marginBottom: 16 }}
      />
      <Table
        size="small"
        columns={historyColumns}
        dataSource={callHistory?.items}
        pagination={pagination}
        onChange={handleTableChange}
        rowKey="id"
      />
    </Card>
  );
};
