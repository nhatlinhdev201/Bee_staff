import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import MainStyles, { SCREEN_HEIGHT } from '../styles/MainStyle';
import { themeColors, colors } from '../styles/Colors';
import { useSelector } from 'react-redux';
import { logo_bee_blue } from '../assets';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import React from 'react';
const UserHeader = () => {
  const userLogin = useSelector(state => state.main.userLogin);
  return (
    <View style={styles.container}>
      {userLogin ? (
        <View style={[MainStyles.flexRowSpaceBetween]}>
          <View style={MainStyles.flexRow}>
            <Image
              source={logo_bee_blue}
              style={{
                width: SCREEN_WIDTH * 0.11,
                height: SCREEN_WIDTH * 0.11,
                resizeMode: 'contain',
                marginRight: 10,
              }}
            />
            <View>
              <Text style={styles.title}>Chào {userLogin?.OfficerName},</Text>
              <Text style={styles.subTitle}>Cùng làm việc nhé !</Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={[MainStyles.flexRowCenter]}>
          <Text style={styles.title}>Ong Vàng xin chào 👋</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.select({
      ios: SCREEN_HEIGHT * 0.08,
      android: SCREEN_HEIGHT * 0.04,
    }),
    paddingBottom: SCREEN_HEIGHT * 0.04,
    paddingHorizontal: 20,
    backgroundColor: themeColors.lightBackground,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.MAIN_BLUE_CLIENT,
  },
  subTitle: {
    fontSize: 13,
    color: themeColors.primaryText,
  },
});
export default UserHeader;
