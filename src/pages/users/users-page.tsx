import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@shared/enum';
import { FETCH_STATUS, fetchUsers, RootState } from '@store/index';
import { Table, Input, Typography } from 'antd';

const { Title } = Typography;
const { Search } = Input;

export const UsersPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { users, fetchUsersStatus } = useSelector((state: RootState) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [sorter, setSorter] = useState({ field: 'fullName', order: 'ascend' });
  console.log('users; ', users);
  
  useEffect(() => {
    dispatch(
      fetchUsers({
        search: searchTerm,
        page: pagination.current,
        limit: pagination.pageSize,
        sort: sorter.field,
        order: sorter.order === 'ascend' ? 'asc' : 'desc',
      }),
    );
  }, [searchTerm, pagination, sorter, dispatch]);

  useEffect(() => {
    if (users?.totalPages) {
      setPagination((prev) => ({ ...prev, total: users?.totalPages * 10 }));
    }
  }, [users?.totalPages]);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
    setSorter(sorter);
  };

  const handleRowClick = (record) => {
    console.log('record: ', record);
    navigate(`${ROUTES.USERS}/${record.id}`);
  };

  const columns = [
    {
      // TODO: Перевод
      title: t('Name'),
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: true,
      sortOrder: sorter.field === 'fullName' && sorter.order,
    },
    {
      // TODO: Перевод
      title: t('Email'),
      dataIndex: 'email',
      key: 'email',
      sorter: true,
      sortOrder: sorter.field === 'email' && sorter.order,
    },
    {
      // TODO: Перевод
      title: t('Phone Number'),
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      sorter: true,
      sortOrder: sorter.field === 'phoneNumber' && sorter.order,
    },
  ];

  return (
    <div>
      {/* TODO: Перевод */}
      <Title level={2}>{t('Users')}</Title>
      <Search
        // TODO: Перевод
        placeholder={t('Search users')}
        onSearch={handleSearch}
        enterButton
        style={{ marginBottom: 16, width: 300 }}
      />
      <Table
        columns={columns}
        dataSource={users?.items}
        loading={fetchUsersStatus === FETCH_STATUS.LOADING}
        onChange={handleTableChange}
        pagination={pagination}
        rowKey="email"
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
      />
    </div>
  );
};
