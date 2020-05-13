
---
- [React Native ZaloSDK ( RNZaloSDK )](#react-native-zalosdk--rnzalosdk)
- [Giới thiệu](#gi%e1%bb%9bi-thi%e1%bb%87u)
- [Tích hợp](#t%c3%adch-h%e1%bb%a3p)
    - [Tạo ứng dụng trên trang developer của Zalo](#t%e1%ba%a1o-%e1%bb%a9ng-d%e1%bb%a5ng-tr%c3%aan-trang-developer-c%e1%bb%a7a-zalo)
    - [Cài đặt](#c%c3%a0i-%c4%91%e1%ba%b7t)
      - [iOS](#ios)
      - [Android](#android)
- [Login](#login)
  - [Đăng nhập bằng Zalo](#%c4%90%c4%83ng-nh%e1%ba%adp-b%e1%ba%b1ng-zalo)
  - [Xác minh lại oauth code](#x%c3%a1c-minh-l%e1%ba%a1i-oauth-code)
  - [Đăng xuất](#%c4%90%c4%83ng-xu%e1%ba%a5t)
- [OpenAPI](#openapi)
  - [Mời sử dụng ứng dụng](#m%e1%bb%9di-s%e1%bb%ad-d%e1%bb%a5ng-%e1%bb%a9ng-d%e1%bb%a5ng)
  - [Đăng bài viết](#%c4%90%c4%83ng-b%c3%a0i-vi%e1%ba%bft)
  - [Gửi tin nhắn cho bạn bè](#g%e1%bb%adi-tin-nh%e1%ba%afn-cho-b%e1%ba%a1n-b%c3%a8)
  - [Lấy danh sách bạn bè](#l%e1%ba%a5y-danh-s%c3%a1ch-b%e1%ba%a1n-b%c3%a8)
  - [Lấy thông tin người dùng](#l%e1%ba%a5y-th%c3%b4ng-tin-ng%c6%b0%e1%bb%9di-d%c3%b9ng)
- [Tương tác với app Zalo](#t%c6%b0%c6%a1ng-t%c3%a1c-v%e1%bb%9bi-app-zalo)
  - [Gửi tin nhắn với bạn bè](#g%e1%bb%adi-tin-nh%e1%ba%afn-v%e1%bb%9bi-b%e1%ba%a1n-b%c3%a8)
  - [Đăng bài viết](#%c4%90%c4%83ng-b%c3%a0i-vi%e1%ba%bft-1)
- [References](#references)
  - [Mã lỗi phần login](#m%c3%a3-l%e1%bb%97i-ph%e1%ba%a7n-login)
---

# React Native ZaloSDK ( RNZaloSDK )

# Giới thiệu
RNZaloSDK là bộ thư viện để các ứng dụng có thể tương tác với Zalo Platform. RNZaloSDK hỗ trợ: 
- iOS 8 trở lên
- CocoaPods 1.0 trở lên
- RN v0.61 trở lên

# Tích hợp

### Tạo ứng dụng trên trang developer của Zalo
- Truy cập vào trang web [deverloper của Zalo](https://developers.zalo.me/)
- Tạo ứng dụng mới và đặt tên cho ứng dụng 
  - Thêm nền tảng iOS: nhập bundle id của App tích hợp, [xem thêm tại đây](https://developers.zalo.me/docs/sdk/ios-sdk-9)
  - Thêm nền tảng Android: nhập package name và base64 của sha1 sign key, [xem thêm tại đây](https://developers.zalo.me/docs/sdk/android-sdk-8)
- Kích hoạt ứng dụng, chuyển trạng thái sang đang hoạt động
- Ghi nhớ ID của ứng dụng và lưu thay đổi

### Cài đặt 
Chạy lệnh để tải về RNZaloSDK

```shell
npm install rnzalosdk --save
```

#### iOS
- thêm URL Type `Main target setting -> info -> URL types -> click +`
  
  `identifier = “zalo”, URL Schemes = “zalo-<YOUR_APP_ID>”`

- Mở file AppDelegate.m`

    ```Objective-C
    ...
    #import <ZaloSDK/ZaloSDK.h>
    - (BOOL)application:(UIApplication *)application
    didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
        ...
        [[ZaloSDK sharedInstance] initializeWithAppId:@"<YOUR_APP_ID>"];
        return YES;
    }
    
    - (BOOL)application:(UIApplication *)application 
        openURL:(NSURL *)url
        sourceApplication:(NSString *)sourceApplication
        annotation:(id)annotation {
    
        return [[ZDKApplicationDelegate sharedInstance] 
        application:application
        openURL:url sourceApplication:sourceApplication annotation:annotation];
    }
    ```

#### Android
- thêm appId vào `android/app/src/main/res/values/strings.xml`

    ```xml
    <resources>
        <string name="app_name">App Name</string>
        <string name="appID"><YOUR_APP_ID></string>
    </res>
    ```
- thêm code ở dưới vào `android/app/src/main/res/AndroidManifest.xml`

    ```xml
    <application
        ...
        <meta-data
            android:name="com.zing.zalo.zalosdk.appID"
            android:value="@string/appID" />

        <activity
            android:name="com.zing.zalo.zalosdk.oauth.WebLoginActivity"
            android:configChanges="orientation|screenSize"
            android:screenOrientation="sensor"
            android:theme="@style/FixThemeForLoginWebview"
            android:windowSoftInputMode="stateHidden|stateAlwaysHidden"></activity>
    </application>
    ```

# Login
 
## Đăng nhập bằng Zalo
SDK cung cấp API login, có 2 cách gọi:
```javascript
const rnzalosdk = require('rnzalo');
var type = rnzalosdk.AppOrWeb;

rnzalosdk.login(type)
    .then(function(result) {
        alert('Login with result' + result);
    })
    .catch(function(err){
        alert('Login failed with error: ' + err);
    });
```

## Xác minh lại oauth code 
SDK cung cấp method để kiểm tra oauth code còn hiệu lực:
```javascript
const rnzalosdk  = require('rnzalo');

rnzalosdk.isAuthenticate()
    .then(function(result){
        alert('Identify authenticate code result: ' + result);
    })
    .catch(function(err) {
        aler('Identify authenticate code with error: ' + err);
    });
```

## Đăng xuất
SDK cung cấp API để đăng xuất. Khi đăng xuất, các thông tin đăng nhập như oauth code và userID sẽ bị xoá:
```javascript
const rnzalosdk = require('rnzalo');
rnzalosdk.logout();
```

# OpenAPI

## Mời sử dụng ứng dụng
SDK cung cấp API cho việc gửi tin nhắn mời bạn bè sử dụng ứng dụng:
```javascript
const rnzalosdk = require('rnzalo');
var friend_id = 13241;
var message = "hello";
rnzalosdk.sendAppRequestTo(friend_id, message)
    .then(function(result) {
        alert('Invite friend with result: ' + result);
    })
    .catch(function(err) {
        aler('Invite friend with error: ' + err);
    });
```

## Đăng bài viết
SDK cung cấp API cho việc đăng bài viết lên tường người dùng:
```javascript
const rnzalosdk = require('rnzalo');
var message = 'hello';
var link = 'https://developers.zalo.me';
rnzalosdk.postFeedWithMessage(message, link)
    .then(function(result) {
        alert('Post feed with result: ' + result);
    })
    .catch(function(err) {
        alert('Post feed with error: ' + err);
    })  
```

## Gửi tin nhắn cho bạn bè 
SDK cung cấp API cho việc gởi tin nhắn cho bạn bè người dùng:
```javascript
const rnzalosdk = require('rnzalo');
var message = 'hello';
var friend_id = 1234141;
var link = '';
rnzalosdk.sendMessageTo(friend_id, message, link)
    .then(function(result){
        alert('Send message with result: ' + result);
    })
    .catch(function(err) {
        alert('Send message with error: ' + err);
    })
```

## Lấy danh sách bạn bè
SDK cung cấp API cho việc lấy danh sách bạn bè của người dùng:
```javascript
const rnzalosdk = require('rnzalo');
var offset_start = 10;
var count = 100;
rnzalosdk.getUserFriendListAtOffset(offset_start, count)
    .then(function(result){
        alert('get user friend list with result: ' + result);
    })
    .catch(function(err) {
        alert('get user friend list with error: ' + err);
    })
```

## Lấy thông tin người dùng 
SDK cung cấp API cho việc lấy danh sách bạn bè của người dùng:
```javascript
const rnzalosdk = require('rnzalo');
var offset_start = 10;
var count = 100;
rnzalosdk.getUserFriendListAtOffset(offset_start, count)
    .then(function(result){
        alert('get user friend list with result: ' + result);
    })
    .catch(function(err) {
        alert('get user friend list with error: ' + err);
    })
```

# Tương tác với app Zalo

## Gửi tin nhắn với bạn bè
SDK cung cấp API cho việc gởi tin nhắn tới bàn bè của người dùng bằng app zalo:
```javascript
const rnzalosdk = require('rnzalo');
var message = 'hello';
var app_name = 'zalosdk';
var link = 'https://zing.vn';
var options = {};
rnzalosdk.shareMessage(message, app_name, link, options)
    .then(function(result){
        alert('Send message via app with result: ' + result);
    })
    .catch(function(err) {
        alert('Send message via app with error: ' + err);
    })
```

## Đăng bài viết
SDK cung cấp API cho việc đăng bài viết lên tường người dùng bằng app zalo:
```javascript
const rnzalosdk = require('rnzalo');
var message = 'hello';
var app_name = 'zalosdk';
var link = 'https://zing.vn';
var options = {};
rnzalosdk.shareFeed(message, app_name, link, options)
    .then(function(result){
        alert('Post feed via app with result: ' + result);
    })
    .catch(function(err) {
        alert('Post feed via app with error: ' + err);
    })
```

# References 

## Mã lỗi phần login
