import React from 'react';
import { connect } from 'react-redux';

export const ServiceList = (props) => (
  <ul>
    { props.services.map(service => <li>{service.name}</li>) }
  </ul>
);

export default connect(({ services }) => ({ services }))(ServiceList);
