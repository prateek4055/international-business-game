export type SpaceType =
  | 'Start'
  | 'Property'
  | 'Utility'
  | 'Uno'
  | 'Chance'
  | 'CustomDuty'
  | 'TravellingDuty'
  | 'PartyHouse'
  | 'Resort'
  | 'Jail';

export type ColorGroup =
  | 'None'
  | 'Red'
  | 'Blue'
  | 'Green'
  | 'Yellow'
  | 'Utility'
  | 'Special';

export interface RentTable {
  siteOnly: number;
  house1: number;
  house2: number;
  house3: number;
  hotel: number;
}

export interface BoardSpace {
  index: number;
  name: string;
  type: SpaceType;
  group: ColorGroup;
  flag?: string; // Flag emoji or badge
  capital?: string;
  currency?: string;
  price?: number;
  mortgage?: number;
  houseCost?: number;
  hotelCost?: number;
  rents?: RentTable;
  pairedWith?: string;
  baseRent?: number;
  pairedRent?: number;
  taxPerCountry?: number;
  maxTax?: number;
  actionValue?: number;
  description: string;
}

export interface Player {
  id: number;
  name: string;
  color: string; // hex
  colorName: string;
  isAI: boolean;
  cash: number;
  creditCardLimit: number;
  hasUsedCreditCard: boolean;
  creditCardInstallmentsLeft: number; // 6 x $2000 = $12000
  hasPassport: boolean;
  passportRoundsRemaining: number;
  boardPosition: number; // 0 to 35
  isInJail: boolean;
  jailRollAttempts: number;
  isBankrupt: boolean;
  ownedPropertyIndices: number[];
}

export const GAME_CONSTANTS = {
  STARTING_CASH: 25000,
  CREDIT_CARD_LIMIT: 10000,
  CREDIT_CARD_INSTALLMENT: 2000,
  CREDIT_CARD_TOTAL_INSTALLMENTS: 6,
  CREDIT_CARD_TOTAL_REPAY: 12000,
  PASS_START_BONUS: 1500,
  PARTY_HOUSE_BONUS_EACH: 200,
  RESORT_FEE_EACH: 200,
  CUSTOM_DUTY_PER_COUNTRY: 100,
  CUSTOM_DUTY_MAX: 1000,
  TRAVELLING_DUTY_PER_COUNTRY: 50,
  TRAVELLING_DUTY_MAX: 500,
  JAIL_BAIL_FEE: 500,
  JAIL_CREDIT_CARD_FEE: 3000,
  JAIL_DICE_ESCAPE_TOTAL: 12,
  JAIL_MAX_ATTEMPTS: 3,
  PASSPORT_REDEEM_FEE: 5000,
  PASSPORT_REDEEM_ROUNDS: 6,
  MONOPOLY_COUNT: 3, // Owner of 3 countries in same color group doubles unimproved rent
  MAX_HOUSES: 3,
  MAX_HOTELS: 1,

  // Authentic Game Theme Colors
  COLORS: {
    BOARD_CYAN: '#168B91',
    CENTER_NAVY: '#193D5B',
    RED_GROUP: '#D97681',
    BLUE_GROUP: '#63A2CF',
    GREEN_GROUP: '#89B46C',
    YELLOW_GROUP: '#E2B64D',
    UTILITY_GREY: '#A3AFC2',
    START_RED: '#D86A75',
    RESORT_CYAN: '#329E91',
    PARTY_PURPLE: '#B58567',
    JAIL_CHARCOAL: '#697788'
  },

  PLAYER_COLORS: [
    { name: 'Crimson Red', hex: '#D97681' },
    { name: 'Ocean Blue', hex: '#63A2CF' },
    { name: 'Emerald Green', hex: '#89B46C' },
    { name: 'Amber Gold', hex: '#E2B64D' },
    { name: 'Teal Action', hex: '#168B91' },
    { name: 'Royal Navy', hex: '#193D5B' }
  ]
};

