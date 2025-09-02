'use client';

import PageWrapper from '@/components/core/PageWrapper';
import { Input } from '@/components/core/Form';
import { Button } from '@/components/core/Button';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginWithUsernameSchema } from '@/validation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createFormData, getLocalizedUrl } from '@/utils';
import useAuthStore from '@/store/useAuthStore';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { LoginRequest } from '@/server/auth';
import { apiPathConfig, routeList, type Locale } from '@/config';
import { showRequestError } from '@/utils/handle-request-error';
import { useSettings } from '@/components/core/hooks/useSettings';
import { useActiveRouteStore } from '@/store/useActiveRouteStore';

const loginRequest = new LoginRequest({
  url: apiPathConfig.login,
  method: 'POST',
});

export default function LoginPage() {
  const router = useRouter();
  const { lang: locale } = useParams();
  const searchParams = useSearchParams();
  const {
    settings: { dictionary },
  } = useSettings();

  const useFormProps = useForm({
    resolver: yupResolver(loginWithUsernameSchema),
    mode: 'onBlur',
  });

  const generalDictionary = dictionary.general;

  const login = useAuthStore((state) => state.login);
  const setActiveRoute = useActiveRouteStore((state) => state.setActiveRoute);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = useFormProps.handleSubmit(async (data) => {
    const { username, password } = data;

    setIsLoading(true);

    try {
      loginRequest.options.body = createFormData({
        email_or_mobile: username,
        password,
      });

      const loggedInData = await loginRequest.login();
      const tokenParts = loggedInData.token.split('Bearer ');

      if (tokenParts.length === 2) {
        loggedInData.token = tokenParts[1];
      }

      await login(loggedInData.token, loggedInData.profile[0]);

      localStorage.setItem('userData', JSON.stringify(loggedInData));

      const redirectURL = searchParams.get('redirectTo') ?? routeList.home.path;
      router.replace(getLocalizedUrl(redirectURL, locale as Locale));
    } catch (error: unknown) {
      showRequestError(error);
    }

    setIsLoading(false);
  });

  useEffect(() => {
    setActiveRoute(routeList.login);

    return () => {
      setActiveRoute(null);
    };
  }, []);

  return (
    <PageWrapper name="login" isContainer={true}>
      <div className="min-h-[--full-height] flex flex-col justify-center items-center py-4">
        <div className="flex flex-col justify-center items-center md:border border-gray-200 md:p-8 rounded-lg">
          <div className="max-w-[18rem] select-none pointer-events-none">
            <img src="/assets/images/auth/login.png" alt="" />
          </div>

          <div className="mt-4 text-center">
            <div className="text-xl font-semibold">
              <h1>{generalDictionary.login}</h1>
            </div>

            <div className="text-muted mt-1 text-xs">
              <p>{generalDictionary.enterYourInfo}</p>
            </div>
          </div>

          <div className="mt-4 w-full">
            <form onSubmit={(e) => e.preventDefault}>
              <div className="flex flex-col gap-3">
                <Controller
                  name='username'
                  control={useFormProps.control}
                  render={({ field }) => (
                    <Input
                      id='username'
                      type='text'
                      placeholder={generalDictionary.emailOrPhone}
                      hasError={useFormProps.formState.errors.username != null}
                      errorMessage={dictionary.general[useFormProps.formState.errors['username']?.message as keyof typeof dictionary.general]}
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
              <div className="flex justify-end text-xs text-muted mt-3">
                <p>
                  {generalDictionary['forgotPassword?']} <Link href="#">{generalDictionary.passwordRecovery}</Link>
                </p>
              </div>
              <div className="mt-5">
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="medium"
                  loading={isLoading}
                  onClick={onSubmit}
                  type="submit"
                >
                  {generalDictionary.login}
                </Button>
              </div>
              <div className="flex justify-center text-center text-xs text-muted mt-5">
                <p>
                  {generalDictionary.haveNotRegistered}{' '}
                  <Link href={getLocalizedUrl(routeList.register.path, locale as Locale)}>
                    {generalDictionary.register}
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
