import * as admin from 'firebase-admin';

export async function isSandbox(): Promise<boolean> {

  const snapshot = await admin
    .database()
    .ref('settings/sandbox')
    .once('value');

    if(!snapshot.exists()) {
      return false;
    }
    return snapshot.val();
}
