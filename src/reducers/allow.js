
const GETS_START = 'allow/GETS_START';
const GETS_SUCCESS = 'allow/GETS_SUCCESS';
const GETS_FAIL = 'allow/GETS_FAIL';
const DELETE_START = 'allow/DELETE_START';

const initialState = {
  items: [],
  loaded: false,
  loading: false
};
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
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
        items: action.res.items
      };
    case GETS_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case DELETE_START:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.values.user)
      };
    default:
      return state;
  }
}
