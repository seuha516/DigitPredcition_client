import React from 'react';
import Title from './components/Title';
import Canvas from './components/Canvas';
import classNames from 'classnames/bind';
import styles from './design/DisplayArea.module.scss';
const cx = classNames.bind(styles);

const App = () => {
  return (
    <div className={cx('area')}>
      <Title />
      <Canvas />
    </div>
  );
};

export default App;
