import React, { useEffect, useState } from 'react';
import MainLayout from '../../components/Navbar';
import StatCard from '../../components/StatCard';
import SalesChart from '../../components/SalesChart';
import RevenueChart from '../../components/RevenueChart';
import TopProducts from '../../components/TopProducts';
import BrandChart from '../../components/BrandChart'; 
import { Row, Col, Typography, Spin, DatePicker, Space, Select, Button, message } from 'antd';
import { 
  DollarOutlined, ShoppingCartOutlined, RiseOutlined, 
  CalendarOutlined, FilterOutlined, ClearOutlined 
} from '@ant-design/icons';
import { getDashboardData, getCategories, getProducts } from '../../service/api'; 

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  
  // Dados
  const [data, setData] = useState([]);
  const [kpis, setKpis] = useState({ total_revenue: 0, total_sales: 0, total_profit: 0 });
  const [topProducts, setTopProducts] = useState([]); 
  const [brandData, setBrandData] = useState([]);
  
  // Filtros - Opções
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Filtros - Selecionados
  const [dateRange, setDateRange] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);

  // Carrega opções iniciais
  useEffect(() => {
    const loadFilters = async () => {
        const cats = await getCategories();
        setCategories(cats || []);

        const prods = await getProducts();
        if (prods) {
            const uniqueBrands = [...new Set(prods.map(p => p.brand))].sort();
            setBrands(uniqueBrands);
        }
    };
    loadFilters();
    fetchData(); 
  }, []);

  // Função Central de Busca
  const fetchData = async (start, end, catId, brandName) => {
    setLoading(true);
    const result = await getDashboardData(start, end, catId, brandName);
    if (result) {
        setData(result.chart_data);
        setKpis(result.metrics);
        setTopProducts(result.top_products || []);
        setBrandData(result.sales_by_brand || []);
    }
    setLoading(false);
  };

  // --- HANDLERS INTELIGENTES ---
  // Precisamos passar os valores atuais E o novo valor alterado

  const handleDateChange = (dates) => {
    setDateRange(dates);
    let start = null, end = null;
    if (dates && dates.length === 2) {
        start = dates[0].format('YYYY-MM-DD');
        end = dates[1].format('YYYY-MM-DD');
    }
    // Usa o valor NOVO de data, mas mantém os valores VELHOS de cat e brand
    fetchData(start, end, selectedCategory, selectedBrand);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    
    // Extrai data atual se existir
    let start = null, end = null;
    if (dateRange && dateRange.length === 2) {
        start = dateRange[0].format('YYYY-MM-DD');
        end = dateRange[1].format('YYYY-MM-DD');
    }
    
    // Usa o valor NOVO de categoria (value), e o velho de brand
    fetchData(start, end, value, selectedBrand);
  };

  const handleBrandChange = (value) => {
    setSelectedBrand(value);

    let start = null, end = null;
    if (dateRange && dateRange.length === 2) {
        start = dateRange[0].format('YYYY-MM-DD');
        end = dateRange[1].format('YYYY-MM-DD');
    }

    // Usa o valor NOVO de brand (value), e o velho de categoria
    fetchData(start, end, selectedCategory, value);
  };

  const clearAllFilters = () => {
    setDateRange(null);
    setSelectedCategory(null);
    setSelectedBrand(null);
    fetchData(null, null, null, null); // Manda tudo nulo para resetar
    message.info("Filtros removidos");
  };

  return (
    <MainLayout>
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
        <div>
          <Title level={2} className="!mb-0">Visão Geral</Title>
          <p className="text-gray-500">Acompanhe as métricas principais da SmartMart.</p>
        </div>
        
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 text-gray-500 font-medium">
                <FilterOutlined /> Filtros:
            </div>

            <RangePicker 
                onChange={handleDateChange} 
                format="DD/MM/YYYY"
                placeholder={['Início', 'Fim']}
                value={dateRange}
                style={{ width: 240 }}
            />

            <Select
                placeholder="Categoria"
                style={{ width: 150 }}
                onChange={handleCategoryChange}
                value={selectedCategory}
                allowClear
            >
                {categories.map(cat => (
                    <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                ))}
            </Select>

            <Select
                placeholder="Marca"
                style={{ width: 150 }}
                onChange={handleBrandChange}
                value={selectedBrand}
                allowClear
                showSearch
            >
                {brands.map(brand => (
                    <Option key={brand} value={brand}>{brand}</Option>
                ))}
            </Select>

            {(dateRange || selectedCategory || selectedBrand) && (
                <Button 
                    type="text" 
                    danger 
                    icon={<ClearOutlined />} 
                    onClick={clearAllFilters}
                    className="flex items-center"
                >
                    Limpar
                </Button>
            )}
        </div>
      </div>
      
      {loading ? (
         <div className="flex justify-center items-center h-64">
            <Spin size="large" tip="Carregando dados..." />
         </div>
      ) : (
        <>
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={8}>
              <StatCard title="Vendas Totais" value={kpis.total_sales} icon={<ShoppingCartOutlined />} color="#1890ff"/>
            </Col>
            <Col xs={24} sm={8}>
              <StatCard title="Receita Bruta" value={kpis.total_revenue} prefix="R$ " icon={<DollarOutlined />} color="#52c41a"/>
            </Col>
            <Col xs={24} sm={8}>
              <StatCard title="Lucro Estimado" value={kpis.total_profit} prefix="R$ " icon={<RiseOutlined />} color="#cf1322"/>
            </Col>
          </Row>

          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} lg={12}>
              <SalesChart data={data} />
            </Col>
            <Col xs={24} lg={12}>
              <RevenueChart data={data} />
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={14}>
                <TopProducts data={topProducts} loading={loading} />
            </Col>
            <Col xs={24} lg={10}>
                <BrandChart data={brandData} loading={loading} />
            </Col>
          </Row>
        </>
      )}
    </MainLayout>
  );
};

export default Dashboard;