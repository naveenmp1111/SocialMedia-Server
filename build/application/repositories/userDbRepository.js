"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDbRepository = void 0;
const userDbRepository = (repository) => {
    const addUser = async (user) => await repository.addUser(user);
    const getUserByEmail = async (email) => await repository.getUserByEmail(email);
    const getUserByUsername = async (username) => await repository.getUserByUsername(username);
    return {
        addUser,
        getUserByEmail,
        getUserByUsername
    };
};
exports.userDbRepository = userDbRepository;
