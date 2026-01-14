import dayjs from 'dayjs';

// --- BANCO DE DADOS INICIAL (SEED) - SEUS CSVs ---
const SEED_CATEGORIES = [
  { "id": 1, "name": "TVs" },
  { "id": 2, "name": "Refrigerators" },
  { "id": 3, "name": "Laptops" },
  { "id": 4, "name": "Microwaves" },
  { "id": 5, "name": "Smartphones" }
];

const SEED_PRODUCTS = [
  { "id": 1, "name": "Samsung 65\" QLED TV", "description": "65-inch 4K Smart TV with HDR and quantum dot technology", "price": 1299.99, "category_id": 1, "brand": "Samsung" },
  { "id": 2, "name": "LG OLED55C1", "description": "55-inch OLED 4K Smart TV with AI ThinQ and G-Sync compatibility", "price": 1499.99, "category_id": 1, "brand": "LG" },
  { "id": 3, "name": "Sony Bravia XR", "description": "65-inch 8K LED Smart TV with cognitive processor XR", "price": 1899.99, "category_id": 1, "brand": "Sony" },
  { "id": 4, "name": "LG French Door Refrigerator", "description": "26.2 cu. ft. smart refrigerator with ice maker and door-in-door", "price": 2199.99, "category_id": 2, "brand": "LG" },
  { "id": 5, "name": "Samsung Family Hub", "description": "27 cu. ft. smart refrigerator with touchscreen and cameras", "price": 2799.99, "category_id": 2, "brand": "Samsung" },
  { "id": 6, "name": "Whirlpool Side-by-Side", "description": "25 cu. ft. fingerprint resistant stainless steel refrigerator", "price": 1499.99, "category_id": 2, "brand": "Whirlpool" },
  { "id": 7, "name": "Dell XPS 15", "description": "15.6-inch touchscreen laptop with Intel i9 and 32GB RAM", "price": 1999.99, "category_id": 3, "brand": "Dell" },
  { "id": 8, "name": "MacBook Pro 16", "description": "16-inch laptop with M1 Pro chip and 16GB unified memory", "price": 2499.99, "category_id": 3, "brand": "Apple" },
  { "id": 9, "name": "Lenovo ThinkPad X1", "description": "14-inch business laptop with Intel i7 and 16GB RAM", "price": 1699.99, "category_id": 3, "brand": "Lenovo" },
  { "id": 10, "name": "Panasonic Countertop Microwave", "description": "1.3 cu. ft. 1100W microwave with inverter technology", "price": 179.99, "category_id": 4, "brand": "Panasonic" },
  { "id": 11, "name": "GE Profile Smart Microwave", "description": "1.7 cu. ft. convection microwave with scan-to-cook technology", "price": 349.99, "category_id": 4, "brand": "GE" },
  { "id": 12, "name": "Samsung Countertop Microwave", "description": "1.1 cu. ft. microwave with sensor cooking", "price": 159.99, "category_id": 4, "brand": "Samsung" },
  { "id": 13, "name": "iPhone 13 Pro Max", "description": "6.7-inch Super Retina XDR display with ProMotion and A15 Bionic chip", "price": 1099.99, "category_id": 5, "brand": "Apple" },
  { "id": 14, "name": "Samsung Galaxy S22 Ultra", "description": "6.8-inch Dynamic AMOLED 2X with S Pen and 108MP camera", "price": 1199.99, "category_id": 5, "brand": "Samsung" },
  { "id": 15, "name": "Google Pixel 6 Pro", "description": "6.7-inch LTPO OLED with Google Tensor processor and 50MP camera", "price": 899.99, "category_id": 5, "brand": "Google" }
];

