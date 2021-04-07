import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { switchMode } from '../modules/painting';
import { BiEraser } from 'react-icons/bi';
import { BsPencil } from 'react-icons/bs';
import { AiOutlineClear } from 'react-icons/ai';
import classNames from 'classnames/bind';
import styles from '../design/Buttons.module.scss';

const cx = classNames.bind(styles);

const Buttons = ({ erase }) => {
  const dispatch = useDispatch();
  const { pen } = useSelector(({ painting }) => ({
    pen: painting.pen,
  }));
  return (
    <div className={cx('buttons')}>
      <button
        onClick={() => {
          dispatch(switchMode());
        }}
      >
        {pen ? <BiEraser size="35px" /> : <BsPencil size="35px" />}
      </button>
      <button onClick={erase}>
        <AiOutlineClear size="35px" />
      </button>
    </div>
  );
};

export default Buttons;
