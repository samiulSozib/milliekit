// // components/pages/Modules/Network/index.tsx
// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { useForm, Controller } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { useRouter } from 'next/navigation';

// import { useSettings } from '@/components/core/hooks/useSettings';
// import PageWrapper from '@/components/core/PageWrapper';
// import ActionBox from '@/components/shared/ActionBox';
// import Header from '@/components/shared/Header';
// import { Input } from '@/components/core/Form';
// import { Modal } from '@/components/core/Modal';
// import { Button } from '@/components/core/Button';
// import { classnames, getLocalizedUrl, getLocalStorageItem } from '@/utils';
// import Icon from '@/components/core/Icon';
// import { useActiveRouteStore } from '@/store/useActiveRouteStore';
// import { networkCreateFormSchema, networkEditFormSchema, networkSearchSchema } from '@/validation';
// import { apiPathConfig, i18n, routeList, type Locale } from '@/config';
// import { NetworkRequest } from '@/server/network';
// import { NetworkWalletRequest } from '@/server/network-wallet-transaction'; // Import the wallet request

// import type { NetworkItemDataType, NetworkCreateDataType, NetworkUpdateDataType, NetworkQueryParamsType, LoggedInDataType, WalletTransactionItemDataType } from '@/types';
// import type { InferType } from 'yup';
// import { SelectBox } from '@/components/core/Form/SelectBox';

// const networkRequest = new NetworkRequest({
//     url: apiPathConfig.networks.base,
// });

// // Initialize wallet request
// const networkWalletRequest = new NetworkWalletRequest({
//     url: apiPathConfig.wallets.subCustomers.base,
// });

// export default function NetworkIndex({
//     items,
//     totalItems,
// }: {
//     items: NetworkItemDataType[];
//     totalItems: number;
// }) {
//     const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
//     const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);
//     const [isOpenSuccessModal, setIsOpenSuccessModal] = useState<boolean>(false);
//     const [isOpenErrorModal, setIsOpenErrorModal] = useState<boolean>(false);
//     const [searchResults, setSearchResults] = useState<NetworkItemDataType[]>(items);
//     const [modalMessage, setModalMessage] = useState<string>('');
//     const [selectedMember, setSelectedMember] = useState<NetworkItemDataType | null>(null);
//     const [isOpenEditDialog, setIsOpenEditDialog] = useState<boolean>(false);
//     const [editFormData, setEditFormData] = useState<NetworkItemDataType | null>(null);
//     const [editLoading, setEditLoading] = useState<boolean>(false);

//     // NEW STATES FOR TRANSACTIONS AND CREDIT/DEBIT
//     const [isOpenTransactionsModal, setIsOpenTransactionsModal] = useState<boolean>(false);
//     const [isOpenCreditDebitModal, setIsOpenCreditDebitModal] = useState<boolean>(false);
//     const [transactions, setTransactions] = useState<WalletTransactionItemDataType[]>([]);
//     const [transactionsLoading, setTransactionsLoading] = useState<boolean>(false);
//     const [creditDebitLoading, setCreditDebitLoading] = useState<boolean>(false);

//     const [isOpenDeactivateConfirm, setIsOpenDeactivateConfirm] = useState<boolean>(false);
//     const [deactivateLoading, setDeactivateLoading] = useState<boolean>(false);

//     const router = useRouter();

//     const {
//         settings: { dictionary, lang },
//     } = useSettings();
//     const generalDictionary = dictionary.general;
//     const networkDictionary = dictionary.network;

//     const addMemberFormProps = useForm({
//         resolver: yupResolver(networkCreateFormSchema),
//         mode: 'onBlur',
//         reValidateMode: 'onSubmit',
//         defaultValues: {
//             first_name: '',
//             last_name: '',
//             mobile: '',
//             password: '',
//             email: '',
//             price_adjust_type: 'increase',
//             price_adjust_mode: 'percentage',
//             price_adjust_value: 0,
//         }
//     });

//     const editMemberFormProps = useForm({
//         resolver: yupResolver(networkEditFormSchema),
//         mode: 'onBlur',
//         reValidateMode: 'onSubmit',
//         defaultValues: {
//             first_name: '',
//             last_name: '',
//             mobile: '',
//             password: '',
//             email: '',
//             price_adjust_type: 'increase',
//             price_adjust_mode: 'percentage',
//             price_adjust_value: 0,
//         }
//     });

//     // NEW: Credit/Debit Form
//     const creditDebitFormProps = useForm({
//         mode: 'onBlur',
//         reValidateMode: 'onSubmit',
//         defaultValues: {
//             transaction_type: 'credit', // 'credit' or 'debit'
//             amount: '',
//             reason: '',
//         }
//     });

//     const priceAdjustModeOptions = [
//         { value: 'percentage', label: networkDictionary.percentage },
//         { value: 'fixed', label: networkDictionary.fixed },
//     ];

//     const priceAdjustTypeOptions = [
//         { value: 'increase', label: networkDictionary.priceIncrease },
//         { value: 'decrease', label: networkDictionary.priceDecrease },
//     ];

//     // NEW: Transaction Type Options
//     const transactionTypeOptions = [
//         { value: 'credit', label: networkDictionary.credit || 'واریز وجه به حساب کاربر' },
//         { value: 'debit', label: networkDictionary.debit || 'برداشت وجه از حساب کاربر' },
//     ];

//     const searchFormProps = useForm({
//         resolver: yupResolver(networkSearchSchema),
//         mode: 'onBlur',
//         reValidateMode: 'onSubmit',
//     });

//     const handleViewTransactions = useCallback((member: NetworkItemDataType) => {
//         // Store the selected member in localStorage
//         const memberData = {
//             id: member.id,
//             first_name: member.first_name,
//             last_name: member.last_name,
//             mobile: member.mobile,
//             email: member.email,
//         };

//         // Store in localStorage for the transactions page
//         localStorage.setItem('selectedNetworkMember', JSON.stringify(memberData));

//         const currentLang = window.location.pathname.split('/')[1] || 'fa';
    
//     // Navigate to transactions page with language and member ID
//     router.push(`/${currentLang}/network-wallet?member_id=${member.id}`);

//         // Close the edit dialog if open
//         setIsOpenEditDialog(false)
        
//     }, [router]);

//     // NEW: Handle Credit/Debit Action
//     const handleCreditDebitAction = useCallback((member: NetworkItemDataType) => {
//         setSelectedMember(member);

//         // Reset form with default values
//         creditDebitFormProps.reset({
//             transaction_type: 'credit',
//             amount: '',
//             reason: '',
//         });

//         setIsOpenCreditDebitModal(true);
//         setIsOpenEditDialog(false);
//     }, [creditDebitFormProps]);

//     // NEW: Submit Credit/Debit Form
//     const handleSubmitCreditDebit = useCallback(async (data: any) => {
//         if (!selectedMember) return;

//         setCreditDebitLoading(true);

//         try {
//             const userData = getLocalStorageItem<LoggedInDataType | null>('userData', null);
//             if (userData == null) {
//                 setModalMessage(networkDictionary.userNotLoggedIn || 'کاربر وارد سیستم نشده است');
//                 setIsOpenErrorModal(true);
//                 setCreditDebitLoading(false);
//                 return;
//             }

//             const amount = parseFloat(data.amount);
//             if (isNaN(amount) || amount <= 0) {
//                 setModalMessage(networkDictionary.invalidAmount || 'مبلغ وارد شده نامعتبر است');
//                 setIsOpenErrorModal(true);
//                 setCreditDebitLoading(false);
//                 return;
//             }

