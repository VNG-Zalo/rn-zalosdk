#import "RNZalo.h"
#import <React/RCTLog.h>
#import <React/RCTUtils.h>
#import <ZaloSDK/ZaloSDK.h>

@implementation RNZalo
RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(login,
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    [[ZaloSDK sharedInstance] unauthenticate];
    dispatch_async(dispatch_get_main_queue(), ^{
        UIViewController *presentedViewController = RCTPresentedViewController();
        [[ZaloSDK sharedInstance] authenticateZaloWithAuthenType:ZAZAloSDKAuthenTypeViaZaloAppAndWebView
                                                parentController:presentedViewController
                                                         handler:^(ZOOauthResponseObject * response) {
            if([response isSucess]) {
                NSString * oauthCode = response.oauthCode;
                resolve(oauthCode);
            } else if(response.errorCode != kZaloSDKErrorCodeUserCancel) {
                // convert int or long to string
                NSString * errorCode = [NSString stringWithFormat:@"%ld", response.errorCode];
                NSString * message = response.errorMessage;
                NSError * error  = [
                                    NSError errorWithDomain:@"Login error"
                                    code:response.errorCode
                                    userInfo:@{NSLocalizedDescriptionKey:message}
                                    ];
                reject(errorCode, message, error);
            }
        }];
    });
}

RCT_EXPORT_METHOD(loginWithType:(NSInteger) type
                  successCallback: (RCTResponseSenderBlock) successCallback
                  failedCallback: (RCTResponseErrorBlock) failedCallback)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        UIViewController *presentedViewController = RCTPresentedViewController();
        enum ZAZaloSDKAuthenType login_type = ZAZAloSDKAuthenTypeViaZaloAppAndWebView;
        if (type == 1) {
            login_type = ZAZaloSDKAuthenTypeViaZaloAppOnly;
        } else if (type == 2){
            login_type = ZAZaloSDKAuthenTypeViaWebViewOnly;
        }
        
        [[ZaloSDK sharedInstance] authenticateZaloWithAuthenType:login_type
                                                parentController:presentedViewController
                                                         handler:^(ZOOauthResponseObject * response) {
            if([response isSucess]) {
                NSString * oauthCode = response.oauthCode;
                successCallback(@[@{ "oauth_code": oauthCode}]);
            } else if(response.errorCode != kZaloSDKErrorCodeUserCancel) {
                // convert int or long to string
                NSError * error  = [
                                    NSError errorWithDomain:@"Login error"
                                    code:response.errorCode
                                    userInfo:@{@"message":response.errorMessage}
                                    ];
                failedCallback(error);
            }
        }];
    });
    return;
}



RCT_EXPORT_METHOD(logout) {
    [[ZaloSDK sharedInstance] unauthenticate];
}

RCT_EXPORT_METHOD(getProfile: (RCTResponseSenderBlock)successCallback
                  failureCallback: (RCTResponseErrorBlock)failureCallback) {
    [[ZaloSDK sharedInstance] getZaloUserProfileWithCallback:
     ^(ZOGraphResponseObject *response) {
        
        if(response.errorCode == kZaloSDKErrorCodeNoneError) {
            successCallback(@[response.data]);
        } else {
            failureCallback(
                            [[NSError alloc] initWithDomain:@"Zalo Oauth"
                                                       code:response.errorCode
                                                   userInfo:@{@"message": response.errorMessage}]
                            );
        }
    }];
    
}

RCT_EXPORT_METHOD(isAuthenticate: (RCTResponseSenderBlock) successCallback
                  failureCallback:(RCTResponseErrorBlock) failureCallback) {
    [[ZaloSDK sharedInstance] isAuthenticatedZaloWithCompletionHandler:^(ZOOauthResponseObject *response) {
        if ([response isSucess]){
            successCallback(@[@{
                                  @"oauthCode": response.oauthCode,
                                  @"displayName":response.displayName,
                                  @"phoneNumber":response.phoneNumber,
                                  @"isRegister":@(response.isRegister),
                                  @"gender":response.gender
            }]);
        } else if (response.errorCode != kZaloSDKErrorCodeUserCancel) {
            failureCallback(
                            [[NSError alloc] initWithDomain:@"Zalo Oauth"
                                                       code:response.errorCode
                                                   userInfo:@{@"message": response.errorMessage}]
                            );
            
        }
    }];
}

RCT_EXPORT_METHOD(sendOfficalAccountMessageWith: (NSString*) template_id
                  templdateData  : (NSDictionary *) template_data
                  successCallback: (RCTResponseSenderBlock) successCallback
                  failureCallback: (RCTResponseErrorBlock) failureCallback) {
    [[ZaloSDK sharedInstance] sendOfficalAccountMessageWith:template_id
                                               templateData:template_data
                                                   callback:^(ZOGraphResponseObject *response) {
        
        if(response.errorCode == kZaloSDKErrorCodeNoneError) {
            successCallback(@[response.data]);
        } else {
            failureCallback(
                            [[NSError alloc] initWithDomain:@"Zalo Oauth"
                                                       code:response.errorCode
                                                   userInfo:@{@"message": response.errorMessage}]
                            );
        }
    }];
}

