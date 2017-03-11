
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
const RESET_PAN = 'board/RESET_PAN';

const CONFIG_MODE = 'board/CONFIG_MODE';
const PHOTO_CONFIG_MODE = 'board/PHOTO_CONFIG_MODE';
const DISPLAY_MODE = 'board/DISPLAY_MODE';
const EDIT_MODE = 'board/EDIT_MODE';
const UPLOAD_MODE = 'board/UPLOAD_MODE';

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
  mode: 'display',
  photo: {
    name: ''
  }
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
        item: action.body
      };
    case GET_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.err
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
    case RESET_PAN: {
      return {
        ...state,
        panX: 0,
        panY: 0
      };
    }
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
        scale: scale <= 0.75 ? 0.75 :
               scale >= 1.25 ? 1.25 : scale
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
    case UPLOAD_MODE: {
      return {
        ...state,
        mode: 'upload',
        scale: 1
      };
    }
    case CONFIG_MODE: {
      return {
        ...state,
        mode: 'config'
      };
    }
    case PHOTO_CONFIG_MODE: {
      return {
        ...state,
        photo: action.photo,
        mode: 'photo-config'
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

export function resetPan() {
  return {
    type: RESET_PAN
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

export function uploadMode() {
  return {
    type: UPLOAD_MODE
  };
}

export function photoConfigMode(photo) {
  return {
    type: PHOTO_CONFIG_MODE,
    photo
  };
}
