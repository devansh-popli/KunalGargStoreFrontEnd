import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import NavbarComponent from './components/NavbarComponent';
import { ToastContainer, Zoom } from 'react-toastify';
import { UserContextProvider } from './context/UserContextProvider';
import Home from './pages/Home';
import NewLedgerAccountForm from './pages/NewLedgerAccountForm';
import StockItemMenu from './pages/StockItemMenu';
import Footer from './components/Footer';
import ViewStockItemMenu from './pages/ViewStockItemMenu';

function App() {
  return (
    <>
      <UserContextProvider>

        <BrowserRouter>
        <NavbarComponent />
          <ToastContainer
            draggable
            transition={Zoom}
            position="bottom-center"
          />
          <Routes>
            <Route path='' element={<Login />} />
            <Route path='/home' element={<Home />} />
            <Route path='/new-ledger-account-form' element={<NewLedgerAccountForm />} />
            <Route path='/stock-item-menu' element={<StockItemMenu />} />
            <Route path='/stock-item-menu/:id' element={<StockItemMenu />} />
            <Route path='/view-stock-item-menu' element={<ViewStockItemMenu />} />
          </Routes>
        </BrowserRouter>
        <Footer/>
      </UserContextProvider>
    </>
  );
}

export default App;
