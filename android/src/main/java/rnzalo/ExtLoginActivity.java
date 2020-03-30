package rnzalo;

import android.content.Intent;
import android.os.Bundle;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.zing.zalo.zalosdk.oauth.LoginForm;
import com.zing.zalo.zalosdk.oauth.OAuthCompleteListener;
import com.zing.zalo.zalosdk.oauth.OauthResponse;

public class ExtLoginActivity extends AppCompatActivity {
    LoginForm loginForm;
    TextView resultTextView;
    private OAuthCompleteListener listener = new OAuthCompleteListener() {
        @Override
        public void onGetOAuthComplete(OauthResponse response) {
            super.onGetOAuthComplete(response);
            String msg = "AuthCode: " + response.getOauthCode() + "\n" +
                    "SocialId: " + response.getSocialId() + "\n";
            resultTextView.setText(msg);
        }

        @Override
        public void onAuthenError(int errorCode, String message) {
            super.onAuthenError(errorCode, message);
            String msg = "ErrorCode: " + errorCode + " - " + "SocialId: " + message;
            resultTextView.setText(msg);
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_ext_login);
        loginForm = findViewById(R.id.LoginForm);
        resultTextView = findViewById(R.id.result_text_view);
        loginForm.setOAuthCompleteListener(listener);
    }


    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        loginForm.onActivityResult(this, requestCode, resultCode, data);
    }

}
