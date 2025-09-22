'use client';

import { useEffect, useState } from 'react';
import PageWrapper from '@/components/core/PageWrapper';
import Header from '@/components/shared/Header';
import { useSettings } from '@/components/core/hooks/useSettings';
import { useActiveRouteStore } from '@/store/useActiveRouteStore';
import { routeList } from '@/config';
import { PagesRequest } from '@/server/page';
import { PageItemDataType } from '@/types/page';
import { apiPathConfig } from '@/config';
import { useParams } from 'next/navigation';

export default function Help() {
  const {
    settings: { dictionary },
  } = useSettings();

  const setActiveRoute = useActiveRouteStore((state) => state.setActiveRoute);
  const [pageData, setPageData] = useState<PageItemDataType>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams(); // 👈 get route params
  const lang = params?.lang as string; // "en", "fa", "ps" etc.

  useEffect(() => {
    setActiveRoute(routeList.pages.subPathList.rules);

    // Fetch page data
    const fetchPageData = async () => {
      try {
        setLoading(true);
        const pagesRequest = new PagesRequest({
          url: apiPathConfig.pages.details,
        });

        const response = await pagesRequest.getPageDetails('Help', lang);

        setPageData(response?.item);
        // This won't show the updated value immediately!
      } catch (err) {
        console.error('Error fetching page data:', err);
        setError('Failed to load content');
      } finally {
        setLoading(false);
      }
    };
    fetchPageData();

    return () => {
      setActiveRoute(null);
    };
  }, []);

  useEffect(() => {
    console.log('pageData updated:', pageData);
  }, [pageData]); // This will run whenever pageData changes

  return (
    <PageWrapper name="rules">
      <Header title={pageData?.title} minHeight="10.5rem" overlayOpacity={0.1} />
      <div className="container-fluid">
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {error && <div className="flex justify-center items-center h-64 text-error">{error}</div>}

        {!loading && !error && pageData && (
          <>
            {pageData.image && (
              <div className="flex justify-center select-none mb-6">
                <div className="max-w-[8.5rem]">
                  <img src={pageData.image} alt={pageData.title} />
                </div>
              </div>
            )}

            <div className="entry-content">
              <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
            </div>
          </>
        )}
      </div>
    </PageWrapper>
  );
}
