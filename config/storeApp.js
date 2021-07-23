import { createStore } from 'redux'

const defaultState = {
  isLogin: false,
  user_type: '',
  isLoading:false,
};

//rejuicer
const storeApp = (state = defaultState, action) => {
  switch(action.type) {
    case 'LOGIN':
      return {...state,
          isLogin: action.payload.isLogin,
          user_type: action.payload.user_type,
        };
    case 'LOADING':
      return {...state,
          isLoading: action.payload.isLoading,
        };
  }
};

export default createStore(storeApp);