export const SPACE_ASSETS: Record<number, { image: string; headerColor: string }> = {
  0: { image: '/board-assets/start.webp', headerColor: '#D86A75' },
  1: { image: '/board-assets/england.webp', headerColor: '#D97681' },
  2: { image: '/board-assets/iraq.webp', headerColor: '#89B46C' },
  3: { image: '/board-assets/waterways.webp', headerColor: '#A3AFC2' },
  4: { image: '/board-assets/uno.webp', headerColor: '#317DB0' },
  5: { image: '/board-assets/france.webp', headerColor: '#D97681' },
  6: { image: '/board-assets/iran.webp', headerColor: '#89B46C' },
  7: { image: '/board-assets/satellite.webp', headerColor: '#A3AFC2' },
  8: { image: '/board-assets/egypt.webp', headerColor: '#89B46C' },
  9: { image: '/board-assets/resort.webp', headerColor: '#329E91' },
  10: { image: '/board-assets/canada.webp', headerColor: '#E2B64D' },
  11: { image: '/board-assets/germany.webp', headerColor: '#D97681' },
  12: { image: '/board-assets/airways.webp', headerColor: '#A3AFC2' },
  13: { image: '/board-assets/custom_duty.webp', headerColor: '#9781A6' },
  14: { image: '/board-assets/switzerland.webp', headerColor: '#D97681' },
  15: { image: '/board-assets/brazil.webp', headerColor: '#E2B64D' },
  16: { image: '/board-assets/chance.webp', headerColor: '#D49A45' },
  17: { image: '/board-assets/italy.webp', headerColor: '#D97681' },
  18: { image: '/board-assets/party_house.webp', headerColor: '#B58567' },
  19: { image: '/board-assets/japan.webp', headerColor: '#63A2CF' },
  20: { image: '/board-assets/usa.webp', headerColor: '#E2B64D' },
  21: { image: '/board-assets/travelling_duty.webp', headerColor: '#9781A6' },
  22: { image: '/board-assets/roadways.webp', headerColor: '#A3AFC2' },
  23: { image: '/board-assets/mexico.webp', headerColor: '#E2B64D' },
  24: { image: '/board-assets/hongkong.webp', headerColor: '#63A2CF' },
  25: { image: '/board-assets/uno.webp', headerColor: '#317DB0' },
  26: { image: '/board-assets/australia.webp', headerColor: '#E2B64D' },
  27: { image: '/board-assets/jail.webp', headerColor: '#697788' },
  28: { image: '/board-assets/india.webp', headerColor: '#63A2CF' },
  29: { image: '/board-assets/chance.webp', headerColor: '#D49A45' },
  30: { image: '/board-assets/saudi_arabia.webp', headerColor: '#89B46C' },
  31: { image: '/board-assets/petroleum.webp', headerColor: '#A3AFC2' },
  32: { image: '/board-assets/china.webp', headerColor: '#63A2CF' },
  33: { image: '/board-assets/railways.webp', headerColor: '#A3AFC2' },
  34: { image: '/board-assets/malaysia.webp', headerColor: '#89B46C' },
  35: { image: '/board-assets/singapore.webp', headerColor: '#63A2CF' },
};

