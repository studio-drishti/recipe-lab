import React, { Component } from 'react';

import withAuthGuard from '../util/withAuthGuard';
import Page from '../layouts/Main';
import UserContext from '../util/UserContext';

class ProfilePage extends Component {
  static displayName = 'ProfilePage';
  static contextType = UserContext;

  render() {
    const { user } = this.context;
    return (
      <Page>
        <h1>{`${user.name}'s`} Profile</h1>
      </Page>
    );
  }
}

export default withAuthGuard(ProfilePage);
