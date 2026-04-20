import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import apiRequest from "../utils/apiRequest";

interface BookedRange {
  checkIn: string;
  checkOut: string;
}

const parseLocalDate = (dateStr: string) => {
  const [year, month, day] = dateStr.slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day);
};

const AvailabilityCalendar = ({ listingId }: { listingId: string }) => {
  const [bookedRanges, setBookedRanges] = useState<BookedRange[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    apiRequest
      .get(`/booking/availability/${listingId}`)
      .then((res) => setBookedRanges(res.data))
      .catch(console.error);
  }, [listingId]);

  const isBlocked = (date: Date) => {
    return bookedRanges.some(({ checkIn, checkOut }) => {
      const start = parseLocalDate(checkIn);
      const end = parseLocalDate(checkOut);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      return date >= start && date < end;
    });
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const prevMonth = () =>
    setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () =>
    setCurrentDate(new Date(year, month + 1, 1));

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay });

  return (
    <div className="py-8 border-b border-gray-200">
      <h2 className="text-xl font-semibold mb-1 text-gray-900">Availability</h2>
      <p className="text-sm text-gray-500 mb-6">
        Add your travel dates for exact pricing
      </p>

      <div className="max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="p-1.5 hover:bg-gray-100 rounded-full transition"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="font-semibold text-gray-900">{monthName}</span>
          <button
            onClick={nextMonth}
            className="p-1.5 hover:bg-gray-100 rounded-full transition"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <div
              key={d}
              className="text-center text-xs font-medium text-gray-400 py-1"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-1">
          {blanks.map((_, i) => (
            <div key={`blank-${i}`} />
          ))}
          {days.map((day) => {
            const date = new Date(year, month, day);
            date.setHours(0, 0, 0, 0);
            const blocked = isBlocked(date);
            const past = date < today;

            return (
              <div
                key={day}
                className={`text-center text-sm py-1.5 rounded-full mx-0.5 select-none
                  ${past ? "text-gray-300 line-through" : ""}
                  ${blocked && !past ? "bg-gray-100 text-gray-400 line-through" : ""}
                  ${!blocked && !past ? "text-gray-900" : ""}
                `}
                title={blocked ? "Booked" : undefined}
              >
                {day}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-gray-100 inline-block border border-gray-200" />
            Booked
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-white inline-block border border-gray-200" />
            Available
          </span>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
