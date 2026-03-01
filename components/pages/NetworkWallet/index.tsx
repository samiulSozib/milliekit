'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/components/core/hooks/useSettings';
import PageWrapper from '@/components/core/PageWrapper';
import ActionBox from '@/components/shared/ActionBox';
import Header from '@/components/shared/Header';
import { Button } from '@/components/core/Button';
import Icon from '@/components/core/Icon';
import { getLocalStorageItem } from '@/utils';
import type { WalletTransactionItemDataType } from '@/types';

export default function NetworkWalletIndex({
  items,
  totalItems,
  memberId,
}: {
  items: WalletTransactionItemDataType[];
  totalItems: number;
  memberId?: string;
}) {
  const [transactions, setTransactions] = useState<WalletTransactionItemDataType[]>(items);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    settings: { dictionary },
  } = useSettings();
  const networkDictionary = dictionary.network;

  useEffect(() => {
    // Load member data from localStorage on client side
    const loadMemberData = () => {
      try {
        const storedMember = getLocalStorageItem('selectedNetworkMember', null);
        if (storedMember) {
          setSelectedMember(storedMember);
        } else if (memberId) {
          // Fallback: create basic member info from memberId
          const memberData = {
            id: parseInt(memberId),
            first_name: 'کاربر',
            last_name: 'شبکه',
            mobile: '',
            email: '',
          };
          setSelectedMember(memberData);
        }
      } catch (error) {
        console.error('Error loading member data:', error);
      }
    };

    loadMemberData();
  }, [memberId]);

  useEffect(() => {
    setTransactions(items);
  }, [items]);

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('fa-IR').format(numAmount) + ' ریال';
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      return date.toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'credit': 'واریز',
      'debit': 'برداشت',
      'deposit': 'واریز',
      'withdrawal': 'برداشت'
    };
    return labels[type] || type;
  };

  const getTransactionTypeColor = (type: string) => {
    return type === 'credit' || type === 'deposit' 
      ? 'text-green-600 bg-green-50' 
      : 'text-red-600 bg-red-50';
  };

  const getTransactionStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'verified': 'text-green-800 bg-green-100',
      'success': 'text-green-800 bg-green-100',
      'completed': 'text-green-800 bg-green-100',
      'pending': 'text-yellow-800 bg-yellow-100',
      'waiting': 'text-yellow-800 bg-yellow-100',
      'rejected': 'text-red-800 bg-red-100',
      'failed': 'text-red-800 bg-red-100',
      'cancelled': 'text-gray-800 bg-gray-100',
    };
    return colors[status] || 'text-gray-800 bg-gray-100';
  };

  const getTransactionStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'verified': 'تایید شده',
      'success': 'موفق',
      'completed': 'تکمیل شده',
      'pending': 'در انتظار',
      'waiting': 'در انتظار',
      'rejected': 'رد شده',
      'failed': 'ناموفق',
      'cancelled': 'لغو شده',
    };
    return labels[status] || status;
  };

  const calculateTotalBalance = () => {
    return transactions.reduce((total, transaction) => {
      const amount = typeof transaction.amount === 'string' 
        ? parseFloat(transaction.amount) 
        : transaction.amount || 0;
      
      if (transaction.type === 'credit' || transaction.type === 'deposit') {
        return total + amount;
      } else {
        return total - amount;
      }
    }, 0);
  };

  const handleBack = () => {
    // Clear localStorage when going back
    localStorage.removeItem('selectedNetworkMember');
    router.back();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <PageWrapper name="module-network-wallet">
      <Header
        title={selectedMember ? 
          `تراکنش‌های ${selectedMember.first_name} ${selectedMember.last_name}` : 
          'تراکنش‌های کیف پول'
        }
        wallpaper="/assets/images/modules/network/wallpaper.jpg"
        wallpaperPosition="top center"
        overlayOpacity={0.7}
      />

      {/* Back Button */}
      <div className="container-fluid mt-4">
        <div className="flex gap-2">
          <Button
            variant="outlined"
            color="primary"
            onClick={handleBack}
            className="mb-4"
            startIcon={<Icon name="arrow-right" />}
          >
            بازگشت به لیست شبکه
          </Button>
          
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleRefresh}
            className="mb-4"
            startIcon={<Icon name="refresh" />}
          >
            بروزرسانی
          </Button>
        </div>
      </div>

      <ActionBox>
        <div className="flex flex-col gap-y-4">
          {selectedMember && (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-50 rounded-full flex items-center justify-center border border-purple-200">
                  <Icon name="user" className="text-purple-600" size={20} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800 text-lg">
                    {selectedMember.first_name} {selectedMember.last_name}
                  </div>
                  {selectedMember.mobile && (
                    <div className="text-gray-500 text-sm mt-1">
                      <Icon name="phone" className="ml-1" size={14} />
                      {selectedMember.mobile}
                    </div>
                  )}
                  {selectedMember.email && (
                    <div className="text-gray-500 text-sm mt-1">
                      <Icon name="mail" className="ml-1" size={14} />
                      {selectedMember.email}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Icon name="wallet" className="text-green-600" size={16} />
                </div>
                <div className="text-green-800 text-sm">موجودی کل</div>
              </div>
              <div className="text-green-900 font-bold text-xl mt-2">
                {formatCurrency(calculateTotalBalance())}
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Icon name="credit-card" className="text-blue-600" size={16} />
                </div>
                <div className="text-blue-800 text-sm">تعداد تراکنش‌ها</div>
              </div>
              <div className="text-blue-900 font-bold text-xl mt-2">
                {totalItems}
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Icon name="trending-up" className="text-purple-600" size={16} />
                </div>
                <div className="text-purple-800 text-sm">وضعیت حساب</div>
              </div>
              <div className="text-purple-900 font-bold text-xl mt-2">
                {calculateTotalBalance() >= 0 ? 'فعال' : 'منفی'}
              </div>
            </div>
          </div>
        </div>
      </ActionBox>

      {/* Transactions List */}
      <div className="mt-6">
        <div className="container-fluid">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-800 text-xl">
                تاریخچه تراکنش‌ها
              </h3>
              <div className="text-gray-500 text-sm">
                نمایش {transactions.length} از {totalItems} تراکنش
              </div>
            </div>
            
            {transactions.length > 0 ? (
              <div className="flex flex-col gap-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-200 hover:border-gray-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Transaction Info Left */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getTransactionTypeColor(transaction.type)}`}>
                            {getTransactionTypeLabel(transaction.type)}
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm ${getTransactionStatusColor(transaction.status)}`}>
                            {getTransactionStatusLabel(transaction.status)}
                          </div>
                        </div>
                        
                        <div className="text-gray-700 mb-2">
                          {transaction.data?.reason || transaction.user?.first_name || 'بدون توضیح'}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Icon name="calendar" className="ml-1" size={14} />
                            {formatDate(transaction.created_at)}
                          </div>
                          {transaction.user && (
                            <div className="flex items-center">
                              <Icon name="user" className="ml-1" size={14} />
                              {transaction.user.first_name} {transaction.user.last_name}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Transaction Amount Right */}
                      <div className="text-left md:text-right">
                        <div className={`font-bold text-2xl mb-1 ${
                          transaction.type === 'credit' || transaction.type === 'deposit' 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {transaction.type === 'credit' || transaction.type === 'deposit' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </div>
                        
                        {transaction.fee && parseFloat(transaction.fee) > 0 && (
                          <div className="text-gray-500 text-sm">
                            کارمزد: {formatCurrency(transaction.fee)}
                          </div>
                        )}
                        
                        <div className="text-gray-500 text-sm mt-2">
                          شماره تراکنش: #{transaction.id}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="credit-card-off" className="text-gray-400" size={32} />
                </div>
                <div className="text-gray-500 text-lg mb-2">
                  {networkDictionary.noTransactionsFound || 'هیچ تراکنشی یافت نشد.'}
                </div>
                <p className="text-gray-400 text-sm">
                  برای این کاربر تاکنون تراکنشی ثبت نشده است.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}