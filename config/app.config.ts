export const API_BASE_URL = 'https://api.milliekit.com/api/v1';
export const apiPathConfig = {
  login: API_BASE_URL + '/auth',
  logout: API_BASE_URL + '/auth/logout',
  register: API_BASE_URL + '/auth/register',
  bookings: {
    base: API_BASE_URL + '/customer/bookings',
    details: API_BASE_URL + '/customer/bookings/{{bookingId}}/show',
    paid: API_BASE_URL + '/customer/bookings/{{bookingId}}/paid',
    cancel: API_BASE_URL + '/customer/bookings/{{bookingId}}/cancel',
    download: API_BASE_URL + '/customer/bookings/{{bookingId}}/download',
    cancellationInfo: API_BASE_URL + '/customer/bookings/{{bookingId}}/cancellation-info',
  },
  wallet: {
    balance: API_BASE_URL + '/customer/wallets/balance',
    transactions: API_BASE_URL + '/customer/wallet-transactions',
    transactionsDetails: API_BASE_URL + '/customer/wallet-transactions/{{transactionId}}/show',
  },
  trips: {
    base: API_BASE_URL + '/web/trips',
    details: API_BASE_URL + '/web/trips/{{tripId}}/show',
  },
  location: {
    cities: API_BASE_URL + '/web/location/country/{{countryCode}}/cities/list',
  },
  vendor: {
    base: API_BASE_URL + '/web/vendors',
  },
  creditTransfer: {
    base: API_BASE_URL + '/common/recharges',
    details: API_BASE_URL + '/common/recharges/{{transferId}}/show',
  },
  moneyTransfer:{
    base:API_BASE_URL+'/common/transfers',
    details:API_BASE_URL+'/common/transfers'
  },
  pages: {
    //base: API_BASE_URL + '/web/pages', // for listing available pages
    details: API_BASE_URL + '/web/pages/{{pageName}}/show', // e.g. Privacy & Policy
  },
} as const;

export const appDesktopScreenSize = 1024;
export const appSmallScreenSize = 768;

export const landingPages = ['/welcome', '/login', '/register'] as const;

export type RouteItemType = {
  id: string;
  path: string;
  subPathList?: Record<string, RouteItemType>;
};

export const routeList = {
  languages: {
    id: 'languages',
    path: '/languages',
  },
  home: {
    id: 'home',
    path: '/home',
  },
  busBooking: {
    id: 'bus-booking',
    path: '/bus-booking',
    subPathList: {
      results: {
        id: 'results',
        path: '/bus-booking/results',
      },
      seatSelection: {
        id: 'select-seat',
        path: '/bus-booking/select-seat',
      },
      supervisorInfo: {
        id: 'supervisor-information',
        path: '/bus-booking/supervisor-information',
      },
    },
  },
  taxiBooking: {
    id: 'taxi-booking',
    path: '/taxi-booking',
    subPathList: {
      results: {
        id: 'results',
        path: '/taxi-booking/results',
      },
      seatSelection: {
        id: 'select-seat',
        path: '/taxi-booking/select-seat',
      },
      supervisorInfo: {
        id: 'supervisor-information',
        path: '/taxi-booking/supervisor-information',
      },
    },
  },
  transactions: {
    id: 'transactions',
    path: '/transactions',
  },
  orders: {
    id: 'orders',
    path: '/orders',
  },
  network: {
    id: 'network',
    path: '/network',
  },
  register: {
    id: 'register',
    path: '/register',
  },
  login: {
    id: 'login',
    path: '/login',
  },
  welcome: {
    id: 'welcome',
    path: '/welcome',
  },
  topUp: {
    id: 'top-up',
    path: '/top-up',
  },
  creditTransfer: {
    id: 'credit-transfer',
    path: '/credit-transfer',
  },
  pages: {
    id: 'pages',
    path: '/pages',
    subPathList: {
      rules: {
        id: 'rules',
        path: '/pages/rules',
      },
      help: {
        id: 'help',
        path: '/pages/help',
      },
      faq: {
        id: 'faq',
        path: '/pages/faq',
      },
    },
  },
  profile: {
    id: 'profile',
    path: '/profile',
  },
  moneyTransfer:{
    id:'mooney-transfer',
    path:"/money-transfer"
  }
} as const;

export const bottomNavigationList = [
  routeList.home,
  routeList.transactions,
  routeList.orders,
  routeList.network,
] as const;
