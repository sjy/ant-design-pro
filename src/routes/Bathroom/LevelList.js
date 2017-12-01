import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Icon, List } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Ellipsis from '../../components/Ellipsis';

import styles from '../List/CardList.less';

@connect(state => ({ bathroom: state.bathroom }))
export default class LevelList extends PureComponent {
    componentDidMount() {
        this.props.dispatch({
            type: 'bathroom/fetch',
            payload: {},
        });
    }

    handleAddLevel = () => {
        this.props.history.push('/newlevel');
    };

    handleTabLevel = id => {
        this.props.history.push(`/bathroom/${id}`);
    };

    render() {
        const { bathroom: { levels, loading } } = this.props;

        return (
            <PageHeaderLayout title="楼层列表">
                <div className={styles.cardList}>
                    <List
                        rowKey="id"
                        loading={loading}
                        grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
                        dataSource={['', ...levels]}
                        renderItem={item =>
                            item ? (
                                <List.Item key={item.id}>
                                    <Card
                                        hoverable
                                        className={styles.card}
                                        actions={[]}
                                        onClick={this.handleTabLevel.bind(this, item.id)}
                                    >
                                        <Card.Meta
                                            // avatar={<img alt="" className={styles.cardAvatar} src={item.avatar} />}
                                            title={<a href="#">{item.name}</a>}
                                            description={
                                                <Ellipsis className={styles.item} lines={3}>
                                                    {`${item.desc}, 共${item.toilets.length}个厕所`}
                                                </Ellipsis>
                                            }
                                        />
                                    </Card>
                                </List.Item>
                            ) : (
                                <List.Item>
                                    <Button type="dashed" className={styles.newButton} onClick={this.handleAddLevel}>
                                        <Icon type="plus" /> 新增楼层
                                    </Button>
                                </List.Item>
                            )
                        }
                    />
                </div>
            </PageHeaderLayout>
        );
    }
}
