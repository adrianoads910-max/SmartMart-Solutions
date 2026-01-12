import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

// --- DASHBOARD ---
export const getDashboardData = async (startDate, endDate) => {
  try {
    let url = '/dashboard';
    
    // Se tiver datas, adiciona na URL: /dashboard?start_date=...&end_date=...
    if (startDate && endDate) {
      url += `?start_date=${startDate}&end_date=${endDate}`;
    }

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Erro dashboard:", error);
    return null;
  }
};

// --- PRODUTOS ---
export const getProducts = async (categoryId = null) => {
    try {
        
        const url = categoryId ? `/products?category_id=${categoryId}` : '/products';
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        return [];
    }
};

export const getCategories = async () => {
    try {
        const response = await api.get('/categories');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        return [];
    }
};

export const getNextProductId = async () => {
    try {
        const response = await api.get('/products/next-id');
        return response.data.next_id;
    } catch (error) {
        console.error("Erro ao buscar próximo ID:", error);
        return '';
    }
};

export const createProduct = async (productData) => {
    try {
        const response = await api.post('/products', productData);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar produto:", error);
        throw error; // Lança o erro para o form tratar
    }
};

export const updateProduct = async (id, productData) => {
    try {
        await api.put(`/products/${id}`, productData);
        return true;
    } catch (error) {
        console.error("Erro ao atualizar:", error);
        return false;
    }
};

export const deleteProduct = async (id) => {
    try {
        await api.delete(`/products/${id}`);
        return true;
    } catch (error) {
        console.error("Erro ao deletar:", error);
        return false;
    }
};

// ... outros exports

export const getSalesHistory = async () => {
    try {
        const response = await api.get('/sales');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar histórico de vendas:", error);
        return [];
    }
};

export const updateSale = async (id, saleData) => {
    try {
        await api.put(`/sales/${id}`, saleData);
        return true;
    } catch (error) {
        console.error("Erro ao atualizar venda:", error);
        return false;
    }
};

export const deleteSale = async (id) => {
    try {
        await api.delete(`/sales/${id}`);
        return true;
    } catch (error) {
        console.error("Erro ao deletar venda:", error);
        return false;
    }
};

// ...

export const getNextSaleId = async () => {
    try {
        const response = await api.get('/sales/next-id');
        return response.data.next_id;
    } catch (error) {
        console.error("Erro ID venda:", error);
        return '';
    }
};

export const createSale = async (saleData) => {
    try {
        const response = await api.post('/sales', saleData);
        return true;
    } catch (error) {
        console.error("Erro criar venda:", error);
        return false;
    }
};


export default api;