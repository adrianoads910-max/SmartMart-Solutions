import React from 'react'
import Dashboard from './pages/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Products from './pages/Produtos';
import AddProduct from './pages/AddProdutos';
import SalesHistory from './pages/HistoricoVendas';

const App = () => {
return (
<>
  <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/sales-history" element={<SalesHistory />} />
          <Route path="/products/add" element={<AddProduct />} /> 
        </Routes>
  </BrowserRouter>
</>);
}
export default App