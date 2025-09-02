'use client';

import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';

import PageWrapper from '@/components/core/PageWrapper';
import { Button } from '@/components/core/Button';
import { Controller, useForm } from 'react-hook-form';
import { Input } from '@/components/core/Form';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { getLocalizedUrl } from '@/utils/i18n';
import { useSettings } from '@/components/core/hooks/useSettings';
import { apiPathConfig, routeList } from '@/config';
import { useActiveRouteStore } from '@/store/useActiveRouteStore';
import { RegisterRequest } from '@/server/auth';
import { registerFormSchema } from '@/validation';
import { createFormData, parseJson } from '@/utils';
import { showRequestError } from '@/utils/handle-request-error';

import type { Locale } from '@/config/i18n';

const registerRequest = new RegisterRequest({
  url: apiPathConfig.register,
  method: 'POST',
});

export default function RegisterPage() {
  const useFormProps = useForm({
    resolver: yupResolver(registerFormSchema),
    mode: 'onBlur',
    reValidateMode: 'onSubmit'
  });

  const { lang: locale } = useParams();
  const {
    settings: { dictionary },
  } = useSettings();

  const setActiveRoute = useActiveRouteStore((state) => state.setActiveRoute);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const generalDictionary = dictionary.general;

  useEffect(() => {
    setActiveRoute(routeList.register);

    return () => {
      setActiveRoute(null);
    };
  }, []);

  const onSubmit = useFormProps.handleSubmit(async (data) => {
    try {
      registerRequest.options.body = createFormData(data);

      await registerRequest.register();
      
      router.replace(getLocalizedUrl(routeList.login.path, locale as Locale));
      toast.success(generalDictionary.registerSuccess);
    } catch (error: unknown) {
      if (error instanceof Error && error.cause === 422) {
        const fieldsErrorRecord = parseJson<Record<string, string>>(error.message) ?? {};
        Object.entries(fieldsErrorRecord).forEach(([key, value]) => {
          toast.error(value);
        });

        return;
      }

      showRequestError(error);
    }
  });

  return (
    <PageWrapper name="login" isContainer={true}>
      <div className="min-h-[--full-height] flex flex-col justify-center items-center py-4">
        <div className="flex flex-col justify-center items-center md:border border-gray-200 md:p-8 rounded-lg">
          <div className="max-w-[18rem] select-none pointer-events-none">
            <img src="/assets/images/auth/register.png" alt="" />
          </div>

          <div className="mt-4 text-center">
            <div className="text-xl font-semibold">
              <h1>{generalDictionary.register}</h1>
            </div>

            <div className="text-muted mt-1 text-xs">
              <p>{generalDictionary.enterYourInfo}</p>
            </div>
          </div>

          <div className="mt-4 w-full">
            <form onSubmit={(e) => e.preventDefault}>
              <div className="flex flex-col gap-3">
                <Controller
                  name='first_name'
                  control={useFormProps.control}
                  render={({ field }) => (
                    <Input
                      id='first_name'
                      type='text'
                      placeholder={generalDictionary.firstName}
                      hasError={useFormProps.formState.errors.first_name != null}
                      errorMessage={dictionary.general[useFormProps.formState.errors['first_name']?.message as keyof typeof dictionary.general]}
                      ltr
                      {...field}
                    />
                  )}
                />
                <Controller
                  name='last_name'
                  control={useFormProps.control}
                  render={({ field }) => (
                    <Input
                      id='last_name'
                      type='text'
                      placeholder={generalDictionary.lastName}
                      hasError={useFormProps.formState.errors.last_name != null}
                      errorMessage={dictionary.general[useFormProps.formState.errors['last_name']?.message as keyof typeof dictionary.general]}
                      ltr
                      {...field}
                    />
                  )}
                />
                <Controller
                  name='email'
                  control={useFormProps.control}
                  render={({ field }) => (
                    <Input
                      id='email'
                      type='text'
                      placeholder={generalDictionary.email}
                      hasError={useFormProps.formState.errors.email != null}
                      errorMessage={dictionary.general[useFormProps.formState.errors['email']?.message as keyof typeof dictionary.general]}
                      ltr
                      {...field}
                    />
                  )}
                />
                <Controller
                  name='mobile'
                  control={useFormProps.control}
                  render={({ field }) => (
                    <Input
                      id='mobile'
                      type='tel'
                      placeholder={generalDictionary.phoneNumber}
                      hasError={useFormProps.formState.errors.mobile != null}
                      errorMessage={dictionary.general[useFormProps.formState.errors['mobile']?.message as keyof typeof dictionary.general]}
                      ltr
                      {...field}
                    />
                  )}
                />
                <Controller
                  name='password'
                  control={useFormProps.control}
                  render={({ field }) => (
                    <Input
                      id='password'
                      type='password'
                      placeholder={generalDictionary.password}
                      hasError={useFormProps.formState.errors.password != null}
                      errorMessage={dictionary.general[useFormProps.formState.errors['password']?.message as keyof typeof dictionary.general]}
                      ltr
                      {...field}
                    />
                  )}
                />
              </div>
              <div className="mt-5">
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  fullWidth={true}
                  loading={isLoading}
                  onClick={onSubmit}
                  disabled={useFormProps.formState.isValid === false}
                  type="submit"
                >
                  {generalDictionary.register}
                </Button>
              </div>
              <div className="flex justify-center text-center text-xs text-muted mt-5">
                <p>
                  {generalDictionary.alreadyRegistered}{' '}
                  <Link href={getLocalizedUrl(routeList.login.path, locale as Locale)}>
                    {generalDictionary.login}
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
