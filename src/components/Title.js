import React from 'react';
import classNames from 'classnames/bind';
import styles from '../design/Title.module.scss';
const cx = classNames.bind(styles);

const Title = () => {
  return <div className={cx('title')}>Digit Prediction</div>;
};

export default Title;
