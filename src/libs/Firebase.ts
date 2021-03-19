import { configs } from '@configs';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import * as firebase from 'firebase-admin';
import { readFileSync, unlinkSync } from 'fs';

export interface IFirebase {
    listDirectory: () => Promise<string>;
    /**
     * Push notification to device, for user with id `id`
     *
     * @param {Types.ObjectId} id - user id
     * @param {any} payload - payload to send as the notification message
     *
     * @memberof IFirebase
     */
    pushNotification: (id: string, payload: unknown) => Promise<unknown>;

    /**
     * Upload media files to firebase
     *
     * @param {string} basedir
     * @param {string} filename
     *
     * @returns {string} public absolute url for the uploaded file
     *
     * @memberof IFirebase
     */
    uploadBinaryData: (basedir: string, filename: string) => Promise<string>;
}

const cert = readFileSync(configs.firebaseAccountJsonFile, 'utf-8');

// initialize firebase here
firebase.initializeApp({ credential: firebase.credential.cert(JSON.parse(cert)), databaseURL: 'https://asder.firebaseio.com', storageBucket: 'gs://asder.iam.gserviceaccount.com' });

const firebaseApp = firebase.app();

async function listDirectory(_basedir: string) {
    //
}

export async function pushNotification(
    _id: string,
    payload: {
        title: string;
        message: string;
    }
): Promise<{ message: string; error?: string }> {
    const user = [];

    if (!user.length) {
        return { error: 'user-not-found', message: 'User with id specified could not be found' };
    }

    const token = user[0]['token'];

    if (!token) {
        return { error: 'device-token-not-found', message: 'Device token could not be found' };
    }

    const notification = {
        title: payload?.title?.toString(),
        body: payload?.message?.toString(),
    };

    const data = { click_action: 'FLUTTER_NOTIFICATION_CLICK' };

    for (const instance in payload) {
        /* eslint-disable  @typescript-eslint/no-unsafe-call */
        data[instance] = payload[instance]?.toString();
    }

    await firebaseApp.messaging().sendToDevice(token, { notification, data });

    return { message: 'success' };
}

async function uploadBinaryData(basedir: string, filepath: string) {
    const bucket = firebaseApp.storage().bucket();

    const bucketResponse = await bucket.upload(filepath, { resumable: true, destination: basedir });
    await bucketResponse[0].makePublic();

    try {
        unlinkSync(filepath);
    } catch {
        //
    }
    return `https://storage.googleapis.com/${bucket.name}/${basedir}`;
}

export default fp((app: FastifyInstance, _opts: unknown, done: (err?: Error) => void) => {
    app.decorate('firebase', { listDirectory, pushNotification, uploadBinaryData });

    // pass execution to the next middleware
    done();
});
