import { shallow } from 'enzyme';
import React from 'react';

import App from 'schooled-lunch/client/pages/index';

describe('With Enzyme', () => {
  it('App shows "Welcome to Schooled Lunch!"', () => {
    const app = shallow(<App />);

    expect(app.find('h1').text()).toEqual('Welcome to Schooled Lunch!');
  });
});