const SEED_SALES = [
  { "id": 1, "product_id": 1, "quantity": 12, "total_price": 15599.88, "date": "2025-01-15" },
  { "id": 2, "product_id": 1, "quantity": 8, "total_price": 10399.92, "date": "2025-03-22" },
  { "id": 3, "product_id": 1, "quantity": 15, "total_price": 19499.85, "date": "2025-07-05" },
  { "id": 4, "product_id": 1, "quantity": 10, "total_price": 12999.9, "date": "2025-10-18" },
  { "id": 5, "product_id": 2, "quantity": 6, "total_price": 8999.94, "date": "2025-02-12" },
  { "id": 6, "product_id": 2, "quantity": 11, "total_price": 16499.89, "date": "2025-05-30" },
  { "id": 7, "product_id": 2, "quantity": 9, "total_price": 13499.91, "date": "2025-09-14" },
  { "id": 8, "product_id": 2, "quantity": 7, "total_price": 10499.93, "date": "2025-12-01" },
  { "id": 9, "product_id": 3, "quantity": 5, "total_price": 9499.95, "date": "2025-01-28" },
  { "id": 10, "product_id": 3, "quantity": 8, "total_price": 15199.92, "date": "2025-04-10" },
  { "id": 11, "product_id": 3, "quantity": 3, "total_price": 5699.97, "date": "2025-08-23" },
  { "id": 12, "product_id": 3, "quantity": 6, "total_price": 11399.94, "date": "2025-11-15" },
  { "id": 13, "product_id": 4, "quantity": 4, "total_price": 8799.96, "date": "2025-02-05" },
  { "id": 14, "product_id": 4, "quantity": 7, "total_price": 15399.93, "date": "2025-06-18" },
  { "id": 15, "product_id": 4, "quantity": 3, "total_price": 6599.97, "date": "2025-09-27" },
  { "id": 16, "product_id": 4, "quantity": 5, "total_price": 10999.95, "date": "2025-12-10" },
  { "id": 17, "product_id": 5, "quantity": 3, "total_price": 8399.97, "date": "2025-03-08" },
  { "id": 18, "product_id": 5, "quantity": 6, "total_price": 16799.94, "date": "2025-05-22" },
  { "id": 19, "product_id": 5, "quantity": 2, "total_price": 5599.98, "date": "2025-08-15" },
  { "id": 20, "product_id": 5, "quantity": 4, "total_price": 11199.96, "date": "2025-11-30" },
  { "id": 21, "product_id": 6, "quantity": 8, "total_price": 11999.92, "date": "2025-01-20" },
  { "id": 22, "product_id": 6, "quantity": 5, "total_price": 7499.95, "date": "2025-04-15" },
  { "id": 23, "product_id": 6, "quantity": 10, "total_price": 14999.9, "date": "2025-07-27" },
  { "id": 24, "product_id": 6, "quantity": 6, "total_price": 8999.94, "date": "2025-10-05" },
  { "id": 25, "product_id": 7, "quantity": 15, "total_price": 29999.85, "date": "2025-02-18" },
  { "id": 26, "product_id": 7, "quantity": 8, "total_price": 15999.92, "date": "2025-05-12" },
  { "id": 27, "product_id": 7, "quantity": 12, "total_price": 23999.88, "date": "2025-09-03" },
  { "id": 28, "product_id": 7, "quantity": 10, "total_price": 19999.9, "date": "2025-12-15" },
  { "id": 29, "product_id": 8, "quantity": 6, "total_price": 14999.94, "date": "2025-03-01" },
  { "id": 30, "product_id": 8, "quantity": 9, "total_price": 22499.91, "date": "2025-06-25" },
  { "id": 31, "product_id": 8, "quantity": 4, "total_price": 9999.96, "date": "2025-10-12" },
  { "id": 32, "product_id": 8, "quantity": 7, "total_price": 17499.93, "date": "2025-12-28" },
  { "id": 33, "product_id": 9, "quantity": 10, "total_price": 16999.9, "date": "2025-01-10" },
  { "id": 34, "product_id": 9, "quantity": 12, "total_price": 20399.88, "date": "2025-04-22" },
  { "id": 35, "product_id": 9, "quantity": 8, "total_price": 13599.92, "date": "2025-08-09" },
  { "id": 36, "product_id": 9, "quantity": 5, "total_price": 8499.95, "date": "2025-11-05" },
  { "id": 37, "product_id": 10, "quantity": 20, "total_price": 3599.8, "date": "2025-02-28" },
  { "id": 38, "product_id": 10, "quantity": 15, "total_price": 2699.85, "date": "2025-05-17" },
  { "id": 39, "product_id": 10, "quantity": 25, "total_price": 4499.75, "date": "2025-09-20" },
  { "id": 40, "product_id": 10, "quantity": 18, "total_price": 3239.82, "date": "2025-12-03" },
  { "id": 41, "product_id": 11, "quantity": 8, "total_price": 2799.92, "date": "2025-01-25" },
  { "id": 42, "product_id": 11, "quantity": 12, "total_price": 4199.88, "date": "2025-04-30" },
  { "id": 43, "product_id": 11, "quantity": 6, "total_price": 2099.94, "date": "2025-07-15" },
  { "id": 44, "product_id": 11, "quantity": 10, "total_price": 3499.9, "date": "2025-10-28" },
  { "id": 45, "product_id": 12, "quantity": 15, "total_price": 2399.85, "date": "2025-03-15" },
  { "id": 46, "product_id": 12, "quantity": 22, "total_price": 3519.78, "date": "2025-06-10" },
  { "id": 47, "product_id": 12, "quantity": 13, "total_price": 2079.87, "date": "2025-09-08" },
  { "id": 48, "product_id": 12, "quantity": 18, "total_price": 2879.82, "date": "2025-11-22" },
  { "id": 49, "product_id": 13, "quantity": 25, "total_price": 27499.75, "date": "2025-02-08" },
  { "id": 50, "product_id": 13, "quantity": 30, "total_price": 32999.7, "date": "2025-05-25" },
  { "id": 51, "product_id": 13, "quantity": 18, "total_price": 19799.82, "date": "2025-08-30" },
  { "id": 52, "product_id": 13, "quantity": 22, "total_price": 24199.78, "date": "2025-12-20" },
  { "id": 53, "product_id": 14, "quantity": 12, "total_price": 14399.88, "date": "2025-01-05" },
  { "id": 54, "product_id": 14, "quantity": 15, "total_price": 17999.85, "date": "2025-04-18" },
  { "id": 55, "product_id": 14, "quantity": 10, "total_price": 11999.9, "date": "2025-07-22" },
  { "id": 56, "product_id": 14, "quantity": 8, "total_price": 9599.92, "date": "2025-10-15" },
  { "id": 57, "product_id": 15, "quantity": 20, "total_price": 17999.8, "date": "2025-03-10" },
  { "id": 58, "product_id": 15, "quantity": 15, "total_price": 13499.85, "date": "2025-06-22" },
  { "id": 59, "product_id": 15, "quantity": 25, "total_price": 22499.75, "date": "2025-09-15" },
  { "id": 60, "product_id": 15, "quantity": 18, "total_price": 16199.82, "date": "2025-12-05" }
];

