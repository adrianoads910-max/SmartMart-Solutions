import React, { useEffect, useState } from 'react';
import { 
  Table, Button, Select, Typography, Tag, Space, Input, Row, Col, 
  Tooltip, Drawer, Form, InputNumber, message, Popconfirm, Upload 
} from 'antd';
import { 
  PlusOutlined, UploadOutlined, SearchOutlined, EditOutlined, 
  DeleteOutlined, SaveOutlined, FileTextOutlined, DownloadOutlined 
} from '@ant-design/icons';

import MainLayout from '../../components/Navbar';
import { 
  getProducts, getCategories, getNextProductId, 
  createProduct, updateProduct, deleteProduct, uploadProductCSV 
} from '../../service/api'; // Verifique se é service ou services

import { exportToCSV } from '../../utils/exportCsv'; 

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const Products = () => {
  // --- ESTADOS ---
  const [allProducts, setAllProducts] = useState([]); 
  const [filteredProducts, setFilteredProducts] = useState([]); 
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados de Filtro
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); 

  // Estados do Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  // --- CARREGAMENTO INICIAL ---
  const fetchCategories = async () => {
    const data = await getCategories();
    if (data) setCategories(data);
  };

  const fetchProducts = async (catId = null) => {
    setLoading(true);
    const data = await getProducts(catId); 
    if (data) {
      setAllProducts(data);
      filterLocalData(data, searchTerm);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // --- LÓGICA DE FILTRO LOCAL ---
  const filterLocalData = (data, search) => {
    if (!search) {
      setFilteredProducts(data);
      return;
    }
    const lowerSearch = search.toLowerCase();
    const filtered = data.filter(product => 
      product.name.toLowerCase().includes(lowerSearch) || 
      product.brand.toLowerCase().includes(lowerSearch) ||
      String(product.id).includes(lowerSearch)
    );
    setFilteredProducts(filtered);
  };

  // --- HANDLERS ---
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    fetchProducts(value); 
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterLocalData(allProducts, value);
  };

  const handleAddNew = async () => {
    setEditingProduct(null);
    form.resetFields();
    try {
        const nextId = await getNextProductId();
        form.setFieldsValue({ id: nextId });
    } catch (e) { console.error(e); }
    setIsDrawerOpen(true);
  };

  const handleEdit = (record) => {
    setEditingProduct(record);
    form.setFieldsValue({ ...record, category_id: record.category_id });
    setIsDrawerOpen(true);
  };

  const handleDelete = async (id) => {
    const success = await deleteProduct(id);
    if (success) {
      message.success('Produto excluído');
      fetchProducts(selectedCategory);
    } else {
      message.error('Erro ao excluir.');
    }
  };

  // Exportar CSV
  const handleExport = () => {
    if (allProducts.length > 0) {
        exportToCSV(allProducts, `produtos_${new Date().toISOString().split('T')[0]}`);
    } else {
        message.warning("Sem dados para exportar.");
    }
  };

  // Importar CSV
  const handleUpload = async ({ file, onSuccess, onError }) => {
    try {
        const res = await uploadProductCSV(file);
        message.success(res.message);
        onSuccess("ok");
        fetchProducts(); // Recarrega a lista
    } catch (err) {
        message.error("Erro ao importar CSV.");
        onError(err);
    }
  };

  const onFinish = async (values) => {
    let success = false;
    if (editingProduct) {
      success = await updateProduct(editingProduct.id, values);
      if (success) message.success('Atualizado!');
    } else {
      try {
        await createProduct(values);
        success = true;
        message.success('Criado!');
      } catch (error) {
        success = false;
        message.error('Erro ao criar.');
      }
    }
    if (success) {
      setIsDrawerOpen(false);
      fetchProducts(selectedCategory);
    }
  };

  // --- CONFIGURAÇÃO DA LINHA EXPANSÍVEL ---
  const expandedRowRender = (record) => {
    return (
      <div className="bg-gray-50 p-4 rounded-md border border-gray-100 mx-4">
        <Space direction="vertical" size="small">
            <Space className="text-teal-700 font-semibold">
                <FileTextOutlined />
                <span>Descrição Detalhada:</span>
            </Space>
            <p className="text-gray-600 pl-6 m-0">
                {record.description ? record.description : <span className="italic text-gray-400">Sem descrição cadastrada.</span>}
            </p>
        </Space>
      </div>
    );
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 70, render: (t) => <span className="text-gray-500">#{t}</span> },
    { title: 'Produto', dataIndex: 'name', render: (t) => <span className="font-medium text-gray-800">{t}</span> },
    { title: 'Marca', dataIndex: 'brand' },
    { title: 'Categoria', dataIndex: 'category_name', render: (t) => <Tag color="geekblue">{t || 'Geral'}</Tag> },
    { 
      title: 'Preço', dataIndex: 'price', 
      render: (v) => <span className="font-semibold text-teal-700">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)}</span> 
    },
    {
      title: 'Ações',
      key: 'action',
      width: 120, 
      render: (_, record) => (
        <Space size="small" onClick={(e) => e.stopPropagation()}> 
          <Tooltip title="Editar">
            <Button type="text" icon={<EditOutlined />} className="text-blue-600 hover:bg-blue-50" onClick={() => handleEdit(record)} />
          </Tooltip>
          <Popconfirm title="Excluir?" onConfirm={() => handleDelete(record.id)} okText="Sim" cancelText="Não">
            <Tooltip title="Excluir">
                <Button type="text" danger icon={<DeleteOutlined />} className="hover:bg-red-50" />
            </Tooltip>
          </Popconfirm>
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
            <Button icon={<DownloadOutlined />} onClick={handleExport}>Baixar Lista</Button>
            
            <Upload customRequest={handleUpload} showUploadList={false} accept=".csv">
                <Button icon={<UploadOutlined />}>Importar CSV</Button>
            </Upload>

            <Button type="primary" icon={<PlusOutlined />} className="!bg-teal-600 hover:!bg-teal-700" onClick={handleAddNew}>
                Novo Produto
            </Button>
        </Space>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-100">
        <Row gutter={16} align="middle">
            <Col xs={24} md={8}>
                <span className="mr-2 text-gray-600">Filtrar:</span>
                <Select
                    style={{ width: 200 }}
                    placeholder="Categoria"
                    onChange={handleCategoryChange}
                    value={selectedCategory}
                    allowClear
                >
                    {categories.map(cat => (
                        <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                    ))}
                </Select>
            </Col>
            <Col xs={24} md={16} className="text-right mt-2 md:mt-0">
                 <Input 
                    prefix={<SearchOutlined className="text-gray-400" />} 
                    placeholder="Buscar por nome, marca ou ID..." 
                    style={{ width: 300 }} 
                    value={searchTerm}
                    onChange={handleSearchChange}
                    allowClear
                 />
            </Col>
        </Row>
      </div>

      <Table 
        columns={columns} 
        dataSource={filteredProducts} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 8 }} 
        className="shadow-sm bg-white rounded-lg"
        expandable={{
            expandedRowRender: expandedRowRender,
            expandRowByClick: true, 
            rowExpandable: (record) => true,
        }}
      />

      {/* --- DRAWER VERDE E MODERNO --- */}
      <Drawer
        title={
            <div className="text-teal-900 font-bold text-lg">
                {editingProduct ? "Editar Produto" : "Novo Produto"}
            </div>
        }
        width={500}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        // Estilização do cabeçalho para ficar verde claro
        headerStyle={{ backgroundColor: '#f0fdfa', borderBottom: '1px solid #ccfbf1' }}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ price: 0 }}>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name="id" label="ID" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} disabled={!!editingProduct} className="font-bold bg-gray-50" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="category_id" label="Categoria" rules={[{ required: true, message: 'Selecione' }]}>
                        <Select placeholder="Selecione">
                            {categories.map(cat => (
                                <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item name="name" label="Nome do Produto" rules={[{ required: true }]}>
                <Input placeholder="Ex: Smart TV" />
            </Form.Item>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name="brand" label="Marca" rules={[{ required: true }]}>
                        <Input placeholder="Ex: Sony" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="price" label="Preço (R$)" rules={[{ required: true }]}>
                        <InputNumber
                            style={{ width: '100%' }}
                            formatter={value => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\R\$\s?|(,*)/g, '')}
                            min={0} precision={2}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item name="description" label="Descrição">
                <TextArea rows={4} placeholder="Detalhes do produto..." />
            </Form.Item>

            <div className="absolute right-0 bottom-0 w-full border-t border-gray-100 p-4 bg-white text-right shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <Space>
                    <Button onClick={() => setIsDrawerOpen(false)}>Cancelar</Button>
                    <Button type="primary" htmlType="submit" className="!bg-teal-600 hover:!bg-teal-700" icon={<SaveOutlined />}>
                        {editingProduct ? "Atualizar" : "Salvar"}
                    </Button>
                </Space>
            </div>
        </Form>
      </Drawer>
    </MainLayout>
  );
};

export default Products;