import { NativeModules, Platform } from "react-native";

const { RNZalo } = NativeModules;

class RNZaloSDK {
  static start_login() {
    if (Platform.OS === "ios") {
      // const oauth_code = await RNZalo.login();
      return new Promise((resolve, reject) => {
        RNZalo.login()
          .then(oauth_code => {
            this.getProfile()
              .then(data => {
                resolve({ ...data, oauth_code });
              })
              .catch(e => {
                reject(e);
              });
          })
          .catch(e => {
            reject(e);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        RNZalo.login()
          .then(login_data => {
            this.getProfile()
              .then(data => {
                resolve({ ...data, oauth_code: login_data.oauthCode });
              })
              .catch(e => {
                reject(e);
              });
          })
          .catch(e => {
            reject(e);
          });
      });
    }
  }

  // type: 0 - web or app, 1 - app, 2 - web
  static login(type = null) {
    if (type === null) {
      return this.start_login();
    } else {
      return new Promise((resolve, reject) => {
        console.log("call login with type");
        RNZalo.loginWithType(
          type,
          data => {
            resolve({ ...data });
          },
          e => {
            reject(e);
          }
        );
      });
    }
  }

  static getProfile() {
    return new Promise((resolve, reject) => {
      RNZalo.getProfile(
        data => {
          resolve({
            user: data
          });
        },
        e => {
          reject(e);
        }
      );
    });
  }

  static logout() {
    RNZalo.logout();
  }

  static isAuthenticate() {
    return new Promise((resolve, reject) => {
      RNZalo.isAuthenticate(
        data => {
          resolve(data);
        },
        e => {
          reject(e);
        }
      );
    });
  }

  static sendOfficalAccountMessageWith(id, data) {
    return new Promise((resolve, reject) => {
      RNZalo.sendOfficalAccountMessageWith(
        id,
        data,
        data => {
          resolve(data);
        },
        e => {
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
        data => {
          resolve(data);
        },
        e => {
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
        data => {
          resolve(data);
        },
        e => {
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
        data => {
          resolve(data);
        },
        e => {
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
        data => {
          resolve(data);
        },
        e => {
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
        data => {
          resolve(data);
        },
        e => {
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
        data => {
          resolve(data);
        },
        e => {
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
        data => {
          resolve(data);
        },
        e => {
          reject(e);
        }
      );
    });
  }

  static getSettings(args = {}) {
    return new Promise((resolve, reject) => {
      RNZalo.getSettings(
        args,
        data => {
          resolve(data);
        },
        e => {
          reject(e);
        }
      );
    });
  }

  static getDeviceID(args = {}) {
    return new Promise((resolve, reject) => {
      RNZalo.getDeviceID(
        args,
        data => {
          resolve(data);
        },
        e => {
          reject(e);
        }
      );
    });
  }
}

export default RNZaloSDK;
