import React from 'react';
import { Card, Statistic } from 'antd';

export const StatCard = ({ title, value, prefix, color, icon }) => {
  return (
    <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <Statistic 
          title={<span className="text-gray-500 font-medium">{title}</span>}
          value={value} 
          precision={2} 
          prefix={prefix}
          valueStyle={{ color: color, fontWeight: 'bold' }}
        />
        <div className="p-3 rounded-full bg-gray-50 text-2xl" style={{ color: color }}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;