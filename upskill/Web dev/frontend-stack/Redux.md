This javascript library allows us to manage states across the files without the problem of prop-drilling.

```jsx

//store.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  account: {
  },
  logIn: {
    email: "",
    password: "",
  },
  contacts: [],

};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccount: (state, action) => {
      state.account = action.payload;
    },
    setContacts: (state, action) => {
      state.contacts = action.payload;
    },
    setLogOut: (state) => {
      state.logIn = initialState;
      state.account = initialState;
    },
  },
});

export const { setAccount, setLogIn, setContacts, setLogOut } = authSlice.actions;
export default authSlice.reducer;


// index.js
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./states/store";

const store = configureStore({
  name: "auth",
  reducer: authReducer,
});


// anyOtherFile.tsx 
import { useSelector, useDispatch } from "react-redux";
import { setAccount } from "../states/store";

const account = useSelector((state) => state.account);
dispatch(setAccount({ ...account, [event.target.name]: event.target.value }));

//The above depicts how to use exported states across files
```

But still we have to use localStorage to persist our data with normal redux toolkit, but redux persists allows us to persist our data across reloads.


No for this upon observation we can persist the data as an extension from above code after we create reducer actions.
```jsx
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import authReducer from "./components/States/store.js";
import otherReducer from "./components/States/otherreducer.js";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { PersistGate } from "redux-persist/integration/react";
  
const rootpersistConfig = {
  key: "root",
  storage,
  blacklist: ["auth"],
};

const authPersistConfig = {
  key: "auth",
  storage,
};

  
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  other: otherReducer,
});

  
const store = configureStore({
  reducer: persistReducer(rootpersistConfig, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

```

For above code we are creating `persistStore()` this creates/sets data with key we have given to localStorage. For example, in above code we are persisting root and auth separately it creates two localStorage data with keys provided root and auth.


If we have to purge the data  we can use `persist.purge("key")` but sometimes it affects whole environment so we use another method general like `localStorage.removeItem("persist:auth");`.

As for [createAsyncThnuk](https://github.com/saipavan2702/mern-template/tree/master/frontend/src/features/auth) which helps in simplifying the process of handling asynchronous tasks and logic with the help of reduxjs/toolkit.

#ref 
[redux multiple reducers](https://medium.com/@1992season/handling-multiple-stores-with-redux-toolkit-in-react-js-88b8278eeac8)
[redux multiple stores](https://www.geekyhub.in/post/handling-multiple-stores-in-react-redux-application/)
[stack-overflow](https://stackoverflow.com/questions/68929107/how-to-purge-any-persisted-state-using-react-tool-kit-with-redux-persist)



