
const GET_START = 'font/GET_START';
const GET_SUCCESS = 'font/GET_SUCCESS';
const GET_FAIL = 'font/GET_FAIL';
const GETS_START = 'font/GETS_START';
const GETS_SUCCESS = 'font/GETS_SUCCESS';
const GETS_FAIL = 'font/GETS_FAIL';

const initialState = {
  item: {},
  items: [],
  loaded: false,
  loading: false
};
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case GET_START:
      return {
        ...state,
        loading: true
      };
    case GET_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        item: action.res.body
      };
    case GET_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case GETS_START:
      return {
        ...state,
        loading: true
      };
    case GETS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        items: action.res.body.items
      };
    case GETS_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    default:
      return state;
  }
}
