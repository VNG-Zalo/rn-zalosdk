package rnzalo;

import android.app.Activity;
import android.content.Intent;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.zing.zalo.zalosdk.kotlin.analytics.EventStorage;
import com.zing.zalo.zalosdk.kotlin.analytics.model.Event;
import com.zing.zalo.zalosdk.kotlin.core.devicetrackingsdk.DeviceTracking;
import com.zing.zalo.zalosdk.kotlin.core.helper.AppInfo;
import com.zing.zalo.zalosdk.kotlin.core.settings.SettingsManager;
import com.zing.zalo.zalosdk.kotlin.oauth.IAuthenticateCompleteListener;
import com.zing.zalo.zalosdk.kotlin.oauth.LoginVia;
import com.zing.zalo.zalosdk.kotlin.oauth.ZaloSDK;
import com.zing.zalo.zalosdk.kotlin.oauth.callback.GetZaloLoginStatus;
import com.zing.zalo.zalosdk.kotlin.oauth.callback.ValidateOAuthCodeCallback;
import com.zing.zalo.zalosdk.kotlin.openapi.ZaloOpenApi;
import com.zing.zalo.zalosdk.kotlin.openapi.ZaloOpenApiCallback;
import com.zing.zalo.zalosdk.kotlin.openapi.ZaloPluginCallback;
import com.zing.zalo.zalosdk.kotlin.openapi.model.FeedData;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Map;

