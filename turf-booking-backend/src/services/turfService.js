import { createTurf, getTurfsByLocation } from '../models/turfModel.js';

export const createNewTurf = async (name, location, adminId, imageUrl) => {
    return await createTurf(name, location, adminId, imageUrl);
};

export const fetchTurfsByLocation = async (location) => {
    if (!location) {
        throw new Error('Location is required');
    }
    return await getTurfsByLocation(location);
};