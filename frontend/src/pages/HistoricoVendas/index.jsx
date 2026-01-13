import React, { useEffect, useState } from 'react';
import { 
  Table, Typography, Tag, Input, Row, Col, Card, Space, 
  Button, Tooltip, Popconfirm, Drawer, Form, InputNumber, DatePicker, message 
} from 'antd';
import { 
  SearchOutlined, CalendarOutlined, FileTextOutlined, InfoCircleOutlined,
  EditOutlined, DeleteOutlined, SaveOutlined, BarcodeOutlined, PlusOutlined,
  CalculatorOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs'; 
import MainLayout from '../../components/Navbar';
import { getSalesHistory, updateSale, deleteSale } from '../../service/api';
import AddSaleDrawer from '../../components/AddSaleDrawer';
import { DownloadOutlined } from '@ant-design/icons'; 
import { exportToCSV } from '../../utils/exportCsv';

const { Title } = Typography;

const SalesHistory = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados do Drawer (Edição)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  
  // Estado NOVO para guardar o preço unitário durante a edição
  const [editingUnitPrice, setEditingUnitPrice] = useState(0); 
  
  const [form] = Form.useForm();

  // --- CARREGAMENTO ---
  const fetchSales = async () => {
    setLoading(true);
    const data = await getSalesHistory();
    if (data) {
      setSales(data);
      if (searchTerm) filterData(data, searchTerm);
      else setFilteredSales(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSales();
  }, []);


  // Função para exportar
  const handleExport = () => {
    if (sales.length > 0) {
        exportToCSV(sales, `historico_vendas_${dayjs().format('DD-MM-YYYY')}`);
    } else {
        message.warning("Sem dados para exportar.");
    }
  };

  // --- FILTROS ---
  const filterData = (data, value) => {
    const filtered = data.filter(sale => 
      sale.product_name.toLowerCase().includes(value) ||
      sale.category_name.toLowerCase().includes(value) ||
      sale.date.includes(value)
    );
    setFilteredSales(filtered);
  }

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    filterData(sales, value);
  };

  // --- AÇÕES (EDITAR / EXCLUIR) ---

  const handleEdit = (record) => {
    setEditingSale(record);
    
    // 1. Calcula o preço unitário atual e salva no estado
    const unitPrice = record.quantity > 0 ? record.total_price / record.quantity : 0;
    setEditingUnitPrice(unitPrice);

    // 2. Preenche o formulário
    form.setFieldsValue({
        ...record,
        date: dayjs(record.date) 
    });
    
    setIsDrawerOpen(true);
  };

  // --- LÓGICA DE CÁLCULO AUTOMÁTICO NA EDIÇÃO ---
  const handleEditValuesChange = (changedValues) => {
    // Se o usuário mudou a quantidade, recalcula o total
    if (changedValues.quantity) {
        const newQty = changedValues.quantity;
        const newTotal = newQty * editingUnitPrice;
        
        form.setFieldsValue({
            total_price: newTotal
        });
    }
  };

  const handleDelete = async (id) => {
    const success = await deleteSale(id);
    if (success) {
        message.success("Venda excluída com sucesso.");
        fetchSales();
    } else {
        message.error("Erro ao excluir venda.");
    }
  };

  const onFinish = async (values) => {
    const payload = {
        ...values,
        date: values.date.format('YYYY-MM-DD')
    };

    const success = await updateSale(editingSale.id, payload);
    if (success) {
        message.success("Venda atualizada!");
        setIsDrawerOpen(false);
        fetchSales();
    } else {
        message.error("Erro ao atualizar.");
    }
  };

  // --- RENDERIZAÇÃO DA LINHA EXPANDIDA ---
  const expandedRowRender = (record) => {
    const unitPrice = record.quantity > 0 ? record.total_price / record.quantity : 0;

    return (
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mx-4 shadow-inner">
        <Row gutter={[32, 16]}>
            <Col xs={24} md={14}>
                <Space direction="vertical" size="small" className="w-full">
                    <Space className="text-teal-700 font-bold text-base">
                        <FileTextOutlined />
                        <span>Sobre o Produto:</span>
                    </Space>
                    <div className="bg-white p-4 rounded border border-gray-100 text-gray-600 leading-relaxed">
                        {record.product_description 
                            ? record.product_description 
                            : <span className="italic text-gray-400">Nenhuma descrição detalhada.</span>
                        }
                    </div>
                </Space>
            </Col>
            <Col xs={24} md={10}>
                <Space direction="vertical" size="small" className="w-full">
                    <Space className="text-blue-600 font-bold text-base">
                        <BarcodeOutlined />
                        <span>Detalhes da Transação:</span>
                    </Space>
                    <div className="bg-white p-4 rounded border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-50">
                            <span className="text-gray-500 text-sm">ID da Venda</span>
                            <Tag color="blue" className="m-0 font-mono">#{record.id}</Tag>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-500">Preço Unitário</span>
                            <span className="text-gray-700 font-medium">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(unitPrice)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
                            <span className="text-gray-500">Quantidade</span>
                            <span className="text-gray-700">x {record.quantity}</span>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                            <span className="text-gray-800 font-bold">Total Pago</span>
                            <span className="text-teal-600 font-bold text-lg">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(record.total_price)}
                            </span>
                        </div>
                    </div>
                </Space>
            </Col>
        </Row>
      </div>
    );
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 70, render: (t) => <span className="text-gray-500">#{t}</span> },
    { 
      title: 'Data', dataIndex: 'date', 
      render: (d) => <span className="flex items-center gap-2 text-gray-700"><CalendarOutlined className="text-teal-600"/>{dayjs(d).format('DD/MM/YYYY')}</span> 
    },
    { title: 'Produto', dataIndex: 'product_name', render: (t) => <span className="font-semibold text-gray-800">{t}</span> },
    { title: 'Categoria', dataIndex: 'category_name', render: (t) => <Tag color="blue">{t}</Tag> },
    { title: 'Qtd.', dataIndex: 'quantity', align: 'center', render: (q) => <span className="font-medium">{q}</span> },
    { 
      title: 'Total', dataIndex: 'total_price', align: 'right', 
      render: (v) => <span className="font-bold text-teal-700">R$ {v.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span> 
    },
    {
      title: 'Ações',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Space size="small" onClick={(e) => e.stopPropagation()}>
            <Tooltip title="Editar Venda">
                <Button type="text" icon={<EditOutlined />} className="text-blue-600 hover:bg-blue-50" onClick={() => handleEdit(record)} />
            </Tooltip>
            <Popconfirm title="Excluir venda?" onConfirm={() => handleDelete(record.id)} okText="Sim" cancelText="Não">
                <Tooltip title="Excluir">
                    <Button type="text" danger icon={<DeleteOutlined />} className="hover:bg-red-50" />
                </Tooltip>
            </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
            <Title level={2} className="!mb-0">Histórico de Vendas</Title>
            <p className="text-gray-500">Consulte e gerencie todas as transações.</p>
        </div>
        <Space>
        {/* BOTÃO DE EXPORTAR */}
        <Button icon={<DownloadOutlined />} onClick={handleExport}>
            Exportar CSV
        </Button>
        
        <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            className="!bg-teal-600 hover:!bg-teal-700"
            onClick={() => setIsAddDrawerOpen(true)}
        >
            Nova Venda
        </Button>
    </Space>
      </div>

      <Card className="shadow-sm border-gray-100 rounded-lg">
        <Row className="mb-4">
            <Col xs={24} md={12}>
                 <Input prefix={<SearchOutlined className="text-gray-400" />} placeholder="Buscar..." value={searchTerm} onChange={handleSearch} allowClear />
            </Col>
        </Row>

        <Table 
            columns={columns} 
            dataSource={filteredSales} 
            rowKey="id" 
            loading={loading}
            pagination={{ pageSize: 10 }}
            className="border-t border-gray-100"
            expandable={{ expandedRowRender, expandRowByClick: true }}
        />
      </Card>

      {/* --- DRAWER DE EDIÇÃO --- */}
      <Drawer
        title={`Editar Venda #${editingSale?.id}`}
        width={400}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form 
            form={form} 
            layout="vertical" 
            onFinish={onFinish}
            // AQUI ESTÁ A MÁGICA: Listener de mudança de valores
            onValuesChange={handleEditValuesChange}
        >
            
            <Form.Item label="Produto (Não editável)">
                <Input value={editingSale?.product_name} disabled className="bg-gray-50 text-gray-700 font-semibold" />
            </Form.Item>

            <Form.Item name="date" label="Data da Venda" rules={[{ required: true }]}>
                <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} allowClear={false} />
            </Form.Item>

            {/* Bloco de Cálculo */}
            <div className="bg-gray-50 p-3 rounded mb-4 border border-gray-100">
                <Row gutter={16} align="middle">
                    <Col span={10}>
                         <Form.Item name="quantity" label="Quantidade" rules={[{ required: true }]} className="mb-0">
                            <InputNumber min={1} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={2} className="text-center pt-6">
                        <CalculatorOutlined className="text-gray-400" />
                    </Col>
                    <Col span={12}>
                         <Form.Item label="Preço Unitário" className="mb-0">
                            <Input 
                                disabled 
                                value={`R$ ${editingUnitPrice.toFixed(2)}`} 
                                className="bg-transparent border-none shadow-none text-gray-500" 
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </div>

            <Form.Item name="total_price" label="Valor Total (Automático)" rules={[{ required: true }]}>
                <InputNumber 
                    min={0} 
                    precision={2} 
                    style={{ width: '100%' }} 
                    className="font-bold text-teal-700"
                    formatter={value => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\R\$\s?|(,*)/g, '')}
                    // ReadOnly para forçar o usuário a mudar a quantidade
                    readOnly 
                />
            </Form.Item>

            <div className="absolute right-0 bottom-0 w-full border-t border-gray-100 p-4 bg-white text-right">
                <Space>
                    <Button onClick={() => setIsDrawerOpen(false)}>Cancelar</Button>
                    <Button type="primary" htmlType="submit" className="bg-teal-600" icon={<SaveOutlined />}>
                        Salvar Alterações
                    </Button>
                </Space>
            </div>
        </Form>
      </Drawer>

      {/* Drawer de Adição (Separado) */}
      <AddSaleDrawer 
        open={isAddDrawerOpen} 
        onClose={() => setIsAddDrawerOpen(false)}
        onSuccess={() => fetchSales()} 
      />
    </MainLayout>
  );
};

export default SalesHistory;