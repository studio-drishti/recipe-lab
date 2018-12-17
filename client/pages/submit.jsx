import React from 'react';
import Layout from '../components/Layout';
import Submission from '../components/Submission';
const SubmitPage = () => (
  <Layout>
    <h1>Submit a Recipe</h1>
    <Submission />
  </Layout>
);

SubmitPage.displayName = 'SubmitPage';
export default SubmitPage;
