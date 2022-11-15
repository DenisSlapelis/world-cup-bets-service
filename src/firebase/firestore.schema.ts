import * as admin from 'firebase-admin';

type WatchLater = {
    name: string;
    link: string;
    created_by: string;
    created_at: admin.firestore.Timestamp;
};

export { WatchLater };
