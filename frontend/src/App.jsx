import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import MapPage from "./pages/MapPage";
import About from "./pages/About";
import CountryProfiles from "./pages/CountryProfiles";
import CountryProfileDetail from "./pages/CountryProfileDetail";
import Topbar from "./components/Topbar";

export default function App() {
  const location = useLocation();
  const hideTopbar = location.pathname === "/map";

  return (
    <>
      {!hideTopbar && <Topbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/country-profiles" element={<CountryProfiles />} />
        <Route path="/country-profiles/:slug" element={<CountryProfileDetail />} />
      </Routes>
    </>
  );
}
