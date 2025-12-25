interface DateRangeProps {
  startYear: string;
  endYear: string;
  id?: string;
}

const DateRange = ({ startYear, endYear, id }: DateRangeProps) => {
  const lang = "en-Us";

  if (!startYear) {
    return <p id={id} className="sub-content text-gray-600"></p>;
  }

  const start = new Date(startYear);
  const startStr = `${start.toLocaleString(lang, {
    month: "short",
  })} ${start.getFullYear()}`;

  const end = new Date(endYear);
  let endStr = "Present";

  if (end.toString() !== "Invalid Date") {
    endStr = `${end.toLocaleString(lang, {
      month: "short",
    })} ${end.getFullYear()}`;
  }

  return (
    <p id={id} className="sub-content text-gray-600">
      {startStr} — {endStr}
    </p>
  );
};

export default DateRange;
