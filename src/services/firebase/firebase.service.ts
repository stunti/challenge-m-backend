import * as firebase from "firebase-admin";
import * as serviceAccount from "../../config/challenge-m-backend-cacde0f5638f.json";
import { Injectable } from "@nestjs/common";

const params = {
  type: serviceAccount.type,
  projectId: serviceAccount.project_id,
  privateKeyId: serviceAccount.private_key_id,
  privateKey: serviceAccount.private_key,
  clientEmail: serviceAccount.client_email,
  clientId: serviceAccount.client_id,
  authUri: serviceAccount.auth_uri,
  tokenUri: serviceAccount.token_uri,
  authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
  clientC509CertUrl: serviceAccount.client_x509_cert_url
};

@Injectable()
export class FirebaseService {
  private static app;

  constructor() {
    if (FirebaseService.app == null) {
      FirebaseService.init();
    }
  }

  static init(): void {
    FirebaseService.app = firebase.initializeApp({
      databaseURL: "https://challenge-m-backend.firebaseio.com",
      credential: firebase.credential.cert(params)
    });
  }

  getApp(): any {
    return FirebaseService.app;
  }
}
