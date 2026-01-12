import React from 'react';
import { Card, Table, Progress, Space } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';

const TopProducts = ({ data, loading }) => {
  
  // Função auxiliar para renderizar a medalha ou a posição numérica
  const renderRank = (index) => {
    switch (index) {
        case 0:
            return <span style={{ fontSize: '22px' }}>🥇</span>; // Ouro
        case 1:
            return <span style={{ fontSize: '22px' }}>🥈</span>; // Prata
        case 2:
            return <span style={{ fontSize: '22px' }}>🥉</span>; // Bronze
        default:
            return <span className="font-bold text-gray-400 text-lg">{index + 1}º</span>;
    }
  };

  const columns = [
    {
      title: '#',
      key: 'rank',
      align: 'center',
      width: 60,
      render: (text, record, index) => renderRank(index), // Usa o índice da linha (0, 1, 2...)
    },
    {
      title: 'Produto',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span className="font-semibold text-gray-700">{text}</span>,
    },
    {
      title: 'Vendas',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      render: (qtd) => <span className="text-gray-500">{qtd} un.</span>
    },
    {
      title: 'Faturamento',
      dataIndex: 'total',
      key: 'total',
      render: (val) => (
        <span className="font-medium text-teal-800">
            R$ {val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      title: 'Impacto (%)',
      dataIndex: 'percentage',
      key: 'percentage',
      width: 150,
      render: (percent) => (
        <div className="w-full">
            <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Receita</span>
                <span className="font-bold text-gray-600">{percent}%</span>
            </div>
            <Progress 
                percent={percent} 
                size="small" 
                showInfo={false} 
                strokeColor={{
                    '0%': '#36cfc9',
                    '100%': '#135200',
                }} 
                trailColor="#f5f5f5"
            />
        </div>
      )
    }
  ];

  return (
    <Card 
        title={
            <Space>
                {/* Troféu estilizado com cor Dourada Vibrante */}
                <div className="p-2 bg-yellow-50 rounded-full border border-yellow-100">
                    <TrophyOutlined style={{ color: '#DAA520', fontSize: '20px' }} />
                </div>
                <span className="font-bold text-gray-700 text-lg">Ranking de Produtos</span>
            </Space>
        } 
        className="shadow-sm h-full border-gray-100 rounded-lg overflow-hidden" 
        bodyStyle={{ padding: 0 }} 
        bordered={true}
        loading={loading}
    >
        <Table 
            dataSource={data} 
            columns={columns} 
            pagination={false} 
            rowKey="name"
            size="middle"
            locale={{ emptyText: 'Nenhuma venda no período selecionado' }}
            rowClassName={(record, index) => 
                index < 3 ? 'bg-yellow-50/30' : 'hover:bg-gray-50'
            } // Destaca levemente as 3 primeiras linhas
        />
    </Card>
  );
};

export default TopProducts;