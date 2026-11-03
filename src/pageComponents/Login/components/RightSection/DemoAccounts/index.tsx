import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { type DemoAccount, demoAccounts } from '@/src/lib/demoAccounts';
import { styles } from './index.stylex';

interface DemoAccountsProps {
   disabled: boolean;
   onSelect: (account: DemoAccount) => void;
}

export default function DemoAccounts({ disabled, onSelect }: DemoAccountsProps) {
   return (
      <section {...stylex.props(styles.root)}>
         <span {...stylex.props(styles.title)}>Try a demo account</span>
         <div {...stylex.props(styles.list)}>
            {demoAccounts.map(account => (
               <button
                  key={account.email}
                  type="button"
                  disabled={disabled}
                  onClick={() => onSelect(account)}
                  aria-label={`Log in as ${account.username}`}
                  {...stylex.props(styles.chip)}
               >
                  <Image
                     src={account.avatar}
                     alt=""
                     width={44}
                     height={44}
                     {...stylex.props(styles.avatar)}
                  />
                  <span {...stylex.props(styles.username)}>{account.username}</span>
               </button>
            ))}
         </div>
      </section>
   );
}
