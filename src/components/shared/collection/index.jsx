import React, { useState, useEffect } from 'react';
import usePotatoStore from '/src/store/usePotatoStore';
import potatoTypeStore from '../../../store/potatoTypeStore';
import description from '/src/assets/description.json';
import { collectionService } from '../../../apis/services/collectionService';

function Collection({ onSelectImage }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const { userPotatoes, fetchUserPotatoes, selectPotato } = usePotatoStore();
    const { isPotatoType, setIsPotatoType } = potatoTypeStore();
    const [allPotatoes, setAllPotatoes] = useState([]);

    const toggleSize = () => {
        setIsExpanded(!isExpanded);
    };

    const fetchAllPotatoes = async () => {
        try {
            const data = await collectionService.getAllPotatoTypes();
            setAllPotatoes(data);
        } catch (error) {
            console.error('Error fetching all potatoes:', error);
        }
    };

    useEffect(() => {
        fetchUserPotatoes();
        fetchAllPotatoes();
    }, [fetchUserPotatoes]);

    const handleImageClick = async (imagePath, potatoType, isAcquired) => {
        setLoading(true);
        try {
            if (isAcquired) {
                await setIsPotatoType(potatoType);
            }
            setSelectedImage(imagePath);
            onSelectImage(imagePath, !isAcquired);
        } catch (error) {
            console.error('Error updating selected potato:', error);
        } finally {
            setLoading(false);
        }
    };

    const images = import.meta.glob('/images/*Potato.{png,jpg,jpeg,png}');
    const imageFiles = Object.keys(images)
        .map((key) => key.replace('/images/', '').replace('.png', ''))
        .filter((fileName) => fileName !== 'Group');

    const orderedImages = description
        .sort((a, b) => parseInt(a.id) - parseInt(b.id))
        .map((item) => item.name)
        .filter((name) => imageFiles.includes(name));

    const potatoImages = collectionService.getPotatoImages(orderedImages, allPotatoes, userPotatoes);

    const renderPotatoImages = (images) => {
        return images.map((image) => (
            <div
                key={image.id}
                className={`relative mx-auto mb-20 flex h-190 w-170 flex-col items-center justify-center rounded-4 border shadow-custom-light`}
                onClick={() => handleImageClick(image.imagePath, image.id, image.isAcquired)}
            >
                <img src={image.imagePath} alt={`Potato ${image.id + 1}`} className='h-118 w-85' />
                {!image.isAcquired && (
                    <div className='absolute left-0 top-0 flex h-full w-full items-center justify-center bg-[#d9d9d9] bg-opacity-50 backdrop-blur-sm'>
                        <img src='/images/Group.png' alt='Overlay' className='h-auto w-135' />
                    </div>
                )}
                <p className='mt-2'>{image.title}</p>
            </div>
        ));
    };

    const containerHeight = isExpanded ? 'max-h-full h-auto pb-20' : 'h-82';

    return (
        <div
            className={`relative flex w-full flex-col rounded-4 bg-white p-4 shadow-custom-dark transition-all ${containerHeight}`}
        >
            <div className='flex h-90 items-center'>
                <div className='w-100-h-30 mb-43 ml-20 mt-24 text-20 font-bold'>Collection</div>
                {!isExpanded && (
                    <div className='mb-46 ml-80 mt-30 h-21 w-132 text-14 text-gray-98'>Choose your Potato</div>
                )}
            </div>
            <button onClick={toggleSize} className='absolute right-2 top-2 rounded-4 bg-transparent p-2'>
                {isExpanded ? (
                    <img src='/images/uparrow.png' alt='Collapse' className='mr-33 mt-27 h-19 w-19' />
                ) : (
                    <img src='/images/downarrow.png' alt='Expand' className='mr-33 mt-27 h-19 w-19' />
                )}
            </button>
            <div className='overflow-y-scroll scrollbar-hide'>
                <div className={`mx-auto grid h-auto gap-4 ${isExpanded ? 'grid-cols-7' : 'hidden'}`}>
                    {loading ? (
                        <div className='col-span-7 flex h-full items-center justify-center'>
                            <p className='mt-70 text-center text-14 text-gray-98'>Loading...</p>
                        </div>
                    ) : potatoImages.length > 0 ? (
                        renderPotatoImages(potatoImages)
                    ) : (
                        <div className='col-span-7 flex h-full items-center justify-center'>
                            <p className='mt-70 text-center text-14 text-gray-98'>
                                There are no potatoes to choose from!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Collection;
