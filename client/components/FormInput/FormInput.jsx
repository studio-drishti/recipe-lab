import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import TextInput from '../TextInput';
import Textarea from '../Textarea';
import Select from '../Select';
import css from './FormInput.css';
import cuid from 'cuid';

const FormInput = ({ className, name, label, id, type, required, ...rest }) => {
  const Input = useMemo(() => {
    switch (type) {
      case 'textarea':
        return Textarea;
      case 'select':
        return Select;
      case 'text':
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
  id: PropTypes.string,
  type: PropTypes.oneOf(['textarea', 'select', 'text']),
  required: PropTypes.bool
};

FormInput.defaultProps = {
  className: null,
  id: cuid(),
  type: 'text',
  required: false
};

export default FormInput;
