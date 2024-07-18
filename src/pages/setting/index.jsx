import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import FormInput from '../../components/common/input/index';

// Nickname 서버에서 가져오기
//? 메모리에 1번만 로드되어서 성능 최적화에 괜찮다고 생각해서 Setting 컴포넌트 밖에 둠
const fetchNicknameFromServer = async () => {
    //API 호출 위치
    // try {
    //     const response = await axios.get('/api/nickname');
    //     return response.data.nickname;
    // } catch (error) {
    //     console.error('Failed to fetch nickname from server', error);
    //     return 'serverNickname';
    // }

    // 임시 데이터(나중에 삭제하기)
    return 'serverNickname';
};

const Setting = () => {
    const { id } = useParams();
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState({ nickname: '' });
    const [isFormValid, setIsFormValid] = useState(false);
    // Github, Baekjoon 연동 (연동되지않았다=false)
    const [isBaekjoonConnected, setIsBaekjoonConnected] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // 닉네임 편집 상태

    // Nickname에 error 또는 빈 input 인지 확인
    const validateForm = () => {
        return Object.values(error).every((err) => !err) && nickname.trim() !== '';
    };

    useEffect(() => {
        // 사용자 id별 Setting Page 로드
        const fetchUser = async () => {
            try {
                const response = await axios.get(`setting:${id}`);
                setNickname(response.data.nickname);
            } catch (error) {
                console.error('Failed to fetch user from server', error);
            }
        };

        // 사용자 Nickname 가져오기
        const getNickname = async () => {
            try {
                const serverNickname = await fetchNicknameFromServer();
                setNickname(serverNickname);
            } catch (err) {
                console.error('Failed to fetch nickname from server', err);
                setNickname('serverNickname');
            }
        };

        // Github, Baekjoon 연동 상태 가져오기
        const fetchConnections = async () => {
            try {
                // const response = await axios.get(`/api/account-connections`);
                // setIsGithubConnected(response.data.github);
                // setIsBaekjoonConnected(response.data.baekjoon);

                // 서버통신 전 버튼작동 확인 용 임시 코드 (나중에 삭제하기)
                const response = { data: { github: false, baekjoon: false } };
                setIsGithubConnected(response.data.github);
                setIsBaekjoonConnected(response.data.baekjoon);
            } catch (error) {
                console.error('Failed to fetch account connections', error);
                setIsGithubConnected(false);
                setIsBaekjoonConnected(false);
            }
        };

        fetchUser();
        getNickname();
        fetchConnections();
    }, [id]);

    // Nickname 입력창 클릭 시 편집 상태로 전환
    const handleClickNicknameInput = () => {
        setIsEditing(true);
    };

    // Nickname Rename
    const handleNicknameChange = async () => {
        if (validateForm()) {
            try {
                // API 호출 위치
                // Nickname 업데이트 요청
                // await axios.put('/api/nickname', { nickname });
                // setNickname(nickname);
                // setError({ ...error, nickname: '' });

                setIsEditing(false);
                alert('Nickname updated successfully');
            } catch (error) {
                console.error('Failed to change nickname', error);
                alert('Failed to change nickname. Please try again.');
            }
        } else {
            setError({ ...error, nickname: 'Please enter a valid nickname' });
        }
    };

    // Github, Baekjoon 계정 연동 모달 띄우기 (oAuth)
    const handleConnect = (platform) => {
        alert(`Connect ${platform} Account`);
        // 여기에 연동 모달 띄우기 추가하기

        // 서버통신전 버튼 작동 확인용 임시 코드 (나중에 삭제하기)
        if (platform === 'Github') {
            setIsGithubConnected(true);
        } else if (platform === 'Baekjoon') {
            setIsBaekjoonConnected(true);
        }
    };

    // Account Delete
    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            'Are you sure you want to delete your account? \nThis action cannot be undone.'
        );
        if (confirmed) {
            // try {
            //     await axios.delete('/api/account');
            //     alert('Your account has been deleted.');
            // } catch (error) {
            //     console.error('Failed to delete account', error);
            //     alert('Failed to delete account');
            // }

            // 확인용 (나중에 삭제하기)
            alert('Account deleted successfully');
        }
    };

    return (
        <div className='m-ful flex h-[100vh] w-full flex-col items-center'>
            <div className='relative h-250 w-[calc(100%-500px)] min-w-627 pt-50'>
                <h1 className='h-auto min-w-0 border-b border-gray-300 text-32'>General</h1>
                <div className='mt-15'>
                    <div className='flex items-start'>
                        <div className='h-150'>
                            {isEditing ? (
                                <FormInput
                                    id='userNickname'
                                    label='My Nickname'
                                    type='text'
                                    placeholder='Please Enter Your Nickname'
                                    error={error.nickname}
                                    setError={(errorMsg) => setError({ ...error, nickname: errorMsg })}
                                    onChange={(e) => setNickname(e.target.value)}
                                    value={nickname}
                                    isFormValid={isFormValid}
                                    setIsFormValid={setIsFormValid}
                                    className='w-520 min-w-100'
                                />
                            ) : (
                                <div className='my-8 inline-flex h-auto w-auto flex-col items-start justify-start gap-2'>
                                    <label htmlFor={id} className='mb-3 text-16 text-black'>
                                        My Nickname
                                    </label>
                                    <span
                                        onClick={handleClickNicknameInput}
                                        className='inline-flex h-50 min-w-100 cursor-pointer items-center justify-start gap-2.5 rounded-4 border bg-white px-16 py-15'
                                    >
                                        {nickname}
                                    </span>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleNicknameChange}
                            className={`${
                                isEditing ? 'bg-primary' : 'bg-gray-db'
                            } ml-4 mt-40 h-44 w-101 rounded text-white duration-200`}
                            disabled={!isEditing}
                        >
                            Rename
                        </button>
                    </div>
                </div>
            </div>
            <div className='relative h-250 w-[calc(100%-500px)] min-w-627 pt-50'>
                <h1 className='h-auto min-w-0 border-b border-gray-300 text-32'>Connect</h1>
                <div className='mt-15 flex w-520 flex-col'>
                    <div className='ml-3 flex h-55 w-300 items-center justify-between'>
                        <span className='flex items-center'>
                            <img src='../../../public/potato.svg' className='h-42 w-42 rounded-full bg-blue' />
                            <p className='ml-5 text-20'>Baekjoon</p>
                        </span>
                        <button
                            className={`left-535 top-142 ml-4 h-44 w-108 rounded text-16 text-white duration-200 hover:scale-105 ${
                                isBaekjoonConnected ? 'bg-gray-db' : 'bg-primary'
                            }`}
                            onClick={() => !isBaekjoonConnected && handleConnect('Baekjoon')}
                            disabled={isBaekjoonConnected}
                        >
                            {isBaekjoonConnected ? 'Connected' : 'Connect'}
                        </button>
                    </div>
                </div>
            </div>
            <div className='relative h-250 w-[calc(100%-500px)] min-w-627 pt-50'>
                <h1 className='h-auto min-w-0 border-b border-gray-300 text-32'>Danger</h1>
                <div className='mt-15 flex w-520 flex-col'>
                    <div className='flex h-55 w-866 items-center'>
                        <span>
                            <p className='font-bold'>Delete your Account</p>
                            <p className='w-688 text-14'>
                                Your potato data will be permanently deleted. This action cannot be undone. Please
                                confirm your decision.
                            </p>
                        </span>
                        <button
                            type='button'
                            onClick={handleDeleteAccount}
                            className='mr-3 h-44 w-147 rounded bg-[#f3f3f3] text-16 text-red duration-200 hover:scale-105'
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Setting;
