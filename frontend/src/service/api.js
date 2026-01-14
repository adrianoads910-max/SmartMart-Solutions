// Importa TUDO de ambos os arquivos
import * as RealApi from './api.real';
import * as MockApi from './api.mock';

// Define qual usar. 
// Pode mudar manualmente aqui para 'true' ou 'false'
const USE_MOCK_MODE = false; // Mude para true para usar Mock

// Exporta as funções do módulo escolhido
export const getCategories = USE_MOCK_MODE ? MockApi.getCategories : RealApi.getCategories;
export const getProducts = USE_MOCK_MODE ? MockApi.getProducts : RealApi.getProducts;
export const getNextProductId = USE_MOCK_MODE ? MockApi.getNextProductId : RealApi.getNextProductId;
export const createProduct = USE_MOCK_MODE ? MockApi.createProduct : RealApi.createProduct;
export const updateProduct = USE_MOCK_MODE ? MockApi.updateProduct : RealApi.updateProduct;
export const deleteProduct = USE_MOCK_MODE ? MockApi.deleteProduct : RealApi.deleteProduct;
export const createCategory = USE_MOCK_MODE ? MockApi.createCategory : RealApi.createCategory;
export const uploadProductCSV = USE_MOCK_MODE ? MockApi.uploadProductCSV : RealApi.uploadProductCSV;

// Vendas & Dashboard
export const getSalesHistory = USE_MOCK_MODE ? MockApi.getSalesHistory : RealApi.getSalesHistory;
export const getNextSaleId = USE_MOCK_MODE ? MockApi.getNextSaleId : RealApi.getNextSaleId;
export const createSale = USE_MOCK_MODE ? MockApi.createSale : RealApi.createSale;
export const updateSale = USE_MOCK_MODE ? MockApi.updateSale : RealApi.updateSale;
export const deleteSale = USE_MOCK_MODE ? MockApi.deleteSale : RealApi.deleteSale;
export const getDashboardData = USE_MOCK_MODE ? MockApi.getDashboardData : RealApi.getDashboardData;