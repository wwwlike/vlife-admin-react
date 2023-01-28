import "./App.css";
// tailwindcss样式引入放在最上面，避免覆盖组件样式
import React from "react";
import { BrowserRouter } from "react-router-dom";
import RenderRouter from "./router";
import "./App.scss";

// import { AppProviders } from "@src/context";
// import { useSize } from "ahooks";
// import { useAuth } from "./context/auth-context";
function App() {
  // const { setScreenSize } = useAuth();
  // const ref = useRef(null);
  // // const size = useSize(ref);
  // useEffect(() => {
  //   // if (size) setScreenSize(size);
  // }, [size?.width, size?.height]);
  return (
    <BrowserRouter>
      <RenderRouter />
    </BrowserRouter>
  );
}
export default App;
