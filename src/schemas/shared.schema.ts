/* -------------------------------------------------------------------------- */
/*                           CONFIRM DETAILS SCHEMA                           */
/* -------------------------------------------------------------------------- */

import { boolean, object } from 'zod';

export const confirmDetailsSchema = object({
  confirm: boolean().refine(Boolean, 'Please confirm details before saving.'),
});
