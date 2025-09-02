'use client';

import { useCallback, useEffect } from 'react';
import PageWrapper from '@/components/core/PageWrapper';
import Header from '@/components/shared/Header';
import { useSettings } from '@/components/core/hooks/useSettings';
import { useActiveRouteStore } from '@/store/useActiveRouteStore';
import { routeList } from '@/config';
import ActionBox from '@/components/shared/ActionBox';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '@/components/core/Form';
import { Button } from '@/components/core/Button';
import Icon from '@/components/core/Icon';
import { faqFilterFormSchema } from '@/validation';
import { SelectBox } from '@/components/core/Form/SelectBox';
import { ISelectBoxOption } from '@/components/core/Form/SelectBox/SelectBox';

export default function FAQ() {
  const {
    settings: { dictionary },
  } = useSettings();

  const generalDictionary = dictionary.general;

  const setActiveRoute = useActiveRouteStore((state) => state.setActiveRoute);

  useEffect(() => {
    setActiveRoute(routeList.pages.subPathList.faq);

    return () => {
      setActiveRoute(null);
    };
  }, []);

  const useFormProps = useForm({
    resolver: yupResolver(faqFilterFormSchema),
    defaultValues: {
      category: null,
      search: null,
    },
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
  });

  const onSubmit = useCallback(() => {}, []);

  const categories = [
    { label: generalDictionary.busTicket, value: 'busTicket' },
    { label: generalDictionary.internetPackage, value: 'internetPackage' },
  ];

  return (
    <PageWrapper name="faq">
      <Header title={dictionary.general.faq} overlayOpacity={0.01} />
      <ActionBox>
        <>
          <div className="flex flex-col gap-y-3">
            <Controller
              name="category"
              control={useFormProps.control}
              render={({ field }) => (
                <SelectBox
                  id="type"
                  className="font-semibold"
                  placeholder={generalDictionary.select}
                  options={categories}
                  {...field}
                  value={null}
                />
              )}
            />
            <Controller
              name="search"
              control={useFormProps.control}
              render={({ field }) => (
                <Input
                  type="text"
                  id="search"
                  placeholder={generalDictionary.search}
                  hasError={useFormProps.formState.errors['search'] != null}
                  errorMessage={
                    generalDictionary[
                      useFormProps.formState.errors['search']?.message as keyof typeof generalDictionary
                    ]
                  }
                  {...field}
                  value={field.value ?? ''}
                  prefixIcon={<Icon name="search" className="text-gray-500" size={18} />}
                  className="font-semibold"
                />
              )}
            />
          </div>

          <div className="mt-4">
            <Button
              size="large"
              color="primary"
              className="w-full shadow-violet"
              onClick={useFormProps.handleSubmit(onSubmit)}
            >
              {generalDictionary.search}
            </Button>
          </div>
        </>
      </ActionBox>
    </PageWrapper>
  );
}
