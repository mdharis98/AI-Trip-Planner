// const express = require('express');
// const axios = require('axios');

// const router = express.Router();

// const INDIAN_TRAIN_NAMES = [
//   'Rajdhani Express',
//   'Shatabdi Express',
//   'Duronto Express',
//   'Intercity Express',
//   'Garib Rath Express',
//   'Vande Bharat Express'
// ];

// const RAPID_API_URL = process.env.RAPIDAPI_INDIAN_TRAINS_URL || 'https://indian-railway-irctc.p.rapidapi.com/api/trains-search/v1/trainBetweenStations';
// const RAPID_API_KEY = process.env.RAPIDAPI_KEY;
// const RAPID_API_HOST = process.env.RAPIDAPI_HOST || 'indian-railway-irctc.p.rapidapi.com';

// const generateDummyPrice = (from, to, index) => {
//   const seed = `${from}${to}${index}`.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
//   return 350 + (seed % 1650);
// };

// const toIsoDateTime = (dateStr, hour, minute) => {
//   const paddedHour = String(hour).padStart(2, '0');
//   const paddedMinute = String(minute).padStart(2, '0');
//   return `${dateStr}T${paddedHour}:${paddedMinute}:00.000Z`;
// };

// const buildIndianMockTrains = (from, to, date) => {
//   const routeSeed = `${from}${to}${date}`.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

//   return INDIAN_TRAIN_NAMES.slice(0, 4).map((name, index) => {
//     const depHour = 5 + ((routeSeed + index * 3) % 15);
//     const depMinute = (routeSeed + index * 17) % 60;
//     const travelHours = 5 + ((routeSeed + index * 5) % 9);
//     const arrTotalMinutes = depHour * 60 + depMinute + travelHours * 60 + 20;
//     const arrHour = Math.floor((arrTotalMinutes % (24 * 60)) / 60);
//     const arrMinute = arrTotalMinutes % 60;

//     return {
//       id: `IN-MOCK-${index + 1}`,
//       name,
//       departureTime: toIsoDateTime(date, depHour, depMinute),
//       arrivalTime: toIsoDateTime(date, arrHour, arrMinute),
//       price: generateDummyPrice(from, to, index)
//     };
//   });
// };

// const normalizeRapidApiTrains = (rawData, from, to, date) => {
//   const list =
//     rawData?.data?.trains ||
//     rawData?.data ||
//     rawData?.trains ||
//     rawData?.result ||
//     [];

//   if (!Array.isArray(list) || list.length === 0) {
//     return [];
//   }

//   return list.slice(0, 8).map((item, index) => {
//     const name =
//       item?.train_name ||
//       item?.name ||
//       item?.trainName ||
//       INDIAN_TRAIN_NAMES[index % INDIAN_TRAIN_NAMES.length];

//     const departureRaw =
//       item?.departure_time ||
//       item?.departure ||
//       item?.dep_time ||
//       item?.from_std ||
//       item?.sourceDepartureTime ||
//       null;

//     const arrivalRaw =
//       item?.arrival_time ||
//       item?.arrival ||
//       item?.arr_time ||
//       item?.to_sta ||
//       item?.destinationArrivalTime ||
//       null;

//     const departureTime = departureRaw && departureRaw.includes('T') ? departureRaw : toIsoDateTime(date, 6 + (index * 2), 15);
//     const arrivalTime = arrivalRaw && arrivalRaw.includes('T') ? arrivalRaw : toIsoDateTime(date, 11 + (index * 2), 10);

//     return {
//       id: item?.train_number || item?.trainNo || `IN-API-${index + 1}`,
//       name,
//       departureTime,
//       arrivalTime,
//       price: generateDummyPrice(from, to, index)
//     };
//   });
// };

// const fetchFromRapidApi = async (from, to, date) => {
//   if (!RAPID_API_KEY) {
//     return [];
//   }

//   const response = await axios.get(RAPID_API_URL, {
//     params: {
//       from,
//       to,
//       date
//     },
//     headers: {
//       'x-rapidapi-key': RAPID_API_KEY,
//       'x-rapidapi-host': RAPID_API_HOST
//     },
//     timeout: 15000
//   });

//   return normalizeRapidApiTrains(response.data, from, to, date);
// };

// router.get('/search', async (req, res) => {
//   const { from, to, date } = req.query;

//   if (!from || !to || !date) {
//     return res.status(400).json({ message: 'from, to and date are required.' });
//   }

//   try {
//     const trains = await fetchFromRapidApi(from, to, date);

//     if (trains.length > 0) {
//       return res.json({ trains });
//     }
//   } catch (error) {
//     console.warn('RapidAPI train fetch failed. Falling back to Indian mock data.');
//   }

//   const fallbackTrains = buildIndianMockTrains(from, to, date);
//   return res.json({ trains: fallbackTrains });
// });

// module.exports = router;


const express = require('express');
const axios = require('axios');

const router = express.Router();

// ------------------ CONSTANTS ------------------
const INDIAN_TRAIN_NAMES = [
  'Rajdhani Express',
  'Shatabdi Express',
  'Duronto Express',
  'Intercity Express',
  'Garib Rath Express',
  'Vande Bharat Express'
];

const RAPID_API_URL =
  process.env.RAPIDAPI_INDIAN_TRAINS_URL ||
  'https://indian-railway-irctc.p.rapidapi.com/api/trains-search/v1/trainBetweenStations';

