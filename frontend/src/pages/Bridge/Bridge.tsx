import { Card } from 'components/Card';
import { AuthRedirectWrapper } from 'wrappers';
import { BlockchainCard, BridgeTokenCard } from './widgets';

type WidgetsType = {
  title: string;
  widget: (props: any) => JSX.Element;
  description?: string;
  props?: { receiver?: string };
  reference: string;
};

const WIDGETS: WidgetsType[] = [
  {
    title: 'BLOCKCHAIN 1',
    widget: BlockchainCard,
    description: 'Connected account details',
    props: {},
    reference: 'https://docs.multiversx.com/sdk-and-tools/sdk-dapp/#account'
  },
  {
    title: 'Bridge',
    widget: BridgeTokenCard,
    description: '----->',
    reference: 'https://docs.multiversx.com/sdk-and-tools/sdk-dapp/#account'
  },
  {
    title: 'BLOCKCHAIN 2',
    widget: BlockchainCard,
    description: 'Connected account details',
    props: {},
    reference: 'https://docs.multiversx.com/sdk-and-tools/sdk-dapp/#account'
  }
];

// TODO: make it horizontal alignment
export const Bridge = () => (
  <AuthRedirectWrapper>
    <div className='flex flex-row gap-6 max-w-3xl w-full'>
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
