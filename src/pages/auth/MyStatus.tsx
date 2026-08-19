import { useState } from 'react';

import ApiStatus from '@/components/layout/ApiStatus';
import PageWrapper from '@/components/layout/containers/PageWrapper';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import GradientText from '@/components/ui/GradientText';
import Input from '@/components/ui/inputs/Input';
import Radio from '@/components/ui/inputs/Radio';
import Textarea from '@/components/ui/inputs/Textarea';
import { useGetMyAdmin, useUpdateAdminStatus } from '@/services/user-service/admin.service.query';
import { formatDate } from '@/utils/common.util';

const STATUS_BADGE_CLASSNAME = {
  ACTIVE: 'text-primary-green border-primary-green/30 bg-primary-green/5',
  ON_LEAVE: 'text-primary-yellow border-primary-yellow/30 bg-primary-yellow/5',
  SUSPENDED: 'text-primary-red border-primary-red/30 bg-primary-red/5',
  INACTIVE: 'text-tertiary border-primary/10 bg-primary/5',
} as const;

const MyStatus = () => {
  const { data: admin, isLoading, isError } = useGetMyAdmin();
  const { mutateAsync, isPending } = useUpdateAdminStatus();

  // Overrides only exist once the admin has actually touched the form -
  // `null` means "show what the server has", so the radio/fields track the
  // admin's real current status instead of always starting on "Active"
  // (derived, not synced via an effect - see useGetMyAdmin/admin below).
  const [statusOverride, setStatusOverride] = useState<'ACTIVE' | 'ON_LEAVE' | null>(null);
  const [reasonOverride, setReasonOverride] = useState<string | null>(null);
  const [leaveUntilOverride, setLeaveUntilOverride] = useState<string | null>(null);

  if (isLoading || isError || !admin) {
    return (
      <PageWrapper>
        <ApiStatus
          status={isLoading ? 'loading' : 'error'}
          text="Loading your admin profile..."
          title="Failed to load your admin profile"
          description="Something went wrong while fetching your status. Please try again."
        />
      </PageWrapper>
    );
  }

  const isSuspended = admin.status === 'SUSPENDED';
  // Self can only ever be ACTIVE or ON_LEAVE - SUSPENDED/INACTIVE have no
  // matching radio option, so they fall back to ACTIVE (view-only anyway
  // for SUSPENDED, handled separately below).
  const currentStatus: 'ACTIVE' | 'ON_LEAVE' = admin.status === 'ON_LEAVE' ? 'ON_LEAVE' : 'ACTIVE';

  const nextStatus = statusOverride ?? currentStatus;
  const reason = reasonOverride ?? (currentStatus === 'ON_LEAVE' ? (admin.statusReason ?? '') : '');
  const leaveUntil =
    leaveUntilOverride ?? (admin.leaveUntil ? (admin.leaveUntil.split('T')[0] ?? '') : '');

  const handleSubmit = async () => {
    if (nextStatus === admin.status) return;
    if (nextStatus === 'ON_LEAVE' && !reason.trim()) return;

    await mutateAsync(
      {
        adminId: admin.user,
        data:
          nextStatus === 'ACTIVE'
            ? { status: 'ACTIVE' }
            : { status: 'ON_LEAVE', reason: reason.trim(), leaveUntil: leaveUntil || undefined },
      },
      {
        onSuccess: () => {
          setStatusOverride(null);
          setReasonOverride(null);
          setLeaveUntilOverride(null);
        },
      },
    );
  };

  return (
    <PageWrapper>
      <div className="border-primary/10 bg-secondary-invert mx-auto flex max-w-lg flex-col gap-6 rounded-xl border p-5">
        {/* -------- Current status -------- */}
        <div className="flex flex-col gap-3">
          <GradientText type="silver" text="My status" className="text-base font-semibold" />

          <div className="flex flex-wrap items-center gap-2">
            <Badge
              content={admin.status.replaceAll('_', ' ').toLowerCase()}
              className={`capitalize ${STATUS_BADGE_CLASSNAME[admin.status]}`}
            />
            {!!admin.assignedStates.length && (
              <span className="text-tertiary text-xs">
                Territory: {admin.assignedStates.join(', ')}
              </span>
            )}
          </div>

          {admin.statusReason && (
            <p className="text-tertiary text-xs">
              Reason: {admin.statusReason}
              {admin.leaveUntil && ` (until ${formatDate(admin.leaveUntil)})`}
            </p>
          )}
        </div>

        {/* -------- Suspended: view-only -------- */}
        {isSuspended ? (
          <p className="text-primary-red text-xs">
            Your access has been suspended by a MASTER. Contact your administrator to have it
            restored - you can&apos;t change this yourself.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            <Radio
              value={nextStatus}
              onChange={(value) => {
                setStatusOverride(value as 'ACTIVE' | 'ON_LEAVE');
              }}
              options={[
                { label: 'Active', value: 'ACTIVE' },
                { label: 'On leave', value: 'ON_LEAVE' },
              ]}
              className="w-64!"
            />

            {nextStatus === 'ON_LEAVE' && (
              <div className="flex flex-col gap-4">
                <Textarea
                  label="Leave reason"
                  textAreaProps={{
                    value: reason,
                    onChange: (e) => {
                      setReasonOverride(e.target.value);
                    },
                    placeholder: "What's the reason for going on leave?",
                    disabled: isPending,
                  }}
                />
                <Input
                  label="Return date (optional)"
                  inputProps={{
                    type: 'date',
                    value: leaveUntil,
                    onChange: (e) => {
                      setLeaveUntilOverride(e.target.value);
                    },
                    disabled: isPending,
                    min: new Date().toISOString().split('T')[0],
                  }}
                />
              </div>
            )}

            <Button
              pattern="primary"
              content={nextStatus === admin.status ? 'No changes' : 'Save status'}
              buttonProps={{
                disabled:
                  isPending ||
                  nextStatus === admin.status ||
                  (nextStatus === 'ON_LEAVE' && !reason.trim()),
                onClick: () => {
                  void handleSubmit();
                },
              }}
            />
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default MyStatus;
