import { PossibleDatesI } from "../types/Date";

export const toDMYOrder = (value: string) => {
  const [year, month, day] = value.split("-");
  return `${day}-${month}-${year}`;
};

export const toYMDOrder = (value: string) => {
  const [day, month, year] = value.split("-");
  return `${year}-${month}-${day}`;
};

export const isDMY = (input: string) => {
  const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
  return dateRegex.test(input);
};

export const isYMD = (input: string) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(input);
};

export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const formatDate = (dateString: string) => {
  const [day, month, year] = dateString.split("-");
  return `${months[parseInt(month) - 1]} ${day}, ${year}`;
};

export const getMonthNumber = (month: string) => {
  let monthIndex = months
    .map((m) => m.toUpperCase())
    .indexOf(month.toUpperCase());
  return monthIndex + 1;
};

export const getMonthDays = (month: number, year: number): PossibleDatesI => {
  let prevMonthDays = [];
  let currentMonthDays = [];
  let nextMonthDays = [];

  let date = new Date(year, month - 1, 1);
  let lastDayOfPrevMonth = new Date(
    date.getFullYear(),
    date.getMonth(),
    0
  ).getDate();
  let firstDayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1;
  for (let i = firstDayOfWeek; i > 0; i--) {
    prevMonthDays.push(lastDayOfPrevMonth - i + 1);
  }

  let lastDayOfCurrentMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();
  for (let i = 1; i <= lastDayOfCurrentMonth; i++) {
    currentMonthDays.push(i);
  }

  let lastDayOfWeek = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDay();
  lastDayOfWeek = lastDayOfWeek === 0 ? 6 : lastDayOfWeek - 1;
  for (let i = 1; i <= 6 - lastDayOfWeek; i++) {
    nextMonthDays.push(i);
  }

  return {
    prevMonthDays: prevMonthDays,
    currentMonthDays: currentMonthDays,
    nextMonthDays: nextMonthDays,
  };
};

export const handleDateFormat = (
  day: number,
  selectedMonth: string,
  selectedYear: string
) => {
  let monthNumber = getMonthNumber(selectedMonth);
  let formattedDay = day.toString().padStart(2, "0");
  let formattedMonth = monthNumber.toString().padStart(2, "0");
  let formattedDate = `${formattedDay}-${formattedMonth}-${selectedYear}`;
  return formattedDate;
};
