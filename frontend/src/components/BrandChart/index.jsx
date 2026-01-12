import React from 'react';
import { Card, Empty, Space } from 'antd';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PieChartOutlined } from '@ant-design/icons';

// Paleta de cores mais moderna e vibrante
const COLORS = [
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#6366f1', // Indigo
  '#14b8a6', // Teal
];

// Componente de Tooltip customizado (FORA do componente principal para evitar erros)
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg">
        <div className="flex items-center gap-2 mb-1">
            {/* Bolinha com a cor da fatia */}
            <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: data.payload.fill }}
            ></div>
            <span className="font-bold text-gray-700">{data.name}</span>
        </div>
        <div className="pl-5">
            <p className="text-gray-500 text-xs">Faturamento</p>
            <p className="text-teal-600 font-semibold text-sm">
            R$ {data.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
        </div>
      </div>
    );
  }
  return null;
};

const BrandChart = ({ data, loading }) => {
  return (
    <Card 
      title={
        <Space>
            {/* Ícone Estilizado (Roxo para diferenciar do Amarelo do Ranking) */}
            <div className="p-2 bg-purple-50 rounded-full border border-purple-100">
                <PieChartOutlined style={{ color: '#722ed1', fontSize: '20px' }} />
            </div>
            <span className="font-bold text-gray-700 text-lg">Share por Marca</span>
        </Space>
      } 
      className="shadow-sm h-full border-gray-100 rounded-lg overflow-hidden" 
      loading={loading}
      bodyStyle={{ padding: '20px 0' }} // Padding ajustado para o gráfico respirar
    >
      <div style={{ height: 320 }}>
        {data && data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={70} // Rosca mais fina e elegante
                    outerRadius={90}
                    paddingAngle={4} // Espaço entre as fatias
                    dataKey="value"
                    stroke="none" // Remove borda branca padrão
                >
                    {data.map((entry, index) => (
                        <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                            // Adiciona a cor ao objeto de dados para o Tooltip usar
                            payload={{...entry, fill: COLORS[index % COLORS.length]}}
                        />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle" // Ícones da legenda redondos
                    formatter={(value) => <span className="text-gray-600 ml-1">{value}</span>}
                />
            </PieChart>
            </ResponsiveContainer>
        ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <Empty description="Sem dados de marcas" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
        )}
      </div>
    </Card>
  );
};

export default BrandChart;