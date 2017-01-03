
const GETS_START = 'media/GETS_START';
const GETS_SUCCESS = 'media/GETS_SUCCESS';
const GETS_NEXT_SUCCESS = 'media/GETS_NEXT_SUCCESS';
const GETS_FAIL = 'media/GETS_FAIL';

const initialState = {
  items: [],
  loaded: false,
  loading: false,
  hasNext: false
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
        items: action.body.items,
        hasNext: action.hasNext
      };
    case GETS_NEXT_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        items: state.items.concat(action.body.items),
        hasNext: action.hasNext
      };
    case GETS_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.err
      };
    default:
      return state;
  }
}
