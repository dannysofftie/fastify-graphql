import { configs } from '@configs';
import * as firebase from 'firebase-admin';

export interface IFirebase {
  /**
   * Push notification to device, for user with id `id`
   *
   * @param {Types.ObjectId} id - user id
   * @param {any} payload - payload to send as the notification message
   *
   * @memberof IFirebase
   */
  pushNotification: (id: string, payload: any) => Promise<any>;

  /**
   * Upload media files to firebase
   *
   * @returns {string} public url for the uploaded file
   *
   * @memberof IFirebase
   */
  uploadBinaryData(params: IGCPUpload): Promise<string>;
  /**
   * Delete files from GCP
   *
   * @param {string[]} urls
   */
  deleteFilesFromBucket(urls: string[]): ReturnType<typeof deleteFilesFromBucket>;
}

// initialize firebase here
firebase.initializeApp({ credential: firebase.credential.cert(configs.firebaseAccountJsonFile), databaseURL: 'https://asder.firebaseio.com', storageBucket: 'gs://asder.iam.gserviceaccount.com' });

const firebaseApp = firebase.app();
const bucket = firebaseApp.storage().bucket('appdomain.com');

export async function pushNotification(_id: string, payload: { title: string; message: string }): Promise<{ message: string; error?: string }> {
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
  const data = { clickAction: 'FLUTTER_NOTIFICATION_CLICK' };
  for (const instance in payload) {
    /* eslint-disable  @typescript-eslint/no-unsafe-call */
    data[instance] = payload[instance]?.toString();
  }
  await firebaseApp.messaging().sendToDevice(token, { notification, data });
  return { message: 'success' };
}

async function uploadBinaryData(opts: IGCPUpload) {
  const remoteStream = bucket.file(opts.remotePath).createWriteStream({
    public: true,
    metadata: {
      'Content-Type': opts.contentType,
    },
  });
  opts.localStream.pipe(remoteStream);
  return `https://storage.googleapis.com/${bucket.name}/${opts.remotePath}`;
}

async function deleteFilesFromBucket(urls: string[]) {
  const deleteResponse = [];
  for (const object of urls) {
    const [response] = await bucket
      .file(object)
      .delete({ ignoreNotFound: true })
      .catch(err => []);
    deleteResponse.push(response?.body);
  }
  return deleteResponse;
}

export default { pushNotification, uploadBinaryData, deleteFilesFromBucket };
