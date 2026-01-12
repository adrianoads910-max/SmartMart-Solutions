import React, { useEffect, useState } from 'react';
import { Table, Button, Select, Typography, Tag, Space, Input, Row, Col, Tooltip } from 'antd';
import { 
  PlusOutlined, 
  UploadOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';

import MainLayout from '../../components/Navbar';
import { getProducts, getCategories } from '../../service/api';

const { Title } = Typography;
const { Option } = Select;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para controlar o select. Iniciamos com null (Todos)
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      if (data) setCategories(data);
    } catch (error) {
      console.error("Erro categorias:", error);
    }
  };

  const fetchProducts = async (catId = null) => {
    setLoading(true);
    try {
      const data = await getProducts(catId);
      if (data) setProducts(data);
    } catch (error) {
      console.error("Erro produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const handleCategoryChange = (value) => {
    setSelectedCategory(value); // Atualiza o visual do Select
    fetchProducts(value);       // Busca os dados (null = todos)
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
      title: 'Produto',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span className="font-medium text-gray-800">{text}</span>
    },
    {
      title: 'Marca',
      dataIndex: 'brand',
      key: 'brand',
    },
    {
      title: 'Categoria',
      dataIndex: 'category_name', 
      key: 'category',
      render: (text) => (
        <Tag color="geekblue">{text || 'Geral'}</Tag>
      )
    },
    {
      title: 'Preço',
      dataIndex: 'price',
      key: 'price',
      render: (value) => (
        <span className="font-semibold text-teal-700">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
        </span>
      )
    },
    {
      title: 'Ações',
      key: 'action',
      width: 100, 
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Editar">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => console.log('Editar', record.id)} 
            />
          </Tooltip>

          <Tooltip title="Excluir">
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />}
              className="hover:bg-red-50"
              onClick={() => console.log('Excluir', record.id)} 
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
            <Title level={2} className="!mb-0">Produtos</Title>
            <p className="text-gray-500">Gerencie o catálogo da sua loja.</p>
        </div>
        <Space>
            <Button icon={<UploadOutlined />}>Importar CSV</Button>
            <Button type="primary" icon={<PlusOutlined />} className="bg-teal-600">Novo Produto</Button>
        </Space>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-100">
        <Row gutter={16} align="middle">
            <Col xs={24} md={8}>
                <span className="mr-2 text-gray-600">Filtrar por Categoria:</span>
                
                <Select
                    style={{ width: 200 }}
                    placeholder="Selecione uma categoria"
                    onChange={handleCategoryChange}
                    value={selectedCategory}
                >
                    {/* --- OPÇÃO PARA LIMPAR O FILTRO --- */}
                    <Option value={null}>Todos os produtos</Option>
                    
                    {/* MAP DAS OUTRAS CATEGORIAS */}
                    {categories.map(cat => (
                        <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                    ))}
                </Select>

            </Col>
            <Col xs={24} md={16} className="text-right mt-2 md:mt-0">
                 <Input prefix={<SearchOutlined />} placeholder="Buscar produto..." style={{ width: 250 }} />
            </Col>
        </Row>
      </div>

      <Table 
        columns={columns} 
        dataSource={products} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 8 }} 
        className="shadow-sm bg-white rounded-lg"
      />
    </MainLayout>
  );
};

export default Products;