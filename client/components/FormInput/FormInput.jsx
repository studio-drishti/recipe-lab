import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useUID } from 'react-uid';
import TextInput from '../TextInput';
import Textarea from '../Textarea';
import Select from '../Select';
import css from './FormInput.module.css';

const FormInput = ({ className, name, label, type, required, ...rest }) => {
  const id = useUID();
  const Input = useMemo(() => {
    switch (type) {
      case 'textarea':
        return Textarea;
      case 'select':
        return Select;
      default:
        return TextInput;
    }
  }, [type]);

  return (
    <div className={classnames(css.formInput, className)}>
      <label htmlFor={id}>
        {label}
        {required && <sup className={css.required}>*</sup>}
      </label>
      <Input id={id} name={name} type={type} {...rest} />
    </div>
  );
};

FormInput.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['textarea', 'select', 'text', 'password']),
  required: PropTypes.bool
};

FormInput.defaultProps = {
  className: null,
  type: 'text',
  required: false
};

export default FormInput;