//             if (data.transaction_type === 'credit') {
//                 // Credit (Add funds)
//                 await networkWalletRequest.credit(
//                     selectedMember.id,
//                     amount,
//                     data.reason || 'واریز وجه',
//                     userData.token
//                 );
//                 setModalMessage(`${networkDictionary.creditSuccess || 'واریز وجه با موفقیت انجام شد'} - ${amount}`);
//             } else {
//                 // Debit (Withdraw funds)
//                 await networkWalletRequest.debit(
//                     selectedMember.id,
//                     amount,
//                     data.reason || 'برداشت وجه',
//                     userData.token
//                 );
//                 setModalMessage(`${networkDictionary.debitSuccess || 'برداشت وجه با موفقیت انجام شد'} - ${amount}`);
//             }

//             setIsOpenCreditDebitModal(false);
//             setIsOpenSuccessModal(true);

//             // Refresh transactions if modal is open
//             if (isOpenTransactionsModal) {
//                 const updatedTransactions = await networkWalletRequest.getTransactions(
//                     selectedMember.id,
//                     userData.token
//                 );
//                 setTransactions(updatedTransactions.items || []);
//             }

//         } catch (error) {
//             console.error('Credit/Debit error:', error);
//             setModalMessage(networkDictionary.creditDebitError || 'خطا در انجام عملیات');
//             setIsOpenErrorModal(true);
//         } finally {
//             setCreditDebitLoading(false);
//         }
//     }, [selectedMember, networkDictionary, isOpenTransactionsModal]);

//     const handleAddMember = useCallback(async (data: InferType<typeof networkCreateFormSchema>) => {
//         setIsOpenAddModal(false);

//         const userData = getLocalStorageItem<LoggedInDataType | null>('userData', null);
//         if (userData == null) return;

//         try {
//             const createData: NetworkCreateDataType = {
//                 first_name: data.first_name,
//                 last_name: data.last_name,
//                 mobile: data.mobile,
//                 password: data.password,
//                 email: data.email || null,
//                 price_adjust_type: data.price_adjust_type,
//                 price_adjust_mode: data.price_adjust_mode,
//                 price_adjust_value: data.price_adjust_value || 0,
//             };

//             await networkRequest.create(createData, userData.token);

//             addMemberFormProps.reset({
//                 first_name: '',
//                 last_name: '',
//                 mobile: '',
//                 password: '',
//                 email: '',
//                 price_adjust_type: 'increase',
//                 price_adjust_mode: 'percentage',
//                 price_adjust_value: 0,
//             });

//             setModalMessage(networkDictionary.memberAddedSuccess || 'عضو جدید با موفقیت افزوده شد.');
//             setIsOpenSuccessModal(true);

//             router.refresh();

//         } catch (error) {
//             setModalMessage(networkDictionary.memberAddError || 'خطا در افزودن عضو جدید.');
//             setIsOpenErrorModal(true);
//         }
//     }, [addMemberFormProps, networkDictionary, router]);

//     const handleUpdateMember = useCallback(async (data: InferType<typeof networkEditFormSchema>) => {
//         if (!selectedMember || !editFormData) return;

//         setEditLoading(true);
//         setIsOpenEditModal(false);

//         const userData = getLocalStorageItem<LoggedInDataType | null>('userData', null);
//         if (userData == null) {
//             setModalMessage(networkDictionary.userNotLoggedIn || 'کاربر وارد سیستم نشده است');
//             setIsOpenErrorModal(true);
//             setEditLoading(false);
//             return;
//         }

//         try {
//             const updateData: NetworkUpdateDataType = {
//                 id: selectedMember.id,
//                 first_name: data.first_name,
//                 last_name: data.last_name,
//                 mobile: data.mobile,
//                 email: data.email || '',
//                 price_adjust_type: data.price_adjust_type || "increase",
//                 price_adjust_mode: data.price_adjust_mode || "fixed",
//                 price_adjust_value: data.price_adjust_value || 0,
//             };

//             // Only include password if it's provided and not empty
//             if (data.password && data.password.trim() !== '') {
//                 updateData.password = data.password;
//             }

//             await networkRequest.update(updateData, userData.token);

//             // Reset edit form
//             editMemberFormProps.reset({
//                 first_name: '',
//                 last_name: '',
//                 mobile: '',
//                 password: '',
//                 email: '',
//                 price_adjust_type: 'increase',
//                 price_adjust_mode: 'percentage',
//                 price_adjust_value: 0,
//             });

//             setModalMessage(networkDictionary.memberUpdatedSuccess || 'اطلاعات عضو با موفقیت بروزرسانی شد.');
//             setIsOpenSuccessModal(true);

//             // Refresh the list
//             router.refresh();

//         } catch (error) {
//             console.error('Update error:', error);
//             setModalMessage(networkDictionary.memberUpdateError || 'خطا در بروزرسانی اطلاعات عضو.');
//             setIsOpenErrorModal(true);
//         } finally {
//             setEditLoading(false);
//             setEditFormData(null);
//         }
//     }, [selectedMember, editFormData, editMemberFormProps, networkDictionary, router]);

//     const handleSearch = useCallback(async (data: InferType<typeof networkSearchSchema>) => {
//         try {
//             const userData = getLocalStorageItem<LoggedInDataType | null>('userData', null);
//             if (userData == null) return;

//             networkRequest.options.token = userData.token;

//             const response = await networkRequest.getList({
//                 search: data.searchType === 'phone' ? data.phoneNumber : data.name,
//                 per_page: 50,
//                 page: 1
//             });

//             setSearchResults(response.items || []);

//         } catch (error) {
//             console.error('Search error:', error);
//             setModalMessage(networkDictionary.searchError || 'خطا در جستجو.');
//             setIsOpenErrorModal(true);
//         }
//     }, [networkDictionary]);

//     const handleResetSearch = useCallback(() => {
//         searchFormProps.reset();
//         setSearchResults(items);
//     }, [searchFormProps, items]);

//     const handleEditMember = useCallback((member: NetworkItemDataType) => {
//         setSelectedMember(member);
//         setEditFormData(member);

//         // Pre-fill form with member data
//         editMemberFormProps.reset({
//             first_name: member.first_name,
//             last_name: member.last_name,
//             mobile: member.mobile,
//             password: '', // Leave password empty by default
//             email: member.email || '',
//             price_adjust_type: member.pricing?.adjust_type || 'increase',
//             price_adjust_mode: member.pricing?.adjust_mode || 'percentage',
//             price_adjust_value: member.pricing?.adjust_value || 0,
//         });

//         setIsOpenEditModal(true);
//     }, [editMemberFormProps]);

//     const handleEditMemberDialog = useCallback((member: NetworkItemDataType) => {
//         setSelectedMember(member);
//         setIsOpenEditDialog(true);
//     }, []);

//     // UPDATED: Handle credit/debit action
//     const handleCreditDebit = useCallback(() => {
//         if (!selectedMember) return;
//         handleCreditDebitAction(selectedMember);
//     }, [selectedMember, handleCreditDebitAction]);

//     // UPDATED: Handle view transactions action
//     const handleViewTransactionsAction = useCallback(() => {
//         if (!selectedMember) return;
//         handleViewTransactions(selectedMember);
//     }, [selectedMember, handleViewTransactions]);

//     const handleDisableMember = useCallback(() => {
//         if (!selectedMember) return;
//         setIsOpenEditDialog(false);
//         setIsOpenDeactivateConfirm(true);
//     }, [selectedMember]);

//     const handleConfirmDeactivate = useCallback(async () => {
//         if (!selectedMember) return;

