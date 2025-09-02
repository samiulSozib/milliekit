import { Spinner } from '@/components/core/Spinner';

export default function GlobalLoading() {
  return (
    <div className="p-6 text-primary text-[2.3rem]">
      <Spinner center turbo />
    </div>
  );
}
