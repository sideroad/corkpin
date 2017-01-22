const GETS_START = 'user/GETS_START';
const GETS_SUCCESS = 'user/GETS_SUCCESS';
const GETS_FAIL = 'user/GETS_FAIL';

const SET = 'user/SET';
const SEARCH = 'user/SEARCH';

const initialState = {
  item: {},
  items: [],
  matched: []
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
        items: action.body.items
      };
    case GETS_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.err
      };
    case SEARCH: {
      const regexp = new RegExp(`.*${action.query}.*`, 'i');
      return {
        ...state,
        loading: false,
        loaded: true,
        matched: state.items.filter(item => item.name.match(regexp))
      };
    }
    case SET:
      return {
        ...state,
        item: action.item
      };
    default:
      return state;
  }
}

export function set(item) {
  return {
    type: SET,
    item
  };
}

export function search(query) {
  return {
    type: SEARCH,
    query
  };
}
