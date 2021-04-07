import React from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import styles from '../design/Result.module.scss';
const cx = classNames.bind(styles);

const Result = () => {
  const { value, prob, delay } = useSelector(({ painting }) => ({
    value: painting.value,
    prob: painting.prob,
    delay: painting.delay,
  }));
  return (
    <>
      <div className={cx('value')}>{value}</div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className={cx('prob')}>{`${prob}%`}</div>
        <div className={cx('delay')}>{`delay: ${delay}ms`}</div>
      </div>
    </>
  );
};

export default Result;
