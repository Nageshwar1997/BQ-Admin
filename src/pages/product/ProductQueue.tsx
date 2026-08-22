import type { TProductStatus } from '@beautinique/frontend-types';
import { useTable } from '@tanstack/react-table';
import { useMemo, useState } from 'react';

import ApiStatus from '@/components/layout/ApiStatus';
import PageWrapper from '@/components/layout/containers/PageWrapper';
import ScrollableGradientContainer from '@/components/layout/containers/ScrollableGradientContainer';
import { ModalWrapper } from '@/components/layout/modals/ModalWrapper';
import {
  Table,
  TableBody,
  TableHead,
  TableHeadCell,
  TableRow,
  TableRowCell,
} from '@/components/layout/table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/inputs/Textarea';
import { APP_TABLE_FEATURES, createAppColumnHelper, toColumn } from '@/constants/table.constants';
import {
  useGetProductQueue,
  useUpdateProductApprovalStatus,
} from '@/services/product-service/product.service.query';
import type { TApiProduct } from '@/types/api.type';
import { formatDate } from '@/utils/common.util';

const STATUS_BADGE_CLASSNAME: Record<TProductStatus, string> = {
  PENDING: 'text-primary-yellow border-primary-yellow/30 bg-primary-yellow/5',
  PUBLISHED: 'text-primary-green border-primary-green/30 bg-primary-green/5',
  REJECTED: 'text-primary-red border-primary-red/30 bg-primary-red/5',
  BLOCKED: 'text-primary-red border-primary-red/30 bg-primary-red/5',
  DELETED: 'text-tertiary border-primary/10 bg-primary/5',
};

const columnHelper = createAppColumnHelper<TApiProduct>();

// -------- Reject Reason Modal (local - one product at a time, not tied to
// the shared `?confirm=` query param since multiple queue rows would collide on it) --------
const RejectProductModal = ({
  product,
  onClose,
}: {
  product: TApiProduct | null;
  onClose: () => void;
}) => {
  const [reason, setReason] = useState('');
  const { mutateAsync, isPending } = useUpdateProductApprovalStatus();

  const handleReject = async () => {
    if (!product || !reason.trim()) return;

    await mutateAsync(
      { productId: product._id, data: { status: 'REJECTED', rejectReason: reason.trim() } },
      {
        onSuccess: () => {
          setReason('');
          onClose();
        },
      },
    );
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <ModalWrapper
      isOpen={!!product}
      onClose={handleClose}
      header={{ title: 'Reject product', showCloseIcon: true }}
      className="max-w-md"
    >
      <div className="flex flex-col gap-4">
        <p className="text-tertiary text-xs sm:text-sm">
          Rejecting <span className="text-primary font-semibold">{product?.title}</span> — this
          reason is shown to the seller.
        </p>
        <Textarea
          label="Reject reason"
          textAreaProps={{
            value: reason,
            onChange: (e) => {
              setReason(e.target.value);
            },
            placeholder: 'Explain why this product is being rejected...',
            disabled: isPending,
          }}
        />
        <Button
          pattern="primary"
          content="Confirm rejection"
          buttonProps={{
            disabled: isPending || !reason.trim(),
            onClick: () => {
              void handleReject();
            },
          }}
          className="bg-primary-red! shadow-none!"
        />
      </div>
    </ModalWrapper>
  );
};

