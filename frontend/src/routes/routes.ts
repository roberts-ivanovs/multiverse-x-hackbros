import { RouteNamesEnum } from 'localConstants';
import { Dashboard, Home, Bridge } from 'pages';
import { RouteType } from 'types';

interface RouteWithTitleType extends RouteType {
  title: string;
}

export const routes: RouteWithTitleType[] = [
  {
    path: RouteNamesEnum.home,
    title: 'Bridge',
    component: Bridge
  },
  {
    path: RouteNamesEnum.dashboard,
    title: 'Dashboard',
    component: Dashboard
  },
  {
    path: RouteNamesEnum.bridge,
    title: 'Home',
    component: Home
  }
];