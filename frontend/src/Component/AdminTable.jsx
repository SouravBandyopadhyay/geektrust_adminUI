import React, { useEffect, useState } from "react";
import { Space, Table, Tag, Button } from "antd";
import { FaTrashAlt, FaExternalLinkAlt } from "react-icons/fa";
import Search from "antd/es/transfer/search";
const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "name",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "name",
    render: (text) => <p>{text.toUpperCase()}</p>,
  },
  {
    title: "Actions",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <Button
          type="primary"
          info="true"
          shape="circle"
          icon={<FaExternalLinkAlt />}
        />
        <Button type="primary" danger shape="circle" icon={<FaTrashAlt />} />
      </Space>
    ),
  },
];

const AdminTable = () => {
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const fetchApi = async () => {
    let res = await fetch(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    );
    let fetchedData = res.json();
    fetchedData
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [searchText, setSearchText] = useState("");
  const [selectionType, setSelectionType] = useState("checkbox");

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: data.length,
  });

  const filteredData = searchText
    ? data.filter((record) =>
        Object.values(record).some((value) =>
          value.toString().toLowerCase().includes(searchText.toLowerCase())
        )
      )
    : data;

  const paginatedData = filteredData.slice(
    (pagination.current - 1) * pagination.pageSize,
    pagination.current * pagination.pageSize
  );

  const handleChange = (pagination) => {
    setPagination({ ...pagination, total: filteredData.length });
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setPagination({ current: 1, pageSize: 10, total: filteredData.length });
  };

  const searchInput = (
    <Search
      placeholder="Search"
      value={searchText}
      onChange={handleSearch}
      allowClear
      onSearch={() => console.log("Searched!")}
    />
  );

  useEffect(() => {
    fetchApi();
  }, []);

  const handleDelete = () => {
    const newData = [...data];
    selectedRowKeys.forEach((key) => {
      const index = newData.findIndex((item) => key === item.key);
      newData.splice(index, 1);
    });
    setData(newData);
    setSelectedRowKeys([]);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  return (
    <>
      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        style={{
          padding: 5,
          margin: "auto",
          justifyContent: "center",
        }}
        rowKey="id"
        columns={columns}
        dataSource={filteredData}
        onChange={handleChange}
        rowClassName={() => "editable-row"}
        bordered
        size="middle"
        title={() => searchInput}
        footer={() => (
          <Button type="primary" danger onClick={handleDelete}>
            Delete selected row(s)
          </Button>
        )}
      />
    </>
  );
};

export default AdminTable;
