import { RouteNamesEnum } from 'localConstants';
import { Home } from 'pages';
import { RouteType } from 'types';

interface RouteWithTitleType extends RouteType {
  title: string;
  path: RouteNamesEnum;
  component: () => JSX.Element;
}

export const routes: RouteWithTitleType[] = [
  {
    path: RouteNamesEnum.home,
    title: 'Home',
    component: Home
  }
];
