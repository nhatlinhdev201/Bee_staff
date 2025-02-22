import React from 'react';
import { View } from 'react-native';
import { Icon, Text } from '@ui-kitten/components';
import { colors } from '../styles/Colors';
import MainStyles from '../styles/MainStyle';
import { convertDate } from '../utils/FormatTime';
import Rating from './Rating';
import { PropTypes } from 'prop-types';

const CardNotifi = ({ data }) => {
  return (
    <View>
      <View style={MainStyles.cardJob}>
        <View style={MainStyles.flexRowCenter}>
          <Text
            style={[
              MainStyles.titleCardJob,
              { textAlign: 'center', color: colors.MAIN_BLUE_CLIENT },
            ]}>
            Thông báo hoàn thành dịch vụ
          </Text>
        </View>
        <View style={MainStyles.flexRowCenter}>
          <View style={MainStyles.line} />
        </View>
        <View style={MainStyles.flexRowCenter}>
          <Text style={[MainStyles.titleCardJob, { textAlign: 'center' }]}>
            Dịch vụ {data?.ServiceName.toLowerCase()}
          </Text>
        </View>
        {data?.BookingServiceCode && (
          <Text
            style={{
              textAlign: 'center',
              fontSize: 12,
              color: colors.primary[700],
              fontWeight: 'bold',
            }}>
            {data?.BookingServiceCode}
          </Text>
        )}
        <View style={MainStyles.rowMargin}>
          <View style={MainStyles.flexRowFlexStart}>
            <Icon
              style={MainStyles.CardIcon}
              fill="#3366FF"
              name="calendar-outline"
            />
            <Text style={MainStyles.textCardJob}>
              Ngày hoàn thành: {convertDate(data?.BookingTime)}
            </Text>
          </View>
        </View>
        <View style={MainStyles.rowMargin}>
          <View style={MainStyles.flexRowFlexStart}>
            <Icon
              style={MainStyles.CardIcon}
              fill="#3366FF"
              name="star-outline"
            />
            <Text style={MainStyles.textCardJob}>Đánh giá: </Text>
            <Rating rating={data?.StartNumber || 5} />
          </View>
        </View>
        <View style={MainStyles.rowMargin}>
          <View style={MainStyles.flexRowFlexStart}>
            <Icon
              style={MainStyles.CardIcon}
              fill="#3366FF"
              name="message-square-outline"
            />
            <Text style={MainStyles.textCardJob}>
              {data?.RatingNote
                ? 'Đánh giá: ' + data?.RatingNote.trim()
                : 'Khách hàng không để lại đánh giá'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

CardNotifi.defaultProps = {
  data: {},
};
CardNotifi.propTypes = {
  data: PropTypes.object,
};

export default CardNotifi;
