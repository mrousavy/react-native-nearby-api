# How to upgrade from react-native-nearby-api@0.0.5

## 1. Uninstall the previous version 0.0.5

`> yarn remove react-native-nearby-api`

## 2. Remove any reference of the old library in XCode

- Open your project in XCode.
- In the `Libraries` directory, remove any references of the previous compiled `libRNNearbyApi.a`.
- Open the file ios/Podfile.
- Remove any references to the `NearbyMessages` pod if exists

## 3. Install the new package

`> yarn add @adrianso/react-native-nearby-api`

This new package support RN60 Autolinking. You do not need to link the library manually.

## 4. Update your Podfile

Copy the following lines to the end of the ios/Podfile, after all the `target` sections.

```ruby
post_install do |installer|
  puts "Renaming logging functions"

  root = File.dirname(installer.pods_project.path)
  Dir.chdir(root);
  Dir.glob("**/*.{h,cc,cpp,in}") {|filename|
    filepath = root + "/" + filename
    text = File.read(filepath)
    addText = text.gsub!(/(?<!React)AddLogSink/, "ReactAddLogSink")
    if addText
      File.chmod(0644, filepath)
      f = File.open(filepath, "w")
      f.write(addText)
      f.close
    end

    text2 = addText ? addText : text
    removeText = text2.gsub!(/(?<!React)RemoveLogSink/, "ReactRemoveLogSink")
    if removeText
      File.chmod(0644, filepath)
      f = File.open(filepath, "w")
      f.write(removeText)
      f.close
    end
  }
end

```

This post install hook is the replacement for the old renameLogger.sh script. It renames `AddLogSink` and `RemoveLogSink` functions in the `glog` library to make sure that it doesn't conflict with the same functions provided by the `NearbyMessages` pod.

## 5. Install your pods

```
> cd ios/
> pod install
```

## 6. Build your project and run

```
> yarn ios
```
