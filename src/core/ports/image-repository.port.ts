export interface ImageMetadataRepositoryPort {
    saveImageMetadata(data: {
      sku: string;
      colorOption: string;
      productIdMagento: number;
      combineSwatch: string;
      imgUrl: string;
      imgOverlay: string;
      secureUrl: string;
      variants: Array<{ size: number; url: string }>;
    }): Promise<{
      id: number;
      imgUrl: string;
      secureUrl: string;
      variants: Array<{ size: number; url: string }>;
    }>;
  }