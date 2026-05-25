/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { ReasonPhrases } from 'http-status-codes';

export const genResponse = <Data = unknown>(
    payload?: App.ModuleBase.Api.ApiResponse<Data>
): App.ModuleBase.Api.ApiResponse<Data> => {
    return {
        message: payload?.message || ReasonPhrases.OK,
        data: payload?.data,
        metadata: {
            timestamp: Date.now(),
            ...payload?.metadata
        }
    };
};
