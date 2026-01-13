import React from 'react';
import { Card } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const SalesChart = ({ data }) => {
  return (
    <Card title="Volume de Vendas por Mês" className="shadow-sm h-full" bordered={false}>
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: '#f5f5f5' }} />
            <Bar dataKey="quantity" fill="#008080" radius={[4, 4, 0, 0]} name="Qtd. Vendas" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default SalesChart;