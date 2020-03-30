import { NativeModules, Platform } from "react-native";

const { RNZalo } = NativeModules;

class RNZaloSDK {
  static start_login() {
    if (Platform.OS === "ios") {
      // const oauth_code = await RNZalo.login();
      return new Promise((resolve, reject) => {
        RNZalo.login()
          .then((oauth_code) => {
            this.getProfile()
              .then((data) => {
                resolve({ ...data, oauth_code });
              })
              .catch((e) => {
                reject(e);
              });
          })
          .catch((e) => {
            reject(e);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        RNZalo.login()
          .then((login_data) => {
            this.getProfile()
              .then((data) => {
                resolve({ ...data, oauth_code: login_data.oauthCode });
              })
              .catch((e) => {
                reject(e);
              });
          })
          .catch((e) => {
            reject(e);
          });
      });
    }
  }

  // type: 0 - web or app, 1 - app, 2 - web
  static login(type: LoginType = LoginType.AppOrWeb) {
    return new Promise((resolve, reject) => {
      console.log("call login with type");
      RNZalo.loginWithType(
        type,
        (data) => {
          resolve({ ...data });
        },
        (e) => {
          reject(e);
        }
      );
    });
  }

  static startExtOauth() {
    return new Promise((resolve, reject) => {
      RNZalo.start_ext_oauth(
        (data) => {
          resolve(data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  static registerZalo() {
    return new Promise((resolve, reject) => {
      RNZalo.RegisterZalo(
        (data) => {
          resolve(data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  static checkZaloLoginStatus() {
    return new Promise((resolve, reject) => {
      RNZalo.CheckZaloLoginStatus(
        (data) => {
          resolve(data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  static getProfile() {
    return new Promise((resolve, reject) => {
      RNZalo.getProfile(
        (data) => {
          resolve({
            user: data,
          });
        },
        (e) => {
          reject(e);
        }
      );
    });
  }

  static logout() {
    return new Promise((resolve, reject) => {
      RNZalo.logout((data) => {
        resolve(data);
      });
    });
  }

  static isAuthenticate() {
    return new Promise((resolve, reject) => {
      RNZalo.isAuthenticate(
        (data) => {
          resolve(data);
        },
        (e) => {
          reject(e);
        }
      );
    });
  }

  static sendOfficalAccountMessageWith(id: string, data: string) {
    return new Promise((resolve, reject) => {
      RNZalo.sendOfficalAccountMessageWith(
        id,
        data,
        (data) => {
          resolve(data);
        },
        (e) => {
          reject(e);
        }
      );
    });
  }

  static sendMessageTo(friend_id, message, link) {
    return new Promise((resolve, reject) => {
      RNZalo.sendMessageTo(
        friend_id,
        message,
        link,
        (data) => {
          resolve(data);
        },
        (e) => {
          reject(e);
        }
      );
    });
  }

  static sendAppRequestTo(friend_id, message) {
    return new Promise((resolve, reject) => {
      RNZalo.sendAppRequestTo(
        friend_id,
        message,
        (data) => {
          resolve(data);
        },
        (e) => {
          reject(e);
        }
      );
    });
  }

  static postFeedWithMessage(message, link) {
    return new Promise((resolve, reject) => {
      RNZalo.postFeedWithMessage(
        message,
        link,
        (data) => {
          resolve(data);
        },
        (e) => {
          reject(e);
        }
      );
    });
  }

  static getUserFriendListAtOffset(offset_start, count) {
    return new Promise((resolve, reject) => {
      RNZalo.getUserFriendListAtOffset(
        offset_start,
        count,
        (data) => {
          resolve(data);
        },
        (e) => {
          reject(e);
        }
      );
    });
  }

  static getUserInvitableFriendListAtOffset(offset_start, count) {
    return new Promise((resolve, reject) => {
      RNZalo.getUserInvitableFriendListAtOffset(
        offset_start,
        count,
        (data) => {
          resolve(data);
        },
        (e) => {
          reject(e);
        }
      );
    });
  }

  static shareMessage(message, app_name, link, dict_others) {
    return new Promise((resolve, reject) => {
      RNZalo.shareMessage(
        message,
        app_name,
        link,
        dict_others,
        (data) => {
          resolve(data);
        },
        (e) => {
          reject(e);
        }
      );
    });
  }

  static shareFeed(message, app_name, link, dict_others) {
    return new Promise((resolve, reject) => {
      RNZalo.shareFeed(
        message,
        app_name,
        link,
        dict_others,
        (data) => {
          resolve(data);
        },
        (e) => {
          reject(e);
        }
      );
    });
  }

  static getSettings(args = {}) {
    return new Promise((resolve, reject) => {
      RNZalo.getSettings(
        args,
        (data) => {
          resolve(data);
        },
        (e) => {
          reject(e);
        }
      );
    });
  }

  static getDeviceID(args = {}) {
    return new Promise((resolve, reject) => {
      RNZalo.getDeviceID(
        args,
        (data) => {
          resolve(data);
        },
        (e) => {
          reject(e);
        }
      );
    });
  }
}

export default RNZaloSDK;
export const LoginType = {
  AppOrWeb: 0,
  App: 1,
  Web: 2,
};
export const ErrorCode = {
  NoErr: 0,
  UnknownError: -1,
  PermissionDenied: -201,
  UserBack: -1111,
  UserReject: -1114,
  ZaloUnknownError: -1112,
  ZaloWebviewLoginNotAllowed: -1118,
  UnexpectedError: -1000,
  InvalidAppId: -1001,
  InvalidParam: -1002,
  InvalidSecretKey: -1003,
  InvalidOauthCode: -1004,
  AcessDenied: -1005,
  InvalidSession: -1006,
  CreateOauthFailed: -1007,
  CreateAccessTokenFailed: -1008,
  UserConsentFailed: -1009,
  ApplicationIsNotApproved: -1014,
  ZaloOauthInvalid: -1019,
  ZaloWebviewNoNetwork: -1021,
  ZaloSDKNoInternetAccess: -1022,
  ZaloApplicationNotInstalled: -1024,
  ZaloOutOfDate: -1025,
  CantLoginGoogle: -1205,
  CantLoginFacebook: -1105,
};
