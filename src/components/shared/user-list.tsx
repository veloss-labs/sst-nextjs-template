'use client';
import React, { useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import useIsHydrating from '~/libs/hooks/useIsHydrating';
import { getTargetElement } from '~/libs/browser/dom';
import { api } from '~/services/trpc/react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import UserItem from '~/components/shared/user-item';

interface UserListProps {
  initialData?: any;
  keyword?: string;
}

const CLIENT_LIMIT_SIZE = 30;
const CLIENT_DATA_OVERSCAN = 10;

const getCursorLimit = (searchParams: URLSearchParams) => ({
  start: Number(searchParams.get('start') || '0'),
  cursor: searchParams.get('cursor') || null,
  limit: Number(searchParams.get('limit') || CLIENT_LIMIT_SIZE.toString()),
});

export default function UserList({ keyword, initialData }: UserListProps) {
  const total = initialData?.totalCount;
  const seachParams = useSearchParams();
  const hydrating = useIsHydrating('[data-hydrating-signal]');

  const [data, { fetchNextPage, hasNextPage, isFetchingNextPage }] =
    api.users.getSearchUsers.useSuspenseInfiniteQuery(
      {
        keyword,
      },
      {
        initialData: () => {
          if (initialData) {
            return {
              pageParams: [undefined],
              pages: [initialData],
            };
          }
        },
        getNextPageParam: (lastPage) => {
          return lastPage?.hasNextPage && lastPage?.endCursor
            ? lastPage?.endCursor
            : null;
        },
      },
    );

  const totalCount = data?.pages?.at(0)?.totalCount ?? 0;
  const flatList = data?.pages?.map((page) => page?.list).flat() ?? [];

  const { start, cursor, limit } = getCursorLimit(seachParams);
  const [initialStart] = useState(() => start);
  const isMountedRef = useRef(false);

  const $list = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useWindowVirtualizer({
    count: total ?? totalCount,
    estimateSize: () => 40,
    overscan: CLIENT_DATA_OVERSCAN,
    scrollMargin: getTargetElement($list)?.offsetTop ?? 0,
    initialRect: {
      width: 0,
      height: 400,
    },
  });

  const virtualizerList = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    const [lastItem] = [...virtualizerList].reverse();

    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= flatList.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    hasNextPage,
    fetchNextPage,
    flatList.length,
    isFetchingNextPage,
    virtualizerList,
  ]);

  return (
    <div ref={$list}>
      <div className="relative w-full space-y-6">
        {virtualizerList.map((virtualRow) => {
          const isLoaderRow = virtualRow.index > flatList.length - 1;
          const item = flatList.at(virtualRow.index);
          if (!item) {
            return null;
          }

          if (isLoaderRow) {
            return (
              <div
                key={`items:loading:${item.id}`}
                style={{
                  height: virtualRow.size,
                  position: 'absolute',
                  top: virtualRow.start,
                  left: 0,
                  right: 0,
                }}
              >
                <div className="flex h-full items-center justify-center">
                  <div className="text-gray-500">Loading...</div>
                </div>
              </div>
            );
          }

          return <UserItem key={`items:${item.id}`} item={item} />;
        })}
      </div>
    </div>
  );
}