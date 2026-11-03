import * as stylex from '@stylexjs/stylex';
import { MdPerson } from 'react-icons/md';
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
                  <span {...stylex.props(styles.avatar)}>
                     <MdPerson size={26} />
                  </span>
                  <span {...stylex.props(styles.username)}>{account.username}</span>
               </button>
            ))}
         </div>
      </section>
   );
}
