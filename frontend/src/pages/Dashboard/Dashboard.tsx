import { Card } from 'components/Card';
import { AuthRedirectWrapper } from 'wrappers';
import { Account, PingPongRaw, Transactions } from './widgets';

type WidgetsType = {
  title: string;
  widget: (props: any) => JSX.Element;
  description?: string;
  props?: { receiver?: string };
  reference: string;
};

const WIDGETS: WidgetsType[] = [
  {
    title: 'Account',
    widget: Account,
    description: 'Connected account details',
    reference: 'https://docs.multiversx.com/sdk-and-tools/sdk-dapp/#account'
  },
  {
    title: 'Ping & Pong (Manual)',
    widget: PingPongRaw,
    description:
      'Smart Contract interactions using manually formulated transactions',
    reference:
      'https://docs.multiversx.com/sdk-and-tools/indices/es-index-transactions/'
  },
  {
    title: 'Transactions (All)',
    widget: Transactions,
    description: 'List transactions for the connected account',
    reference:
      'https://api.elrond.com/#/accounts/AccountController_getAccountTransactions'
  }
];

export const Dashboard = () => (
  <AuthRedirectWrapper>
    <div className='flex flex-col gap-6 max-w-3xl w-full'>
      {WIDGETS.map((element) => {
        const {
          title,
          widget: MxWidget,
          description,
          props = {},
          reference
        } = element;

        return (
          <Card
            key={title}
            title={title}
            description={description}
            reference={reference}
          >
            <MxWidget {...props} />
          </Card>
        );
      })}
    </div>
  </AuthRedirectWrapper>
);
