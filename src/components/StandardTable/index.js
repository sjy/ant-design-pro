import React, { PureComponent } from 'react';
import moment from 'moment';
import { Table, Alert, Badge, Divider } from 'antd';
import styles from './index.less';

const statusMap = ['processing', 'error', 'success', 'default'];
class StandardTable extends PureComponent {
    state = {
        selectedRowKeys: [],
        totalCallNo: 0,
    };

    componentWillReceiveProps(nextProps) {
        // clean state
        if (nextProps.selectedRows.length === 0) {
            this.setState({
                selectedRowKeys: [],
                totalCallNo: 0,
            });
        }
    }

    handleRowSelectChange = (selectedRowKeys, selectedRows) => {
        const totalCallNo = selectedRows.reduce((sum, val) => {
            return sum + parseFloat(val.callNo, 10);
        }, 0);

        if (this.props.onSelectRow) {
            this.props.onSelectRow(selectedRows);
        }

        this.setState({ selectedRowKeys, totalCallNo });
    };

    handleTableChange = (pagination, filters, sorter) => {
        this.props.onChange(pagination, filters, sorter);
    };

    cleanSelectedKeys = () => {
        this.handleRowSelectChange([], []);
    };

    render() {
        const { selectedRowKeys, totalCallNo } = this.state;
        const { data: { list, pagination }, loading } = this.props;

        const status = ['运行中', ' 维护中', '未开启', '关闭'];

        const columns = [
            {
                title: '编号',
                dataIndex: 'no',
            },
            {
                title: '描述',
                dataIndex: 'description',
            },
            {
                title: '状态',
                dataIndex: 'status',
                filters: [
                    {
                        text: status[0],
                        value: 0,
                    },
                    {
                        text: status[1],
                        value: 1,
                    },
                    {
                        text: status[2],
                        value: 2,
                    },
                ],
                render(val) {
                    return <Badge status={statusMap[val]} text={status[val]} />;
                },
            },
            {
                title: '更新时间',
                dataIndex: 'updatedAt',
                sorter: true,
                render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
            },
            {
                title: '操作',
                render: () => (
                    <div>
                        <a href="">配置</a>
                        <Divider type="vertical" />
                        <a href="">订阅警报</a>
                    </div>
                ),
            },
        ];

        const paginationProps = {
            showSizeChanger: true,
            showQuickJumper: true,
            ...pagination,
        };

        const rowSelection = {
            selectedRowKeys,
            onChange: this.handleRowSelectChange,
            getCheckboxProps: record => ({
                disabled: record.disabled,
            }),
        };

        return (
            <div className={styles.standardTable}>
                <div className={styles.tableAlert}>
                    <Alert
                        message={
                            <div>
                                已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                                <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
                                    清空
                                </a>
                            </div>
                        }
                        type="info"
                        showIcon
                    />
                </div>
                <Table
                    loading={loading}
                    rowKey={record => record.key}
                    rowSelection={rowSelection}
                    dataSource={list}
                    columns={columns}
                    pagination={paginationProps}
                    onChange={this.handleTableChange}
                />
            </div>
        );
    }
}

export default StandardTable;
