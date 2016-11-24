
const GETS_START = 'image/GETS_START';
const GETS_SUCCESS = 'image/GETS_SUCCESS';
const GETS_FAIL = 'image/GETS_FAIL';
const GET_START = 'image/GET_START';
const GET_SUCCESS = 'image/GET_SUCCESS';
const GET_FAIL = 'image/GET_FAIL';
const UPDATE_START = 'image/UPDATE_START';
const UPDATE_SUCCESS = 'image/UPDATE_SUCCESS';
const UPDATE_FAIL = 'image/UPDATE_FAIL';

const SIZING_START = 'image/SIZING_START';
const SIZING_CHANGE = 'image/SIZING_CHANGE';
const SIZING_END = 'image/SIZING_END';
const DRAGGING_START = 'image/DRAGGING_START';
const DRAGGING_END = 'image/DRAGGING_END';

const initialState = {
  item: {},
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
        items: action.res.items.map(
          item => ({
            ...item,
            sizing: false,
            dragging: false,
            focus: ''
          })
        )
      };
    case GETS_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
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
        item: action.res
      };
    case GET_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case UPDATE_START:
      return {
        ...state,
        loading: true,
        items: state.items.map(
          item => ({
            ...item,
            x: item.id === action.values.id && action.values.x ? action.values.x : item.x,
            y: item.id === action.values.id && action.values.y ? action.values.y : item.y,
            z: item.id === action.values.id && action.values.z ? action.values.z : item.z,
            width: item.id === action.values.id && action.values.width ?
                   action.values.width : item.width,
            height: item.id === action.values.id && action.values.height ?
                    action.values.height : item.height
          })
        )
      };
    case UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        items: state.items.map(
          item => ({
            ...item,
            x: item.id === action.values.id && action.values.x ? action.values.x : item.x,
            y: item.id === action.values.id && action.values.y ? action.values.y : item.y,
            width: item.id === action.values.id && action.values.width ?
                   action.values.width : item.width,
            height: item.id === action.values.id && action.values.height ?
                    action.values.height : item.height
          })
        )
      };
    case SIZING_START:
      return {
        ...state,
        items: state.items.map(
          item => ({
            ...item,
            sizing: item.id === action.item.id,
            focus: item.id === action.item.id ? action.item.focus : '',
            z: item.id === action.item.id ? action.item.z : item.z
          })
        )
      };
    case SIZING_CHANGE:
      return {
        ...state,
        items: state.items.map(
          item => ({
            ...item,
            x: item.id === action.item.id && action.item.x ? action.item.x : item.x,
            y: item.id === action.item.id && action.item.y ? action.item.y : item.y,
            width: item.id === action.item.id && action.item.width ?
                   action.item.width : item.width,
            height: item.id === action.item.id && action.item.height ?
                    action.item.height : item.height
          })
        )
      };
    case SIZING_END:
      return {
        ...state,
        items: state.items.map(
          item => ({
            ...item,
            sizing: false,
            focus: ''
          })
        )
      };
    case DRAGGING_START:
      return {
        ...state,
        items: state.items.map(
          item => ({
            ...item,
            dragging: item.id === action.item.id,
            z: item.id === action.item.id ? action.item.z : item.z
          })
        )
      };
    case DRAGGING_END:
      return {
        ...state,
        items: state.items.map(
          item => ({
            ...item,
            dragging: false
          })
        )
      };
    case UPDATE_FAIL:
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


export function sizingStart(item) {
  return {
    type: SIZING_START,
    item
  };
}

export function sizingChange(item) {
  return {
    type: SIZING_CHANGE,
    item
  };
}

export function sizingEnd(item) {
  return {
    type: SIZING_END,
    item
  };
}

export function draggingStart(item) {
  return {
    type: DRAGGING_START,
    item
  };
}

export function draggingEnd(item) {
  return {
    type: DRAGGING_END,
    item
  };
}
