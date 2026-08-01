/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import {
  CONTACT_QUERY_STATUS,
  CONTACT_QUERY_TYPES,
  SORT_MAP,
} from '@beautinique/frontend-constants';
import type { IListContactQueriesQuery } from '@beautinique/frontend-types';
import { isNullOrUndefined } from '@beautinique/shared-utils';
import { Icon } from '@iconify/react';
import { Fragment, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

import ApiStatus from '@/components/layout/ApiStatus';
import PageWrapper from '@/components/layout/containers/PageWrapper';
import ScrollableGradientContainer from '@/components/layout/containers/ScrollableGradientContainer';
import LoadingText from '@/components/layout/loaders/LoadingText';
import {
  Table,
  TableBody,
  TableHead,
  TableHeadCell,
  TableRow,
  TableRowCell,
} from '@/components/layout/table';
import Select from '@/components/ui/inputs/Select';
import { ENQUIRIES_TABLE_TITLES } from '@/constants/api.constants';
import useQueryParams from '@/hooks/useQueryParams';
import { useGetContactQueries } from '@/services/organization-service/contact.service.query';
import { formatDate } from '@/utils/common.util';

const Enquiries = () => {
  const { ref, inView } = useInView();
  const { queryParams, removeParams, setParams } = useQueryParams();
  const {
    data: enquiries,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isError,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useGetContactQueries({
    queryType: queryParams.queryType as IListContactQueriesQuery['queryType'] | undefined,
    status: queryParams.status?.toUpperCase() as IListContactQueriesQuery['status'] | undefined,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <PageWrapper>
      <div className="">
        <div className="flex gap-4">
          <Select
            key="queryType"
            options={CONTACT_QUERY_TYPES.map((value) => ({ label: value, value }))}
            selectProps={{
              value: queryParams.queryType ?? '',
              onChange: (value) => {
                if (!value) {
                  removeParams(['queryType']);
                } else if (value) {
                  setParams({ queryType: String(value) });
                }
              },
              placeholder: 'Select query type',
            }}
          />
          <Select
            key="status"
            options={CONTACT_QUERY_STATUS.map((value) => ({
              label: value,
              value: value.toLowerCase(),
            }))}
            selectProps={{
              value: queryParams.status ?? '',
              onChange: (value) => {
                if (!value) {
                  removeParams(['status']);
                } else if (value) {
                  setParams({ status: String(value) });
                }
              },
              placeholder: 'Select query status',
            }}
          />
        </div>
        <div className="border-primary/10 bg-secondary-invert overflow-hidden rounded-xl border">
          {!!enquiries?.length && (
            <ScrollableGradientContainer
              direction="horizontal"
              gradientClassNames={{ left: 'from-secondary-invert', right: 'from-secondary-invert' }}
            >
              <Table className="relative text-xs">
                <TableHead>
                  <TableRow>
                    {ENQUIRIES_TABLE_TITLES.map(({ label, sortKey }, index) => (
                      <TableHeadCell
                        key={`th-${String(index)}`}
                        className={`${sortKey ? 'hover:text-primary/90 cursor-pointer select-none' : ''} `}
                        // onClick={() => {
                        //   if (sortKey) handleSort(sortKey);
                        // }}
                      >
                        <div className="flex items-center justify-center gap-1">
                          {label}
                          {sortKey && (
                            <Icon
                              icon={
                                queryParams.sortBy === sortKey
                                  ? queryParams.sortOrder === SORT_MAP.asc
                                    ? 'solar:alt-arrow-up-linear'
                                    : 'solar:alt-arrow-down-linear'
                                  : 'solar:sort-linear'
                              }
                              className="size-3.5 shrink-0"
                            />
                          )}
                        </div>
                      </TableHeadCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {enquiries.map((query, index) => {
                    return (
                      <TableRow
                        key={`${query._id}-${String(index)}`}
                        tabIndex={0}
                        className="border-y-primary/5 odd:bg-primary/5 even:bg-primary/2.5 border-y first:border-t-0 last:border-b-0 [&>td]:px-3 [&>td]:py-2 [&>td]:text-xs"
                        ref={index === enquiries.length - 10 ? ref : undefined}
                      >
                        <TableRowCell>{index + 1}</TableRowCell>
                        <TableRowCell>{query.name}</TableRowCell>
                        <TableRowCell className="uppercase">{query._id}</TableRowCell>
                        <TableRowCell className="max-w-sm truncate text-left">
                          {query.message}
                        </TableRowCell>
                        <TableRowCell>
                          <Link
                            className="text-primary group flex items-center gap-2"
                            to={`mailto:${query.email}`}
                            target="_blank"
                          >
                            <span className="size-4 shrink-0">
                              <Icon
                                icon="solar:reply-linear"
                                className="group-hover:text-blue-crayola-c size-full"
                              />
                            </span>
                            {query.email}
                          </Link>
                        </TableRowCell>
                        <TableRowCell className="text-primary flex items-center gap-1">
                          {!!query.phoneNumber && (
                            <Fragment>
                              <Link target="_blank" to={`https://wa.me/+91${query.phoneNumber}`}>
                                <span className="block size-3.5 shrink-0">
                                  <Icon icon="logos:whatsapp-icon" />
                                </span>
                              </Link>
                              <Link target="_blank" to={`tel:${query.phoneNumber}`}>
                                <span className="block size-3.5 shrink-0">
                                  <Icon
                                    icon="solar:phone-calling-bold-duotone"
                                    className="[&>*:first-child]:text-blue-crayola-c stroke-primary size-full [&>*:first-child]:opacity-100"
                                  />
                                </span>
                              </Link>
                            </Fragment>
                          )}
                          {query.phoneNumber}
                        </TableRowCell>
                        <TableRowCell>{query.queryType}</TableRowCell>
                        <TableRowCell className="first-letter:capitalize">
                          {query.status.toLowerCase()}
                        </TableRowCell>
                        <TableRowCell className="uppercase">
                          {formatDate(query.createdAt, {
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </TableRowCell>
                        <TableRowCell className="uppercase">
                          {!isNullOrUndefined(query.expiresAt)
                            ? formatDate(query.expiresAt, {
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : '-'}
                        </TableRowCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollableGradientContainer>
          )}

          {(isLoading ||
            isFetchingNextPage ||
            isError ||
            // typescript-eslint's no-unnecessary-condition misreads isFetchNextPageError as always
            // falsy for this react-query hook shape, even though tsc confirms it's a real boolean.
            isFetchNextPageError ||
            enquiries?.length === 0) && (
            <div
              className={`flex items-center justify-center ${!isFetchingNextPage ? 'min-h-[40dvh]' : ''}`}
            >
              {isLoading || isFetchingNextPage ? (
                <LoadingText
                  text={isLoading ? 'Loading products...' : 'Loading more products...'}
                  className="my-2"
                />
              ) : (
                <ApiStatus
                  className="min-h-0!"
                  status={isError || isFetchNextPageError ? 'error' : 'empty'}
                  title={
                    isError
                      ? 'Failed to load products'
                      : isFetchNextPageError
                        ? 'Failed to load more products'
                        : 'No products available'
                  }
                  description={
                    isError
                      ? 'Something went wrong while fetching products. Please try again.'
                      : isFetchNextPageError
                        ? 'Something went wrong while fetching more products. Please try again.'
                        : 'No products have been added yet.'
                  }
                />
              )}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Enquiries;
