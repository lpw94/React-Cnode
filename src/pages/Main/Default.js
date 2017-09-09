import React from 'react'
import List from '../../components/List';
import { Tabs } from 'antd-mobile';
import { connect } from 'react-redux';
import { topics } from '../../store/actions';
const TabPane = Tabs.TabPane;
const tabs = {
  '全部': 'all',
  '精华': 'good',
  '分享': 'share',
  '问答': 'ask',
  '招聘': 'job',
  '11': 'dev'
};

class MyTabs extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      firstCome: true
    }
  }


  componentDidMount () {
    const { data, getData } = this.props;
    if (data.length === 0) {
      getData();
    }
  }

  componentWillReceiveProps (newProps) {
    if (newProps.tab !== this.props.tab) {
      this.props.getData();
    }
  }

  changeTab = (value) => {
    if (this.state.firstCome) this.setState({firstCome: false});
    const { loading, refresh, changeTab } = this.props;
    if (loading || refresh) return;
    changeTab(value);
  }

  saveScrollTop = (value) => {
    localStorage.setItem('scrollTop', value);
  }

  render () {
    const { tab } = this.props;
    return (
      <div>
        <Tabs 
          activeKey={tab}
          defaultActiveKey={tab}
          swipeable={false}
          animated
          destroyInactiveTabPane
          onChange={this.changeTab}
        >
          {
            Object.entries(tabs).map((item, index) => <TabPane tab={item[0]} key={item[1]}><List {...{...this.props, saveScrollTop: this.saveScrollTop, ...this.state}} /></TabPane>)
          }
        </Tabs>
      </div>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    tab: state.topics.tab,
    data: state.topics.data,
    loading: state.status.loading,
    refresh: state.status.refresh,
    reachEnd: state.status.reachEnd
  };
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changeTab: (tab) => {
      dispatch(topics.changeTab(tab));
    },
    getData: () => {
      dispatch(topics.getTopics());
    },
    onRefresh: () => {
      dispatch(topics.refresh());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyTabs);