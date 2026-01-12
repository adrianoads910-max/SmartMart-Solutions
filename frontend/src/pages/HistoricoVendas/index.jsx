import React, { useEffect, useState } from 'react';
import { Table, Typography, Tag, Input, Row, Col, Card, Space } from 'antd';
import { SearchOutlined, CalendarOutlined, FileTextOutlined, InfoCircleOutlined } from '@ant-design/icons';
import MainLayout from '../../components/Navbar';
import { getSalesHistory } from '../../service/api';

const { Title, Text } = Typography;

const SalesHistory = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Busca dados do backend
  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true);
      const data = await getSalesHistory();
      if (data) {
        setSales(data);
        setFilteredSales(data);
      }
      setLoading(false);
    };
    fetchSales();
  }, []);

  // Filtro local
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    
    const filtered = sales.filter(sale => 
      sale.product_name.toLowerCase().includes(value) ||
      sale.category_name.toLowerCase().includes(value) ||
      sale.date.includes(value)
    );
    setFilteredSales(filtered);
  };

  // --- RENDERIZAÇÃO DA LINHA EXPANDIDA ---
  const expandedRowRender = (record) => {
    // Calcula o preço unitário baseado no total / quantidade
    const unitPrice = record.total_price / record.quantity;

    return (
      <div className="bg-gray-50 p-4 rounded-md border border-gray-100 mx-4">
        <Row gutter={[24, 16]}>
            {/* Coluna 1: Descrição do Produto */}
            <Col xs={24} md={16}>
                <Space direction="vertical" size="small">
                    <Space className="text-teal-700 font-semibold">
                        <FileTextOutlined />
                        <span>Detalhes do Produto:</span>
                    </Space>
                    <p className="text-gray-600 pl-6 m-0">
                        {record.product_description 
                            ? record.product_description 
                            : <span className="italic text-gray-400">Sem descrição disponível.</span>
                        }
                    </p>
                </Space>
            </Col>

            {/* Coluna 2: Detalhes Financeiros Extras */}
            <Col xs={24} md={8} className="border-l border-gray-200 pl-6">
                <Space direction="vertical" size="small">
                    <Space className="text-blue-600 font-semibold">
                        <InfoCircleOutlined />
                        <span>Resumo da Transação:</span>
                    </Space>
                    <div className="pl-6 text-sm text-gray-600">
                        <p className="mb-1">
                            Preço Unitário: <span className="font-medium text-gray-800">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(unitPrice)}
                            </span>
                        </p>
                        <p className="mb-0">
                           ID do Sistema: <span className="font-mono text-xs bg-gray-200 px-1 rounded">#{record.id}</span>
                        </p>
                    </div>
                </Space>
            </Col>
        </Row>
      </div>
    );
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      render: (text) => <span className="text-gray-500">#{text}</span>
    },
    {
      title: 'Data',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      render: (date) => (
        <span className="flex items-center gap-2 text-gray-700">
            <CalendarOutlined className="text-teal-600"/>
            {new Date(date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
        </span>
      )
    },
    {
      title: 'Produto',
      dataIndex: 'product_name',
      key: 'product_name',
      render: (text) => <span className="font-semibold text-gray-800">{text}</span>
    },
    {
      title: 'Categoria',
      dataIndex: 'category_name',
      key: 'category_name',
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    {
      title: 'Qtd.',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      render: (qtd) => <span className="font-medium">{qtd}</span>
    },
    {
      title: 'Total',
      dataIndex: 'total_price',
      key: 'total_price',
      align: 'right',
      render: (val) => (
        <span className="font-bold text-teal-700">
          R$ {val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </span>
      )
    },
  ];

  return (
    <MainLayout>
      <div className="mb-6">
        <Title level={2} className="!mb-0">Histórico de Vendas</Title>
        <p className="text-gray-500">Consulte todas as transações realizadas.</p>
      </div>

      <Card className="shadow-sm border-gray-100 rounded-lg">
        {/* Barra de Busca */}
        <Row className="mb-4">
            <Col xs={24} md={12}>
                 <Input 
                    prefix={<SearchOutlined className="text-gray-400" />} 
                    placeholder="Buscar por produto, categoria ou data..." 
                    value={searchTerm}
                    onChange={handleSearch}
                    allowClear
                 />
            </Col>
        </Row>

        <Table 
            columns={columns} 
            dataSource={filteredSales} 
            rowKey="id" 
            loading={loading}
            pagination={{ pageSize: 10 }}
            className="border-t border-gray-100"
            
            // --- ATIVAÇÃO DA EXPANSÃO ---
            expandable={{
                expandedRowRender: expandedRowRender,
                expandRowByClick: true, // Clique em qualquer lugar abre
                rowExpandable: (record) => true,
            }}
        />
      </Card>
    </MainLayout>
  );
};

export default SalesHistory;