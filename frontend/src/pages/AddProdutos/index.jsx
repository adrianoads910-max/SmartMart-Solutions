import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, Select, Typography, Card, message, Row, Col } from 'antd';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { getCategories, getNextProductId, createProduct } from '../../services/api';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const AddProduct = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Carrega categorias e o próximo ID ao abrir a tela
  useEffect(() => {
    const loadData = async () => {
      const cats = await getCategories();
      setCategories(cats || []);

      const nextId = await getNextProductId();
      // Preenche o campo ID automaticamente
      form.setFieldsValue({ id: nextId });
    };
    loadData();
  }, [form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await createProduct(values);
      message.success('Produto cadastrado com sucesso!');
      navigate('/products'); // Volta para a lista
    } catch (error) {
      message.error('Erro ao cadastrar produto. Verifique o ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex items-center gap-4 mb-6">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/products')} />
        <div>
            <Title level={2} className="!mb-0">Adicionar Produto</Title>
            <p className="text-gray-500">Cadastre um novo item manualmente.</p>
        </div>
      </div>

      <Card className="shadow-sm rounded-lg border-gray-100 max-w-4xl">
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ price: 0 }}
        >
            <Row gutter={24}>
                {/* --- ID DO PRODUTO (Sequencial) --- */}
                <Col xs={24} md={6}>
                    <Form.Item
                        name="id"
                        label="ID do Produto"
                        tooltip="Gerado sequencialmente, mas pode ser alterado."
                        rules={[{ required: true, message: 'ID é obrigatório' }]}
                    >
                        <InputNumber style={{ width: '100%' }} className="font-bold text-gray-700" />
                    </Form.Item>
                </Col>

                {/* --- NOME --- */}
                <Col xs={24} md={18}>
                    <Form.Item
                        name="name"
                        label="Nome do Produto"
                        rules={[{ required: true, message: 'Por favor insira o nome' }]}
                    >
                        <Input placeholder="Ex: Smart TV 55 polegadas" />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                 {/* --- MARCA --- */}
                 <Col xs={24} md={8}>
                    <Form.Item
                        name="brand"
                        label="Marca"
                        rules={[{ required: true, message: 'Marca é obrigatória' }]}
                    >
                        <Input placeholder="Ex: Samsung, Apple..." />
                    </Form.Item>
                </Col>

                {/* --- CATEGORIA --- */}
                <Col xs={24} md={8}>
                    <Form.Item
                        name="category_id"
                        label="Categoria"
                        rules={[{ required: true, message: 'Selecione uma categoria' }]}
                    >
                        <Select placeholder="Selecione...">
                            {categories.map(cat => (
                                <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>

                {/* --- PREÇO --- */}
                <Col xs={24} md={8}>
                    <Form.Item
                        name="price"
                        label="Preço (R$)"
                        rules={[{ required: true, message: 'Insira o valor' }]}
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

            {/* --- DESCRIÇÃO --- */}
            <Form.Item
                name="description"
                label="Descrição Detalhada"
            >
                <TextArea rows={4} placeholder="Descreva as características do produto..." />
            </Form.Item>

            <Form.Item>
                <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={<SaveOutlined />} 
                    size="large"
                    loading={loading}
                    className="bg-teal-600 hover:bg-teal-500"
                >
                    Salvar Produto
                </Button>
            </Form.Item>
        </Form>
      </Card>
    </MainLayout>
  );
};

export default AddProduct;