// --- HELPER FUNCTIONS ---

// Simula delay de rede para parecer real
const delay = () => new Promise(resolve => setTimeout(resolve, 300));

// Carrega ou Inicializa o Banco
const loadDB = (key, defaultData) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData;
  }
  return JSON.parse(data);
};

const saveDB = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- API MOCKADA (Substitui o Backend) ---

export const getCategories = async () => {
  await delay();
  return loadDB('categories', SEED_CATEGORIES);
};

export const getProducts = async (catId = null) => {
  await delay();
  let products = loadDB('products', SEED_PRODUCTS);
  const categories = loadDB('categories', SEED_CATEGORIES);

  // Faz o "Join" para pegar nome da categoria
  products = products.map(p => {
    const cat = categories.find(c => c.id === p.category_id);
    return { ...p, category_name: cat ? cat.name : 'Geral' };
  });

  if (catId) {
    return products.filter(p => p.category_id === Number(catId));
  }
  return products;
};

export const getNextProductId = async () => {
  const products = loadDB('products', SEED_PRODUCTS);
  if (products.length === 0) return 1;
  const maxId = Math.max(...products.map(p => p.id));
  return maxId + 1;
};

export const createProduct = async (productData) => {
  await delay();
  const products = loadDB('products', SEED_PRODUCTS);
  products.push(productData);
  saveDB('products', products);
  return { message: 'Criado com sucesso' };
};

export const updateProduct = async (id, productData) => {
  await delay();
  let products = loadDB('products', SEED_PRODUCTS);
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...productData };
    saveDB('products', products);
    return true;
  }
  return false;
};

export const deleteProduct = async (id) => {
  await delay();
  let products = loadDB('products', SEED_PRODUCTS);
  const newProducts = products.filter(p => p.id !== id);
  saveDB('products', newProducts);
  return true;
};

export const createCategory = async (name) => {
  await delay();
  const categories = loadDB('categories', SEED_CATEGORIES);
  const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
  const newCat = { id: newId, name };
  categories.push(newCat);
  saveDB('categories', categories);
  return newCat;
};

// --- VENDAS ---

