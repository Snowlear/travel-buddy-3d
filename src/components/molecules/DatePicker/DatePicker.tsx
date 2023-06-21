import React, { useReducer, useState } from "react";
import styles from "./DatePicker.module.css";
import Input from "../../atoms/Input/Input";
import RightArrow from "../../../assets/images/svgs/rightArrow.svg";
import LeftArrow from "../../../assets/images/svgs/leftArrow.svg";
import Select from "../../atoms/Select/Select";
import {
  getMonthDays,
  getMonthNumber,
  handleDateFormat,
  months,
} from "../../../utils/date";
import { PossibleDatesI } from "../../../types/Date";
import classnames from "classnames";

interface DatePickerProps {
  label: string;
  value: string;
  onChange: (newDate: string) => void;
}

interface DatePickerState {
  selectedYear: string;
  selectedMonth: string;
  monthsToSelect: string[];
  dayOptions: PossibleDatesI;
}

type DatePickerActions =
  | { type: "SET_SELECTED_YEAR"; payload: string }
  | { type: "SET_SELECTED_MONTH"; payload: string };

const reducer = (
  state: DatePickerState,
  action: DatePickerActions
): DatePickerState => {
  switch (action.type) {
    case "SET_SELECTED_YEAR":
      return {
        ...state,
        selectedYear: action.payload,
        dayOptions: getMonthDays(
          getMonthNumber(state.selectedMonth),
          Number(action.payload)
        ),
      };
    case "SET_SELECTED_MONTH":
      return {
        ...state,
        selectedMonth: action.payload,
        dayOptions: getMonthDays(
          getMonthNumber(action.payload),
          Number(state.selectedYear)
        ),
      };
    default:
      return state;
  }
};

const DatePicker: React.FC<DatePickerProps> = ({ label, value, onChange }) => {
  const initialState: DatePickerState = {
    selectedYear: String(new Date().getFullYear()),
    selectedMonth: months[new Date().getMonth()].toUpperCase(),
    monthsToSelect: months.map((x) => x.toUpperCase()),
    dayOptions: getMonthDays(
      getMonthNumber(months[new Date().getMonth()].toUpperCase()),
      new Date().getFullYear()
    ),
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const { selectedYear, selectedMonth, monthsToSelect, dayOptions } = state;
  const [showBubble, setShowBubble] = useState(false);

  const handleArrowClick = (direction: "+" | "-") => {
    let currentMonthIndex = getMonthNumber(selectedMonth) - 1;
    let newMonthIndex;
    let newYear = Number(selectedYear);
    if (direction === "+") {
      newMonthIndex = currentMonthIndex === 11 ? 0 : currentMonthIndex + 1;
      if (newMonthIndex === 0) {
        newYear += 1;
      }
    } else {
      newMonthIndex = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;
      if (newMonthIndex === 11) {
        newYear -= 1;
      }
    }
    let newMonth = months[newMonthIndex].toUpperCase();
    dispatch({ type: "SET_SELECTED_YEAR", payload: String(newYear) });
    dispatch({ type: "SET_SELECTED_MONTH", payload: newMonth });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = event.target.value.replace(/[^0-9]/g, "");
    onChange(newValue);
  };

  const handleDateChange = (
    event: React.MouseEvent<HTMLParagraphElement, MouseEvent>,
    day: number
  ) => {
    onChange(handleDateFormat(day, selectedMonth, selectedYear));
    setShowBubble(false);
  };

  const bubbleContent = () => {
    if (!showBubble) {
      return;
    }
    let years = [];
    let currentYear = new Date().getFullYear();

    for (let i = 0; i < 10; i++) {
      years.push(String(currentYear + i));
    }

    return (
      <>
        <div className={styles.controlContainer}>
          <img
            onClick={() => {
              handleArrowClick("-");
            }}
            className={styles.arrows}
            alt="Previous Month"
            src={LeftArrow}
          />
          <div className={styles.selectArea}>
            <Select
              options={monthsToSelect}
              value={selectedMonth}
              onChange={(x) =>
                dispatch({
                  type: "SET_SELECTED_MONTH",
                  payload: x.target.value,
                })
              }
            />
            <Select
              options={years}
              value={selectedYear}
              onChange={(x) =>
                dispatch({ type: "SET_SELECTED_YEAR", payload: x.target.value })
              }
            />
          </div>

          <img
            className={styles.arrows}
            alt="Next Month"
            src={RightArrow}
            onClick={() => {
              handleArrowClick("+");
            }}
          />
        </div>
        <div className={styles.daysControl}>
          <div className={styles.dayArea}>
            <p>Mo</p>
            <p>Tu</p>
            <p>We</p>
            <p>Th</p>
            <p>Fr</p>
            <p>Sa</p>
            <p>Su</p>
          </div>
          <div className={styles.daysContainer}>
            {dayOptions &&
              dayOptions.prevMonthDays.map((day) => (
                <p
                  key={"p_" + day}
                  className={classnames(styles.day, styles.otherDay)}
                >
                  {day}
                </p>
              ))}
            {dayOptions &&
              dayOptions.currentMonthDays.map((day) => (
                <p
                  key={"c_" + day}
                  className={classnames(styles.cDay, styles.day)}
                  onClick={(e) => {
                    handleDateChange(e, day);
                  }}
                >
                  {day}
                </p>
              ))}
            {dayOptions &&
              dayOptions.nextMonthDays.map((day) => (
                <p
                  key={"n_" + day}
                  className={classnames(styles.day, styles.otherDay)}
                >
                  {day}
                </p>
              ))}
          </div>
        </div>
      </>
    );
  };
  return (
    <Input
      onFocus={() => setShowBubble(true)}
      inputStyle={styles.innerInput}
      className={styles.input}
      bubbleContent={bubbleContent()}
      onChange={handleInputChange}
      bubbleAdditionalStyle={styles.bubbleStyle}
      hideClearButton
      label={label}
      value={value}
    ></Input>
  );
};

export default DatePicker;
