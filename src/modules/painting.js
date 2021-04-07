import { createAction, handleActions } from 'redux-actions';

const SWITCH_MODE = 'painting/SWITCH_MODE';
const CHECK_SERVER = 'painting/CHECK_SERVER';
const CHECK_IMAGE = 'painting/CHECK_IMAGE';

export const switchMode = createAction(SWITCH_MODE);
export const checkServer = createAction(CHECK_SERVER, ({ serverStatus }) => ({
  serverStatus,
}));
export const checkImage = createAction(
  CHECK_IMAGE,
  ({ value, prob, delay }) => ({ value, prob, delay }),
);

const initialState = {
  pen: true,
  serverStatus: null,
  value: `' ~'`,
  prob: '100',
  delay: '0',
};

const painting = handleActions(
  {
    [SWITCH_MODE]: (state) => {
      return { ...state, pen: !state.pen };
    },
    [CHECK_SERVER]: (state, { payload: { serverStatus } }) => {
      return { ...state, serverStatus };
    },
    [CHECK_IMAGE]: (state, { payload: { value, prob, delay } }) => {
      return { ...state, value, prob, delay };
    },
  },
  initialState,
);

export default painting;
