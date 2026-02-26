import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import ListingPage from "./pages/ListingPage";
import AuthPage from "./pages/AuthPage";
import CreateListing from "./pages/CreateListing";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/listing/:id" element={<ListingPage />} />
        <Route path="/create-listing" element={<CreateListing />} />
      </Routes>
    </>
  );
};

export default App;
