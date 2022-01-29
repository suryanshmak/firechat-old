import React, { lazy, Suspense, useEffect } from "react";
import GlobalStyles from "./GlobalStyles";
import useLocalStorage from "./hooks/useLocalStorage";
import { Route, Switch, Redirect } from "react-router-dom";
import Spinner from "./components/Spinner";
import { useUser } from "./contexts/UserProvider";
const Login = lazy(() => import("./components/Login"));
const ChatRoom = lazy(() => import("./components/ChatRoom"));

const App: React.FC = () => {
  const [isSigned, setIsSigned] = useLocalStorage("isSigned", false);
  const user = useUser();

  useEffect(() => {
    user ? setIsSigned(true) : setIsSigned(false);
  }, [user]);

  return (
    <div className="App">
      <GlobalStyles />
      <Suspense fallback={<Spinner />}>
        <Switch>
          <Route
            path="/"
            exact
            render={() =>
              isSigned ? <Redirect to="/channels/:id" /> : <Login />
            }
          />
          <Route
            path="/channels/:id"
            render={() => (!isSigned ? <Redirect to="/" /> : <ChatRoom />)}
          />
        </Switch>
      </Suspense>
    </div>
  );
};

export default App;
