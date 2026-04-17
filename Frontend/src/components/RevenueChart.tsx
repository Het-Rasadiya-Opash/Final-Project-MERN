import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import apiRequest from "../utils/apiRequest";

interface MonthRevenue {
  _id: number; // 1-12
  total: number;
  bookings: number;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const CHART_H = 160;
const CHART_W = 600;
const BAR_GAP = 8;

const RevenueChart = () => {
  const [revenue, setRevenue] = useState<MonthRevenue[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [tooltip, setTooltip] = useState<{ month: string; total: number; bookings: number } | null>(null);

  useEffect(() => {
    apiRequest
      .get("/booking/revenue")
      .then((res) => {
        setRevenue(res.data.revenue);
        setYear(res.data.year);
      })
      .catch(console.error);
  }, []);

  const data = MONTHS.map((label, i) => {
    const found = revenue.find((r) => r._id === i + 1);
    return { label, total: found?.total ?? 0, bookings: found?.bookings ?? 0 };
  });

  const maxTotal = Math.max(...data.map((d) => d.total), 1);
  const totalRevenue = data.reduce((s, d) => s + d.total, 0);
  const totalBookings = data.reduce((s, d) => s + d.bookings, 0);

  const barWidth = (CHART_W - BAR_GAP * 13) / 12;

  return (
    <div className="mt-10 pt-8 border-t border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-red-50 p-2 rounded-xl border border-red-100">
            <TrendingUp size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 leading-tight">Revenue Analytics</h2>
            <p className="text-xs text-gray-500 font-medium">{year} · Paid bookings only</p>
          </div>
        </div>
        <div className="flex gap-6 text-right">
          <div>
            <p className="text-xs text-gray-500">Total Revenue</p>
            <p className="text-lg font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Paid Bookings</p>
            <p className="text-lg font-bold text-gray-900">{totalBookings}</p>
          </div>
        </div>
      </div>

      {totalRevenue === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-100">
          <TrendingUp size={36} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-500 text-sm">No paid bookings yet this year</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${CHART_W} ${CHART_H + 32}`}
            className="w-full min-w-[320px]"
            onMouseLeave={() => setTooltip(null)}
          >
            {[0.25, 0.5, 0.75, 1].map((ratio) => (
              <line
                key={ratio}
                x1={0}
                x2={CHART_W}
                y1={CHART_H - CHART_H * ratio}
                y2={CHART_H - CHART_H * ratio}
                stroke="#f3f4f6"
                strokeWidth={1}
              />
            ))}

            {data.map((d, i) => {
              const barH = Math.max((d.total / maxTotal) * CHART_H, d.total > 0 ? 4 : 0);
              const x = BAR_GAP + i * (barWidth + BAR_GAP);
              const y = CHART_H - barH;
              const isHovered = tooltip?.month === d.label;

              return (
                <g key={d.label}>
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barH}
                    rx={4}
                    fill={isHovered ? "#e11d48" : d.total > 0 ? "#fda4af" : "#f3f4f6"}
                    className="transition-colors duration-150 cursor-pointer"
                    onMouseEnter={() => setTooltip({ month: d.label, total: d.total, bookings: d.bookings })}
                  />
                  <text
                    x={x + barWidth / 2}
                    y={CHART_H + 16}
                    textAnchor="middle"
                    fontSize={10}
                    fill="#9ca3af"
                    fontFamily="inherit"
                  >
                    {d.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {tooltip && (
            <div className="mt-2 inline-flex items-center gap-4 bg-gray-900 text-white text-xs px-4 py-2 rounded-lg">
              <span className="font-semibold">{tooltip.month}</span>
              <span>₹{tooltip.total.toLocaleString()}</span>
              <span className="text-gray-400">{tooltip.bookings} {tooltip.bookings === 1 ? "booking" : "bookings"}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RevenueChart;