export const getSalesHistory = async () => {
  await delay();
  const sales = loadDB('sales', SEED_SALES);
  const products = loadDB('products', SEED_PRODUCTS);
  const categories = loadDB('categories', SEED_CATEGORIES);

  // JOIN MANUAL: Venda + Produto + Categoria
  const salesWithDetails = sales.map(sale => {
    const product = products.find(p => p.id === sale.product_id);
    const category = product ? categories.find(c => c.id === product.category_id) : null;
    
    return {
      ...sale,
      product_name: product ? product.name : 'Produto Excluído',
      product_description: product ? product.description : '',
      category_name: category ? category.name : 'Geral'
    };
  }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Ordena por data (mais recente)

  return salesWithDetails;
};

export const getNextSaleId = async () => {
  const sales = loadDB('sales', SEED_SALES);
  if (sales.length === 0) return 1;
  const maxId = Math.max(...sales.map(s => s.id));
  return maxId + 1;
};

export const createSale = async (saleData) => {
  await delay();
  const sales = loadDB('sales', SEED_SALES);
  sales.push(saleData);
  saveDB('sales', sales);
  return true;
};

export const updateSale = async (id, saleData) => {
  await delay();
  let sales = loadDB('sales', SEED_SALES);
  const index = sales.findIndex(s => s.id === id);
  if (index !== -1) {
    sales[index] = { ...sales[index], ...saleData };
    saveDB('sales', sales);
    return true;
  }
  return false;
};

export const deleteSale = async (id) => {
  await delay();
  let sales = loadDB('sales', SEED_SALES);
  const newSales = sales.filter(s => s.id !== id);
  saveDB('sales', newSales);
  return true;
};

// --- DASHBOARD (LÓGICA COMPLEXA NO FRONTEND) ---

export const getDashboardData = async (startDate, endDate, categoryId, brand) => {
  await delay();
  
  // Carrega tudo
  let sales = await getSalesHistory(); // Já vem com Joins
  
  // 1. Filtros
  if (startDate && endDate) {
    sales = sales.filter(s => s.date >= startDate && s.date <= endDate);
  }
  if (categoryId) {
    // Precisamos buscar o produto original para saber o ID da categoria
    const products = loadDB('products', SEED_PRODUCTS);
    sales = sales.filter(s => {
       const prod = products.find(p => p.id === s.product_id);
       return prod && prod.category_id === Number(categoryId);
    });
  }
  if (brand) {
    const products = loadDB('products', SEED_PRODUCTS);
    sales = sales.filter(s => {
       const prod = products.find(p => p.id === s.product_id);
       return prod && prod.brand === brand;
    });
  }

  // 2. Agrupamento por Mês
  const salesByMonthMap = {};
  let totalRevenue = 0;
  let totalSalesQty = 0;

  sales.forEach(sale => {
    const month = sale.date.substring(0, 7); // '2023-10'
    if (!salesByMonthMap[month]) {
        salesByMonthMap[month] = { name: month, revenue: 0, quantity: 0 };
    }
    salesByMonthMap[month].revenue += sale.total_price;
    salesByMonthMap[month].quantity += sale.quantity;
    
    totalRevenue += sale.total_price;
    totalSalesQty += sale.quantity;
  });

  // Converte objeto para array e ordena
  const chartData = Object.values(salesByMonthMap).sort((a, b) => a.name.localeCompare(b.name));

  // 3. Top Produtos
  const productMap = {};
  sales.forEach(sale => {
    if (!productMap[sale.product_name]) {
        productMap[sale.product_name] = { name: sale.product_name, quantity: 0, total: 0 };
    }
    productMap[sale.product_name].quantity += sale.quantity;
    productMap[sale.product_name].total += sale.total_price;
  });

  const topProducts = Object.values(productMap)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
    .map(p => ({
        ...p,
        percentage: totalRevenue > 0 ? (p.total / totalRevenue) * 100 : 0
    }));

  // 4. Share por Marca
  const brandMap = {};
  const products = loadDB('products', SEED_PRODUCTS);
  
  sales.forEach(sale => {
      // Reencontra o produto para pegar a marca (se não veio no join anterior corretamente)
      const originalProd = products.find(p => p.id === sale.product_id);
      if (originalProd) {
          const b = originalProd.brand;
          if (!brandMap[b]) brandMap[b] = 0;
          brandMap[b] += sale.total_price;
      }
  });

  const salesByBrand = Object.keys(brandMap).map(key => ({
      name: key,
      value: brandMap[key]
  }));

  return {
    chart_data: chartData,
    metrics: {
        total_revenue: totalRevenue,
        total_sales: totalSalesQty,
        total_profit: totalRevenue * 0.30
    },
    top_products: topProducts,
    sales_by_brand: salesByBrand
  };
};

// --- IMPORT CSV ---
// Parseia o CSV no frontend e salva no localStorage
export const uploadProductCSV = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const text = e.target.result;
                const lines = text.split('\n');
                const headers = lines[0].split(',').map(h => h.trim());
                
                const products = loadDB('products', SEED_PRODUCTS);
                let count = 0;

                for (let i = 1; i < lines.length; i++) {
                    if (!lines[i].trim()) continue;
                    
                    const values = lines[i].split(',');
                    const productObj = {};
                    
                    headers.forEach((header, index) => {
                        let val = values[index]?.trim();
                        // Remove aspas se houver
                        if (val && val.startsWith('"') && val.endsWith('"')) {
                            val = val.slice(1, -1);
                        }
                        productObj[header] = val;
                    });

                    // Conversão de tipos
                    if (productObj.id) productObj.id = Number(productObj.id);
                    if (productObj.price) productObj.price = parseFloat(productObj.price);
                    if (productObj.category_id) productObj.category_id = Number(productObj.category_id);

                    // Validação simples: se não existe ID, insere
                    if (!products.find(p => p.id === productObj.id)) {
                        products.push(productObj);
                        count++;
                    }
                }
                
                saveDB('products', products);
                resolve({ message: `${count} produtos importados com sucesso!` });

            } catch (error) {
                reject(error);
            }
        };
        
        reader.onerror = (error) => reject(error);
        reader.readAsText(file); // Lê o arquivo localmente
    });
};