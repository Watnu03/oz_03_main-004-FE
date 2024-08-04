import React, { useEffect, useState } from 'react';
import { collectionService } from '../../apis/services/collectionService';

const PotatoInfoModal = ({ isOpen, selectedImage, onClose, onOk, isOverlayed }) => {
    const [potatoInfo, setPotatoInfo] = useState({ name: '', description: '' });

    useEffect(() => {
        const fetchPotatoInfo = async () => {
            try {
                const potatoData = await collectionService.getUserPotatoDetails();
                const fileName = selectedImage.split('/').pop().split('.').slice(0, -1).join('.');
                const selectedPotato = potatoData.find((potato) => potato.name === fileName);

                if (selectedPotato) {
                    setPotatoInfo(selectedPotato);
                } else {
                    setPotatoInfo({ name: 'Unknown', description: 'No description available.' });
                }
            } catch (error) {
                console.error('Error fetching potato info:', error);
            }
        };

        if (selectedImage) {
            fetchPotatoInfo();
        }
    }, [selectedImage]);

    if (!isOpen) return null;

    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'
            onClick={handleBackgroundClick}
        >
            <div className='relative flex h-267 w-546 animate-slide-up flex-col justify-around overflow-hidden rounded-4 bg-white p-30 shadow-custom-dark'>
                <div className='relative flex'>
                    <div className='relative h-190 w-170 flex-shrink-0 p-5'>
                        <img
                            className={`object-fit h-full w-full ${isOverlayed ? 'opacity-30' : ''}`}
                            src={selectedImage}
                            alt='Selected Potato'
                        />
                        {isOverlayed && (
                            <div className='absolute inset-0 flex items-center justify-center rounded-4 bg-[#d9d9d9] bg-opacity-30 backdrop-blur-sm'>
                                <img src='/images/Group.png' alt='Overlay' className='h-100 w-100' />
                            </div>
                        )}
                    </div>
                    <div className='ml-50 flex flex-col'>
                        <div className='text-center'>
                            <h1 className='mt-10 text-28 font-bold text-strong'>
                                {isOverlayed ? 'Unlock' : potatoInfo.name}
                            </h1>
                        </div>
                        <div className='mt-4 text-center'>
                            <p className='mt-10 text-16 text-primary'>
                                {isOverlayed
                                    ? 'This is a special potato with no additional information.'
                                    : potatoInfo.description}
                            </p>
                        </div>
                        <div className='mt-6 flex justify-center space-x-4'>
                            <button
                                onClick={onOk}
                                className='ml-5 mt-50 h-33 w-100 rounded-4 bg-primary px-10 py-5 text-14 text-white duration-200 hover:scale-105'
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PotatoInfoModal;