export const BOARD_SPACES: BoardSpace[] = [
  {
    index: 0,
    name: 'START',
    type: 'Start',
    group: 'None',
    description: 'Collect $1500 as you pass or land',
    actionValue: 1500
  },
  {
    index: 1,
    name: 'ENGLAND',
    type: 'Property',
    group: 'Red',
    flag: '🇬🇧',
    capital: 'LONDON',
    currency: 'POUND',
    price: 2500,
    mortgage: 1250,
    houseCost: 2500,
    hotelCost: 2500,
    rents: { siteOnly: 700, house1: 1700, house2: 3400, house3: 5100, hotel: 6100 },
    description: 'United Kingdom'
  },
  {
    index: 2,
    name: 'IRAQ',
    type: 'Property',
    group: 'Green',
    flag: '🇮🇶',
    capital: 'BAGHDAD',
    currency: 'DINAR',
    price: 5000,
    mortgage: 2500,
    houseCost: 5000,
    hotelCost: 5000,
    rents: { siteOnly: 500, house1: 1500, house2: 3000, house3: 4500, hotel: 5500 },
    description: 'Republic of Iraq'
  },
  {
    index: 3,
    name: 'WATERWAYS',
    type: 'Utility',
    group: 'Utility',
    flag: '🚢',
    price: 9500,
    mortgage: 5000,
    baseRent: 1400,
    pairedRent: 2200,
    pairedWith: 'SATELLITE',
    description: 'If owner of SATELLITE the Rent is $2200'
  },
  {
    index: 4,
    name: 'UNO',
    type: 'Uno',
    group: 'Special',
    flag: '🇺🇳',
    description: 'Roll dice for Even or Odd UNO reward or penalty'
  },
  {
    index: 5,
    name: 'FRANCE',
    type: 'Property',
    group: 'Red',
    flag: '🇫🇷',
    capital: 'PARIS',
    currency: 'EURO',
    price: 2500,
    mortgage: 1250,
    houseCost: 2500,
    hotelCost: 2500,
    rents: { siteOnly: 300, house1: 1300, house2: 2600, house3: 3900, hotel: 4900 },
    description: 'French Republic'
  },
  {
    index: 6,
    name: 'IRAN',
    type: 'Property',
    group: 'Green',
    flag: '🇮🇷',
    capital: 'TEHRAN',
    currency: 'RIAL',
    price: 2500,
    mortgage: 1250,
    houseCost: 2500,
    hotelCost: 2500,
    rents: { siteOnly: 300, house1: 1300, house2: 2600, house3: 3900, hotel: 4900 },
    description: 'Islamic Republic of Iran'
  },
  {
    index: 7,
    name: 'SATELLITE',
    type: 'Utility',
    group: 'Utility',
    flag: '🛰️',
    price: 2000,
    mortgage: 1250,
    baseRent: 500,
    pairedRent: 1000,
    pairedWith: 'WATERWAYS',
    description: 'If owner of WATERWAYS the Rent is $1000'
  },
  {
    index: 8,
    name: 'EGYPT',
    type: 'Property',
    group: 'Green',
    flag: '🇪🇬',
    capital: 'CAIRO',
    currency: 'POUND',
    price: 3200,
    mortgage: 1500,
    houseCost: 3200,
    hotelCost: 3200,
    rents: { siteOnly: 300, house1: 1300, house2: 2600, house3: 3900, hotel: 4900 },
    description: 'Arab Republic of Egypt'
  },
  {
    index: 9,
    name: 'RESORT',
    type: 'Resort',
    group: 'None',
    flag: '🏖️',
    actionValue: 200,
    description: 'Give $200 to each other player'
  },
  {
    index: 10,
    name: 'CANADA',
    type: 'Property',
    group: 'Yellow',
    flag: '🇨🇦',
    capital: 'OTTAWA',
    currency: 'CANADIAN DOLLAR',
    price: 4000,
    mortgage: 2000,
    houseCost: 4000,
    hotelCost: 4000,
    rents: { siteOnly: 400, house1: 1400, house2: 2800, house3: 4200, hotel: 5200 },
    description: 'Canada'
  },
  {
    index: 11,
    name: 'GERMANY',
    type: 'Property',
    group: 'Red',
    flag: '🇩🇪',
    capital: 'BERLIN',
    currency: 'EURO',
    price: 3500,
    mortgage: 1750,
    houseCost: 3500,
    hotelCost: 3500,
    rents: { siteOnly: 400, house1: 1400, house2: 2800, house3: 4200, hotel: 5200 },
    description: 'Federal Republic of Germany'
  },
  {
    index: 12,
    name: 'AIRWAYS',
    type: 'Utility',
    group: 'Utility',
    flag: '✈️',
    price: 10500,
    mortgage: 5500,
    baseRent: 1500,
    pairedRent: 2500,
    pairedWith: 'PETROLEUM',
    description: 'If owner of PETROLEUM the Rent is $2500'
  },
  {
    index: 13,
    name: 'CUSTOM DUTY',
    type: 'CustomDuty',
    group: 'Special',
    flag: '🛃',
    taxPerCountry: 100,
    maxTax: 1000,
    description: 'Pay $100 for each country owned (Max $1000)'
  },
  {
    index: 14,
    name: 'SWITZERLAND',
    type: 'Property',
    group: 'Red',
    flag: '🇨🇭',
    capital: 'BERN',
    currency: 'SWISS FRANC',
    price: 3500,
    mortgage: 3300,
    houseCost: 3500,
    hotelCost: 3500,
    rents: { siteOnly: 700, house1: 1700, house2: 3400, house3: 5100, hotel: 6100 },
    description: 'Swiss Confederation'
  },
  {
    index: 15,
    name: 'BRAZIL',
    type: 'Property',
    group: 'Yellow',
    flag: '🇧🇷',
    capital: 'BRASILIA',
    currency: 'REAL',
    price: 2500,
    mortgage: 1300,
    houseCost: 2500,
    hotelCost: 2500,
    rents: { siteOnly: 300, house1: 1300, house2: 2600, house3: 3900, hotel: 4900 },
    description: 'Federative Republic of Brazil'
  },
  {
    index: 16,
    name: 'CHANCE',
    type: 'Chance',
    group: 'Special',
    flag: '❓',
    description: 'Roll dice for Even or Odd CHANCE reward or penalty'
  },
  {
    index: 17,
    name: 'ITALY',
    type: 'Property',
    group: 'Red',
    flag: '🇮🇹',
    capital: 'ROME',
    currency: 'EURO',
    price: 3500,
    mortgage: 1000,
    houseCost: 2000,
    hotelCost: 2000,
    rents: { siteOnly: 200, house1: 1200, house2: 2400, house3: 3600, hotel: 4600 },
    description: 'Italian Republic'
  },
  {
    index: 18,
    name: 'PARTY HOUSE',
    type: 'PartyHouse',
    group: 'None',
    flag: '🎉',
    actionValue: 200,
    description: 'Receive $200 from each other player'
  },
  {
    index: 19,
    name: 'JAPAN',
    type: 'Property',
    group: 'Blue',
    flag: '🇯🇵',
    capital: 'TOKYO',
    currency: 'YEN',
    price: 2500,
    mortgage: 1250,
    houseCost: 2500,
    hotelCost: 2500,
    rents: { siteOnly: 250, house1: 1250, house2: 2500, house3: 3750, hotel: 4750 },
    description: 'Japan'
  },
  {
    index: 20,
    name: 'USA',
    type: 'Property',
    group: 'Yellow',
    flag: '🇺🇸',
    capital: 'WASHINGTON D.C.',
    currency: 'US DOLLAR',
    price: 8500,
    mortgage: 5000,
    houseCost: 8500,
    hotelCost: 8500,
    rents: { siteOnly: 1000, house1: 2000, house2: 4000, house3: 6000, hotel: 7000 },
    description: 'United States of America'
  },
  {
    index: 21,
    name: 'TRAVELLING DUTY',
    type: 'TravellingDuty',
    group: 'Special',
    flag: '🚌',
    taxPerCountry: 50,
    maxTax: 500,
    description: 'Pay $50 for each country owned (Max $500)'
  },
  {
    index: 22,
    name: 'ROADWAYS',
    type: 'Utility',
    group: 'Utility',
    flag: '🚍',
    price: 3500,
    mortgage: 1800,
    baseRent: 800,
    pairedRent: 1500,
    pairedWith: 'RAILWAYS',
    description: 'If owner of RAILWAYS the Rent is $1500'
  },
  {
    index: 23,
    name: 'MEXICO',
    type: 'Property',
    group: 'Yellow',
    flag: '🇲🇽',
    capital: 'MEXICO CITY',
    currency: 'PESO',
    price: 4000,
    mortgage: 2000,
    houseCost: 4000,
    hotelCost: 4000,
    rents: { siteOnly: 900, house1: 1800, house2: 3600, house3: 5400, hotel: 6400 },
    description: 'United Mexican States'
  },
  {
    index: 24,
    name: 'HONGKONG',
    type: 'Property',
    group: 'Blue',
    flag: '🇭🇰',
    capital: 'HONG KONG',
    currency: 'HK DOLLAR',
    price: 2000,
    mortgage: 1000,
    houseCost: 2500,
    hotelCost: 2500,
    rents: { siteOnly: 200, house1: 1200, house2: 2400, house3: 3600, hotel: 4600 },
    description: 'Hong Kong'
  },
  {
    index: 25,
    name: 'UNO',
    type: 'Uno',
    group: 'Special',
    flag: '🇺🇳',
    description: 'Roll dice for Even or Odd UNO reward or penalty'
  },
  {
    index: 26,
    name: 'AUSTRALIA',
    type: 'Property',
    group: 'Yellow',
    flag: '🇦🇺',
    capital: 'CANBERRA',
    currency: 'AUSTRALIAN DOLLAR',
    price: 3300,
    mortgage: 2000,
    houseCost: 3300,
    hotelCost: 3300,
    rents: { siteOnly: 400, house1: 1400, house2: 2800, house3: 4200, hotel: 5200 },
    description: 'Commonwealth of Australia'
  },
  {
    index: 27,
    name: 'JAIL',
    type: 'Jail',
    group: 'None',
    flag: '🔒',
    description: 'In Jail or Just Visiting'
  },
  {
    index: 28,
    name: 'INDIA',
    type: 'Property',
    group: 'Blue',
    flag: '🇮🇳',
    capital: 'DELHI',
    currency: 'RUPEE',
    price: 4500,
    mortgage: 2750,
    houseCost: 5500,
    hotelCost: 5500,
    rents: { siteOnly: 550, house1: 1550, house2: 3100, house3: 4650, hotel: 5650 },
    description: 'Republic of India'
  },
  {
    index: 29,
    name: 'CHANCE',
    type: 'Chance',
    group: 'Special',
    flag: '❓',
    description: 'Roll dice for Even or Odd CHANCE reward or penalty'
  },
  {
    index: 30,
    name: 'SAUDI ARABIA',
    type: 'Property',
    group: 'Green',
    flag: '🇸🇦',
    capital: 'RIYADH',
    currency: 'RIYAL',
    price: 5500,
    mortgage: 2800,
    houseCost: 5500,
    hotelCost: 5500,
    rents: { siteOnly: 600, house1: 1600, house2: 3200, house3: 4800, hotel: 5800 },
    description: 'Kingdom of Saudi Arabia'
  },
  {
    index: 31,
    name: 'PETROLEUM',
    type: 'Utility',
    group: 'Utility',
    flag: '⛽',
    price: 5500,
    mortgage: 3100,
    baseRent: 500,
    pairedRent: 1000,
    pairedWith: 'AIRWAYS',
    description: 'If owner of AIRWAYS the Rent is $1000'
  },
  {
    index: 32,
    name: 'CHINA',
    type: 'Property',
    group: 'Blue',
    flag: '🇨🇳',
    capital: 'BEIJING',
    currency: 'YUAN (RMB)',
    price: 4500,
    mortgage: 2250,
    houseCost: 4500,
    hotelCost: 4500,
    rents: { siteOnly: 450, house1: 1450, house2: 2900, house3: 4350, hotel: 5350 },
    description: "People's Republic of China"
  },
  {
    index: 33,
    name: 'RAILWAYS',
    type: 'Utility',
    group: 'Utility',
    flag: '🚆',
    price: 9500,
    mortgage: 5000,
    baseRent: 1500,
    pairedRent: 2500,
    pairedWith: 'ROADWAYS',
    description: 'If owner of ROADWAYS the Rent is $2500'
  },
  {
    index: 34,
    name: 'MALAYSIA',
    type: 'Property',
    group: 'Green',
    flag: '🇲🇾',
    capital: 'KUALA LUMPUR',
    currency: 'RINGGIT',
    price: 1500,
    mortgage: 800,
    houseCost: 1500,
    hotelCost: 1500,
    rents: { siteOnly: 200, house1: 1200, house2: 2400, house3: 3600, hotel: 4600 },
    description: 'Malaysia'
  },
  {
    index: 35,
    name: 'SINGAPORE',
    type: 'Property',
    group: 'Blue',
    flag: '🇸🇬',
    capital: 'SINGAPORE CITY',
    currency: 'SINGAPORE DOLLAR',
    price: 3000,
    mortgage: 1500,
    houseCost: 3000,
    hotelCost: 3000,
    rents: { siteOnly: 300, house1: 1300, house2: 2600, house3: 3900, hotel: 4900 },
    description: 'Republic of Singapore'
  }
];

