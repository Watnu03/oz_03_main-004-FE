import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import Calendar from '../../components/shared/calendar';
import Info from '../../components/shared/info';
import Potato from '../../components/shared/potato';
import Stack from '../../components/shared/stack';
import Todo from '../../components/shared/todo';
import Collection from '../../components/shared/collection';
import Level from '../../components/shared/level';
import { ChangePotatoModal, PotatoInfoModal, UserUpdateModal } from '../../components/modal/index';

const Home = () => {
    const [isChangePotatoModalOpen, setIsChangePotatoModalOpen] = useState(false);
    const [isPotatoInfoModalOpen, setIsPotatoInfoModalOpen] = useState(false);
    const [isUserUpdateModal, setIsUserUpdateModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null); // 선택된 이미지 초기화
    const [confirmedImage, setConfirmedImage] = useState(null); // 확정된 이미지 초기화
    const [isOverlayed, setIsOverlayed] = useState(false); // 오버레이 상태

    useEffect(() => {
        setIsUserUpdateModal(true);
    }, []);

    const handleSelectImage = (image, isOverlayed) => {
        setSelectedImage(image);
        setIsOverlayed(isOverlayed); // 오버레이 상태 업데이트
        setIsPotatoInfoModalOpen(true);
    };
    // ChangePotatoModal 모달에서 OK 버튼 클릭 시 서버에 이미지 정보를 여기서 저장
    const handleConfirmChange = async (image) => {
        setConfirmedImage(image);
        // 서버에 이미지 정보를 저장하는 코드 (현재는 주석 처리)
        // try {
        //     const response = await axios.post('/api/potato', { image });
        //     console.log('Image saved successfully');
        //     setConfirmedImage(image);
        // } catch (error) {
        //     console.error('Error saving image:', error);
        // }
    };

    const handleGetNewPotato = () => {
        setIsNewPotatoEarnedModalOpen(true);
    };

    const handlePotatoInfoModalOkClick = () => {
        setIsPotatoInfoModalOpen(false);
        if (!isOverlayed) {
            setIsChangePotatoModalOpen(true); // 오버레이가 없는 경우에만 ChangePotatoModal 실행
        }
    };

    const handlePotatoInfoModalClose = () => {
        setIsPotatoInfoModalOpen(false);
    };

    return (
        <div className='flex h-[calc(100vh-80px)] w-full flex-col gap-5 px-10 py-20'>
            <div className='mx-auto flex h-1/3 w-[calc(100%-500px)] items-start gap-30 hwide:h-270 wide:w-1400 middle:w-[calc(100%-250px)] tablet:mx-auto tablet:min-h-700 tablet:w-full tablet:flex-wrap tablet:justify-between tablet:gap-0 tablet:px-10'>
                <div className='h-full w-1/4 rounded-4 p-24 shadow-custom-dark tablet:h-[calc(50%-10px)] tablet:w-[calc(50%-10px)] tablet:p-12'>
                    <Potato selectedImage={confirmedImage} /> {/* 확정된 이미지를 전달 */}
                </div>
                <div className='flex h-full w-1/4 items-center justify-center rounded-4 p-24 shadow-custom-dark tablet:h-[calc(50%-10px)] tablet:w-[calc(50%-10px)] tablet:p-12'>
                    <Level />
                </div>
                <div className='h-full w-1/4 rounded-4 p-24 shadow-custom-dark tablet:h-[calc(50%-10px)] tablet:w-[calc(50%-10px)] tablet:p-12'>
                    <Info />
                </div>
                <div className='h-full w-1/4 rounded-4 p-24 shadow-custom-dark tablet:h-[calc(50%-10px)] tablet:w-[calc(50%-10px)] tablet:p-12'>
                    <Stack />
                </div>
            </div>

            <Swiper
                modules={[Navigation]}
                spaceBetween={110}
                slidesPerView={1}
                navigation
                className='mx-auto mt-20 flex h-2/3 w-[calc(100%-300px)] grow px-100 wide:w-1550 wide:px-75 middle:w-[calc(100%-150px)] middle:px-50 tablet:m-0 tablet:w-full tablet:px-12'
            >
                <SwiperSlide className='flex justify-between py-8 gap-30'>
                    <div className='w-1/2 h-full p-24 rounded-4 shadow-custom-dark'>
                        <Calendar />
                    </div>
                    <div className='w-1/2 h-full p-24 rounded-4 shadow-custom-dark'>
                        <Todo />
                    </div>
                </SwiperSlide>
                <SwiperSlide className='h-full py-8'>
                    <Collection onSelectImage={handleSelectImage} />
                </SwiperSlide>
            </Swiper>
            <PotatoInfoModal
                isOpen={isPotatoInfoModalOpen}
                onClose={handlePotatoInfoModalClose}
                onOk={handlePotatoInfoModalOkClick}
                selectedImage={selectedImage}
                isOverlayed={isOverlayed} // 오버레이 상태 전달
            />
            <ChangePotatoModal
                isOpen={isChangePotatoModalOpen}
                onClose={() => setIsChangePotatoModalOpen(false)}
                selectedImage={selectedImage}
                onConfirm={handleConfirmChange}
            />
            <UserUpdateModal
                isOpen={isUserUpdateModal}
                onClose={() => {
                    setIsUserUpdateModal(false);
                }}
            />
        </div>
    );
};

export default Home;
