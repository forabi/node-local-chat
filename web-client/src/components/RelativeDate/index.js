import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import moment from 'moment';

class RelativeDate extends PureComponent {
  static propTypes = {
    children: PropTypes.instanceOf(Date),
    style: PropTypes.object,
  };
  
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  
  componentDidMount() {
    this.interval = setInterval(() => {
      this.forceUpdate();
    }, 1000);
  }
  
  render() {
    const { children } = this.props;
    return (<span {...this.props}>{ moment(children).fromNow() }</span>);
  }
}

export default RelativeDate;
