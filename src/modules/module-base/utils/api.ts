/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { ReasonPhrases } from 'http-status-codes';

export const genResponse = <Data = unknown, Metadata = Record<string, unknown>>(
    payload: Partial<App.ModuleBase.Api.ApiResponse<Data, Metadata>> = {}
): App.ModuleBase.Api.ApiResponse<Data, Metadata> => {
    const { message = ReasonPhrases.OK, data = null, metadata = {} as Metadata } = payload;

    return {
        message,
        data,
        metadata: {
            ...metadata,
            timestamp: new Date().toISOString()
        }
    };
};
