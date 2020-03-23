//rimport { createStore } from 'redux';
import React, { createContext, useState } from 'react';

const defaultState = {};

function loginStore(state = defaultState, action) {
    switch (action.type) {
        case 'oathenticated':
            return { ...state, ...action.data };
        default:
            return state;
    }
}

// export default createStore(loginStore);

const LoginContext = createContext([{}, () => {}]);

const LoginProvider = props => {
    const [state, setState] = useState({
        user: {},
        oauth_code: null,
        loading: true,
    });
    return <LoginContext.Provider value={[state, setState]}>{props.children}</LoginContext.Provider>;
};

export { LoginContext, LoginProvider };
