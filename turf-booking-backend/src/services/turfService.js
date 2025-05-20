import { createTurf, getTurfsByLocation, getTurfById } from '../models/turfModel.js';

export const createNewTurf = async (name, location, adminId, imageUrl) => {
    return await createTurf(name, location, adminId, imageUrl);
};

export const fetchTurfsByLocation = async (location) => {
    if (!location) {
        throw new Error('Location is required');
    }
    return await getTurfsByLocation(location);
};

export const fetchTurfById = async (id) => {
    if (!id) {
        throw new Error('ID is required');
    }
    return await getTurfById(id);
};