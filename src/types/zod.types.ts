interface ZodCommonConfigs {
  field: string;
  parentField?: string;
  showingFieldName: string;
  showingParentFieldName?: string;
}

interface ZodCompareConfigs {
  min?: number | undefined;
  max?: number | undefined;
}

export type TZodRegex = {
  regex: RegExp;
  message: string;
};

export interface ZodStringConfigs extends ZodCommonConfigs, ZodCompareConfigs {
  blockMultipleSpaces?: boolean;
  blockSingleSpace?: boolean;
  nonEmpty?: boolean;
  customRegexes?: TZodRegex[];
}

export type ZodRequiredStringConfigs = ZodStringConfigs; // Required
export type ZodOptionalStringConfigs = ZodStringConfigs; // Optional
