import { PrismaClient } from '@prisma/client';
import { ImageMetadataRepositoryPort } from '../../core/ports/image-repository.port';

export class PrismaImageMetadataRepository implements ImageMetadataRepositoryPort {
  constructor(private readonly prisma: PrismaClient = new PrismaClient()) {}

  async saveImageMetadata(data: {
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
  }> {
    // Properly structured create with variants
    const result = await this.prisma.image_metadata.create({
      include: { variants: true },
      data: {
        sku: data.sku,
        color_option: data.colorOption,
        product_id_magento: data.productIdMagento,
        combine_swatch: data.combineSwatch,
        img_url: data.imgUrl,
        img_overlay: data.imgOverlay,
        secure_url: data.secureUrl,
        variants: {
          create: data.variants.map(variant => ({
            size: variant.size,
            url: variant.url
          }))
        }
      }
    });

    return {
      id: result.id,
      imgUrl: result.img_url || '',
      secureUrl: result.secure_url || '',
      variants: result.variants.map((v: any) => ({
        size: v.size,
        url: v.url
      }))
    };
  }
}