/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { model, Schema } from 'mongoose';

/** constants */
import { MessengerDatabaseKey } from '@module-messenger/constants/key';

/** types */

export const AttachmentSchema = new Schema<
    App.ModuleMessenger.Data.TypeAttachment,
    App.ModuleMessenger.Model.AttachmentModel
>(
    {
        url: { type: String, required: true },
        fileType: { type: String, enum: ['image', 'video', 'file'], required: true },
        fileName: { type: String, required: true },
        fileSize: { type: Number, required: true }
    },
    { timestamps: true }
);

// AttachmentSchema.statics = {
//     create: async function (
//         payload: App.ModuleMessenger.Model.Attachments['Create']['Payload']
//     ): App.ModuleMessenger.Model.Attachments['Create']['Return'] {
//         //
//     }
// };

export const AttachmentModel = model<
    App.ModuleMessenger.Data.TypeAttachment,
    App.ModuleMessenger.Model.AttachmentModel
>(MessengerDatabaseKey.Attachments, AttachmentSchema);
