
const GETS_START = 'board/GETS_START';
const GETS_SUCCESS = 'board/GETS_SUCCESS';
const GETS_FAIL = 'board/GETS_FAIL';
const GET_START = 'board/GET_START';
const GET_SUCCESS = 'board/GET_SUCCESS';
const GET_FAIL = 'board/GET_FAIL';

const CHANGE_SCALE = 'board/CHANGE_SCALE';
const MOVE_START = 'board/MOVE_START';
const MOVE_END = 'board/MOVE_END';
const PAN_TO = 'board/PAN_TO';
const PAN_DEFAULT = 'board/PAN_DEFAULT';
const CONFIG_MODE = 'board/CONFIG_MODE';
const DISPLAY_MODE = 'board/DISPLAY_MODE';
const EDIT_MODE = 'board/EDIT_MODE';

const initialState = {
  scale: 1,
  item: {},
  items: [],
  loaded: false,
  loading: false,
  moving: false,
  panX: 0,
  panY: 0,
  defaultX: 0,
  defaultY: 0,
  panStartX: 0,
  panStartY: 0,
  mode: 'display'
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
    case MOVE_START:
      return {
        ...state,
        panStartX: state.panX + action.x,
        panStartY: state.panY + action.y,
        moving: true
      };
    case MOVE_END:
      return {
        ...state,
        moving: false
      };
    case PAN_TO:
      return {
        ...state,
        panX: state.panStartX - action.x,
        panY: state.panStartY - action.y
      };
    case PAN_DEFAULT:
      return {
        ...state,
        defaultX: action.x,
        defaultY: action.y
      };
    case CHANGE_SCALE: {
      const scale = state.scale + (action.delta / 1500);
      return {
        ...state,
        scale: scale <= 0 ? 0 : scale
      };
    }
    case DISPLAY_MODE: {
      return {
        ...state,
        mode: 'display'
      };
    }
    case EDIT_MODE: {
      return {
        ...state,
        mode: 'edit',
        scale: 1
      };
    }
    case CONFIG_MODE: {
      return {
        ...state,
        mode: 'config'
      };
    }
    default:
      return state;
  }
}

export function changeScale(delta) {
  return {
    type: CHANGE_SCALE,
    delta
  };
}

export function moveStart(x, y) {
  return {
    type: MOVE_START,
    x,
    y
  };
}

export function moveEnd() {
  return {
    type: MOVE_END
  };
}

export function pan(x, y) {
  return {
    type: PAN_TO,
    x,
    y
  };
}

export function setDefault(x, y) {
  return {
    type: PAN_DEFAULT,
    x,
    y
  };
}

export function configMode() {
  return {
    type: CONFIG_MODE
  };
}
export function editMode() {
  return {
    type: EDIT_MODE
  };
}

export function displayMode() {
  return {
    type: DISPLAY_MODE
  };
}
