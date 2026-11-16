'use client';

import Image from 'next/image';
import { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { FileImage, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

interface ImageUploadProps {
  imageUrls: string[];
  setImageUrls: React.Dispatch<React.SetStateAction<string[]>>;
  handleImageChange: (urls: string[]) => void;
}

export default function ImageGallery({
  imageUrls,
  setImageUrls,
  handleImageChange,
}: ImageUploadProps) {
  const t = useTranslations('ADMIN_IMAGE_GALLERY');
  const [selectedImage, setSelectedImage] = useState<number>(0);

  const onUpload = (result: any) => {
    if (result.info && result.info.secure_url) {
      const newImageUrl = result.info.secure_url;

      setImageUrls(prevImageUrls => {
        const updatedImageUrls = [...prevImageUrls, newImageUrl];
        handleImageChange(updatedImageUrls);
        return updatedImageUrls;
      });
    }
  };

  const onUploadError = (error: any) => {
    console.error(`Upload failed: ${error.message}`);
    toast.error(t('UPLOAD_FAILED', { message: error.message }));
  };

  const handleDeleteImage = (index: number) => {
    setImageUrls(prevImageUrls => {
      const updateImageUrls = [...prevImageUrls];
      updateImageUrls.splice(index, 1);
      handleImageChange(updateImageUrls);
      return updateImageUrls;
    });
  };

  return (
    <div className='flex flex-col gap-3'>
      <div className='w-full min-h-60 bg-[#efefef] rounded-lg flex justify-center items-center'>
        {imageUrls.length > 0 ? (
          <Image
            src={imageUrls[selectedImage]}
            alt={t('PRODUCT_IMAGE_ALT')}
            width={256}
            height={341}
            draggable={false}
            loading='eager'
            className='w-full h-full'
          />
        ) : (
          <FileImage />
        )}
      </div>
      <div className='flex flex-wrap gap-3'>
        {imageUrls.map((url, index) => (
          <div
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`bg-[#efefef] w-[100px] h-32.5 max-w-fit relative rounded-lg flex justify-center items-center ${
              selectedImage === index ? 'border border-black' : ''
            }`}
          >
            <button
              type='button'
              onClick={e => {
                e.stopPropagation();
                handleDeleteImage(index);
              }}
              className='absolute -top-1.5 -right-1.5 bg-white rounded-full p-0.5 shadow text-gray-400 hover:text-red-500 transition-colors'
            >
              <X size={13} />
            </button>
            <Image
              className='h-auto w-full rounded-lg'
              src={url}
              alt={url}
              width={256}
              height={341}
              draggable={false}
            />
          </div>
        ))}
        <CldUploadWidget
          uploadPreset='bidrbjhr'
          onSuccess={onUpload}
          onError={onUploadError}
        >
          {({ open }) => {
            const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              open();
            };
            return (
              <button onClick={handleOnClick} aria-label={t('UPLOAD')}>
                <div
                  className={`w-[100px] h-32.5 p-3 border border-dashed rounded-lg flex justify-center items-center`}
                >
                  <div className='bg-[#b2fbbc] h-[23px] p-0.5 rounded-full'>
                    <Plus size={18} color='#fff' />
                  </div>
                </div>
              </button>
            );
          }}
        </CldUploadWidget>
      </div>
    </div>
  );
}
