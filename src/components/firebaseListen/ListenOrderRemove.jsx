import React from 'react';
import {Text, View} from 'react-native';
import AlertModal from '../AlertModal';
import MainStyles from '../../styles/MainStyle';
import {colors} from '../../styles/Colors';
import {PropTypes} from 'prop-types';

const ListenOrderRemove = ({
  orderRemove,
  isModalVisible,
  setModalVisible,
  onConfirm,
}) => {
  const handleConfirm = () => {
    onConfirm();
    setModalVisible(false); // Thêm vào để đóng modal khi người dùng xác nhận
  };

  return (
    <AlertModal
      isVisible={isModalVisible}
      onClose={() => setModalVisible(false)} // Đóng modal khi người dùng bấm ngoài hoặc nút đóng
      isAuto={false}
      onConfirm={handleConfirm}
      title="Thông báo cập nhật đơn dịch vụ"
      backdropCloseable={true}
      isCancelable={false}>
      <View>
        {orderRemove?.orderId ? (
          <View style={[MainStyles.cardJob]}>
            <View style={MainStyles.flexRowCenter}>
              <Text style={[MainStyles.titleCardJob, {textAlign: 'center'}]}>
                {orderRemove?.DataService?.ServiceName}
              </Text>
            </View>
            {orderRemove?.BookingCode ? (
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 12,
                  color: colors.primary[700],
                  fontWeight: 'bold',
                }}>
                {orderRemove?.BookingCode}
              </Text>
            ) : null}
            <View style={MainStyles.flexRowCenter}>
              <View style={MainStyles.line} />
            </View>
            <View style={MainStyles.flexRowCenter}>
              <Text style={[{textAlign: 'center'}]}>
                {'Đơn dịch vụ của bạn đã được hoàn thành !'}
              </Text>
            </View>
          </View>
        ) : null}
      </View>
    </AlertModal>
  );
};

ListenOrderRemove.propTypes = {
  orderRemove: PropTypes.object,
  isModalVisible: PropTypes.bool,
  setModalVisible: PropTypes.func,
  onConfirm: PropTypes.func,
};

export default ListenOrderRemove;
