import { Platform, PermissionsAndroid } from 'react-native';

/**
 * Requests required runtime camera and audio recording permissions on Android.
 */
export async function requestCameraAndAudioPermissions(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);

    const cameraGranted =
      granted[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED;
    const audioGranted =
      granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED;

    return cameraGranted && audioGranted;
  } catch (err) {
    console.warn('Failed to request runtime permissions', err);
    return false;
  }
}
