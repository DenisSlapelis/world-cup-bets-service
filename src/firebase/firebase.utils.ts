import environment from '../environment/environment';
import * as admin from 'firebase-admin';

/**
 * The FirebaseUtils class defines the `getInstance` method that lets clients access
 * the unique Firestore instance.
 */
class FirebaseUtils {
    private static instance: FirebaseUtils;
    admin: admin.app.App;
    firestore: FirebaseFirestore.Firestore;

    /**
     * The FirebaseUtils's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    private constructor() {
        this.admin = this.initializeDefaultApp();
        this.firestore = this.admin.firestore();
    }

    public static getInstance(): FirebaseUtils {
        if (!FirebaseUtils.instance) {
            FirebaseUtils.instance = new FirebaseUtils();
        }

        return FirebaseUtils.instance;
    }

    public getDocumentsFromCollection(snapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>): Array<any> {
        const result: Array<any> = [];

        snapshot.forEach((document) => {
            result.push(document.data());
        });

        return result;
    }

    private initializeDefaultApp = () => {
        if (environment.nodeEnv === 'develop' && environment.keyFilename) {
            const serviceAccount = environment.keyFilename;

            return admin.initializeApp(
                {
                    credential: admin.credential.cert(serviceAccount),
                },
                'sync-watch-later-service'
            );
        } else {
            return admin.initializeApp();
        }
    };
}

const firebase = FirebaseUtils.getInstance();

export default firebase;
