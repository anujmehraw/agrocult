"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "../lib/useTranslation";

export default function YieldChart() {
  const { t } = useTranslation();

  const data = [
    { year: "2019", yield: 2.1 },
    { year: "2020", yield: 2.4 },
    { year: "2021", yield: 2.8 },
    { year: "2022", yield: 3.0 },
    { year: "2023", yield: 3.2 },
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow">

      <h3 className="font-semibold mb-3">
        🌾 {t("Crop Yield Trend (tons/hectare)")}
      </h3>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Line
            dataKey="yield"
            stroke="#16a34a"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}