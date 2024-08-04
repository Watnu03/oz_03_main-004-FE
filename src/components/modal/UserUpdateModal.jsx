import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { githubService, potatoService } from '../../apis/services/userUpdateService';
import Loading from '../common/loading';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const UserUpdateModal = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [latestCommitCount, setLatestCommitCount] = useState(0);
    const [commitDifference, setCommitDifference] = useState(0);
    const [previousLevel, setPreviousLevel] = useState(0);
    const [currentLevel, setCurrentLevel] = useState(0);
    const [previousPotato, setPreviousPotato] = useState([]);
    const [currentPotato, setCurrentPotato] = useState([]);
    const [newPotato, setNewPotato] = useState([]);
    const [showAcquiredNotification, setShowAcquiredNotification] = useState(false);
    const [levelupAlert, setLevelupAlert] = useState(false);

    useEffect(() => {
        const storedCommitCount = Number(localStorage.getItem('latestCommitCount')) || 0;
        const storedPreviousLevel = Number(localStorage.getItem('previousLevel')) || 1;
        const storedPreviousPotato = JSON.parse(localStorage.getItem('previousPotato') || '[]');

        setLatestCommitCount(storedCommitCount);
        setPreviousLevel(storedPreviousLevel);
        setPreviousPotato(storedPreviousPotato);

        const fetchData = async () => {
            setLoading(true);

            try {
                await Promise.all([fetchGithubData(storedCommitCount), fetchPotatoData(storedPreviousPotato)]);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const fetchGithubData = async (storedCommitCount) => {
        try {
            const githubData = await githubService.getGithubState();
            const getCommitCount = githubData.totalCommit || 0;
            const getCurrentLevel = githubData.level || 1;

            const commitDifference = getCommitCount - storedCommitCount;
            setCommitDifference(commitDifference);
            setCurrentLevel(getCurrentLevel);

            localStorage.setItem('latestCommitCount', getCommitCount);
            localStorage.setItem('previousLevel', getCurrentLevel);
        } catch (error) {
            console.error('Error fetching GitHub data:', error);
        }
    };

    const fetchPotatoData = async (storedPreviousPotato) => {
        try {
            const userPotatoDetails = await potatoService.getUserPotatoDetails();
            const acquiredPotatoes = userPotatoDetails.filter((potato) => potato.isAcquired);
            setCurrentPotato(acquiredPotatoes);

            // 중복된 감자 식별 및 필터링
            const currentPotatoIds = new Set(acquiredPotatoes.map((potato) => potato.potatoId));
            const previousPotatoIds = new Set(storedPreviousPotato.map((potato) => potato.potatoId));
            const duplicatePotatoIds = new Set([...currentPotatoIds].filter((id) => previousPotatoIds.has(id)));

            const filteredCurrentPotatoes = acquiredPotatoes.filter(
                (potato) => !duplicatePotatoIds.has(potato.potatoId)
            );
            const filteredPreviousPotatoes = storedPreviousPotato.filter(
                (potato) => !duplicatePotatoIds.has(potato.potatoId)
            );

            const getNewPotatoes = [...filteredCurrentPotatoes, ...filteredPreviousPotatoes];
            setNewPotato(getNewPotatoes);

            setShowAcquiredNotification(getNewPotatoes.length > 0);

            localStorage.setItem('previousPotato', JSON.stringify(acquiredPotatoes));
        } catch (error) {
            console.error('Error fetching potato data:', error);
        }
    };

    useEffect(() => {
        if (Number(previousLevel) < currentLevel) {
            setLevelupAlert(true);
        } else {
            setLevelupAlert(false);
        }
    }, [currentLevel, previousLevel]);

    if (loading) {
        return (
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
                <Loading />
            </div>
        );
    }

    const shouldOpenModal = !(commitDifference === 0 && previousLevel === currentLevel && newPotato.length === 0);
    if (!isOpen || !shouldOpenModal) return null;

    return (
        <div onClick={onClose} className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='flex h-626 w-620 animate-slide-up flex-col items-center'>
                <div
                    className='animate-scaleUp mb-[-10px] h-118 w-full bg-opacity-70 bg-cover bg-top text-center'
                    style={{ backgroundImage: "url('/images/levelup.png')" }}
                >
                    <div className='text-outline my-10 text-64 font-bold tracking-wide text-basic'>
                        {(!levelupAlert && 'Welcome Back!') || 'Level UP!'}
                    </div>
                </div>
                <div className='flex h-540 w-full flex-col items-center justify-around bg-white'>
                    <h1 className='mt-10 text-24 font-bold text-strong'>
                        {(!levelupAlert && `We've Got Some Updates for You`) || 'Congratulations'}
                    </h1>
                    <div className='h-39'>
                        <span className='mr-5 text-20 font-bold text-strong'>{commitDifference}</span>
                        <span className='text-16 text-primary'>commits added to your XP!</span>
                    </div>

                    <div className='bg-fa mb-10 flex h-60 w-453 items-center justify-center rounded-10 border border-strong'>
                        <span className='text-23 font-bold text-strong'>{previousLevel}레벨</span>
                        <img src='/images/right-arrow.png' alt='' className='mx-23 h-24 w-24 text-strong' />
                        <span className='text-23 font-bold text-strong'>{currentLevel}레벨</span>
                    </div>

                    <div className='h-268 w-573 overflow-hidden rounded-10 border border-strong scrollbar-hide'>
                        <div className='flex justify-center rounded-10 bg-white py-13'>
                            <img src='/images/star-icon.png' alt='' className='mx-3 h-31 w-31 animate-twinkle' />
                            <img src='/images/star-icon.png' alt='' className='mx-3 h-31 w-31 animate-twinkle' />
                            <span className='mx-20 text-23 font-bold text-strong'>New Potato</span>
                            <img src='/images/star-icon.png' alt='' className='mx-3 h-31 w-31 animate-twinkle' />
                            <img src='/images/star-icon.png' alt='' className='mx-3 h-31 w-31 animate-twinkle' />
                        </div>
                        {(showAcquiredNotification && (
                            <Swiper
                                modules={[Pagination, Autoplay]}
                                grabCursor={true}
                                slidesPerView={3}
                                spaceBetween={10}
                                autoplay={{ delay: 1500, disableOnInteraction: false }}
                                loop={true}
                                className='w-full bg-white'
                            >
                                {newPotato.map((potato, index) => (
                                    <SwiperSlide key={index} className='flex items-center justify-center'>
                                        <div className='flex h-190 w-170 flex-shrink-0 flex-col items-center justify-center rounded-4 border shadow-custom-light'>
                                            <img
                                                src={`/images/${potato.potatoName}.png`}
                                                alt=''
                                                className='h-118 w-85 object-cover'
                                            />
                                            <p className='my-5 text-primary'>{potato.potatoName}</p>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )) || (
                            <div className='flex w-full justify-center justify-items-center bg-white'>
                                <p className='mt-70 text-center text-14 text-gray-98'>
                                    No new potatoes at the moment..!
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className='mb-10 h-33 w-70 rounded-4 bg-primary px-10 py-5 text-14 text-white duration-200 hover:scale-105'
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserUpdateModal;