//         setDeactivateLoading(true);
//         try {
//             const userData = getLocalStorageItem<LoggedInDataType | null>('userData', null);
//             if (userData == null) {
//                 setModalMessage('کاربر وارد سیستم نشده است');
//                 setIsOpenErrorModal(true);
//                 return;
//             }

//             await networkRequest.deactivate(selectedMember.id, userData.token);

//             setModalMessage(`${networkDictionary.memberDeactivatedSuccess || 'کاربر با موفقیت غیرفعال شد'}: ${selectedMember.first_name} ${selectedMember.last_name}`);
//             setIsOpenSuccessModal(true);
//             setIsOpenDeactivateConfirm(false);

//             // Refresh the list
//             router.refresh();

//         } catch (error) {
//             console.error('Deactivation error:', error);
//             setModalMessage(networkDictionary.memberDeactivationError || 'خطا در غیرفعال کردن کاربر');
//             setIsOpenErrorModal(true);
//         } finally {
//             setDeactivateLoading(false);
//         }
//     }, [selectedMember, networkDictionary, router]);

//     const handleCancelDeactivate = useCallback(() => {
//         setIsOpenDeactivateConfirm(false);
//         setDeactivateLoading(false);
//     }, []);

//     const setActiveRoute = useActiveRouteStore((state) => state.setActiveRoute);

//     useEffect(() => {
//         setActiveRoute(routeList.network);
//         setSearchResults(items);

//         return () => {
//             setActiveRoute(null);
//         };
//     }, [items]);

//     const formatPhoneNumber = (phone: string) => {
//         return phone.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
//     };

//     // NEW: Format date for transactions
//     const formatDate = (dateString: string) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString('fa-IR', {
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     };

//     // NEW: Format currency for transactions
//     const formatCurrency = (amount: string) => {
//         return new Intl.NumberFormat('fa-IR').format(parseFloat(amount)) + ' ریال';
//     };

//     // NEW: Get transaction type label
//     const getTransactionTypeLabel = (type: string) => {
//         return type === 'credit' ? 'واریز' : 'برداشت';
//     };

//     // NEW: Get transaction status color
//     const getTransactionStatusColor = (status: string) => {
//         switch (status) {
//             case 'verified': return 'text-green-600';
//             case 'pending': return 'text-yellow-600';
//             case 'rejected': return 'text-red-600';
//             default: return 'text-gray-600';
//         }
//     };

//     // NEW: Get transaction status label
//     const getTransactionStatusLabel = (status: string) => {
//         switch (status) {
//             case 'verified': return 'تایید شده';
//             case 'pending': return 'در انتظار';
//             case 'rejected': return 'رد شده';
//             default: return status;
//         }
//     };

//     return (
//         <>
//             <PageWrapper name="module-network">
//                 <Header
//                     title={networkDictionary.network || 'شبکه'}
//                     wallpaper="/assets/images/modules/network/wallpaper.jpg"
//                     wallpaperPosition="top center"
//                     overlayOpacity={0.7}
//                 />

//                 <ActionBox>
//                     <div className="flex flex-col gap-y-3">
//                         {/* Add New Member Button */}
//                         <Button
//                             fullWidth
//                             variant="contained"
//                             color="primary"
//                             size="medium"
//                             onClick={() => setIsOpenAddModal(true)}
//                             className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3.5 rounded-xl shadow-lg"
//                         >
//                             <span className="text-lg">+</span>
//                             <span className="mx-2">{networkDictionary.addNewMember || 'افزودن عضو جدید'}</span>
//                         </Button>

//                         {/* Search by Name */}
//                         <Controller
//                             name="name"
//                             control={searchFormProps.control}
//                             render={({ field }) => (
//                                 <Input
//                                     id="name"
//                                     type="text"
//                                     placeholder={networkDictionary.searchByName || 'جستجو بر اساس نام و نام خانوادگی...'}
//                                     className="font-normal text-sm bg-white rounded-xl py-3"
//                                     prefixIcon={<Icon name="search" className="text-gray-400" size={18} />}
//                                     {...field}
//                                 />
//                             )}
//                         />

//                         {/* Search by Phone Number */}
//                         <Controller
//                             name="phoneNumber"
//                             control={searchFormProps.control}
//                             render={({ field }) => (
//                                 <Input
//                                     id="phoneNumber"
//                                     type="tel"
//                                     placeholder={networkDictionary.searchByPhone || 'جستجو بر اساس شماره تلفن...'}
//                                     className="font-normal text-sm ltr bg-white rounded-xl py-3"
//                                     prefixIcon={<Icon name="search" className="text-gray-400" size={18} />}
//                                     {...field}
//                                 />
//                             )}
//                         />
//                     </div>
//                 </ActionBox>

//                 {/* Members List */}
//                 <div className="mt-4">
//                     <div className="container-fluid">
//                         <div className="bg-white rounded-2xl p-4 shadow-sm">
//                             {searchResults.length > 0 ? (
//                                 <div className="flex flex-col gap-y-3">
//                                     {searchResults.map((member) => (
//                                         <div
//                                             key={member.id}
//                                             className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
//                                         >
//                                             <div className="flex items-center justify-between">
//                                                 {/* Member Info */}
//                                                 <div className="flex items-center gap-3 flex-1">
//                                                     <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-50 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm">
//                                                         <Icon
//                                                             name="user"
//                                                             className="text-purple-600"
//                                                             size={20}
//                                                         />
//                                                     </div>
//                                                     <div className="flex-1 min-w-0">
//                                                         <div className="font-semibold text-gray-800 text-sm truncate">
//                                                             {member.first_name} {member.last_name}
//                                                         </div>
//                                                         <div className="text-gray-500 text-xs mt-0.5 ltr">
//                                                             {formatPhoneNumber(member.mobile)}
//                                                         </div>
//                                                     </div>
//                                                 </div>

