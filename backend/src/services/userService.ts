import User, { IUser } from '../models/User';

/**
 * Find a user by their email address.
 * Explicitly selects the password field because it is excluded by default (select: false).
 */
export const findUserByEmail = async (email: string): Promise<IUser | null> => {
    return User.findOne({ email: email.toLowerCase().trim() }).select('+password');
};


export const findUserById = async (id: string): Promise<IUser | null> => {
    return User.findById(id).select('-password');
};


export const createUser = async (
    name: string,
    email: string,
    hashedPassword: string
): Promise<IUser> => {
    const user = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
    });
    return user;
};