export interface UnoChanceEvent {
  text: string;
  action: 'receive' | 'pay' | 'collect_all' | 'collect_sites' | 'party_house' | 'jail' | 'passport' | 'repairs';
  amount?: number;
  houseCost?: number;
  hotelCost?: number;
}

export const UNO_EVENTS: Record<number, UnoChanceEvent> = {
  // Even
  2: { text: 'It is your Anniversary! Collect $500 from each player.', action: 'collect_all', amount: 500 },
  4: { text: '1st prize in Beauty contest! Receive $2500 from Bank.', action: 'receive', amount: 2500 },
  6: { text: 'Income tax refund! Receive $2000 from Bank.', action: 'receive', amount: 2000 },
  8: { text: 'Go to Party House & collect $200 from each player!', action: 'party_house', amount: 200 },
  10: { text: 'Receive interest on shares $1500 from Bank.', action: 'receive', amount: 1500 },
  12: { text: 'Sale of stocks! Collect $3000 from Bank.', action: 'receive', amount: 3000 },
  // Odd
  3: { text: 'Go directly to JAIL!', action: 'jail' },
  5: { text: 'School and Medical Fees: Pay $2500 to Bank.', action: 'pay', amount: 2500 },
  7: { text: 'Submit your Passport! (No right to collect rent until redeemed).', action: 'passport' },
  9: { text: 'General Repair on all properties: $50 per house, $100 per hotel.', action: 'repairs', houseCost: 50, hotelCost: 100 },
  11: { text: 'Pay Insurance premium $1500 to Bank.', action: 'pay', amount: 1500 }
};

