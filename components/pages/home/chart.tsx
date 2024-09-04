import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";

interface ChartData {
  name: string;
  startups: number;
  mentors: number;
}

type MetricKey = "startups" | "mentors";

interface ChartProps {
  data: ChartData[];
  selectedMetric: MetricKey;
}

type CustomTooltipProps = TooltipProps<number, string> & {
  selectedMetric: MetricKey;
};

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  selectedMetric,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 shadow-md">
        <p className="text-sm font-bold text-gray-700">{`${label}`}</p>
        <p className="text-sm text-blue-600">
          {`${selectedMetric === "startups" ? "Startups" : "Mentores"}: ${payload[0].value}`}
        </p>
      </div>
    );
  }
  return null;
};

export default function Chart({ data, selectedMetric }: ChartProps) {
  const maxValue = Math.max(...data.map((item) => item[selectedMetric]));
  const roundedMaxValue = Math.ceil(maxValue / 20) * 20;

  return (
    <div className="w-full h-[300px] border border-gray-200 rounded-lg p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            <filter id="shadow" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
              <feOffset in="blur" dx="6" dy="1" result="offsetBlur" />
              <feMerge>
                <feMergeNode in="offsetBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <CartesianGrid
            strokeDasharray="1"
            vertical={false}
            stroke="#A5B5C1"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
            tickMargin={10}
            padding={{ left: 30, right: 30 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
            domain={[0, roundedMaxValue]}
            ticks={[
              0,
              roundedMaxValue / 4,
              roundedMaxValue / 2,
              (3 * roundedMaxValue) / 4,
              roundedMaxValue,
            ]}
            width={40}
            allowDecimals={false}
          />
          <Tooltip<number, string>
            content={(props) => (
              <CustomTooltip {...props} selectedMetric={selectedMetric} />
            )}
          />
          <Line
            type="linear"
            dataKey={selectedMetric}
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: "#3b82f6" }}
            name={selectedMetric === "startups" ? "Startups" : "Mentores"}
            filter="url(#shadow)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