//                                                 {/* Action Buttons */}
//                                                 <div className="flex items-center gap-2 flex-shrink-0">
//                                                     <button
//                                                         onClick={() => handleEditMember(member)}
//                                                         className="w-9 h-9 bg-purple-50 hover:bg-purple-100 rounded-lg flex items-center justify-center transition-colors"
//                                                         title={networkDictionary.edit || 'ویرایش'}
//                                                     >
//                                                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                                             <path d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13" stroke="#8576FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
//                                                             <path d="M16.0399 3.01928L8.15988 10.8993C7.85988 11.1993 7.55988 11.7893 7.49988 12.2193L7.06988 15.2293C6.90988 16.3193 7.67988 17.0793 8.76988 16.9293L11.7799 16.4993C12.1999 16.4393 12.7899 16.1393 13.0999 15.8393L20.9799 7.95928C22.3399 6.59928 22.9799 5.01928 20.9799 3.01928C18.9799 1.01928 17.3999 1.65928 16.0399 3.01928Z" stroke="#8576FF" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
//                                                             <path d="M14.9102 4.15039C15.5802 6.54039 17.4502 8.41039 19.8502 9.09039" stroke="#8576FF" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
//                                                         </svg>
//                                                     </button>
//                                                     <button
//                                                         onClick={() => handleEditMemberDialog(member)}
//                                                         className="w-9 h-9 bg-purple-50 hover:bg-purple-100 rounded-lg flex items-center justify-center transition-colors"
//                                                         title={networkDictionary.moreOptions}
//                                                     >
//                                                         <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                                             <path d="M9.72497 3.50462C11.9341 3.50462 13.725 5.29549 13.725 7.50462C13.725 9.71376 11.9341 11.5046 9.72497 11.5046C7.51583 11.5046 5.72497 9.71376 5.72497 7.50462C5.72497 5.29549 7.51583 3.50462 9.72497 3.50462ZM9.72497 0C14.3385 0 18.3211 3.15001 19.4261 7.56439C19.5267 7.9662 19.2825 8.37348 18.8807 8.47406C18.4788 8.57465 18.0716 8.33045 17.971 7.92863C17.0321 4.17796 13.6463 1.5 9.72497 1.5C5.8019 1.5 2.41507 4.18026 1.47783 7.93315C1.37747 8.33502 0.970326 8.57944 0.568455 8.47908C0.166584 8.37872 -0.077837 7.97158 0.0225256 7.5697C1.12562 3.15272 5.10945 0 9.72497 0Z" fill="#8576FF" />
//                                                         </svg>
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             ) : (
//                                 <div className="text-center py-12">
//                                     <Icon name="users" className="text-gray-300 mx-auto" size={48} />
//                                     <div className="text-gray-500 mt-3 text-sm">
//                                         {networkDictionary.noMembersFound || 'هیچ عضوی یافت نشد.'}
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </PageWrapper>

//             {/* Bottom Sheet Modal for Add Member */}
//             {isOpenAddModal && (
//                 <>
//                     {/* Backdrop */}
//                     <div
//                         className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
//                         onClick={() => setIsOpenAddModal(false)}
//                     />

//                     {/* Bottom Sheet */}
//                     <div
//                         className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 transition-transform duration-300 ease-out"
//                         style={{
//                             maxHeight: '90vh',
//                             animation: 'slideUp 0.3s ease-out'
//                         }}
//                     >
//                         {/* Form Content */}
//                         <div className="overflow-y-auto px-5 py-6" style={{ maxHeight: 'calc(90vh - 140px)' }}>
//                             <div className="flex flex-col gap-y-4">
//                                 {/* First Name */}
//                                 <div>
//                                     <label className="block text-sm text-gray-600 mb-2 text-right">
//                                         {networkDictionary.first_name || 'نام (اجباری)'}
//                                     </label>
//                                     <Controller
//                                         name="first_name"
//                                         control={addMemberFormProps.control}
//                                         render={({ field }) => (
//                                             <Input
//                                                 id="first_name"
//                                                 type="text"
//                                                 placeholder={networkDictionary.enterFirstName || 'افزودن نام و نام خانوادگی'}
//                                                 className="font-normal text-sm bg-gray-50 rounded-xl border-0"
//                                                 hasError={addMemberFormProps.formState.errors.first_name?.message != null}
//                                                 errorMessage={addMemberFormProps.formState.errors.first_name?.message}
//                                                 {...field}
//                                             />
//                                         )}
//                                     />
//                                 </div>

//                                 {/* Last Name */}
//                                 <div>
//                                     <label className="block text-sm text-gray-600 mb-2 text-right">
//                                         {networkDictionary.last_name || 'نام و نام خانوادگی'}
//                                     </label>
//                                     <Controller
//                                         name="last_name"
//                                         control={addMemberFormProps.control}
//                                         render={({ field }) => (
//                                             <Input
//                                                 id="last_name"
//                                                 type="text"
//                                                 placeholder={networkDictionary.enterLastName || 'افزودن نام و نام خانوادگی'}
//                                                 className="font-normal text-sm bg-gray-50 rounded-xl border-0"
//                                                 hasError={addMemberFormProps.formState.errors.last_name?.message != null}
//                                                 errorMessage={addMemberFormProps.formState.errors.last_name?.message}
//                                                 {...field}
//                                             />
//                                         )}
//                                     />
//                                 </div>

//                                 {/* Email */}
//                                 <div>
//                                     <label className="block text-sm text-gray-600 mb-2 text-right">
//                                         {networkDictionary.email || 'ایمیل'}
//                                     </label>
//                                     <Controller
//                                         name="email"
//                                         control={addMemberFormProps.control}
//                                         render={({ field }) => (
//                                             <Input
//                                                 id="email"
//                                                 type="text"
//                                                 placeholder="مثال: sample@gmail.com"
//                                                 className="font-normal text-sm bg-gray-50 rounded-xl border-0 ltr text-left"
//                                                 hasError={addMemberFormProps.formState.errors.email?.message != null}
//                                                 errorMessage={addMemberFormProps.formState.errors.email?.message}
//                                                 {...field}
//                                                 value={field.value || ''}
//                                             />
//                                         )}
//                                     />
//                                 </div>

//                                 {/* Mobile */}
//                                 <div>
//                                     <label className="block text-sm text-gray-600 mb-2 text-right">
//                                         {networkDictionary.enterMobile || 'واحد پول مورد نظر جهت محاسبه'}
//                                     </label>
//                                     <Controller
//                                         name="mobile"
//                                         control={addMemberFormProps.control}
//                                         render={({ field }) => (
//                                             <Input
//                                                 id="mobile"
//                                                 type="tel"
//                                                 placeholder={networkDictionary.enterMobile || 'شماره موبایل'}
//                                                 className="font-normal text-sm bg-gray-50 rounded-xl border-0 ltr"
//                                                 hasError={addMemberFormProps.formState.errors.mobile?.message != null}
//                                                 errorMessage={addMemberFormProps.formState.errors.mobile?.message}
//                                                 {...field}
//                                             />
//                                         )}
//                                     />
//                                 </div>

//                                 {/* Password */}
//                                 <div>
//                                     <label className="block text-sm text-gray-600 mb-2 text-right">
//                                         {networkDictionary.password || 'کلمه عبور مناسب'}
//                                     </label>
//                                     <Controller
//                                         name="password"
//                                         control={addMemberFormProps.control}
//                                         render={({ field }) => (
//                                             <Input
//                                                 id="password"
//                                                 type="password"
//                                                 placeholder={networkDictionary.enterPassword || 'رمز عبور'}
//                                                 className="font-normal text-sm bg-gray-50 rounded-xl border-0"
//                                                 hasError={addMemberFormProps.formState.errors.password?.message != null}
//                                                 errorMessage={addMemberFormProps.formState.errors.password?.message}
//                                                 {...field}
//                                             />
//                                         )}
//                                     />
//                                 </div>

//                                 {/* Price Adjustment Type */}
//                                 <div>
//                                     <label className="block text-sm text-gray-600 mb-2 text-right">
//                                         {networkDictionary.selectPriceType || 'انتخاب جنبه'}
//                                     </label>
//                                     <div className="relative">
//                                         <Controller
//                                             name="price_adjust_type"
//                                             control={addMemberFormProps.control}
//                                             render={({ field }) => (
//                                                 <SelectBox
//                                                     id="price_adjust_type"
//                                                     name={field.name}
//                                                     placeholder={networkDictionary.selectPriceAdjustment}
//                                                     options={priceAdjustTypeOptions}
//                                                     value={
//                                                         priceAdjustTypeOptions.find(
//                                                             (option) => option.value === field.value
//                                                         ) || null
//                                                     }
//                                                     onChange={(selected) => {
//                                                         field.onChange(selected ? selected.value : '');
//                                                     }}
//                                                 />
//                                             )}
//                                         />
//                                         <Icon name="chevron-down" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
//                                     </div>
//                                 </div>

//                                 {/* Price Adjustment Mode */}
//                                 <div>
//                                     <label className="block text-sm text-gray-600 mb-2 text-right">
//                                         {networkDictionary.selectPriceMode || 'استان'}
//                                     </label>
//                                     <div className="relative">
//                                         <Controller
//                                             name="price_adjust_mode"
//                                             control={addMemberFormProps.control}
//                                             render={({ field }) => (
//                                                 <SelectBox
//                                                     id="price_adjust_mode"
//                                                     name={field.name}
//                                                     placeholder={networkDictionary.selectPriceMode}
//                                                     options={priceAdjustModeOptions}
//                                                     value={
//                                                         priceAdjustModeOptions.find(
//                                                             (option) => option.value === field.value
//                                                         ) || null
//                                                     }
//                                                     onChange={(selected) => {
//                                                         field.onChange(selected ? selected.value : '');
//                                                     }}
//                                                 />
//                                             )}
//                                         />
//                                         <Icon name="chevron-down" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
//                                     </div>
//                                 </div>

//                                 {/* Price Adjustment Value */}
//                                 <div>
//                                     <label className="block text-sm text-gray-600 mb-2 text-right">
//                                         {networkDictionary.enterMobile || 'واحد پول مورد نظر جهت محاسبه'}
//                                     </label>
//                                     <Controller
//                                         name="price_adjust_value"
//                                         control={addMemberFormProps.control}
//                                         render={({ field }) => (
//                                             <Input
//                                                 id="price_adjust_value"
//                                                 type="number"
//                                                 placeholder={networkDictionary.enterPriceValue || 'مقدار تغییر قیمت'}
//                                                 className="font-normal text-sm bg-white rounded-xl ltr"
//                                                 hasError={addMemberFormProps.formState.errors.price_adjust_value?.message != null}
//                                                 errorMessage={addMemberFormProps.formState.errors.price_adjust_value?.message}
//                                                 {...field}
//                                                 onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
//                                                 value={field.value || 0}
//                                             />
//                                         )}
//                                     />
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Submit Button - Fixed at Bottom */}
//                         <div className="sticky bottom-0 bg-white px-5 py-4 border-t border-gray-100">
//                             <Button
//                                 fullWidth
//                                 size="medium"
//                                 className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3.5 rounded-xl shadow-lg"
//                                 onClick={addMemberFormProps.handleSubmit(handleAddMember)}
//                             >
//                                 {networkDictionary.confirmAndSubmit || 'تایید و ثبت'}
//                             </Button>
//                         </div>
//                     </div>

