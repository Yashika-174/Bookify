//CSS
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

//Routes
import { Routes, Route } from 'react-router-dom';

// Pages
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ListingPage from './pages/ListingPage';
import HomePage from './pages/HomePage';
import BookDetailsPage from './pages/BookDetailsPage';
import OrderPage from './pages/OrderPage';
import ViewOrderDetailPage from './pages/ViewOrderDetailPage';


//Components
import NavBar from './components/NavBar';




function App() {
  return (

    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/book/list" element={<ListingPage />} />
        <Route path="/book/view/:bookId" element={<BookDetailsPage />} />
        <Route path="/book/orders" element={<OrderPage />} />
        <Route path="/book/orders/:bookId" element={<ViewOrderDetailPage />} />

      </Routes>
    </div>

  );
}

export default App;
