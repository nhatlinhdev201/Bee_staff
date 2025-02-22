import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {Image} from 'react-native-compressor';
import FastImage from 'react-native-fast-image';
import ProgressImage from 'react-native-image-progress';
import {ProgressBar} from '@ui-kitten/components';
import Modal from 'react-native-modal';
import axios from 'axios';
import {APIImage} from '../Config/Api';
import {ic_upload} from '../assets';
import {PropTypes} from 'prop-types';

const ImageUploadComponent = ({
  setImageUrl,
  btnWidth = 200,
  btnHeight = 200,
  total = 1,
}) => {
  const [isUpload, setIsUpload] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [currentID, setCurrentID] = useState(1);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isOptionsModalVisible, setIsOptionsModalVisible] = useState(false);

  const optionsMedia = {
    quality: 0.5,
    format: 'JPEG',
  };

  const choosePhoto = async () => {
    setIsOptionsModalVisible(false);
    try {
      const image = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: total,
      });
      if (image && image.assets && image.assets.length > 0) {
        setSelectedImages(image.assets.map(asset => asset.uri));
        uploadImage(image.assets.map(asset => asset.uri));
      }
    } catch (error) {
      console.error('Error choosing photo:', error);
    }
  };

  const takePhoto = async () => {
    setIsOptionsModalVisible(false);
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        presentationStyle: 'overFullScreen',
      });
      if (result && result.assets && result.assets.length > 0) {
        setSelectedImages([result.assets[0].uri]);
        uploadImage([result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  const uploadImage = async imageUris => {
    setIsLoadingMedia(true);
    try {
      const compressedImages = await Promise.all(
        imageUris.map(uri => Image.compress(uri, optionsMedia)),
      );
      if (compressedImages.length === 0) {
        setIsLoadingMedia(false);
      } else {
        const arrayTempImage = compressedImages;
        setIsUpload(true);
        API_spCallPostImage(arrayTempImage);
      }
    } catch (error) {
      console.error('Error compressing images: ', error);
      setIsLoadingMedia(false);
    }
  };

  const API_spCallPostImage = async arrayTempImage => {
    try {
      const formData = new FormData();
      formData.append('AppAPIKey', 'netcoApikey2025');
      formData.append('Code', '1234564');
      formData.append('OfficerId', '123456');
      formData.append('Key', `OVG_Booking`);
      formData.append('Type', `1`);
      formData.append('CustomerCode', '73333');

      arrayTempImage.forEach((img, i) => {
        formData.append('myFile' + i, {
          uri: img,
          type: 'image/jpeg',
          name: img.slice(img.lastIndexOf('/') + 1),
        });
      });

      const result = await axios.post('YOUR_SERVER_UPLOAD_URL', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: event => {
          const progress = event.loaded / event.total;
          setUploadProgress(progress);
        },
      });

      if (result.data.length > 0) {
        setIsUpload(true);
        setIsLoadingMedia(false);
        setImageUrl(result.data);
        setImageList(prevList => [
          ...prevList,
          {id: currentID, source: APIImage + result.data[0]},
        ]);
        setCurrentID(prevID => prevID + 1);
      } else {
        setIsUpload(false);
        setIsLoadingMedia(false);
      }
    } catch (error) {
      console.error('Upload error: ', error);
      setIsLoadingMedia(false);
    }
  };

  const deleteImage = () => {
    setIsUpload(false);
    setSelectedImages([]);
    setImageList(imageList.filter(image => image.source !== selectedImages[0]));
  };

  const toggleOptionsModal = () => {
    setIsOptionsModalVisible(!isOptionsModalVisible);
  };

  return (
    <View style={styles.container}>
      {isUpload ? null : (
        <TouchableOpacity onPress={toggleOptionsModal}>
          <View
            style={[
              styles.imageUpload,
              {
                width: btnWidth,
                height: btnHeight,
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}>
            <FastImage source={ic_upload} style={{width: 45, height: 45}} />
            <Text style={styles.textBtnUpload}>Tải lên hoặc chụp hình ảnh</Text>
          </View>
        </TouchableOpacity>
      )}

      {isLoadingMedia && (
        <View style={styles.imageContainer}>
          {selectedImages.length > 0 && (
            <ProgressImage
              source={{uri: selectedImages[0]}}
              indicator={() => <ActivityIndicator animating={true} size={30} />}
              indicatorProps={{
                size: 80,
                borderWidth: 0,
                color: 'rgba(150, 150, 150, 1)',
                unfilledColor: 'rgba(200, 200, 200, 0.2)',
              }}
              style={styles.image}
            />
          )}
          <ProgressBar progress={uploadProgress} width={200} />
        </View>
      )}

      {selectedImages.length > 0 && !isLoadingMedia && (
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={toggleOptionsModal}>
            <View style={{position: 'relative'}}>
              <FastImage
                source={{uri: selectedImages[0]}}
                style={{width: btnWidth, height: btnHeight, borderRadius: 5}}
              />
              {selectedImages.length > 1 && (
                <View style={styles.multipleImageIndicator}>
                  <Text style={styles.multipleImageText}>
                    +{selectedImages.length - 1}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={deleteImage}>
            <Text style={styles.deleteButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        isVisible={isOptionsModalVisible}
        onBackdropPress={toggleOptionsModal}
        style={styles.bottomModal}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.option} onPress={choosePhoto}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
              }}>
              Chọn ảnh từ thư viện
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={takePhoto}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
              }}>
              Chụp ảnh
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={toggleOptionsModal}>
            <Text style={{fontSize: 16, fontWeight: '700'}}>Hủy</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageUpload: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  textBtnUpload: {
    marginTop: 10,
    color: '#007BFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    marginTop: 20,
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FF0000',
    fontWeight: 'bold',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 22,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  option: {
    padding: 15,
  },
  multipleImageIndicator: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 5,
    padding: 5,
  },
  multipleImageText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

ImageUploadComponent.defaultProps = {
  setImageUrl: () => {},
  btnWidth: 200,
  btnHeight: 200,
  total: 1,
};
ImageUploadComponent.propTypes = {
  setImageUrl: PropTypes.func,
  btnWidth: PropTypes.number,
  btnHeight: PropTypes.number,
  total: PropTypes.number,
};

export default ImageUploadComponent;