//                     {/* CSS Animation */}
//                     <style jsx>{`
//                         @keyframes slideUp {
//                             from {
//                                 transform: translateY(100%);
//                             }
//                             to {
//                                 transform: translateY(0);
//                             }
//                         }
//                     `}</style>
//                 </>
//             )}

//             {/* Edit Member Modal */}
//             {isOpenEditModal && editFormData && (
//                 <>
//                     {/* Backdrop */}
//                     <div
//                         className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
//                         onClick={() => setIsOpenEditModal(false)}
//                     />

//                     {/* Bottom Sheet */}
//                     <div
//                         className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 transition-transform duration-300 ease-out"
//                         style={{
//                             maxHeight: '90vh',
//                             animation: 'slideUp 0.3s ease-out'
//                         }}
//                     >
//                         {/* Header */}
//                         <div className="px-5 pt-6 pb-4 border-b border-gray-100">
//                             <div className="flex items-center justify-between">
//                                 <h2 className="text-lg font-semibold text-gray-800">
//                                     {networkDictionary.editMember}
//                                 </h2>
//                                 <button
//                                     onClick={() => setIsOpenEditModal(false)}
//                                     className="text-gray-400 hover:text-gray-600"
//                                 >
//                                     <Icon name="x" size={20} />
//                                 </button>
//                             </div>
//                             <p className="text-gray-500 text-sm mt-1">
//                                 {networkDictionary.editMemberDescription}
//                             </p>
//                         </div>

//                         {/* Form Content */}
//                         <div className="overflow-y-auto px-5 py-6" style={{ maxHeight: 'calc(90vh - 200px)' }}>
//                             <div className="flex flex-col gap-y-4">
//                                 {/* First Name */}
//                                 <div>
//                                     <label className="block text-sm text-gray-600 mb-2 text-right">
//                                         {networkDictionary.first_name || 'نام (اجباری)'}
//                                     </label>
//                                     <Controller
//                                         name="first_name"
//                                         control={editMemberFormProps.control}
//                                         render={({ field }) => (
//                                             <Input
//                                                 id="edit_first_name"
//                                                 type="text"
//                                                 placeholder={networkDictionary.enterFirstName || 'نام'}
//                                                 className="font-normal text-sm bg-gray-50 rounded-xl border-0"
//                                                 hasError={editMemberFormProps.formState.errors.first_name?.message != null}
//                                                 errorMessage={editMemberFormProps.formState.errors.first_name?.message}
//                                                 {...field}
//                                             />
//                                         )}
//                                     />
//                                 </div>

//                                 {/* Last Name */}
//                                 <div>
//                                     <label className="block text-sm text-gray-600 mb-2 text-right">
//                                         {networkDictionary.last_name || 'نام خانوادگی'}
//                                     </label>
//                                     <Controller
//                                         name="last_name"
//                                         control={editMemberFormProps.control}
//                                         render={({ field }) => (
//                                             <Input
//                                                 id="edit_last_name"
//                                                 type="text"
//                                                 placeholder={networkDictionary.enterLastName || 'نام خانوادگی'}
//                                                 className="font-normal text-sm bg-gray-50 rounded-xl border-0"
//                                                 hasError={editMemberFormProps.formState.errors.last_name?.message != null}
//                                                 errorMessage={editMemberFormProps.formState.errors.last_name?.message}
//                                                 {...field}
//                                             />
//                                         )}
//                                     />
//                                 </div>

//                                 {/* Email */}
//                                 <div>
//                                     <label className="block text-sm text-gray-600 mb-2 text-right">
//                                         {networkDictionary.email || 'ایمیل'}
//                                     </label>
//                                     <Controller
//                                         name="email"
//                                         control={editMemberFormProps.control}
//                                         render={({ field }) => (
//                                             <Input
//                                                 id="edit_email"
//                                                 type="text"
//                                                 placeholder="مثال: sample@gmail.com"
//                                                 className="font-normal text-sm bg-gray-50 rounded-xl border-0 ltr text-left"
//                                                 hasError={editMemberFormProps.formState.errors.email?.message != null}
//                                                 errorMessage={editMemberFormProps.formState.errors.email?.message}
//                                                 {...field}
//                                                 value={field.value || ''}
//                                             />
//                                         )}
//                                     />
//                                 </div>

//                                 {/* Mobile */}
//                                 <div>
//                                     <label className="block text-sm text-gray-600 mb-2 text-right">
//                                         {networkDictionary.mobile}
//                                     </label>
//                                     <Controller
//                                         name="mobile"
//                                         control={editMemberFormProps.control}
//                                         render={({ field }) => (
//                                             <Input
//                                                 id="edit_mobile"
//                                                 type="tel"
//                                                 placeholder={networkDictionary.enterMobile}
//                                                 className="font-normal text-sm bg-gray-50 rounded-xl border-0 ltr"
//                                                 hasError={editMemberFormProps.formState.errors.mobile?.message != null}
//                                                 errorMessage={editMemberFormProps.formState.errors.mobile?.message}
//                                                 {...field}
//                                             />
//                                         )}
//                                     />
//                                 </div>