const ProductQueue = () => {
  const [rejectingProduct, setRejectingProduct] = useState<TApiProduct | null>(null);

  const { data: products, isLoading, isError } = useGetProductQueue({ status: 'PENDING' });
  const { mutateAsync: approve, isPending: isApproving } = useUpdateProductApprovalStatus();

  const handleApprove = async (productId: string) => {
    await approve({ productId, data: { status: 'PUBLISHED' } });
  };

  const columns = useMemo(
    () => [
      toColumn(
        columnHelper.display({
          id: 'serial',
          header: () => 'S. No',
          cell: (info) => info.row.index + 1,
        }),
      ),
      toColumn(
        columnHelper.accessor('title', {
          header: () => 'Product',
          cell: (info) => (
            <div className="flex flex-col gap-1 text-left">
              <span className="text-primary font-medium">{info.getValue()}</span>
              <span className="text-tertiary text-[11px]">{info.row.original.brand}</span>
            </div>
          ),
        }),
      ),
      toColumn(
        columnHelper.accessor('sellingPrice', {
          header: () => 'Price',
          cell: (info) => (
            <div className="flex flex-col gap-1 text-left text-xs">
              <span className="text-primary font-medium">₹{info.getValue()}</span>
              {info.row.original.originalPrice !== info.getValue() && (
                <span className="text-tertiary line-through">
                  ₹{info.row.original.originalPrice}
                </span>
              )}
            </div>
          ),
        }),
      ),
      toColumn(
        // Just the seller's user ID (truncated) - product-service has no
        // seller-name field of its own to show, and resolving one would
        // need a cross-service call organization-service, which this
        // codebase's convention rules out (BullMQ jobs only between
        // services, never peer HTTP). Same scope-cut as the ownership
        // middleware/queue filter (Phase 5.2).
        columnHelper.accessor('seller', {
          header: () => 'Seller',
          cell: (info) => (
            <span className="text-tertiary font-mono text-[11px]">{info.getValue().slice(-8)}</span>
          ),
        }),
      ),
      toColumn(
        columnHelper.accessor('createdAt', {
          header: () => 'Applied At',
          cell: (info) => (
            <span className="uppercase">
              {formatDate(info.getValue(), {
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          ),
        }),
      ),
      toColumn(
        columnHelper.accessor('status', {
          header: () => 'Status',
          cell: (info) => (
            <Badge
              content={info.getValue().toLowerCase()}
              className={`capitalize ${STATUS_BADGE_CLASSNAME[info.getValue()]}`}
            />
          ),
        }),
      ),
      toColumn(
        columnHelper.display({
          id: 'actions',
          header: () => 'Actions',
          cell: (info) => {
            const product = info.row.original;
            if (product.status !== 'PENDING') return null;

            return (
              <div className="flex items-center justify-center gap-2">
                <Button
                  pattern="primary"
                  content="Approve"
                  className="bg-primary-green! w-auto! px-3! py-1.5! text-xs! shadow-none!"
                  buttonProps={{
                    disabled: isApproving,
                    onClick: () => {
                      void handleApprove(product._id);
                    },
                  }}
                />
                <Button
                  pattern="secondary"
                  content="Reject"
                  className="w-auto! px-3! py-1.5! text-xs!"
                  buttonProps={{
                    onClick: () => {
                      setRejectingProduct(product);
                    },
                  }}
                />
              </div>
            );
          },
        }),
      ),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps -- handleApprove closes over stable mutateAsync, only isApproving needs to trigger a rebuild
    [isApproving],
  );

  const table = useTable({
    features: APP_TABLE_FEATURES,
    data: products ?? [],
    columns,
    getRowId: (row) => row._id,
  });

  const rows = table.getRowModel().rows;

  return (
    <PageWrapper>
      <div className="border-primary/10 bg-secondary-invert overflow-hidden rounded-xl border">
        {!!rows.length && (
          <ScrollableGradientContainer
            direction="horizontal"
            gradientClassNames={{ left: 'from-secondary-invert', right: 'from-secondary-invert' }}
          >
            <Table className="relative text-xs">
              <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHeadCell key={header.id}>
                        {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                      </TableHeadCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.id}
                    tabIndex={0}
                    className="border-y-primary/5 odd:bg-primary/5 even:bg-primary/2.5 border-y first:border-t-0 last:border-b-0 [&>td]:px-3 [&>td]:py-2 [&>td]:text-xs"
                  >
                    {row.getAllCells().map((cell) => (
                      <TableRowCell key={cell.id}>
                        <table.FlexRender cell={cell} />
                      </TableRowCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollableGradientContainer>
        )}

        {(isLoading || isError || rows.length === 0) && (
          <div className="flex min-h-[40dvh] items-center justify-center">
            {isLoading ? (
              <ApiStatus status="loading" text="Loading your queue..." />
            ) : (
              <ApiStatus
                className="min-h-0!"
                status={isError ? 'error' : 'empty'}
                title={isError ? 'Failed to load queue' : 'Queue is empty'}
                description={
                  isError
                    ? 'Something went wrong while fetching your queue. Please try again.'
                    : 'No pending products assigned to you right now.'
                }
              />
            )}
          </div>
        )}
      </div>

      <RejectProductModal
        product={rejectingProduct}
        onClose={() => {
          setRejectingProduct(null);
        }}
      />
    </PageWrapper>
  );
};

export default ProductQueue;