public class RNZaloModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    private final ReactApplicationContext mReactContext;
    private ZaloSDK mSDk;
    private ZaloOpenApi mOpenAPI;


    public RNZaloModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.mReactContext = reactContext;
        this.mReactContext.addActivityEventListener(this);
        this.mSDk = new ZaloSDK(reactContext);
        this.mOpenAPI = null;
    }

    @ReactMethod
    public void start_ext_oauth(final Callback successCallback, final Callback failureCallback) {
        Intent intent =new Intent(this.mReactContext, rnzalo.ExtLoginActivity.class) ;
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        this.mReactContext.startActivity(intent);
        final WritableMap params = Arguments.createMap();
        successCallback.invoke(params);
    }
    @ReactMethod
    public void login(final Promise promise) {
        this.mSDk.unAuthenticate();
        this.mSDk.authenticate(this.mReactContext.getCurrentActivity(), LoginVia.APP_OR_WEB, new IAuthenticateCompleteListener() {

            @Override
            public void onAuthenticateSuccess(long uid, @NotNull String oauthCode, @NotNull Map<String, ?> data) {
                final WritableMap params = Arguments.createMap();
                params.putString("uId", "" + uid);
                params.putString("oauthCode", "" + oauthCode);
                for (Map.Entry<String, ?> entry : data.entrySet()) {
                    params.putString(entry.getKey(), String.valueOf(entry.getValue()));
                }
                mOpenAPI = new ZaloOpenApi(mReactContext, oauthCode);
                promise.resolve(params);
            }

            @Override
            public void onAuthenticateError(int errorCode, @NotNull String message) {
                final String code = errorCode + "";
                promise.reject(code, message);
            }
        });
    }

    @ReactMethod
    public void loginWithType(int type, final Callback successCallback, final Callback errorCallback) {
        LoginVia login_type = LoginVia.APP_OR_WEB;
        switch (type) {
            case 1:
                login_type = LoginVia.APP;
                break;
            case 2:
                login_type = LoginVia.WEB;
                break;
        }
        this.mSDk.authenticate(this.mReactContext.getCurrentActivity(), login_type, new IAuthenticateCompleteListener() {

            @Override
            public void onAuthenticateSuccess(long uid, @NotNull String oauthCode, @NotNull Map<String, ?> data) {
                final WritableMap params = Arguments.createMap();
                params.putString("uId", "" + uid);
                params.putString("oauth_code", "" + oauthCode);
                for (Map.Entry<String, ?> entry : data.entrySet()) {
                    params.putString(entry.getKey(), String.valueOf(entry.getValue()));
                }
                mOpenAPI = new ZaloOpenApi(mReactContext, oauthCode);
                successCallback.invoke(params);
            }

            @Override
            public void onAuthenticateError(int errorCode, @NotNull String message) {
                final WritableMap err = Arguments.createMap();
                err.putInt("error_code", errorCode);
                err.putString("error_message", message);
                errorCallback.invoke(err);
            }
        });
    }

    @ReactMethod
    public void logout(Callback successCallback) {
        this.mSDk.unAuthenticate();
        this.mOpenAPI = null;

        WritableMap params = Arguments.createMap();
        successCallback.invoke(params);
    }

    @ReactMethod
    public void RegisterZalo(final Callback successCallback, final  Callback errorCallback) {
        this.mSDk.registerZalo(this.mReactContext.getCurrentActivity(), new IAuthenticateCompleteListener() {
            @Override
            public void onAuthenticateSuccess(long uid, @NotNull String oauth_code, @NotNull Map<String, ?> data) {
                WritableMap params = Arguments.createMap();
                params.putString("uId", "" + uid);
                params.putString("oauth_code", "" + oauth_code);
                for (Map.Entry<String, ?> entry : data.entrySet()) {
                    params.putString(entry.getKey(), String.valueOf(entry.getValue()));
                }
                mOpenAPI = new ZaloOpenApi(mReactContext, oauth_code);
                successCallback.invoke(params);
            }

            @Override
            public void onAuthenticateError(int i, @NotNull String s) {

                WritableMap params = Arguments.createMap();
                params.putInt("error_code", i);
                params.putString("error_message", s);
                errorCallback.invoke(params);
            }
        });

    }

    @ReactMethod
    public void CheckZaloLoginStatus(final Callback successCallback, final Callback errorCallback) {
        this.mSDk.getZaloLoginStatus(new GetZaloLoginStatus() {
            @Override
            public void onGetZaloLoginStatusCompleted(int status) {
                if (status >= 0 && status < 2) {
                    final WritableMap params = Arguments.createMap();
                    params.putInt("status", status);
                    successCallback.invoke(params);
                } else {
                    final WritableMap params = Arguments.createMap();
                    params.putInt("error_code", status);
                    errorCallback.invoke(params);
                }
            }
        });
    }

    @ReactMethod
    public int isAuthenticate(final Callback successCallback, final Callback errorCallback) {
        this.mSDk.isAuthenticate(
                new ValidateOAuthCodeCallback() {
                    @Override
                    public void onValidateComplete(boolean validated, int errorCode, long uid, String oauthCode) {
                        if (validated) {
                            final WritableMap params = Arguments.createMap();
                            params.putString("uId", "" + uid);
                            params.putString("oauth_code", oauthCode);
                            mOpenAPI = new ZaloOpenApi(mReactContext, oauthCode);
                            successCallback.invoke(params);
                        } else {
                            final WritableMap err = Arguments.createMap();
                            err.putInt("error_code", errorCode);
                            errorCallback.invoke(err);
                        }

                    }
                });

        return 0;
    }

    @Override
    public String getName() {
        return "RNZalo";
    }

    @ReactMethod
    public int getProfile(final Callback successCallback, final Callback errorCallback) {
        final String[] Fields = {"id", "birthday", "gender", "picture", "name"};
        if (this.mOpenAPI == null) {
            final WritableMap err = Arguments.createMap();
            err.putString("error_message", "Not authentication");
            errorCallback.invoke(err);
            return -1;
        }
        this.mOpenAPI.getProfile(Fields, new ZaloOpenApiCallback() {
            @Override
            public void onResult(JSONObject data) {
                try {
                    WritableMap user = UtilService.convertJsonToMap(data);
                    successCallback.invoke(user);
                } catch (Exception ex) {
                    final WritableMap err = Arguments.createMap();
                    err.putString("error_message", ex.getMessage());
                    err.putString("error_trace", ex.toString());
                    errorCallback.invoke(err);
                }
            }
        });
        return 0;
    }

    @ReactMethod
    public int sendOfficalAccontMassageWith(String id, String data, Callback successCallback, Callback errorCallback) {
        final WritableMap err = Arguments.createMap();
        err.putString("error_message", "RNZaloSDK not suppport for android");
        errorCallback.invoke(err);
        return -1;
    }

    @ReactMethod
    public int sendMessageTo(String friend_id, String message, String link, final Callback successCallback, final Callback errorCallback) {
        if (this.mOpenAPI == null) {
            final WritableMap err = Arguments.createMap();
            err.putString("error_message", "Not authentication");
            errorCallback.invoke(err);
            return -1;
        }
        this.mOpenAPI.sendMsgToFriend(friend_id, message, link, new ZaloOpenApiCallback() {
            @Override
            public void onResult(JSONObject data) {
                try {
                    WritableMap user = UtilService.convertJsonToMap(data);
                    successCallback.invoke(user);
                } catch (Exception ex) {
                    final WritableMap err = Arguments.createMap();
                    err.putString("error_message", ex.getMessage());
                    err.putString("error_trace", ex.toString());
                    errorCallback.invoke(err);
                }
            }
        });
        return 0;
    }

    @ReactMethod
    public int sendAppRequestTo(String friend_id, String message, final Callback successCallback, final Callback errorCallback) {
        if (this.mOpenAPI == null) {
            final WritableMap err = Arguments.createMap();
            err.putString("error_message", "Not authentication");
            errorCallback.invoke(err);
            return -1;
        }
        this.mOpenAPI.inviteFriendUseApp(friend_id.split(","), message, new ZaloOpenApiCallback() {
            @Override
            public void onResult(JSONObject data) {
                try {
                    WritableMap user = UtilService.convertJsonToMap(data);
                    successCallback.invoke(user);
                } catch (Exception ex) {
                    final WritableMap err = Arguments.createMap();
                    err.putString("error_message", ex.getMessage());
                    err.putString("error_trace", ex.toString());
                    errorCallback.invoke(err);
                }
            }
        });
        return 0;
    }

    @ReactMethod
    public int postFeedWithMessage(String message, String link, final Callback successCallback, final Callback errorCallback) {
        if (this.mOpenAPI == null) {
            final WritableMap err = Arguments.createMap();
            err.putString("error_message", "Not authentication");
            errorCallback.invoke(err);
            return -1;
        }
        this.mOpenAPI.postToWall(link, message, new ZaloOpenApiCallback() {
            @Override
            public void onResult(JSONObject data) {
                try {
                    WritableMap user = UtilService.convertJsonToMap(data);
                    successCallback.invoke(user);
                } catch (Exception ex) {
                    final WritableMap err = Arguments.createMap();
                    err.putString("error_message", ex.getMessage());
                    err.putString("error_trace", ex.toString());
                    errorCallback.invoke(err);
                }
            }
        });
        return 0;
    }

    @ReactMethod
    public int getUserFriendListAtOffset(int start, int count, final Callback successCallback, final Callback errorCallback) {
        if (this.mOpenAPI == null) {
            final WritableMap err = Arguments.createMap();
            err.putString("error_message", "Not authentication");
            errorCallback.invoke(err);
            return -1;
        }
        this.mOpenAPI.getFriendListUsedApp(
                new String[]{
                        "id", "name", "gender", "picture"
                }
                , start, count, new ZaloOpenApiCallback() {
                    @Override
                    public void onResult(JSONObject data) {
                        try {
                            WritableMap user = UtilService.convertJsonToMap(data);
                            successCallback.invoke(user);
                        } catch (Exception ex) {
                            final WritableMap err = Arguments.createMap();
                            err.putString("error_message", ex.getMessage());
                            err.putString("error_trace", ex.toString());
                            errorCallback.invoke(err);
                        }
                    }
                });
        return 0;
    }

    @ReactMethod
    public int getUserInvitableFriendListAtOffset(int start, int count, final Callback successCallback, final Callback errorCallback) {
        if (this.mOpenAPI == null) {
            final WritableMap err = Arguments.createMap();
            err.putString("error_message", "Not authentication");
            errorCallback.invoke(err);
            return -1;
        }
        this.mOpenAPI.getFriendListInvitable(
                new String[]{
                        "id", "name", "gender", "picture"
                },
                start,
                count,
                new ZaloOpenApiCallback() {
                    @Override
                    public void onResult(JSONObject data) {
                        try {
                            WritableMap user = UtilService.convertJsonToMap(data);
                            successCallback.invoke(user);
                        } catch (Exception ex) {
                            final WritableMap err = Arguments.createMap();
                            err.putString("error_message", ex.getMessage());
                            err.putString("error_trace", ex.toString());
                            errorCallback.invoke(err);
                        }
                    }
                });
        return 0;
    }

    @ReactMethod
    public int shareMessage(String message, String app_name, String link, ReadableMap dict_others, final Callback successCallback, final Callback errorCallback) {
        if (this.mOpenAPI == null) {
            final WritableMap err = Arguments.createMap();
            err.putString("error_message", "Not authentication");
            errorCallback.invoke(err);
            return -1;
        }
        FeedData feed_data = new FeedData(message, "", link, new ArrayList<String>(), "", "");
        this.mOpenAPI.shareMessage(feed_data, new ZaloPluginCallback() {
            @Override
            public void onResult(boolean isSuccess, int errCode, @Nullable String messageStr, @Nullable String jsonStr) {
                if (!isSuccess) {
                    final WritableMap err = Arguments.createMap();
                    err.putInt("error_code", errCode);
                    err.putString("error_message", messageStr);
                    errorCallback.invoke(err);
                    return;
                }
                try {
                    WritableMap user = UtilService.convertJsonToMap(new JSONObject(jsonStr));
                    successCallback.invoke(user);
                } catch (Exception ex) {
                    final WritableMap err = Arguments.createMap();
                    err.putString("error_message", ex.getMessage());
                    err.putString("error_trace", ex.toString());
                    errorCallback.invoke(err);
                }
            }
        });
        return 0;
    }

    @ReactMethod
    public int shareFeed(String message, String app_name, String link, ReadableMap dict_others, final Callback successCallback, final Callback errorCallback) {
        if (this.mOpenAPI == null) {
            final WritableMap err = Arguments.createMap();
            err.putString("error_message", "Not authentication");
            errorCallback.invoke(err);
            return -1;
        }
        FeedData feed_data = new FeedData(message, "", link, new ArrayList<String>(), "", "");
        this.mOpenAPI.shareFeed(feed_data, new ZaloPluginCallback() {
            @Override
            public void onResult(boolean isSuccess, int errCode, @Nullable String messageStr, @Nullable String jsonStr) {
                if (!isSuccess) {
                    final WritableMap err = Arguments.createMap();
                    err.putInt("error_code", errCode);
                    err.putString("error_message", messageStr);
                    errorCallback.invoke(err);
                    return;
                }
                try {
                    WritableMap user = UtilService.convertJsonToMap(new JSONObject(jsonStr));
                    successCallback.invoke(user);
                } catch (Exception ex) {
                    final WritableMap err = Arguments.createMap();
                    err.putString("error_message", ex.getMessage());
                    err.putString("error_trace", ex.toString());
                    errorCallback.invoke(err);
                }
            }
        });
        return 0;
    }

    @ReactMethod
    public int getSettings(ReadableMap params, final Callback successCallback, final Callback errorCallback) {
        try {
            SettingsManager mgr = SettingsManager.Companion.getInstance();
            WritableMap result = Arguments.createMap();
            result.putDouble("wakeup_interval", mgr.getWakeUpInterval());
            result.putBoolean("is_login_via_browser", mgr.isLoginViaBrowser());
            result.putDouble("expire_date", mgr.getExpiredTime());
            result.putBoolean("is_use_webview_login_zalo", mgr.isUseWebViewLoginZalo());
            result.putString("sdk_version", AppInfo.getInstance().getSDKVersion());
            result.putString("app_id", getReactApplicationContext().getString(R.string.appID));
            successCallback.invoke(result);
        } catch (Exception ex) {
            final WritableMap err = Arguments.createMap();
            err.putString("error_message", ex.getMessage());
            err.putString("error_trace", ex.toString());
            errorCallback.invoke(err);
        }
        return 0;
    }

    @ReactMethod
    public int getDeviceID(ReadableMap params, final Callback successCallback, final Callback errorCallback) {
        try {
            DeviceTracking devcie_tracking = DeviceTracking.Companion.getInstance();
            WritableMap result = Arguments.createMap();
            result.putString("device_id", devcie_tracking.getDeviceId());
            WritableArray arr_events = Arguments.createArray();
            for (Event e : EventStorage.events) {
                arr_events.pushString(e.toString());
            }
            result.putArray("events", arr_events);
            successCallback.invoke(result);
        } catch (Exception ex) {
            final WritableMap err = Arguments.createMap();
            err.putString("error_message", ex.getMessage());
            err.putString("error_trace", ex.toString());
            errorCallback.invoke(err);
        }
        return 0;
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        this.mSDk.onActivityResult(activity, requestCode, requestCode, data);
    }

    @Override
    public void onNewIntent(Intent intent) {

    }
}
