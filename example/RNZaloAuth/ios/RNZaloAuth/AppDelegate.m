/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import <ZaloSDK/ZaloSDK.h>
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <ZPTracker/ZPTracker.h>

// #define kZALO_SDK_APP_ID @"2613582731942964398"
#define kZALO_SDK_APP_ID @"1577725557845407485"
#define kPIXEL_ID 6342418164282734099L

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"RNZaloAuth"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  [[ZaloSDK sharedInstance] initializeWithAppId:kZALO_SDK_APP_ID];
  [[ZaloSDK sharedInstance] setAllowsSignInGoogleWithBrowser:YES];
  [ZDKLogManager setLogLevel:ZDKLogVerbose];
  
  ZPTracker *tracker = [ZPTracker newInstanceWithPixelId:kPIXEL_ID];
  [tracker setAppId:kZALO_SDK_APP_ID];
  [tracker trackEventWithName:@"app_start"];
  return YES;
}

//- (BOOL)application:(UIApplication *)application
//            openURL:(NSURL *)url
//  sourceApplication:(NSString *)sourceApplication
//         annotation:(id)annotation {
//
//  return [[ZDKApplicationDelegate sharedInstance]
//          application:application
//          openURL:url sourceApplication:sourceApplication annotation:annotation];
//}


- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
    return [[ZDKApplicationDelegate sharedInstance] application:app openURL:url options:options];
}

- (BOOL)application:(UIApplication *)application shouldAllowExtensionPointIdentifier:(NSString *)extensionPointIdentifier{
    return NO;
}


- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
