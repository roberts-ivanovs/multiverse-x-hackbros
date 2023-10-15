import { RouteNamesEnum } from 'localConstants';
import { Bridge, Dashboard, Home } from 'pages';
import { RouteType } from 'types';

interface RouteWithTitleType extends RouteType {
  title: string;
}

export const routes: RouteWithTitleType[] = [
  {
    path: RouteNamesEnum.bridge,
    title: 'Bridge',
    component: Bridge
  },
  {
    path: RouteNamesEnum.dashboard,
    title: 'Dashboard',
    component: Dashboard
  },
  {
    path: RouteNamesEnum.home,
    title: 'Home',
    component: Home
  }
];