//                                 {/* Password (Optional for update) */}
//                                 <div>
//                                     <label className="block text-sm text-gray-600 mb-2 text-right">
//                                         {networkDictionary.password || 'کلمه عبور جدید (اختیاری)'}
//                                         <span className="text-gray-400 text-xs mr-1"> - {networkDictionary.optional}</span>
//                                     </label>
//                                     <Controller
//                                         name="password"
//                                         control={editMemberFormProps.control}
//                                         render={({ field }) => (
//                                             <Input
//                                                 id="edit_password"
//                                                 type="password"
//                                                 placeholder={networkDictionary.enterNewPassword}
//                                                 className="font-normal text-sm bg-gray-50 rounded-xl border-0"
//                                                 hasError={editMemberFormProps.formState.errors.password?.message != null}
//                                                 errorMessage={editMemberFormProps.formState.errors.password?.message}
//                                                 {...field}
//                                             />
//                                         )}
//                                     />
//                                 </div>

//                                 {/* Price Adjustment Type */}
//                                 <div>
//                                     <label className="block text-sm text-gray-600 mb-2 text-right">
//                                         {networkDictionary.selectPriceType || 'نوع تغییر قیمت'}
//                                     </label>
//                                     <div className="relative">
//                                         <Controller
//                                             name="price_adjust_type"
//                                             control={editMemberFormProps.control}
//                                             render={({ field }) => (
//                                                 <SelectBox
//                                                     id="edit_price_adjust_type"
//                                                     name={field.name}
//                                                     placeholder={networkDictionary.selectPriceAdjustment}
//                                                     options={priceAdjustTypeOptions}
//                                                     value={
//                                                         priceAdjustTypeOptions.find(
//                                                             (option) => option.value === field.value
//                                                         ) || null
//                                                     }
//                                                     onChange={(selected) => {
//                                                         field.onChange(selected ? selected.value : '');
//                                                     }}
//                                                 />
//                                             )}
//                                         />
//                                         <Icon name="chevron-down" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
//                                     </div>
//                                 </div>

//                                 {/* Price Adjustment Mode */}
//                                 <div>
//                                     <label className="block text-sm text-gray-600 mb-2 text-right">
//                                         {networkDictionary.selectPriceMode || 'حالت تغییر قیمت'}
//                                     </label>
//                                     <div className="relative">
//                                         <Controller
//                                             name="price_adjust_mode"
//                                             control={editMemberFormProps.control}
//                                             render={({ field }) => (
//                                                 <SelectBox
//                                                     id="edit_price_adjust_mode"
//                                                     name={field.name}
//                                                     placeholder={networkDictionary.selectPriceMode}
//                                                     options={priceAdjustModeOptions}
//                                                     value={
//                                                         priceAdjustModeOptions.find(
//                                                             (option) => option.value === field.value
//                                                         ) || null
//                                                     }
//                                                     onChange={(selected) => {
//                                                         field.onChange(selected ? selected.value : '');
//                                                     }}
//                                                 />
//                                             )}
//                                         />
//                                         <Icon name="chevron-down" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
//                                     </div>
//                                 </div>

//                                 {/* Price Adjustment Value */}
//                                 <div>
//                                     <label className="block text-sm text-gray-600 mb-2 text-right">
//                                         {networkDictionary.priceAdjustValue}
//                                     </label>
//                                     <Controller
//                                         name="price_adjust_value"
//                                         control={editMemberFormProps.control}
//                                         render={({ field }) => (
//                                             <Input
//                                                 id="edit_price_adjust_value"
//                                                 type="number"
//                                                 placeholder={networkDictionary.enterPriceValue}
//                                                 className="font-normal text-sm bg-white rounded-xl ltr"
//                                                 hasError={editMemberFormProps.formState.errors.price_adjust_value?.message != null}
//                                                 errorMessage={editMemberFormProps.formState.errors.price_adjust_value?.message}
//                                                 {...field}
//                                                 onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
//                                                 value={field.value || 0}
//                                             />
//                                         )}
//                                     />
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Submit Button - Fixed at Bottom */}
//                         <div className="sticky bottom-0 bg-white px-5 py-4 border-t border-gray-100">
//                             <Button
//                                 fullWidth
//                                 size="medium"
//                                 className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3.5 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                                 onClick={editMemberFormProps.handleSubmit(handleUpdateMember)}
//                                 disabled={editLoading}
//                             >
//                                 {editLoading ? (
//                                     <div className="flex items-center justify-center gap-2">
//                                         <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                         </svg>
//                                         <span>{networkDictionary.updating}</span>
//                                     </div>
//                                 ) : (
//                                     networkDictionary.updateMember
//                                 )}
//                             </Button>
//                         </div>
//                     </div>

//                     {/* CSS Animation */}
//                     <style jsx>{`
//                         @keyframes slideUp {
//                             from {
//                                 transform: translateY(100%);
//                             }
//                             to {
//                                 transform: translateY(0);
//                             }
//                         }
//                     `}</style>
//                 </>
//             )}

//             {/* Edit Member Dialog */}
//             {isOpenEditDialog && selectedMember && (
//                 <>
//                     {/* Backdrop */}
//                     <div
//                         className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-300"
//                         onClick={() => setIsOpenEditDialog(false)}
//                     />

//                     {/* Dialog - Centered */}
//                     <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl shadow-2xl z-50 w-[90%] max-w-sm animate-fadeIn">
//                         {/* Header with Member Info */}


//                         {/* Action Buttons */}
//                         <div className="px-5 pb-6">
//                             <div className="flex flex-col gap-3">
//                                 {/* Credit or Debit */}
//                                 <button
//                                     onClick={handleCreditDebit}
//                                     className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 active:bg-gray-100 transition-colors border border-gray-200"
//                                 >
//                                     <div className="flex items-center gap-3">
//                                         <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl flex items-center justify-center">
//                                             <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                                 <path d="M12.5 13.75H7.5C6.83696 13.75 6.20107 13.4866 5.73223 13.0178C5.26339 12.5489 5 11.913 5 11.25V6.25C5 5.58696 5.26339 4.95107 5.73223 4.48223C6.20107 4.01339 6.83696 3.75 7.5 3.75H12.5C13.163 3.75 13.7989 4.01339 14.2678 4.48223C14.7366 4.95107 15 5.58696 15 6.25V11.25C15 11.913 14.7366 12.5489 14.2678 13.0178C13.7989 13.4866 13.163 13.75 12.5 13.75Z" stroke="#8576FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                                                 <path d="M10 10.625C10.6904 10.625 11.25 10.0654 11.25 9.375C11.25 8.68464 10.6904 8.125 10 8.125C9.30964 8.125 8.75 8.68464 8.75 9.375C8.75 10.0654 9.30964 10.625 10 10.625Z" stroke="#8576FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                                                 <path d="M7.5 3.75V1.875M12.5 3.75V1.875" stroke="#8576FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                                             </svg>
//                                         </div>
//                                         <span className="font-medium text-gray-800 text-sm">
//                                             {networkDictionary.credit_or_debit || 'واریز / برداشت وجه'}
//                                         </span>
//                                     </div>
//                                     <Icon name="chevron-left" className="text-gray-400" size={16} />
//                                 </button>

