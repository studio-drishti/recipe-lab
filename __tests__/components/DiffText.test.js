import { shallow } from 'enzyme';
import React from 'react';

import DiffText from 'recipe-lab/client/components/DiffText';

const setup = propOverrides => {
  const props = Object.assign(
    {
      original: '1 super great omlet',
      modified: '1 mediocre omlet'
    },
    propOverrides
  );

  const wrapper = shallow(<DiffText {...props} />);

  return {
    props,
    wrapper,
    del: wrapper.find('del'),
    ins: wrapper.find('ins')
  };
};

describe('Displaying diff text', () => {
  test('diff text is removed and inserted', () => {
    const { del, ins } = setup();

    expect(del.text()).toEqual('super great');
    expect(ins.text()).toEqual('mediocre');
  });
});
