import React from 'react';
import PropTypes from 'prop-types';
import FieldNote from '../components/FieldNote';
import Page from '../layouts/Main';
import withAuthGuard from '../hoc/withAuthGuard';

const NewFieldNotePage = () => (
  <Page>
    <FieldNote />
  </Page>
);

export default NewFieldNotePage;
