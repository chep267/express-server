/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

export interface TypeUser {
    _id: string;

    /**
     * The display name of the user.
     */
    name: string | null;
    /**
     * The email of the user.
     */
    email: string | null;
    /**
     * The phone number normalized based on the E.164 standard (e.g. +16505550101) for the
     * user.
     *
     * @remarks
     * This is null if the user has no phone credential linked to the account.
     */
    phone: string | null;
    /**
     * The profile photo URL of the user.
     */
    photo: string | null;
    uid: string;
    role: string;
    createdAt?: string;
    updatedAt?: string;
}
