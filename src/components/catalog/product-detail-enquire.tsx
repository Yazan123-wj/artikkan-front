'use client';

import { ProductEnquireButton } from '@/components/enquiry/product-enquire-button';

type ProductDetailEnquireProps = {
  name: string;
  category: string;
  slug: string;
  reference?: string;
  imageSrc: string;
  imageAlt: string;
  enquireLabel: string;
  enquiryEmail: string | null;
};

export function ProductDetailEnquire({
  name,
  category,
  slug,
  reference,
  imageSrc,
  imageAlt,
  enquireLabel,
  enquiryEmail,
}: ProductDetailEnquireProps) {
  return (
    <ProductEnquireButton
      variant="editorial"
      label={enquireLabel}
      enquiryEmail={enquiryEmail}
      product={{
        name,
        category,
        slug,
        reference,
        imageSrc,
        imageAlt,
      }}
    />
  );
}
