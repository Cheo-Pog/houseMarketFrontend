import { defineStore } from 'pinia';
import axios from '../axios-auth';

export const houseStore = defineStore('store',
    {
        state: () => ({
            history: [],
            favoriteHouses: [],
        }),
        getters: {
            getHistory(state) {
                let history = [...state.history].reverse();
                let uniqueHistory = history.filter((house, index, self) =>
                    index === self.findIndex((h) => h.id === house.id)
                );
                return uniqueHistory;
            },
            getFavoriteHouses(state) {
                return state.favoriteHouses;
            },
            
        },
        actions: {
            async fetchHouses() {
                try {
                    const response = await axios.get("/houses");
                    return response.data;
                } catch (error) {
                    console.error(error);
                }
            },
            async fetchHouse(id) {
                try {
                    const response = await axios.get(`/houses/${id}`);
                    this.history.push(response.data[0]);
                    return response.data[0];
                } catch (error) {
                    console.error(error);
                }
            },
            async deleteHouse(id) {
                try {
                    await axios.delete(`/houses/${id}`);
                } catch (error) {
                    console.error(error);
                }
            },
            favoriteHouse(house) {
                const index = this.favoriteHouses.findIndex((h) => h.id === house.id);
                if (index === -1) {
                    this.favoriteHouses.push(house);
                    return true
                } else {
                    this.favoriteHouses.splice(index, 1);
                    return false;
                }
            }
        }
    })