import React from 'react';
import DatePicker from 'react-native-date-picker';

function CustomDatePicker({
  setOpen,
  open,
  currentDate,
  setCurrentDate,
  modal,
  setSelected,
  mode,
  minuteInterval,
  handleSubmit,
  ...props
}) {
  return (
    <DatePicker
      modal={modal}
      mode={mode}
      open={open}
      androidVariant={'iosClone'}
      date={currentDate}
      onConfirm={date => {
        setOpen(false);
        setCurrentDate(date);
        setSelected ? setSelected(true) : null;
      }}
      minuteInterval={minuteInterval ? minuteInterval : 1}
      onCancel={() => {
        setOpen(false);
      }}
      {...props}
    />
  );
}

export default CustomDatePicker;
