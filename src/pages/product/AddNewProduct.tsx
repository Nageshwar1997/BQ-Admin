import {
  productBasicInfoSchema,
  productCategoryInventorySchema,
  productDescriptionSchema,
  productMediaSchema,
  productSeoSchema,
  productTryOnSchema,
  productVariantsSchema,
} from '@/schemas/product.schema';
import { confirmDetailsSchema } from '@/schemas/shared.schema';
import type {
  TConfirmDetails,
  TProductBasicInfo,
  TProductCategoryInventory,
  TProductDescription,
  TProductMedia,
  TProductSeo,
  TProductTryOn,
  TProductVariants,
} from '@/types/schema.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const AddNewProduct = () => {
  const form1 = useForm<TProductBasicInfo>({
    resolver: zodResolver(productBasicInfoSchema),
    defaultValues: {
      title: '',
      baseSku: '',
      brand: '',
      discountedPrice: 0,
      price: 0,
    },
  });

  const form2 = useForm<TProductCategoryInventory>({
    resolver: zodResolver(productCategoryInventorySchema),
    defaultValues: {
      childCategory: '',
      isPublished: false,
      lowStockThreshold: 0,
      mainCategory: '',
      stock: 0,
      subCategory: '',
    },
  });
  const form3 = useForm<TProductMedia>({
    resolver: zodResolver(productMediaSchema),
    defaultValues: {
      images: [],
      thumbnail: '',
      videos: [],
    },
  });
  const form4 = useForm<TProductDescription>({
    resolver: zodResolver(productDescriptionSchema),
    defaultValues: {
      description: '',
      ingredients: '',
      shortDescription: '',
      usageInstructions: '',
    },
  });
  const form5 = useForm<TProductVariants>({
    resolver: zodResolver(productVariantsSchema),
    defaultValues: {
      variants: [],
      specifications: [],
    },
  });
  const form6 = useForm<TProductTryOn>({
    resolver: zodResolver(productTryOnSchema),
    defaultValues: {
      assets: [],
      enableTryOn: false,
      model: '',
    },
  });
  const form7 = useForm<TProductSeo>({
    resolver: zodResolver(productSeoSchema),
    defaultValues: {
      seoDescription: '',
      seoKeywords: [],
      seoTitle: '',
    },
  });
  const form8 = useForm<TConfirmDetails>({
    resolver: zodResolver(confirmDetailsSchema),
    defaultValues: { confirm: false },
  });
  return <div>AddNewProduct</div>;
};

export default AddNewProduct;
