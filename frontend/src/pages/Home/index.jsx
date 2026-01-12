import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, Spin, DatePicker, Space } from 'antd';
import { DollarOutlined, ShoppingCartOutlined, RiseOutlined, CalendarOutlined } from '@ant-design/icons';

import MainLayout from '../../components/Navbar';
import StatCard from '../../components/StatCard';
import SalesChart from '../../components/SalesChart';
import RevenueChart from '../../components/RevenueChart';
import TopProducts from '../../components/TopProducts';
import BrandChart from '../../components/BrandChart'; 
import { getDashboardData } from '../../service/api';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  
  const [data, setData] = useState([]);
  const [kpis, setKpis] = useState({ total_revenue: 0, total_sales: 0, total_profit: 0 });
  const [topProducts, setTopProducts] = useState([]); 
  const [brandData, setBrandData] = useState([]); // <--- ESTADO NOVO
  
  const [dateRange, setDateRange] = useState(null);

  const fetchData = async (start = null, end = null) => {
    setLoading(true);
    const result = await getDashboardData(start, end);
    if (result) {
      setData(result.chart_data);
      setKpis(result.metrics);
      setTopProducts(result.top_products || []);
      setBrandData(result.sales_by_brand || []); // <--- SALVA DADOS DAS MARCAS
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDateChange = (dates) => {
    setDateRange(dates);
    if (dates && dates.length === 2) {
      const start = dates[0].format('YYYY-MM-DD');
      const end = dates[1].format('YYYY-MM-DD');
      fetchData(start, end);
    } else {
      fetchData();
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <Title level={2} className="!mb-0">Visão Geral</Title>
          <p className="text-gray-500">Acompanhe as métricas principais da SmartMart.</p>
        </div>
        
        <div className="bg-white p-2 rounded shadow-sm">
            <Space>
                <CalendarOutlined className="text-teal-600" />
                <span className="text-gray-600 font-medium">Período:</span>
                <RangePicker 
                    onChange={handleDateChange} 
                    format="DD/MM/YYYY"
                    placeholder={['Data Inicial', 'Data Final']}
                    value={dateRange}
                />
            </Space>
        </div>
      </div>
      
      {loading ? (
         <div className="flex justify-center items-center h-64">
            <Spin size="large" tip="Calculando métricas..." />
         </div>
      ) : (
        <>
          {/* LINHA 1: KPIS */}
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={8}>
              <StatCard title="Vendas no Período" value={kpis.total_sales} icon={<ShoppingCartOutlined />} color="#1890ff"/>
            </Col>
            <Col xs={24} sm={8}>
              <StatCard title="Receita" value={kpis.total_revenue} prefix="R$ " icon={<DollarOutlined />} color="#52c41a"/>
            </Col>
            <Col xs={24} sm={8}>
              <StatCard title="Lucro Estimado" value={kpis.total_profit} prefix="R$ " icon={<RiseOutlined />} color="#cf1322"/>
            </Col>
          </Row>

          {/* LINHA 2: GRÁFICOS TEMPORAIS */}
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} lg={12}>
              <SalesChart data={data} />
            </Col>
            <Col xs={24} lg={12}>
              <RevenueChart data={data} />
            </Col>
          </Row>

          {/* LINHA 3: DETALHAMENTO (TOP PRODUTOS + BRAND SHARE) */}
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={14}>
                {/* Tabela ocupa um pouco mais da metade */}
                <TopProducts data={topProducts} loading={loading} />
            </Col>
            <Col xs={24} lg={10}>
                {/* Gráfico de Pizza ocupa o restante */}
                <BrandChart data={brandData} loading={loading} />
            </Col>
          </Row>
        </>
      )}
    </MainLayout>
  );
};

export default Dashboard;