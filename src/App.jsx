import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DestinationDetails from "./pages/DestinationDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/destination/:id"
        element={<DestinationDetails />}
      />
    </Routes>
  );
}

export default App;