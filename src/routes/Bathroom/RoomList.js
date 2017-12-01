import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Select,
    Icon,
    Button,
    Dropdown,
    Menu,
    InputNumber,
    DatePicker,
    Modal,
    message,
} from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from '../List/TableList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
    Object.keys(obj)
        .map(key => obj[key])
        .join(',');

@connect(state => ({
    bathroom: state.bathroom,
}))
@Form.create()
export default class RoomList extends PureComponent {
    state = {
        addInputValue: '',
        modalVisible: false,
        selectedRows: [],
        formValues: {},
    };

    fetchData() {
        const { dispatch, match } = this.props;
        dispatch({
            type: 'bathroom/fetch',
            payload: {
                level: match.params.level,
            },
        });
    }

    startPoll() {
        this.timeout = setTimeout(() => this.fetchData(), 5000);
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.bathroom !== nextProps.bathroom) {
            clearTimeout(this.timeout);

            // Optionally do something with data
            if (!nextProps.bathroom.loading) {
                this.startPoll();
            }
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    handleStandardTableChange = (pagination, filtersArg, sorter) => {
        const { dispatch } = this.props;
        const { formValues } = this.state;

        const filters = Object.keys(filtersArg).reduce((obj, key) => {
            const newObj = { ...obj };
            newObj[key] = getValue(filtersArg[key]);
            return newObj;
        }, {});

        const params = {
            currentPage: pagination.current,
            pageSize: pagination.pageSize,
            ...formValues,
            ...filters,
        };
        if (sorter.field) {
            params.sorter = `${sorter.field}_${sorter.order}`;
        }

        dispatch({
            type: 'bathroom/fetch',
            payload: params,
        });
    };

    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        dispatch({
            type: 'bathroom/fetch',
            payload: {},
        });
    };

    handleMenuClick = e => {
        const { dispatch } = this.props;
        const { selectedRows } = this.state;

        if (!selectedRows) return;

        switch (e.key) {
            case 'remove':
                dispatch({
                    type: 'bathroom/remove',
                    payload: {
                        no: selectedRows.map(row => row.no).join(','),
                    },
                    callback: () => {
                        this.setState({
                            selectedRows: [],
                        });
                    },
                });
                break;
            default:
                break;
        }
    };

    handleSelectRows = rows => {
        this.setState({
            selectedRows: rows,
        });
    };

    handleSearch = e => {
        e.preventDefault();

        const { dispatch, form } = this.props;

        form.validateFields((err, fieldsValue) => {
            if (err) return;

            const values = {
                ...fieldsValue,
                updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
            };

            this.setState({
                formValues: values,
            });

            dispatch({
                type: 'bathroom/fetch',
                payload: values,
            });
        });
    };

    handleModalVisible = flag => {
        this.setState({
            modalVisible: !!flag,
        });
    };

    handleAddInput = e => {
        this.setState({
            addInputValue: e.target.value,
        });
    };

    handleAdd = () => {
        this.props.dispatch({
            type: 'bathroom/add',
            payload: {
                description: this.state.addInputValue,
            },
        });

        message.success('添加成功');
        this.setState({
            modalVisible: false,
        });
    };

    renderSimpleForm() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label="编号">{getFieldDecorator('no')(<Input placeholder="请输入" />)}</FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="状态">
                            {getFieldDecorator('status')(
                                <Select placeholder="请选择" style={{ width: '100%' }}>
                                    <Option value="1">运行中</Option>
                                    <Option value="2">维护中</Option>
                                    <Option value="0">关闭</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <span className={styles.submitButtons}>
                            <Button type="primary" htmlType="submit">
                                查询
                            </Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                                重置
                            </Button>
                        </span>
                    </Col>
                </Row>
            </Form>
        );
    }

    render() {
        const { bathroom: { loading, bathrooms, devices, selectedLevel }, match } = this.props;
        const { selectedRows, modalVisible, addInputValue } = this.state;
        const list = devices;

        const menu = (
            <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
                <Menu.Item key="remove">删除</Menu.Item>
            </Menu>
        );

        return (
            <PageHeaderLayout title={`${selectedLevel && selectedLevel.name || ''}卫生间`}>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
                        <div className={styles.tableListOperator}>
                            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                                新建
                            </Button>
                            {selectedRows.length > 0 && (
                                <span>
                                    <Button>批量操作</Button>
                                    <Dropdown overlay={menu}>
                                        <Button>
                                            更多操作 <Icon type="down" />
                                        </Button>
                                    </Dropdown>
                                </span>
                            )}
                        </div>
                        <StandardTable
                            selectedRows={selectedRows}
                            loading={loading}
                            data={{ list, pagination: null }}
                            onSelectRow={this.handleSelectRows}
                            onChange={this.handleStandardTableChange}
                        />
                    </div>
                </Card>
                <Modal
                    title="新建设备"
                    visible={modalVisible}
                    onOk={this.handleAdd}
                    onCancel={() => this.handleModalVisible()}
                >
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
                        <Input placeholder="请输入" onChange={this.handleAddInput} value={addInputValue} />
                    </FormItem>
                </Modal>
            </PageHeaderLayout>
        );
    }
}
