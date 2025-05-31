import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/LogIn";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import BookPage from "./pages/BookPage";
import { FavoritesProvider } from './components/FavoritesContext';
import FavoritesPage from "./pages/FavoritesPage";

function App() {
  return (
    <FavoritesProvider>
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/book/:id" element={<BookPage />} />
        <Route path="/:userId/favorites" element={<FavoritesPage />} />
      </Routes>
    </Router>
    </FavoritesProvider>
  );
}

export default App;