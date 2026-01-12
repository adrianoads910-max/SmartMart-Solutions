import React, { useEffect, useState } from 'react';
import { Drawer, Form, Button, Col, Row, InputNumber, Select, DatePicker, message, Input } from 'antd';
import { SaveOutlined, CalculatorOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getNextSaleId, getProducts, createSale } from '../../service/api';

const { Option } = Select;

const AddSaleDrawer = ({ open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Estado para guardar o preço do produto selecionado atualmente
  const [selectedProductPrice, setSelectedProductPrice] = useState(0);

  // 1. Carregar dados ao abrir o Drawer
  useEffect(() => {
    if (open) {
      loadInitialData();
    }
  }, [open]);

  const loadInitialData = async () => {
    form.resetFields();
    setSelectedProductPrice(0);
    
    // Define data de hoje como padrão
    form.setFieldsValue({ date: dayjs() });

    // Busca próximo ID
    const nextId = await getNextSaleId();
    form.setFieldsValue({ id: nextId });

    // Busca lista de produtos para o select
    const prods = await getProducts();
    if (prods) setProducts(prods);
  };

  // 2. Lógica Inteligente de Cálculo
  const handleValuesChange = (changedValues, allValues) => {
    
    // SE O USUÁRIO MUDOU O PRODUTO
    if (changedValues.product_id) {
      const product = products.find(p => p.id === changedValues.product_id);
      if (product) {
        setSelectedProductPrice(product.price);
        
        // Se já tiver quantidade, recalcula o total
        const qty = allValues.quantity || 0;
        const newTotal = product.price * qty;
        
        form.setFieldsValue({ 
            total_price: newTotal 
        });
      }
    }

    // SE O USUÁRIO MUDOU A QUANTIDADE
    if (changedValues.quantity) {
      const qty = changedValues.quantity;
      const newTotal = selectedProductPrice * qty;
      
      form.setFieldsValue({ 
        total_price: newTotal 
      });
    }
  };

  // 3. Salvar Venda
  const onFinish = async (values) => {
    setLoading(true);
    const payload = {
        ...values,
        date: values.date.format('YYYY-MM-DD')
    };

    const success = await createSale(payload);
    if (success) {
        message.success("Venda registrada!");
        onSuccess(); // Avisa o pai para atualizar a tabela
        onClose();   // Fecha o drawer
    } else {
        message.error("Erro ao registrar venda.");
    }
    setLoading(false);
  };

  return (
    <Drawer
      title="Nova Venda"
      width={450}
      onClose={onClose}
      open={open}
      bodyStyle={{ paddingBottom: 80 }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={handleValuesChange} // <--- ONDE A MÁGICA ACONTECE
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="id" label="ID da Venda" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} disabled className="font-bold bg-gray-100" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="date" label="Data" rules={[{ required: true }]}>
              <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} allowClear={false} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="product_id" label="Produto" rules={[{ required: true, message: 'Selecione um produto' }]}>
            <Select 
                placeholder="Selecione o produto..." 
                showSearch
                optionFilterProp="children"
            >
                {products.map(p => (
                    <Option key={p.id} value={p.id}>
                        {p.name} - R$ {p.price}
                    </Option>
                ))}
            </Select>
        </Form.Item>

        <div className="bg-gray-50 p-4 rounded mb-4 border border-gray-100">
            <Row gutter={16} align="middle">
                <Col span={10}>
                    <Form.Item name="quantity" label="Quantidade" rules={[{ required: true }]}>
                        <InputNumber min={1} style={{ width: '100%' }} placeholder="Qtd" />
                    </Form.Item>
                </Col>
                <Col span={2} className="text-center pt-2">
                    <CalculatorOutlined className="text-gray-400" />
                </Col>
                <Col span={12}>
                    <Form.Item label="Preço Unitário (Ref.)">
                         <Input 
                            readOnly 
                            value={`R$ ${selectedProductPrice.toFixed(2)}`} 
                            className="bg-transparent border-none text-gray-500 shadow-none" 
                         />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item 
                name="total_price" 
                label="Total Calculado (R$)" 
                rules={[{ required: true }]}
            >
                <InputNumber 
                    style={{ width: '100%' }} 
                    className="font-bold text-teal-700 text-lg"
                    formatter={value => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\R\$\s?|(,*)/g, '')}
                    readOnly // O usuário não deve digitar aqui, é automático
                />
            </Form.Item>
        </div>

        <div className="absolute right-0 bottom-0 w-full border-t border-gray-100 p-4 bg-white text-right">
            <Button onClick={onClose} style={{ marginRight: 8 }}>
              Cancelar
            </Button>
            <Button type="primary" htmlType="submit" loading={loading} className="bg-teal-600" icon={<SaveOutlined />}>
              Registrar Venda
            </Button>
        </div>
      </Form>
    </Drawer>
  );
};

export default AddSaleDrawer;