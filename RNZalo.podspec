
Pod::Spec.new do |s|
  s.name         = "RNZalo"
  s.version      = "1.0.0"
  s.summary      = "RNZalo"
  s.description  = <<-DESC
                  RNZalo
                   DESC
  s.homepage     = ""
  s.license      = "MIT"
  s.author             = { "author" => "duydb2@vng.com.vn" }
  s.platform     = :ios, "7.0"
  s.source       = { :git => "https://github.com/VNG-Zalo/rn-zalosdk.git", :tag => "master" }
  s.source_files  = "ios/**/*.{h,m}"
  s.requires_arc = true


  s.dependency "React"
  s.dependency "ZaloSDK"

end

  
