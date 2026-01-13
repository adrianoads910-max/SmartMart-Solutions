import React, { useEffect, useState } from 'react';
import { 
  Form, Input, InputNumber, Button, Select, Typography, Card, 
  message, Row, Col, Modal, Upload, Divider, Space 
} from 'antd';
import { 
  SaveOutlined, ArrowLeftOutlined, PlusOutlined, UploadOutlined, InboxOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import MainLayout from '../../components/Navbar';
import { 
  getNextProductId, createProduct, getCategories, createCategory, uploadProductCSV 
} from '../../service/api';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const AddProduct = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estados para o Modal de Nova Categoria
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [catLoading, setCatLoading] = useState(false);

  // Carrega dados iniciais
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const cats = await getCategories();
    setCategories(cats || []);

    // Só busca o ID se o campo estiver vazio (para não sobrescrever input manual)
    if (!form.getFieldValue('id')) {
        const nextId = await getNextProductId();
        form.setFieldsValue({ id: nextId });
    }
  };

  // --- LÓGICA DE SALVAR PRODUTO ---
  const onFinish = async (values) => {
    setLoading(true);
    try {
      await createProduct(values);
      message.success('Produto cadastrado com sucesso!');
      navigate('/products');
    } catch (error) {
      message.error('Erro ao cadastrar. Verifique se o ID já existe.');
    } finally {
      setLoading(false);
    }
  };

  // --- LÓGICA DE NOVA CATEGORIA ---
  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    setCatLoading(true);
    try {
        const newCat = await createCategory(newCatName);
        message.success(`Categoria "${newCat.name}" criada!`);
        
        // Atualiza a lista e seleciona a nova categoria
        const updatedCats = await getCategories();
        setCategories(updatedCats);
        form.setFieldsValue({ category_id: newCat.id });
        
        setIsCatModalOpen(false);
        setNewCatName('');
    } catch (error) {
        message.error("Erro ao criar categoria.");
    } finally {
        setCatLoading(false);
    }
  };

  // --- LÓGICA DE UPLOAD CSV ---
  const handleUpload = async ({ file, onSuccess, onError }) => {
    try {
        const res = await uploadProductCSV(file);
        message.success(res.message);
        onSuccess("ok");
        navigate('/products'); // Redireciona para ver os produtos importados
    } catch (err) {
        message.error("Erro ao importar CSV.");
        onError(err);
    }
  };

  return (
    <MainLayout>
      {/* Cabeçalho com Botões de Ação */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/products')} />
            <div>
                <Title level={2} className="!mb-0">Adicionar Produto</Title>
                <p className="text-gray-500">Cadastre manualmente ou importe dados.</p>
            </div>
        </div>
        
        {/* Botão de Importar CSV */}
        <Upload 
            customRequest={handleUpload} 
            showUploadList={false} 
            accept=".csv"
        >
            <Button icon={<UploadOutlined />}>Importar via CSV</Button>
        </Upload>
      </div>

      <Card className="shadow-sm rounded-lg border-gray-100 max-w-4xl">
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ price: 0 }}
        >
            <Row gutter={24}>
                <Col xs={24} md={6}>
                    <Form.Item
                        name="id"
                        label="ID do Produto"
                        tooltip="Gerado sequencialmente, mas pode ser alterado."
                        rules={[{ required: true, message: 'ID obrigatório' }]}
                    >
                        <InputNumber style={{ width: '100%' }} className="font-bold text-gray-700" />
                    </Form.Item>
                </Col>

                <Col xs={24} md={18}>
                    <Form.Item
                        name="name"
                        label="Nome do Produto"
                        rules={[{ required: true, message: 'Insira o nome' }]}
                    >
                        <Input placeholder="Ex: Smart TV 55 polegadas" />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                 <Col xs={24} md={8}>
                    <Form.Item
                        name="brand"
                        label="Marca"
                        rules={[{ required: true, message: 'Marca obrigatória' }]}
                    >
                        <Input placeholder="Ex: Samsung" />
                    </Form.Item>
                </Col>

                {/* --- SELEÇÃO DE CATEGORIA COM BOTÃO DE ADICIONAR --- */}
                <Col xs={24} md={8}>
                    <Form.Item
                        label="Categoria"
                        required
                    >
                        <div className="flex gap-2">
                            <Form.Item
                                name="category_id"
                                noStyle
                                rules={[{ required: true, message: 'Selecione uma categoria' }]}
                            >
                                <Select placeholder="Selecione..." style={{ flex: 1 }}>
                                    {categories.map(cat => (
                                        <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Button 
                                icon={<PlusOutlined />} 
                                onClick={() => setIsCatModalOpen(true)}
                                title="Nova Categoria"
                            />
                        </div>
                    </Form.Item>
                </Col>

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
                    className="!bg-teal-600 hover:!bg-teal-500"
                >
                    Salvar Produto
                </Button>
            </Form.Item>
        </Form>
      </Card>

      {/* --- MODAL PARA CRIAR NOVA CATEGORIA --- */}
      <Modal
        title="Nova Categoria"
        open={isCatModalOpen}
        onOk={handleAddCategory}
        confirmLoading={catLoading}
        onCancel={() => setIsCatModalOpen(false)}
        okText="Criar"
        cancelText="Cancelar"
      >
        <p className="mb-2 text-gray-500">Digite o nome da nova categoria:</p>
        <Input 
            value={newCatName} 
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="Ex: Eletrodomésticos"
            onPressEnter={handleAddCategory}
        />
      </Modal>

    </MainLayout>
  );
};

export default AddProduct;