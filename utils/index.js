import config from '../config';

export const getAmountFromReadings = readings => {
  const arr = [];
  config.forEach(el => {
    const { diff, amount } = el;
    if (readings > 0 && readings >= diff) arr.push({ readings: diff, amount });
    else if (readings > 0 && readings <= diff) arr.push({ readings, amount });
    readings -= diff;
  });
  return arr.reduce((acc, value) => {
    return acc + value.readings * value.amount;
  }, 0);
};

export const get = (readings) => {
  let amount = 0;
  if (readings > 0 && readings <= 150) amount = readings * 5.5;
  else if (readings > 150 && readings <= 300)
    amount = 150 * 5.5 + (readings - 150) * 6;
  else if (readings > 300 && readings <= 500)
    amount = 150 * 5.5 + 150 * 6 + (readings - 300) * 6.5;
  else if (readings > 500)
    amount = 150 * 5.5 + 150 * 6 + 200 * 6.5 + (readings - 500) * 7;
  // amount += defaultValue;
  return amount;
};

export const formatDate = (date) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();
  return `${day} ${monthNames[monthIndex]} ${year}`;
};

