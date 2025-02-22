import React from 'react';
import {Text, View} from 'react-native';
import AlertModal from '../AlertModal';
import MainStyles from '../../styles/MainStyle';
import {PropTypes} from 'prop-types';

const AlertConfirm = ({title, isModalVisible, setModalVisible, onConfirm}) => {
  const handleConfirm = () => {
    onConfirm();
    setModalVisible(false);
  };

  return (
    <AlertModal
      isVisible={isModalVisible}
      onClose={() => setModalVisible(false)}
      isAuto={false}
      onConfirm={handleConfirm}
      title="Thông báo"
      backdropCloseable={true}
      isCancelable={false}>
      <View>
        <View style={[MainStyles.cardJob]}>
          <View style={MainStyles.flexRowCenter}>
            <View style={MainStyles.line} />
          </View>
          <View style={MainStyles.flexRowCenter}>
            <Text style={[{textAlign: 'center'}]}>{title}</Text>
          </View>
        </View>
      </View>
    </AlertModal>
  );
};
AlertConfirm.propTypes = {
  title: PropTypes.string.isRequired,
  isModalVisible: PropTypes.bool.isRequired,
  setModalVisible: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
export default AlertConfirm;
