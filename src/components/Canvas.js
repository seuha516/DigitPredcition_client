import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { checkImage, checkServer, switchMode } from '../modules/painting';
import Buttons from './Buttons';
import Result from './Result';
import classNames from 'classnames/bind';
import styles from '../design/Canvas.module.scss';

const cx = classNames.bind(styles);

let status = {
  drawable: false,
  X: -1,
  Y: -1,
};
let canvas, ctx;
let loading = false;

const Canvas = () => {
  const dispatch = useDispatch();
  const { pen, serverStatus } = useSelector(({ painting }) => ({
    pen: painting.pen,
    serverStatus: painting.serverStatus,
  }));
  const canvasRef = useRef(null);

  useEffect(() => {
    //canvas, ctx 지정
    canvas = canvasRef.current;
    ctx = canvas.getContext('2d');
    //canvas 초기 설정
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 320, 320);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 25;
    //EventListener 추가
    canvas.addEventListener('mousedown', down, false);
    canvas.addEventListener('mousemove', move, false);
    canvas.addEventListener('mouseup', finish, false);
    canvas.addEventListener('mouseout', finish, false);
    canvas.addEventListener('touchstart', touchStart, false);
    canvas.addEventListener('touchmove', touchMove, false);
    canvas.addEventListener('touchend', finish, false);
    ready();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    ctx.strokeStyle = pen ? 'black' : 'white';
    ctx.lineWidth = pen ? 25 : 40;
  }, [pen]);

  const ready = async () => {
    console.log('서버가 준비됐는지 확인');
    await axios
      .get('https://digit-prediction-backend.herokuapp.com/check')
      .then((res) => {
        console.log(res.data);
        dispatch(checkServer({ serverStatus: true }));
        dispatch(checkImage({ value: `' V'`, prob: '100', delay: '0' }));
        setInterval(() => {
          if (!loading) check();
        }, 100);
      })
      .catch((err) => {
        alert('서버가 응답하지 않습니다.');
        console.log(err);
        dispatch(checkServer({ serverStatus: false }));
        dispatch(checkImage({ value: `' ^'`, prob: '0', delay: '1000' }));
      });
  };
  const check = async () => {
    console.log('이미지 전송 시작');
    loading = true;
    const time = new Date();
    const imgBase64 = canvas.toDataURL('image/png', 'image/octet-stream');
    const decodImg = atob(imgBase64.split(',')[1]);
    let array = [];
    for (let i = 0; i < decodImg.length; i++) {
      array.push(decodImg.charCodeAt(i));
    }
    const file = new Blob([new Uint8Array(array)], { type: 'image/png' });
    const fileName = 'canvas_img_' + new Date().getMilliseconds() + '.png';
    let formData = new FormData();
    formData.append('file', file, fileName);
    let result = { value: '?', prob: '?', delay: '?' };
    await axios
      .post(
        'https://digit-prediction-backend.herokuapp.com/predict',
        formData,
        {
          headers: {
            mode: 'no-cors',
            'Access-Control-Allow-Origin': '*',
          },
        },
      )
      .then((res) => {
        result = {
          ...result,
          value: res.data.split(',')[0].trim(),
          prob: res.data.split(',')[1].trim(),
        };
      })
      .catch((err) => {
        console.log('이미지 전송 중 오류 발생', err);
      });
    console.log(`${result.value}, ${result.prob}%, ${new Date() - time}ms`);
    result = { ...result, delay: String(new Date() - time) };
    dispatch(checkImage(result));
    loading = false;
  };
  const erase = () => {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 320, 320);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 25;
    if (!pen) dispatch(switchMode());
  };
  const down = (e) => {
    e.preventDefault();
    status = { X: e.offsetX, Y: e.offsetY, drawable: true };
  };
  const touchStart = (e) => {
    e.preventDefault();
    status = {
      X: e.touches[0].clientX - canvas.getBoundingClientRect().left,
      Y: e.touches[0].clientY - canvas.getBoundingClientRect().top,
      drawable: true,
    };
  };
  const move = (e) => {
    e.preventDefault();
    if (!status.drawable) return;
    ctx.beginPath();
    ctx.moveTo(status.X, status.Y);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    status = { ...status, X: e.offsetX, Y: e.offsetY };
  };
  const touchMove = (e) => {
    e.preventDefault();
    if (!status.drawable) return;
    ctx.beginPath();
    ctx.moveTo(status.X, status.Y);
    ctx.lineTo(
      e.touches[0].clientX - canvas.getBoundingClientRect().left,
      e.touches[0].clientY - canvas.getBoundingClientRect().top,
    );
    ctx.stroke();
    status = {
      ...status,
      X: e.touches[0].clientX - canvas.getBoundingClientRect().left,
      Y: e.touches[0].clientY - canvas.getBoundingClientRect().top,
    };
  };
  const finish = () => {
    status.drawable = false;
  };

  return (
    <div className={cx('area')}>
      <div className={cx('input')}>
        <canvas
          className={cx('canvas')}
          ref={canvasRef}
          width="300px"
          height="300px"
          style={{ display: serverStatus ? 'block' : 'none' }}
        />
        {serverStatus === null && (
          <div className={cx('waitMessage', 'canvas')}>
            <p>Waiting...</p>
            <p>
              서버의 응답을 기다리는 중입니다.
              <br />
              <br />
              서버에 오랜만에 접근할 경우, <br />약 30 ~ 40초의 시간이
              필요합니다.
            </p>
          </div>
        )}
        {serverStatus === false && (
          <div className={cx('waitMessage', 'canvas')}>
            <p>No Response</p>
            <p>
              서버가 응답하지 않습니다...
              <br />
              <br />
              서버에 문제가 있는 것 같습니다. <br />
              다음에 다시 시도해주세요.
            </p>
          </div>
        )}
        <Buttons erase={erase} />
      </div>
      <div className={cx('output')}>
        <Result />
      </div>
    </div>
  );
};

export default Canvas;
