require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "RNNearbyApi"
  s.version      = package["version"]
  s.summary      = package['description']
  s.author       = package['author']
  s.homepage     = package['homepage']
  s.license      = package['license']
  s.ios.deployment_target = "7.0"
  s.source_files  = "ios/Classes/*.{h,m}"
  s.source = {:path => "ios/RNNearbyApi/"}

  s.dependency "React"
  s.dependency "NearbyMessages"
end