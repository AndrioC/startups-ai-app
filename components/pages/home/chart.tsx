import React from "react";
import { useTranslations } from "next-intl";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartProps {
  data: {
    name: string;
    startups: number;
    mentors: number;
    investors: number;
    government: number;
    traditionalCompanies: number;
    innovationEnvironments: number;
    countries: number;
  }[];
  selectedMetric:
    | "startups"
    | "mentors"
    | "investors"
    | "government"
    | "traditionalCompanies"
    | "innovationEnvironments";
}

// Componente customizado para o Tooltip
const CustomTooltip = ({ active, payload, label, selectedMetric }: any) => {
  const t = useTranslations("admin.dashboard");

  if (active && payload && payload.length) {
    const metricValue = payload[0].value;
    const metricName = t(`metrics.${selectedMetric}`);

    return (
      <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-md">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-base font-medium">
          <span className="font-semibold">{metricName}:</span> {metricValue}
        </p>
      </div>
    );
  }

  return null;
};

const Chart: React.FC<ChartProps> = ({ data, selectedMetric }) => {
  const t = useTranslations("admin.dashboard");

  const getMetricColor = () => {
    switch (selectedMetric) {
      case "startups":
        return "#3b82f6";
      case "mentors":
        return "#eab308";
      case "investors":
        return "#22c55e";
      case "government":
        return "#ef4444";
      case "traditionalCompanies":
        return "#6366f1";
      case "innovationEnvironments":
        return "#06b6d4";
      default:
        return "#8884d8";
    }
  };

  const maxValue = Math.max(...data.map((item) => item[selectedMetric]));

  const domainMax = Math.ceil(maxValue * 1.2);

  const color = getMetricColor();

  const formatYAxis = (tickItem: number) => {
    if (tickItem >= 1000) {
      return `${(tickItem / 1000).toFixed(1)}k`;
    }
    return tickItem.toString();
  };

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart
        data={data}
        margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
      >
        <defs>
          <linearGradient
            id={`color${selectedMetric}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="5%" stopColor={color} stopOpacity={0.8} />
            <stop offset="95%" stopColor={color} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={{ stroke: "#e5e7eb" }}
          tick={{ fill: "#64748b", fontSize: 12 }}
          dy={5}
        />
        <YAxis
          tickLine={false}
          axisLine={{ stroke: "#e5e7eb" }}
          tick={{ fill: "#64748b", fontSize: 12 }}
          domain={[0, domainMax]}
          tickFormatter={formatYAxis}
          dx={-5}
        />
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#e5e7eb"
        />
        <Tooltip
          content={<CustomTooltip selectedMetric={selectedMetric} />}
          cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: "3 3" }}
        />
        <Legend
          formatter={() => t(`metrics.${selectedMetric}`)}
          iconType="circle"
          iconSize={10}
          wrapperStyle={{ paddingTop: "10px" }}
        />
        <Area
          type="monotone"
          dataKey={selectedMetric}
          name={t(`metrics.${selectedMetric}`)}
          stroke={color}
          strokeWidth={2}
          fillOpacity={1}
          fill={`url(#color${selectedMetric})`}
          activeDot={{ r: 6, stroke: "white", strokeWidth: 2, fill: color }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default Chart;