//                                 {/* View Transactions */}
//                                 <button
//                                     onClick={handleViewTransactionsAction}
//                                     className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 active:bg-gray-100 transition-colors border border-gray-200"
//                                 >
//                                     <div className="flex items-center gap-3">
//                                         <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center">
//                                             <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                                 <path d="M15 9.16667H5C3.61917 9.16667 2.5 10.2858 2.5 11.6667V15.8333C2.5 17.2142 3.61917 18.3333 5 18.3333H15C16.3808 18.3333 17.5 17.2142 17.5 15.8333V11.6667C17.5 10.2858 16.3808 9.16667 15 9.16667Z" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                                                 <path d="M5.83333 9.16667V5.83333C5.83333 4.72827 6.27232 3.66846 7.05372 2.88706C7.83512 2.10565 8.89493 1.66667 10 1.66667C11.1051 1.66667 12.1649 2.10565 12.9463 2.88706C13.7277 3.66846 14.1667 4.72827 14.1667 5.83333V9.16667" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                                                 <path d="M10 14.1667V16.6667" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                                             </svg>
//                                         </div>
//                                         <span className="font-medium text-gray-800 text-sm">
//                                             {networkDictionary.viewTransaction || 'مشاهده تراکنش‌ها'}
//                                         </span>
//                                     </div>
//                                     <Icon name="chevron-left" className="text-gray-400" size={16} />
//                                 </button>

//                                 {/* Disable Account Button */}
//                                 <button
//                                     onClick={handleDisableMember}
//                                     className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 active:bg-gray-100 transition-colors border border-gray-200"
//                                 >
//                                     <div className="flex items-center gap-3">
//                                         <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-50 rounded-xl flex items-center justify-center">
//                                             <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                                 <path d="M12.5 7.5L7.5 12.5M7.5 7.5L12.5 12.5M18.3333 10C18.3333 14.6024 14.6024 18.3333 10 18.3333C5.39763 18.3333 1.66667 14.6024 1.66667 10C1.66667 5.39763 5.39763 1.66667 10 1.66667C14.6024 1.66667 18.3333 5.39763 18.3333 10Z" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                                             </svg>
//                                         </div>
//                                         <span className="font-medium text-gray-800 text-sm">
//                                             {networkDictionary.disableAccount || 'غیرفعال کردن حساب'}
//                                         </span>
//                                     </div>
//                                     <Icon name="chevron-left" className="text-gray-400" size={16} />
//                                 </button>
//                             </div>

//                             {/* Close Button */}
//                             <button
//                                 onClick={() => setIsOpenEditDialog(false)}
//                                 className="w-full mt-6 py-3.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg transition-all active:scale-[0.98]"
//                             >
//                                 {networkDictionary.close || 'بستن'}
//                             </button>
//                         </div>
//                     </div>

//                     {/* CSS Animation */}
//                     <style jsx>{`
//                         @keyframes fadeIn {
//                             from {
//                                 opacity: 0;
//                                 transform: translate(-50%, -50%) scale(0.95);
//                             }
//                             to {
//                                 opacity: 1;
//                                 transform: translate(-50%, -50%) scale(1);
//                             }
//                         }
//                         .animate-fadeIn {
//                             animation: fadeIn 0.2s ease-out;
//                         }
//                     `}</style>
//                 </>
//             )}

//             {/* NEW: Transactions Modal */}
//             {isOpenTransactionsModal && selectedMember && (
//                 <>
//                     {/* Backdrop */}
//                     <div
//                         className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
//                         onClick={() => setIsOpenTransactionsModal(false)}
//                     />

//                     {/* Bottom Sheet */}
//                     <div
//                         className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 transition-transform duration-300 ease-out"
//                         style={{
//                             maxHeight: '90vh',
//                             animation: 'slideUp 0.3s ease-out'
//                         }}
//                     >
//                         {/* Header */}
//                         <div className="px-5 pt-6 pb-4 border-b border-gray-100">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <h2 className="text-lg font-semibold text-gray-800">
//                                         {networkDictionary.transactionsHistory || 'تاریخچه تراکنش‌ها'}
//                                     </h2>
//                                     <p className="text-gray-500 text-sm mt-1">
//                                         {selectedMember.first_name} {selectedMember.last_name}
//                                     </p>
//                                 </div>
//                                 <button
//                                     onClick={() => setIsOpenTransactionsModal(false)}
//                                     className="text-gray-400 hover:text-gray-600"
//                                 >
//                                     <Icon name="x" size={20} />
//                                 </button>
//                             </div>
//                         </div>




//                     </div>

//                     {/* CSS Animation */}
//                     <style jsx>{`
//                         @keyframes slideUp {
//                             from {
//                                 transform: translateY(100%);
//                             }
//                             to {
//                                 transform: translateY(0);
//                             }
//                         }
//                     `}</style>
//                 </>
//             )}

//             {/* NEW: Credit/Debit Modal (Based on the image) */}
//             {isOpenCreditDebitModal && selectedMember && (
//                 <>
//                     {/* Backdrop */}
//                     <div
//                         className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
//                         onClick={() => setIsOpenCreditDebitModal(false)}
//                     />

//                     {/* Bottom Sheet */}
//                     <div
//                         className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 transition-transform duration-300 ease-out"
//                         style={{
//                             maxHeight: '90vh',
//                             animation: 'slideUp 0.3s ease-out'
//                         }}
//                     >
//                         {/* Header */}
//                         <div className="px-5 pt-6 pb-4 border-b border-gray-100">
//                             <div className="flex items-center justify-between">
//                                 <h2 className="text-lg font-semibold text-gray-800">
//                                     {networkDictionary.changeAccountBalance || 'تغییر موجودی حساب'}
//                                 </h2>
//                                 <button
//                                     onClick={() => setIsOpenCreditDebitModal(false)}
//                                     className="text-gray-400 hover:text-gray-600"
//                                 >
//                                     <Icon name="x" size={20} />
//                                 </button>
//                             </div>
//                             <p className="text-gray-500 text-sm mt-1">
//                                 {selectedMember.first_name} {selectedMember.last_name}
//                             </p>
//                         </div>

//                         {/* Form Content */}
//                         <div className="overflow-y-auto px-5 py-6" style={{ maxHeight: 'calc(90vh - 200px)' }}>
//                             <div className="flex flex-col gap-y-4">
//                                 {/* Transaction Type Selection (Radio buttons like in the image) */}
//                                 <div className="mb-2">
//                                     <label className="block text-sm text-gray-600 mb-3 text-right">
//                                         {networkDictionary.selectTransactionType || 'انتخاب نوع تراکنش'}
//                                     </label>
//                                     <div className="flex flex-col gap-2">
//                                         {/* Credit Option */}
//                                         <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
//                                             <div className="relative">
//                                                 <input
//                                                     type="radio"
//                                                     name="transaction_type"
//                                                     value="credit"
//                                                     checked={creditDebitFormProps.watch('transaction_type') === 'credit'}
//                                                     onChange={(e) => creditDebitFormProps.setValue('transaction_type', e.target.value)}
//                                                     className="sr-only"
//                                                 />
//                                                 <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${creditDebitFormProps.watch('transaction_type') === 'credit' ? 'border-green-500' : 'border-gray-300'}`}>
//                                                     {creditDebitFormProps.watch('transaction_type') === 'credit' && (
//                                                         <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                             <div className="flex-1">
//                                                 <span className="font-medium text-gray-800 text-sm">
//                                                     {networkDictionary.credit || 'واریز وجه به حساب کاربر'}
//                                                 </span>
//                                             </div>
//                                         </label>

//                                         {/* Debit Option */}
//                                         <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
//                                             <div className="relative">
//                                                 <input
//                                                     type="radio"
//                                                     name="transaction_type"
//                                                     value="debit"
//                                                     checked={creditDebitFormProps.watch('transaction_type') === 'debit'}
//                                                     onChange={(e) => creditDebitFormProps.setValue('transaction_type', e.target.value)}
//                                                     className="sr-only"
//                                                 />
//                                                 <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${creditDebitFormProps.watch('transaction_type') === 'debit' ? 'border-red-500' : 'border-gray-300'}`}>
//                                                     {creditDebitFormProps.watch('transaction_type') === 'debit' && (
//                                                         <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                             <div className="flex-1">
//                                                 <span className="font-medium text-gray-800 text-sm">
//                                                     {networkDictionary.debit || 'برداشت وجه از حساب کاربر'}
//                                                 </span>
//                                             </div>
//                                         </label>
//                                     </div>
//                                 </div>

