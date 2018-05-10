/* eslint-env jest */

import { shallow } from 'enzyme'
import React from 'react'
import renderer from 'react-test-renderer'

import App from '../pages/index'

describe('With Enzyme', () => {
  it('App shows "Hello world!"', () => {
    const app = shallow(<App />)

    expect(app.find('h1').text()).toEqual('Welcome to Schooled Lunch!')
  })
})
