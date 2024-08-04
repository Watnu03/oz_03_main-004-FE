import React, { useEffect, useState } from 'react';
import usePotatoStore from '../../../store/usePotatoStore';
import descriptionData from '../../../assets/description.json';
import Loading from '../../common/loading';
import Alert from '../../common/alert';

const Potato = () => {
    const [selectedPotato, setSelectedPotato] = useState(null);
    const [coinCount, setCoinCount] = useState(0);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const { userPotatoes, fetchUserPotatoes } = usePotatoStore((state) => ({
        userPotatoes: state.userPotatoes,
        fetchUserPotatoes: state.fetchUserPotatoes,
    }));

    // description.json에서 id로 데이터를 찾는 함수
    const getDescriptionById = (id) => {
        if (!id) return null;
        const description = descriptionData.find((item) => item.id === id.toString());

        return description;
    };

    useEffect(() => {
        const initializeData = async () => {
            setLoading(true);
            try {
                await fetchUserPotatoes();
            } catch (err) {
                setError('Failed to fetch potatoes');
            }
            setLoading(false);
        };

        initializeData();
    }, [fetchUserPotatoes]);

    useEffect(() => {
        const selected = userPotatoes.find((potato) => potato.isSelected);

        if (selected && selected.type) {
            const description = getDescriptionById(selected.type);

            setSelectedPotato(description);
        } else {
            setSelectedPotato(null);
        }
    }, [userPotatoes]);

    if (loading) return <Loading />;
    if (error) return <Alert message={error} />;

    return (
        <div className='flex h-auto w-auto flex-col items-center'>
            <div className='flex w-full justify-center'>
                <img src='/images/coin.png' className='mb-30 mr-5 h-20 w-20 text-14' alt='Coin' /> : {coinCount}
            </div>
            {selectedPotato ? (
                <div>
                    <img
                        src={`/images/${selectedPotato.name}.png`}
                        alt='Selected Potato'
                        className='hwide:h-120 hwide:w-150 wide:h-118 wide:w-85'
                    />
                </div>
            ) : (
                <p className='mt-55 items-center justify-center text-gray-98'>No potato selected.</p>
            )}
        </div>
    );
};

export default Potato;
