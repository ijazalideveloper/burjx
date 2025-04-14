'use client';

import { CategoryTab } from '@/lib/types';
import styles from './MarketTabs.module.css';

interface MarketTabsProps {
  activeTab: CategoryTab;
  onTabChange: (tab: CategoryTab) => void;
}

export default function MarketTabs({ activeTab, onTabChange }: MarketTabsProps) {
  const tabs = [
    {
      id: 'featured' as CategoryTab,
      label: 'Featured',
      icon: '🔥'
    },
    {
      id: 'gainers' as CategoryTab,
      label: 'Top Gainers',
      icon: '🚀'
    },
    {
      id: 'losers' as CategoryTab,
      label: 'Top Losers',
      icon: '📉'
    }
  ];
  
  return (
    <div className={styles.tabsContainer}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`${styles.tabButton} ${
            activeTab === tab.id ? styles.activeTab : styles.inactiveTab
          }`}
        >
          <span className={styles.tabIcon}>{tab.icon}</span>
          <span>{tab.label}</span>
          
          {/* Underline for active tab */}
          {activeTab === tab.id && (
            <div className={styles.activeIndicator}></div>
          )}
        </button>
      ))}
    </div>
  );
}