//                                 {/* Amount Input */}
//                                 <div>
//                                     <label className="block text-sm text-gray-600 mb-2 text-right">
//                                         {networkDictionary.amount || 'مبلغ'}
//                                     </label>
//                                     <div className="relative">
//                                         <input
//                                             type="number"
//                                             placeholder={networkDictionary.enterAmount || 'مبلغ مورد نظر را وارد کنید'}
//                                             className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 font-normal text-sm ltr text-left placeholder:text-right"
//                                             value={creditDebitFormProps.watch('amount')}
//                                             onChange={(e) => creditDebitFormProps.setValue('amount', e.target.value)}
//                                             min="0"
//                                             step="0.01"
//                                         />
//                                         <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
//                                             ریال
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Reason Input */}
//                                 <div>
//                                     <label className="block text-sm text-gray-600 mb-2 text-right">
//                                         {networkDictionary.reason || 'علت'}
//                                     </label>
//                                     <textarea
//                                         placeholder={networkDictionary.enterReason || 'علت واریز/برداشت وجه را وارد کنید'}
//                                         className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 font-normal text-sm placeholder-gray-400 resize-none"
//                                         rows={3}
//                                         value={creditDebitFormProps.watch('reason')}
//                                         onChange={(e) => creditDebitFormProps.setValue('reason', e.target.value)}
//                                     />
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Submit Button - Fixed at Bottom */}
//                         <div className="sticky bottom-0 bg-white px-5 py-4 border-t border-gray-100">
//                             <Button
//                                 fullWidth
//                                 size="medium"
//                                 className={`font-semibold py-3.5 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${creditDebitFormProps.watch('transaction_type') === 'credit' ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}
//                                 onClick={creditDebitFormProps.handleSubmit(handleSubmitCreditDebit)}
//                                 disabled={creditDebitLoading || !creditDebitFormProps.watch('amount')}
//                             >
//                                 {creditDebitLoading ? (
//                                     <div className="flex items-center justify-center gap-2">
//                                         <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                         </svg>
//                                         <span>{networkDictionary.processing || 'در حال پردازش...'}</span>
//                                     </div>
//                                 ) : (
//                                     creditDebitFormProps.watch('transaction_type') === 'credit'
//                                         ? networkDictionary.confirmCredit || 'تایید و واریز'
//                                         : networkDictionary.confirmDebit || 'تایید و برداشت'
//                                 )}
//                             </Button>
//                         </div>
//                     </div>

//                     {/* CSS Animation */}
//                     <style jsx>{`
//                         @keyframes slideUp {
//                             from {
//                                 transform: translateY(100%);
//                             }
//                             to {
//                                 transform: translateY(0);
//                             }
//                         }
//                     `}</style>
//                 </>
//             )}

//             {/* Success Modal */}
//             <Modal
//                 isOpen={isOpenSuccessModal}
//                 onClose={() => setIsOpenSuccessModal(false)}
//                 autoClose={false}
//                 footer={
//                     <div className="px-5 pb-6 pt-1">
//                         <div className="w-full">
//                             <Button
//                                 size="xs"
//                                 variant="contained"
//                                 color="success"
//                                 className="w-full"
//                                 onClick={() => setIsOpenSuccessModal(false)}
//                             >
//                                 {generalDictionary.close || 'بستن'}
//                             </Button>
//                         </div>
//                     </div>
//                 }
//             >
//                 <div className="px-5 py-6">
//                     <div className="flex flex-col items-center gap-y-7">
//                         <div className="w-[5.3rem]">
//                             <img src="/assets/images/misc/icon-successful.png" alt="" />
//                         </div>
//                         <div className="text-[var(--color-success)] font-semibold text-center">
//                             <p>{modalMessage}</p>
//                         </div>
//                     </div>
//                 </div>
//             </Modal>

//             {/* Error Modal */}
//             <Modal
//                 isOpen={isOpenErrorModal}
//                 onClose={() => setIsOpenErrorModal(false)}
//                 autoClose={false}
//                 footer={
//                     <div className="px-5 pb-6 pt-1">
//                         <div className="w-full">
//                             <Button
//                                 size="xs"
//                                 variant="contained"
//                                 color="danger"
//                                 className="w-full"
//                                 onClick={() => setIsOpenErrorModal(false)}
//                             >
//                                 {generalDictionary.close || 'بستن'}
//                             </Button>
//                         </div>
//                     </div>
//                 }
//             >
//                 <div className="px-5 py-6">
//                     <div className="flex flex-col items-center gap-y-7">
//                         <div className="w-[5.3rem]">
//                             <img src="/assets/images/misc/icon-failure.png" alt="" />
//                         </div>
//                         <div className="text-[var(--color-error)] font-semibold text-center">
//                             <p>{modalMessage}</p>
//                         </div>
//                     </div>
//                 </div>
//             </Modal>

//             {/* Deactivation Confirmation Modal */}
//             {isOpenDeactivateConfirm && selectedMember && (
//                 <>
//                     {/* Backdrop */}
//                     <div
//                         className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
//                         onClick={handleCancelDeactivate}
//                     />

//                     {/* Confirmation Dialog */}
//                     <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl shadow-2xl z-50 w-[90%] max-w-sm animate-fadeIn">
//                         {/* Header */}
//                         <div className="px-5 pt-6 pb-4">
//                             <div className="text-center">
//                                 <h3 className="text-lg font-semibold text-gray-800 mb-2">
//                                     {generalDictionary.confirm}
//                                 </h3>
//                                 <p className="text-gray-600 text-sm">
//                                     {networkDictionary.deactivateConfirmationMessage || `${selectedMember.first_name} ${selectedMember.last_name} مطمئن هستید؟`}
//                                 </p>
//                             </div>
//                         </div>

//                         {/* Action Buttons */}
//                         <div className="px-5 pb-6">
//                             <div className="flex flex-row gap-3">
//                                 {/* Cancel Button */}
//                                 <button
//                                     onClick={handleCancelDeactivate}
//                                     disabled={deactivateLoading}
//                                     className="w-full py-3.5 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 font-semibold rounded-2xl shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
//                                 >
//                                     {generalDictionary.cancel}
//                                 </button>

//                                 {/* Confirm Deactivate Button */}
//                                 <button
//                                     onClick={handleConfirmDeactivate}
//                                     disabled={deactivateLoading}
//                                     className="w-full py-3.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-2xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                                 >
//                                     {deactivateLoading ? (
//                                         <>
//                                             <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                             </svg>
//                                             <span>{networkDictionary.processing || 'در حال پردازش...'}</span>
//                                         </>
//                                     ) : (
//                                         generalDictionary.confirm
//                                     )}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>

//                     {/* CSS Animation */}
//                     <style jsx>{`
//                         @keyframes fadeIn {
//                             from {
//                                 opacity: 0;
//                                 transform: translate(-50%, -50%) scale(0.95);
//                             }
//                             to {
//                                 opacity: 1;
//                                 transform: translate(-50%, -50%) scale(1);
//                             }
//                         }
//                         .animate-fadeIn {
//                             animation: fadeIn 0.2s ease-out;
//                         }
//                     `}</style>
//                 </>
//             )}
//         </>
//     );
// }