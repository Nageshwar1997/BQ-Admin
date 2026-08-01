import { CONTACT_QUERY_STATUS, CONTACT_QUERY_TYPES } from '@beautinique/frontend-constants';
import type { IListContactQueriesQuery } from '@beautinique/frontend-types';

import PageWrapper from '@/components/layout/containers/PageWrapper';
import Select from '@/components/ui/inputs/Select';
import useQueryParams from '@/hooks/useQueryParams';
import { useGetContactQueries } from '@/services/organization-service/contact.service.query';

const Enquiries = () => {
  const { queryParams, removeParams, setParams } = useQueryParams();
  const { data } = useGetContactQueries({
    queryType: queryParams.queryType as IListContactQueriesQuery['queryType'] | undefined,
    status: queryParams.status?.toUpperCase() as IListContactQueriesQuery['status'] | undefined,
  });
  console.log('🚀 ~ Enquiries ~ data:', data);

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
      </div>
    </PageWrapper>
  );
};

export default Enquiries;