const RAPID_API_KEY = process.env.RAPIDAPI_KEY;
const RAPID_API_HOST =
  process.env.RAPIDAPI_HOST || 'indian-railway-irctc.p.rapidapi.com';

// ------------------ CITY → STATION ------------------
const cityToStation = {
  Delhi: 'NDLS',
  Mumbai: 'BCT',
  Hyderabad: 'HYB',
  Secunderabad: 'SC',
  Chennai: 'MAS',
  Kolkata: 'HWH',
  Bengaluru: 'SBC',
  Pune: 'PUNE',
  Danapur: 'DNR'
};

// ------------------ HELPERS ------------------
const generateDummyPrice = (from, to, index) => {
  const seed = `${from}${to}${index}`
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return 350 + (seed % 1650);
};

const toIsoDateTime = (dateStr, hour, minute) => {
  const h = String(hour).padStart(2, '0');
  const m = String(minute).padStart(2, '0');
  return `${dateStr}T${h}:${m}:00.000Z`;
};

const getDuration = (dep, arr) => {
  if (!dep || !arr) return 'N/A';
  const d1 = new Date(dep);
  const d2 = new Date(arr);
  const diff = (d2 - d1) / (1000 * 60);
  const hours = Math.floor(diff / 60);
  const mins = diff % 60;
  return `${hours}:${mins < 10 ? '0' : ''}${mins}`;
};

// ------------------ MOCK DATA ------------------
const buildIndianMockTrains = (from, to, date) => {
  const routeSeed = `${from}${to}${date}`
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return INDIAN_TRAIN_NAMES.slice(0, 4).map((name, index) => {
    const depHour = 5 + ((routeSeed + index * 3) % 15);
    const depMinute = (routeSeed + index * 17) % 60;

    const travelHours = 5 + ((routeSeed + index * 5) % 9);
    const arrTotalMinutes =
      depHour * 60 + depMinute + travelHours * 60 + 20;

    const arrHour = Math.floor((arrTotalMinutes % (24 * 60)) / 60);
    const arrMinute = arrTotalMinutes % 60;

    const departureTime = toIsoDateTime(date, depHour, depMinute);
    const arrivalTime = toIsoDateTime(date, arrHour, arrMinute);

    return {
      id: `IN-MOCK-${index + 1}`,
      trainNumber: `12${index}91`,
      name,
      from,
      to,
      departureTime,
      arrivalTime,
      duration: getDuration(departureTime, arrivalTime),
      classes: ['SL', '3A', '2A'],
      runningDays: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      price: generateDummyPrice(from, to, index)
    };
  });
};

// ------------------ NORMALIZE API ------------------
const normalizeRapidApiTrains = (rawData, from, to, date) => {
  const list =
    rawData?.data?.trains ||
    rawData?.data ||
    rawData?.trains ||
    rawData?.result ||
    [];

  if (!Array.isArray(list) || list.length === 0) return [];

  return list.slice(0, 8).map((item, index) => {
    const name =
      item?.train_name ||
      item?.name ||
      INDIAN_TRAIN_NAMES[index % INDIAN_TRAIN_NAMES.length];

    const departureRaw =
      item?.departure_time ||
      item?.departure ||
      item?.dep_time ||
      null;

    const arrivalRaw =
      item?.arrival_time ||
      item?.arrival ||
      item?.arr_time ||
      null;

    const departureTime =
      departureRaw && departureRaw.includes('T')
        ? departureRaw
        : toIsoDateTime(date, 6 + index * 2, 15);

    const arrivalTime =
      arrivalRaw && arrivalRaw.includes('T')
        ? arrivalRaw
        : toIsoDateTime(date, 11 + index * 2, 10);

    return {
      id: item?.train_number || `IN-API-${index + 1}`,
      trainNumber: item?.train_number || `12${index}91`,
      name,
      from,
      to,
      departureTime,
      arrivalTime,
      duration: getDuration(departureTime, arrivalTime),
      classes: ['SL', '3A', '2A'],
      runningDays: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      price: generateDummyPrice(from, to, index)
    };
  });
};

// ------------------ API CALL ------------------
const fetchFromRapidApi = async (from, to, date) => {
  if (!RAPID_API_KEY) return [];

  const response = await axios.get(RAPID_API_URL, {
    params: {
      from: cityToStation[from] || from,
      to: cityToStation[to] || to,
      date
    },
    headers: {
      'x-rapidapi-key': RAPID_API_KEY,
      'x-rapidapi-host': RAPID_API_HOST
    },
    timeout: 15000
  });

  return normalizeRapidApiTrains(response.data, from, to, date);
};

// ------------------ ROUTE ------------------
router.get('/search', async (req, res) => {
  const { from, to, date } = req.query;

  if (!from || !to || !date) {
    return res
      .status(400)
      .json({ message: 'from, to and date are required.' });
  }

  try {
    const trains = await fetchFromRapidApi(from, to, date);

    if (trains.length > 0) {
      return res.json({ trains });
    }
  } catch (error) {
    console.warn('RapidAPI failed → fallback used');
  }

  const fallbackTrains = buildIndianMockTrains(from, to, date);
  return res.json({ trains: fallbackTrains });
});

module.exports = router;