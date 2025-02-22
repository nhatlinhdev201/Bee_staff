import React, {useEffect} from 'react';
import {Platform, View} from 'react-native';
import {PERMISSIONS, requestMultiple} from 'react-native-permissions';

const RequestPermissionV2 = () => {
  const requestAndroidPermissions = async () => {
    const permissions = [
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
      PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
    ];

    if (Platform.Version >= 33) {
      permissions.push(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
      permissions.push(PERMISSIONS.ANDROID.READ_MEDIA_VIDEO);
    } else {
      permissions.push(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    }
    permissions.push(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);

    const statuses = await requestMultiple(permissions);
    console.log('Permission statuses:', statuses);
  };

  const requestIOSPermissions = async () => {
    const permissions = [
      PERMISSIONS.IOS.CAMERA,
      PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      // PERMISSIONS.IOS.RECORD_AUDIO,
      PERMISSIONS.IOS.PHOTO_LIBRARY,
      // PERMISSIONS.IOS.MICROPHONE,
      PERMISSIONS.IOS.NOTIFICATIONS,
    ];

    const statuses = await requestMultiple(permissions);
    console.log('Permission statuses:', statuses);
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestAndroidPermissions();
    } else if (Platform.OS === 'ios') {
      requestIOSPermissions();
    }
  }, []);

  return <View />;
};

export default RequestPermissionV2;
