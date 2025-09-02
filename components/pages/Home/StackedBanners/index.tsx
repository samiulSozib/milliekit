import { classnames } from '@/utils';
import { motion } from 'framer-motion';
import move from 'lodash-move';
import { useRef, useState } from 'react';
import styles from './StackedBanners.module.scss';

interface StackedBannersProps {
  banners: string[];
  cardOffset?: number;
  scaleFactor?: number;
}

export default function StackedBanners({ banners, cardOffset = 10, scaleFactor = 0.06 }: StackedBannersProps) {
  const [cards, setCards] = useState(banners);

  const moveToEnd = (from: number) => {
    setCards(move(cards, from, cards.length - 1));
  };

  return (
    <div className={classnames('StackedBanners', styles.StackedBanners)}>
      <ul className={classnames('StackedBanners__inner', styles.StackedBanners__inner)}>
        {cards.map((card, index) => {
          const canDrag = index === 0;

          return (
            <motion.li
              key={card}
              className={classnames('StackedBanners__card', styles.StackedBanners__card)}
              style={{
                cursor: canDrag ? 'grab' : 'auto',
              }}
              animate={{
                top: index * -cardOffset,
                scale: 1 - index * scaleFactor,
                zIndex: banners.length - index,
              }}
              drag={canDrag ? 'y' : false}
              dragConstraints={{
                top: 0,
                bottom: 0,
              }}
              dragElastic={0}
              onDragEnd={() => moveToEnd(index)}
            >
              <img className="w-full" src={card} alt="" />
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
