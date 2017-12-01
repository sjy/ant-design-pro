import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
    },
};

const submitFormLayout = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
    },
};

@connect(state => ({
    submitting: state.form.regularFormSubmitting,
}))
@Form.create()
export default class NewLevel extends PureComponent {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: 'form/submitRegularForm',
                    payload: values,
                });
            }
        });
    };

    render() {
        const { submitting } = this.props;
        const { getFieldDecorator, getFieldValue } = this.props.form;

        return (
            <PageHeaderLayout title="">
                <Card bordered={false}>
                    <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
                        <FormItem {...formItemLayout} label="标题">
                            {getFieldDecorator('title', {
                                rules: [
                                    {
                                        required: true,
                                        message: '楼层名称',
                                    },
                                ],
                            })(<Input placeholder="给楼层起个名字" />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="楼层描述">
                            {getFieldDecorator('goal', {
                                rules: [
                                    {
                                        required: true,
                                        message: '地理位置，楼层标签等描述',
                                    },
                                ],
                            })(<TextArea style={{ minHeight: 32 }} placeholder="请输入描述信息" rows={4} />)}
                        </FormItem>
                        <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                            <Button type="primary" htmlType="submit" loading={submitting}>
                                提交
                            </Button>
                            <Button style={{ marginLeft: 8 }}>保存</Button>
                        </FormItem>
                    </Form>
                </Card>
            </PageHeaderLayout>
        );
    }
}
