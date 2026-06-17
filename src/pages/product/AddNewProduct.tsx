import Navbar from '@/components/layout/navbar';
import Button from '@/components/ui/Button';
import Stepper from '@/components/ui/Stepper';
import { ADD_PRODUCT_STEPS, CATEGORY_LEVELS_MAP, EMPTY_ARRAY } from '@/constants/common.constants';
import { ADD_PRODUCT_FORM_ID_MAP } from '@/constants/form.constants';
import { useProcessQuillContent } from '@/hooks/useProcessQuillContent';
import {
  productBasicInfoSchema,
  productDescriptionAndContentSchema,
  productMediaAndGallerySchema,
  productStockAndVariantsSchema,
  productTryOnConfigurationSchema,
} from '@/schemas/product.schema';
import { confirmDetailsSchema } from '@/schemas/shared.schema';
import {
  useUploadMultipleMedia,
  useUploadSingleMedia,
} from '@/services/media-service/media.service.query';
import { useGetCategoriesByParentLevel } from '@/services/product-service/category.service.query';
import {
  usePublishProduct,
  useSaveDraftProduct,
} from '@/services/product-service/product.service.query';
import type {
  TAddProductStepNumber,
  TProductQuillImageRefs,
  TProductQuillRefs,
} from '@/types/common.type';
import type { TQuillImageRef } from '@/types/component.type';
import type {
  TConfirmDetails,
  TProductBasicInfo,
  TProductDescriptionAndContent,
  TProductMediaAndGallery,
  TProductStockAndVariants,
  TProductTryOnConfiguration,
} from '@/types/schema.type';
import { zodResolver } from '@hookform/resolvers/zod';
import type Quill from 'quill';
import { useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import AddProductBasicInfoFields from './children/AddProductBasicInfoFields';
import AddProductConfirmFieldAndReview from './children/AddProductConfirmFieldAndReview';
import AddProductDescriptionAndContentFields from './children/AddProductDescriptionAndContentFields';
import AddProductMediaAndGalleryFields from './children/AddProductMediaAndGalleryFields';
import AddProductStockAndVariantsFields from './children/AddProductStockAndVariantsFields';
import AddProductTryOnConfigurationFields from './children/AddProductTryOnConfigurationFields';

const AddNewProduct = () => {
  const [activeStep, setActiveStep] = useState<TAddProductStepNumber>(0);
  const { processQuillContent } = useProcessQuillContent<TProductDescriptionAndContent>();

  const uploadSingleMediaQuery = useUploadSingleMedia();
  const uploadMultipleMediaQuery = useUploadMultipleMedia();
  const saveDraftProductQuery = useSaveDraftProduct();
  const publishDraftProductQuery = usePublishProduct();

  const quillRefs: TProductQuillRefs = {
    description: useRef<Quill | null>(null),
    ingredients: useRef<Quill | null>(null),
    instructions: useRef<Quill | null>(null),
    additional: useRef<Quill | null>(null),
  };

  const imageRefs: TProductQuillImageRefs = {
    description: useRef<TQuillImageRef[]>([]),
    ingredients: useRef<TQuillImageRef[]>([]),
    instructions: useRef<TQuillImageRef[]>([]),
    additional: useRef<TQuillImageRef[]>([]),
  };

  const basicInfoForm = useForm<TProductBasicInfo>({
    resolver: zodResolver(productBasicInfoSchema),
  });

  const mediaAndGalleryForm = useForm<TProductMediaAndGallery>({
    resolver: zodResolver(productMediaAndGallerySchema),
  });

  const descriptionAndContentForm = useForm<TProductDescriptionAndContent>({
    resolver: zodResolver(productDescriptionAndContentSchema),
  });

  const stockAndVariantsForm = useForm<TProductStockAndVariants>({
    resolver: zodResolver(productStockAndVariantsSchema),
  });

  const tryOnConfigurationForm = useForm<TProductTryOnConfiguration>({
    resolver: zodResolver(productTryOnConfigurationSchema),
  });

  const reviewAndConfirmForm = useForm<TConfirmDetails>({
    resolver: zodResolver(confirmDetailsSchema),
  });

  const l1Category = useWatch({ control: basicInfoForm.control, name: 'l1Category' });
  const l2Category = useWatch({ control: basicInfoForm.control, name: 'l2Category' });

  const { data: l1Cats = EMPTY_ARRAY } = useGetCategoriesByParentLevel({
    level: CATEGORY_LEVELS_MAP.L1,
  });

  const { data: l2Cats = EMPTY_ARRAY } = useGetCategoriesByParentLevel({
    level: CATEGORY_LEVELS_MAP.L2,
    parent: l1Category?.id,
    enabled: !!l1Category?.id,
  });

  const { data: l3Cats = EMPTY_ARRAY } = useGetCategoriesByParentLevel({
    level: CATEGORY_LEVELS_MAP.L3,
    parent: l2Category?.id,
    enabled: !!l2Category?.id,
  });

  const handleNext = () => {
    setActiveStep(
      (prev) => (prev < ADD_PRODUCT_STEPS.length - 1 ? prev + 1 : prev) as TAddProductStepNumber,
    );
  };

  const onBasicInfoSubmit = async (data: TProductBasicInfo) => {
    console.log('onBasicInfoSubmit data', data);
    await saveDraftProductQuery.mutateAsync(
      { ...data, step: activeStep },
      { onSuccess: handleNext },
    );
  };

  const onMediaAndGallerySubmit = async (data: TProductMediaAndGallery) => {
    const basicInfo = basicInfoForm.getValues();

    let thumbnailUrl = typeof data.thumbnail === 'string' ? data.thumbnail : '';

    let videoUrl = typeof data.video === 'string' ? data.video : undefined;

    const existingImageUrls: string[] = [];
    const newImageFiles: File[] = [];

    data.images.forEach((image) => {
      if (typeof image === 'string') {
        existingImageUrls.push(image);
      } else {
        newImageFiles.push(image);
      }
    });

    const uploadPromises: Promise<unknown>[] = [];

    // Thumbnail upload
    if (data.thumbnail instanceof File) {
      const thumbnailFormData = new FormData();

      thumbnailFormData.append('file', data.thumbnail);
      thumbnailFormData.append('folder', basicInfo.title);

      uploadPromises.push(
        uploadSingleMediaQuery.mutateAsync({
          data: thumbnailFormData,
          toasterInfo: {
            title: 'Please wait...',
            description: 'Uploading thumbnail',
          },
        }),
      );
    } else {
      uploadPromises.push(Promise.resolve(null));
    }

    // Images upload
    if (newImageFiles.length) {
      const imagesFormData = new FormData();

      newImageFiles.forEach((file) => {
        imagesFormData.append('files', file);
      });

      imagesFormData.append('folder', basicInfo.title);

      uploadPromises.push(
        uploadMultipleMediaQuery.mutateAsync({
          data: imagesFormData,
          toasterInfo: {
            title: 'Please wait...',
            description: 'Uploading images',
          },
        }),
      );
    } else {
      uploadPromises.push(Promise.resolve(null));
    }

    // Video upload
    if (data.video instanceof File) {
      const videoFormData = new FormData();

      videoFormData.append('file', data.video);
      videoFormData.append('folder', basicInfo.title);

      uploadPromises.push(
        uploadSingleMediaQuery.mutateAsync({
          data: videoFormData,
          toasterInfo: {
            title: 'Please wait...',
            description: 'Uploading video',
          },
        }),
      );
    } else {
      uploadPromises.push(Promise.resolve(null));
    }

    const [thumbnailResponse, imagesResponse, videoResponse] = await Promise.all(uploadPromises);

    if (thumbnailResponse && typeof thumbnailResponse === 'object' && 'url' in thumbnailResponse) {
      thumbnailUrl = thumbnailResponse.url as string;
    }

    if (videoResponse && typeof videoResponse === 'object' && 'url' in videoResponse) {
      videoUrl = videoResponse.url as string;
    }

    const uploadedImageUrls =
      imagesResponse && typeof imagesResponse === 'object' && 'urls' in imagesResponse
        ? ((imagesResponse.urls as string[]) ?? [])
        : [];

    const finalImages = [...existingImageUrls, ...uploadedImageUrls];

    mediaAndGalleryForm.setValue('thumbnail', thumbnailUrl);
    mediaAndGalleryForm.setValue('images', finalImages);

    if (videoUrl) {
      mediaAndGalleryForm.setValue('video', videoUrl);
    }

    await saveDraftProductQuery.mutateAsync(
      {
        thumbnail: thumbnailUrl,
        images: finalImages,
        video: videoUrl,
        step: activeStep,
      },
      { onSuccess: handleNext },
    );
  };

  const onDescriptionAndContentSubmit = async (data: TProductDescriptionAndContent) => {
    const title = basicInfoForm.getValues().title;
    const [descriptionResponse, additionalResponse, ingredientsResponse, instructionsResponse] =
      await Promise.all([
        processQuillContent({
          field: 'description',
          folder: title,
          imagesRef: imageRefs.description,
          quillRef: quillRefs.description,
          setValue: descriptionAndContentForm.setValue,
          toasterInfo: {
            title: 'Please wait...',
            description: 'Uploading description images...',
          },
        }),
        processQuillContent({
          field: 'additional',
          folder: title,
          imagesRef: imageRefs.additional,
          quillRef: quillRefs.additional,
          setValue: descriptionAndContentForm.setValue,
          toasterInfo: {
            title: 'Please wait...',
            description: 'Uploading additional info images...',
          },
        }),
        processQuillContent({
          field: 'ingredients',
          folder: title,
          imagesRef: imageRefs.ingredients,
          quillRef: quillRefs.ingredients,
          setValue: descriptionAndContentForm.setValue,
          toasterInfo: {
            title: 'Please wait...',
            description: 'Uploading ingredients images...',
          },
        }),
        processQuillContent({
          field: 'instructions',
          folder: title,
          imagesRef: imageRefs.instructions,
          quillRef: quillRefs.instructions,
          setValue: descriptionAndContentForm.setValue,
          toasterInfo: {
            title: 'Please wait...',
            description: 'Uploading instructions images...',
          },
        }),
      ]);

    await saveDraftProductQuery.mutateAsync(
      {
        shortDescription: data.shortDescription,
        description: descriptionResponse,
        instructions: instructionsResponse,
        ingredients: ingredientsResponse,
        additional: additionalResponse,
        step: activeStep,
      },
      { onSuccess: handleNext },
    );
  };

  const onStockAndVariantsSubmit = async (data: TProductStockAndVariants) => {
    console.log('onStockAndVariantsSubmit data', data);
    await saveDraftProductQuery.mutateAsync(
      { ...data, step: activeStep },
      { onSuccess: handleNext },
    );
  };

  const onTryOnConfigurationSubmit = async (data: TProductTryOnConfiguration) => {
    console.log('onTryOnConfigurationSubmit data', data);
    await saveDraftProductQuery.mutateAsync(
      { ...data, step: activeStep },
      { onSuccess: handleNext },
    );
  };

  const onReviewAndConfirmSubmit = async (_data: TConfirmDetails) => {
    await publishDraftProductQuery.mutateAsync();
  };

  const handleBack = () => {
    setActiveStep((prev) => (prev > 0 ? prev - 1 : prev) as TAddProductStepNumber);
  };

  const handleSaveDraft = async () => {
    console.log('Save Draft');
  };

  const stepFields = [
    <form
      id={ADD_PRODUCT_FORM_ID_MAP[activeStep]}
      onSubmit={basicInfoForm.handleSubmit(onBasicInfoSubmit)}
    >
      <AddProductBasicInfoFields
        form={basicInfoForm}
        categories={{ L1: l1Cats, L2: l2Cats, L3: l3Cats }}
      />
    </form>,
    <form
      id={ADD_PRODUCT_FORM_ID_MAP[activeStep]}
      onSubmit={mediaAndGalleryForm.handleSubmit(onMediaAndGallerySubmit)}
    >
      <AddProductMediaAndGalleryFields form={mediaAndGalleryForm} />
    </form>,
    <form
      id={ADD_PRODUCT_FORM_ID_MAP[activeStep]}
      onSubmit={descriptionAndContentForm.handleSubmit(onDescriptionAndContentSubmit)}
    >
      <AddProductDescriptionAndContentFields
        form={descriptionAndContentForm}
        imageRefs={imageRefs}
        quillRefs={quillRefs}
      />
    </form>,
    <form
      id={ADD_PRODUCT_FORM_ID_MAP[activeStep]}
      onSubmit={stockAndVariantsForm.handleSubmit(onStockAndVariantsSubmit)}
    >
      <AddProductStockAndVariantsFields
        form={stockAndVariantsForm}
        defaultPrices={{
          originalPrice: basicInfoForm.watch('originalPrice'),
          sellingPrice: basicInfoForm.watch('sellingPrice'),
        }}
      />
    </form>,
    <form
      id={ADD_PRODUCT_FORM_ID_MAP[activeStep]}
      onSubmit={tryOnConfigurationForm.handleSubmit(onTryOnConfigurationSubmit)}
    >
      <AddProductTryOnConfigurationFields form={tryOnConfigurationForm} />
    </form>,
    <form
      id={ADD_PRODUCT_FORM_ID_MAP[activeStep]}
      onSubmit={reviewAndConfirmForm.handleSubmit(onReviewAndConfirmSubmit)}
    >
      <AddProductConfirmFieldAndReview
        form={reviewAndConfirmForm}
        values={{
          basicInfo: basicInfoForm.getValues(),
          mediaAndGallery: mediaAndGalleryForm.getValues(),
          descriptionAndContent: descriptionAndContentForm.getValues(),
          stockAndVariants: stockAndVariantsForm.getValues(),
          tryOnConfiguration: tryOnConfigurationForm.getValues(),
        }}
      />
    </form>,
  ];

  return (
    <div className="h-full w-full">
      <Navbar buttons={[{ content: 'Save Draft', leftIcon: { icon: 'solar:diskette-linear' } }]} />
      <Stepper
        steps={ADD_PRODUCT_STEPS}
        activeStep={activeStep}
        // TODO: Remove onStepClick after done
        onStepClick={(step) => setActiveStep(step as TAddProductStepNumber)}
        className="mt-4 p-4!"
      >
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-primary text-sm font-semibold">
              {ADD_PRODUCT_STEPS[activeStep].title}
            </p>

            <p className="text-secondary text-xs">{ADD_PRODUCT_STEPS[activeStep].description}</p>
          </div>

          {stepFields[activeStep]}

          <div className="flex justify-between gap-3">
            <Button
              pattern="secondary"
              content={activeStep === 0 ? 'Save draft' : 'Back'}
              buttonProps={{ onClick: activeStep === 0 ? handleSaveDraft : handleBack }}
            />

            <Button
              pattern="primary"
              content={activeStep === ADD_PRODUCT_STEPS.length - 1 ? 'Save' : 'Save & Next'}
              buttonProps={{ type: 'submit', form: ADD_PRODUCT_FORM_ID_MAP[activeStep] }}
            />
          </div>
        </div>
      </Stepper>
    </div>
  );
};

export default AddNewProduct;