export const CHANCE_EVENTS: Record<number, UnoChanceEvent> = {
  // Even
  2: { text: 'Loss in Share market: Pay $2000 to Bank.', action: 'pay', amount: 2000 },
  4: { text: 'Fine for Accident due to Wrong Driving: Pay $1000 to Bank.', action: 'pay', amount: 1000 },
  6: { text: 'House repair: Pay $1500 to Bank.', action: 'pay', amount: 1500 },
  8: { text: 'Loss due to fire in godown: Pay $3000 to Bank.', action: 'pay', amount: 3000 },
  10: { text: 'Go directly to JAIL!', action: 'jail' },
  12: { text: 'Repair of your Car: Pay $200 to Bank.', action: 'pay', amount: 200 },
  // Odd
  3: { text: 'Lottery prize! Receive $2500 from Bank.', action: 'receive', amount: 2500 },
  5: { text: 'You have won crossword prize! Receive $1000 from Bank.', action: 'receive', amount: 1000 },
  7: { text: 'Collect rent from each player: $100 for all of your sites!', action: 'collect_sites', amount: 100 },
  9: { text: 'You have won Jackpot of $2000 from Bank!', action: 'receive', amount: 2000 },
  11: { text: 'Prize for best performance in Export: Receive $1500 from Bank.', action: 'receive', amount: 1500 }
};

export function getUnoEvent(rollTotal: number): UnoChanceEvent {
  return UNO_EVENTS[rollTotal] || (rollTotal % 2 === 0 ? UNO_EVENTS[6] : UNO_EVENTS[5]);
}

export function getChanceEvent(rollTotal: number): UnoChanceEvent {
  return CHANCE_EVENTS[rollTotal] || (rollTotal % 2 === 0 ? CHANCE_EVENTS[4] : CHANCE_EVENTS[5]);
}