RCT_EXPORT_METHOD(sendMessageTo: (NSString*) str_friend_id
                  withMessage:(NSString*) str_message
                  witLink:(NSString*) str_link
                  successCallback: (RCTResponseSenderBlock) successCallback
                  failureCallback: (RCTResponseErrorBlock) failureCallback) {
    [[ZaloSDK sharedInstance] sendMessageTo:str_friend_id
                                    message:str_message
                                       link:str_link
                                   callback:^(ZOGraphResponseObject *response) {
        
        if(response.errorCode == kZaloSDKErrorCodeNoneError) {
            successCallback(@[response.data]);
        } else {
            failureCallback(
                            [[NSError alloc] initWithDomain:@"Zalo Oauth"
                                                       code:response.errorCode
                                                   userInfo:@{@"message": response.errorMessage}]
                            );
        }
    }];
}


RCT_EXPORT_METHOD(sendAppRequestTo: (NSString*) str_friend_id
                  withMessage:(NSString*) str_message
                  successCallback: (RCTResponseSenderBlock) successCallback
                  failureCallback: (RCTResponseErrorBlock) failureCallback) {
    [[ZaloSDK sharedInstance] sendAppRequestTo:str_friend_id
                                       message:str_message
                                      callback:^(ZOGraphResponseObject *response) {
        if(response.errorCode == kZaloSDKErrorCodeNoneError) {
            successCallback(@[response.data]);
        } else {
            failureCallback(
                            [[NSError alloc] initWithDomain:@"Zalo Oauth"
                                                       code:response.errorCode
                                                   userInfo:@{@"message": response.errorMessage}]
                            );
        }
    }];
}

RCT_EXPORT_METHOD(postFeedWithMessage:(NSString*) str_message
                  withLink: (NSString*) str_link
                  successCallback: (RCTResponseSenderBlock) successCallback
                  failureCallback: (RCTResponseErrorBlock) failureCallback ){
    [[ZaloSDK sharedInstance] postFeedWithMessage:str_message
                                             link:str_link
                                         callback:^(ZOGraphResponseObject *response) {
        if (response.errorCode == kZaloSDKErrorCodeNoneError) {
            successCallback(@[response.data]);
        } else {
            failureCallback(
                            [[NSError alloc] initWithDomain:@"Zalo Oauth"
                                                       code:response.errorCode
                                                   userInfo:@{@"message": response.errorMessage}]
                            );
        }
    }];
}

RCT_EXPORT_METHOD(getUserFriendListAtOffset:(NSUInteger) ui_offset
                  withCount: (NSUInteger) ui_count
                  successCallback: (RCTResponseSenderBlock) successCallback
                  failureCallback: (RCTResponseErrorBlock) failureCallback ){
    
    [[ZaloSDK sharedInstance] getUserFriendListAtOffset:ui_offset
                                                  count:ui_count
                                               callback:^(ZOGraphResponseObject *response) {
        if (response.errorCode == kZaloSDKErrorCodeNoneError) {
            successCallback(@[response.data]);
        } else {
            failureCallback(
                            [[NSError alloc] initWithDomain:@"Zalo Oauth"
                                                       code:response.errorCode
                                                   userInfo:@{@"message": response.errorMessage}]
                            );
        }
    }];
}

RCT_EXPORT_METHOD(sendMessage:(NSString*) str_message
                  withAppName: (NSString*) str_app_name
                  withLink: (NSString*) str_link
                  successCallback: (RCTResponseSenderBlock) successCallback
                  failureCallback: (RCTResponseErrorBlock) failureCallback ){
    ZOFeed *zo_feed = [[ZOFeed alloc] initWithLink:str_link
                                           appName:str_app_name
                                           message:str_message
                                            others:@{}];
    dispatch_async(dispatch_get_main_queue(), ^{
        UIViewController *presentedViewController = RCTPresentedViewController();
        [[ZaloSDK sharedInstance] sendMessage:zo_feed
                                 inController:presentedViewController
                                     callback:^(ZOShareResponseObject *response) {
            if ([response isSucess]){
                successCallback(@[response]);
            } else {
                failureCallback(
                                [[NSError alloc] initWithDomain:@"Zalo Oauth"
                                                           code:response.errorCode
                                                       userInfo:@{@"message": response.errorMessage}]
                                );
            }
        }];
    });
}

RCT_EXPORT_METHOD(shareFeed:(NSString*) str_message
                  withAppName: (NSString*) str_app_name
                  withLink: (NSString*) str_link
                  successCallback: (RCTResponseSenderBlock) successCallback
                  failureCallback: (RCTResponseErrorBlock) failureCallback ){
    ZOFeed *zo_feed = [[ZOFeed alloc] initWithLink:str_link
                                           appName:str_app_name
                                           message:str_message
                                            others:@{}];
    dispatch_async(dispatch_get_main_queue(), ^{
        UIViewController *presentedViewController = RCTPresentedViewController();
        [[ZaloSDK sharedInstance] sendMessage:zo_feed
                                 inController:presentedViewController
                                     callback:^(ZOShareResponseObject *response) {
            if ([response isSucess]){
                successCallback(@[response]);
            } else {
                failureCallback(
                                [[NSError alloc] initWithDomain:@"Zalo Oauth"
                                                           code:response.errorCode
                                                       userInfo:@{@"message": response.errorMessage}]
                                );
            }
        }];
    });
}

@end

