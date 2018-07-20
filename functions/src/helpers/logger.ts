import * as admin from "firebase-admin";

export class Logger {
  constructor(private _db) {
    this._db = _db;
  }

  async logEvent(message: string, args: any, source: string) {
    const dbRef = this._db.collection(`events`);
    const data:any = {
      timestamp: new Date().toISOString(),
      message: message,
      source: source
    };

    if( args.user ) {
      data.user = args.user;
    }

    if( args.comment ) {
      data.comment = args.comment;
    }

    return dbRef.doc().set(data);

  }
}
