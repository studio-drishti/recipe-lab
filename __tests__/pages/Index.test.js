import { shallow } from 'enzyme';
import React from 'react';

import App from 'recipe-lab/client/pages/index';

describe('With Enzyme', () => {
  it('App shows "Welcome to Recipe Lab!"', () => {
    const app = shallow(<App />);

    expect(app.find('h1').text()).toEqual('Welcome to Recipe Lab!');
  });
});
