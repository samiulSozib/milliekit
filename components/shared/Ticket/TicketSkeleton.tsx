import { classnames } from '@/utils';

import styles from './Ticket.module.scss';

export default function TicketSkeleton() {
  return (
    <div className={classnames(styles.ticket, 'overflow-hidden pt-1.5 pb-4 px-3.5 cursor-pointer')}>
      <div className="skeleton skeletonItem h-[1rem] w-[6rem] mt-4"></div>
      <div className="flex justify-between items-center mt-4">
        <div className="skeleton skeletonItem h-[3rem] w-[6rem]"></div>
        <div className="skeleton skeletonItem h-[3rem] w-[6rem]"></div>
      </div>
      <div className={classnames(styles['ticket-separator'], 'my-8 px-4')}>
        <div className={classnames(styles['ticket-separator__line'])}></div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="skeleton skeletonItem h-[1.6rem] w-[6rem]"></div>
        <div className="skeleton skeletonItem h-[1.6rem] w-[6rem]"></div>
      </div>
    </div>
  );
}
