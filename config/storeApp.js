import { createStore } from 'redux'

const defaultState = {
  isLogin: false,
  tipe: '',
  peserta_id: '',

  isLoading:false,

  kehadiranTabId: '',

};

//rejuicer
const storeApp = (state = defaultState, action) => {
  switch(action.type) {
    case 'LOGIN':
      return {...state,
          isLogin: action.payload.isLogin,
          tipe: action.payload.tipe,
          peserta_id: action.payload.peserta_id,
        };
    case 'LOADING':
      return {...state,
          isLoading: action.payload.isLoading,
        };
    case 'KEHADIRANTAB':
      return {...state,
          kehadiranTabId: action.payload.kehadiranTabId,
        };
  }
};

export default createStore(storeApp);
