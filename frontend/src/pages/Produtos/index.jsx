import React, { useEffect, useState } from 'react';
import { 
  Table, Button, Select, Typography, Tag, Space, Input, Row, Col, 
  Tooltip, Drawer, Form, InputNumber, message, Popconfirm 
} from 'antd';
import { 
  PlusOutlined, UploadOutlined, SearchOutlined, EditOutlined, 
  DeleteOutlined, SaveOutlined 
} from '@ant-design/icons';

import MainLayout from '../../components/Navbar';
import { 
  getProducts, getCategories, getNextProductId, 
  createProduct, updateProduct, deleteProduct 
} from '../../service/api';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const Products = () => {
  // --- ESTADOS ---
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Estados do Drawer (Formulário Lateral)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // Se null = Criando, se objeto = Editando
  const [form] = Form.useForm(); // Instância do formulário

  // --- CARREGAMENTO INICIAL ---
  const fetchCategories = async () => {
    const data = await getCategories();
    if (data) setCategories(data);
  };

  const fetchProducts = async (catId = null) => {
    setLoading(true);
    const data = await getProducts(catId);
    if (data) setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // --- AÇÕES DO USUÁRIO ---
  
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    fetchProducts(value);
  };

  // 1. Abrir Drawer para CRIAR NOVO
  const handleAddNew = async () => {
    setEditingProduct(null); // Modo Criação
    form.resetFields();
    
    // Busca o próximo ID automático no backend
    try {
        const nextId = await getNextProductId();
        form.setFieldsValue({ id: nextId });
    } catch (e) {
        console.error("Erro ao gerar ID", e);
    }
    
    setIsDrawerOpen(true);
  };

  // 2. Abrir Drawer para EDITAR
  const handleEdit = (record) => {
    setEditingProduct(record); // Modo Edição
    
    // Preenche o formulário com os dados da linha clicada
    form.setFieldsValue({
      ...record,
      category_id: record.category_id 
    });
    
    setIsDrawerOpen(true);
  };

  // 3. EXCLUIR Produto
  const handleDelete = async (id) => {
    const success = await deleteProduct(id);
    if (success) {
      message.success('Produto excluído com sucesso');
      fetchProducts(selectedCategory); // Recarrega a tabela
    } else {
      message.error('Erro ao excluir. O produto pode ter vendas associadas.');
    }
  };

  // 4. SALVAR (Submit do Formulário)
  const onFinish = async (values) => {
    let success = false;

    if (editingProduct) {
      // Atualizando (PUT)
      success = await updateProduct(editingProduct.id, values);
      if (success) message.success('Produto atualizado!');
    } else {
      // Criando Novo (POST)
      try {
        await createProduct(values);
        success = true;
        message.success('Produto criado!');
      } catch (error) {
        success = false;
        message.error('Erro ao criar. Verifique se o ID já existe.');
      }
    }

    if (success) {
      setIsDrawerOpen(false);
      fetchProducts(selectedCategory); // Atualiza tabela
    }
  };

  // --- COLUNAS DA TABELA ---
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
      render: (text) => <Tag color="geekblue">{text || 'Geral'}</Tag>
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
      width: 120, 
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Editar">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              className="text-blue-600 hover:bg-blue-50"
              onClick={() => handleEdit(record)} 
            />
          </Tooltip>

          {/* Botão com confirmação de segurança */}
          <Popconfirm
            title="Excluir produto"
            description="Tem certeza? Essa ação não pode ser desfeita."
            onConfirm={() => handleDelete(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Tooltip title="Excluir">
                <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />}
                className="hover:bg-red-50"
                />
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
                    <Option value={null}>Todos os produtos</Option>
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

      {/* --- DRAWER (FORMULÁRIO LATERAL) --- */}
      <Drawer
        title={editingProduct ? "Editar Produto" : "Novo Produto"}
        width={500}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        // Estilo para garantir que o botão fique fixo embaixo
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ price: 0 }}
        >
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="id"
                        label="ID"
                        rules={[{ required: true }]}
                    >
                        {/* ID desabilitado na edição para não quebrar integridade do banco */}
                        <InputNumber style={{ width: '100%' }} disabled={!!editingProduct} className="font-bold" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="category_id"
                        label="Categoria"
                        rules={[{ required: true, message: 'Selecione' }]}
                    >
                        <Select placeholder="Selecione">
                            {categories.map(cat => (
                                <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                name="name"
                label="Nome do Produto"
                rules={[{ required: true, message: 'Insira o nome' }]}
            >
                <Input placeholder="Ex: Smart TV" />
            </Form.Item>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="brand"
                        label="Marca"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="Ex: Sony" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="price"
                        label="Preço (R$)"
                        rules={[{ required: true }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            formatter={value => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\R\$\s?|(,*)/g, '')}
                            min={0}
                            precision={2}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                name="description"
                label="Descrição"
            >
                <TextArea rows={4} placeholder="Detalhes do produto..." />
            </Form.Item>

            {/* Botões de Ação Fixos no Rodapé do Drawer */}
            <div className="absolute right-0 bottom-0 w-full border-t border-gray-100 p-4 bg-white text-right">
                <Space>
                    <Button onClick={() => setIsDrawerOpen(false)}>Cancelar</Button>
                    <Button type="primary" htmlType="submit" className="bg-teal-600" icon={<SaveOutlined />}>
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