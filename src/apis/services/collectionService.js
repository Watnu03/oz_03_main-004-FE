import { potatoAPI } from '../api/potato';

export const collectionService = {
    getAllPotatoTypes: async () => {
        try {
            const allPotatoes = await potatoAPI.getAllPotatoTypes();
            return allPotatoes.map((potato) => ({
                id: potato.id,
                name: potato.potato_name,
                description: potato.potato_description,
            }));
        } catch (error) {
            console.error('Error fetching all potato types:', error);
            throw error;
        }
    },
    getUserPotatoes: async () => {
        try {
            const myPotatoes = await potatoAPI.getUserPotatoes();
            return myPotatoes.map((potato) => ({
                id: potato.id,
                user: potato.user,
                type: potato.potato_type,
                isAcquired: potato.is_acquired,
                isSelected: potato.is_selected,
            }));
        } catch (error) {
            console.error('Error fetching user potatoes:', error);
            throw error;
        }
    },

    getPotatoImages: (files, allPotatoes, ownedPotatoes) => {
        return files.map((fileName, i) => {
            const imagePath = `/images/${fileName}.png`;
            const title = fileName;
            const potatoTypeId = allPotatoes.find((item) => item.name === fileName)?.id;
            const isAcquired = ownedPotatoes.some((potato) => potato.type === potatoTypeId && potato.isAcquired);

            return {
                id: i + 1,
                imagePath,
                title,
                isAcquired,
            };
        });
    },

    updateSelectedPotato: async (potatoType) => {
        try {
            const response = await potatoAPI.updateUserPotato(potatoType);
            return response;
        } catch (error) {
            console.error('Error updating selected potato:', error);
            throw error;
        }
    },

    getUserPotatoDetails: async () => {
        try {
            const allPotatoes = await potatoAPI.getAllPotatoTypes();
            const userPotatoes = await potatoAPI.getUserPotatoes();

            const userPotatoDetails = userPotatoes.map((userPotato) => {
                const potatoInfo = allPotatoes.find((potato) => potato.id === userPotato.potato_type);
                return {
                    potatoId: userPotato.potato_type,
                    name: potatoInfo ? potatoInfo.potato_name : 'Unknown Potato',
                    isAcquired: userPotato.is_acquired,
                    description: potatoInfo ? potatoInfo.potato_description : 'No description available.',
                };
            });
            return userPotatoDetails;
        } catch (error) {
            console.error('Error fetching user potato details:', error);
            throw error;
        }
    },
};
