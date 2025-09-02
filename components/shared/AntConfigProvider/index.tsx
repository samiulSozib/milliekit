import '@ant-design/v5-patch-for-react-19';
import { ConfigProvider } from 'antd';

type AntConfigProviderPropsType = {
  children: React.ReactNode;
  color?: `#${string}` | `var(--${string})`;
  fontFamily?: `var(--${string})`;
};

export default function AntConfigProvider({
  children,
  color = '#00ab55',
  fontFamily = 'var(--font-primary)',
}: AntConfigProviderPropsType) {
  return (
    <ConfigProvider
      direction="rtl"
      theme={{
        token: {
          fontFamily,
          colorPrimary: color,
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
