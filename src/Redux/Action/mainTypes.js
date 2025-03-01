const mainTypes = {
  LOADING: "LOADING",
  ERROR: "ERROR",
  CallServer: "CallServer",
  CONFIRM: "CONFIRM_ITEM",
  IN_ORDER: "IN_ORDER_ITEM",
  USER_PROFILE: "USER_PROFILE",
  ACCEPTED_ORDER: "ACCEPTED_ORDER",
  LOCATION_TIME: "LOCATION_TIME_STAFF",
  NOT_ACCEPTING_ORDERS: "NOT_ACCEPTING_ORDERS", //Đang tắt nhận đơn
  INSUFFICIENT_BALANCE: "INSUFFICIENT_BALANCE", //Không đủ số dư tài khoản
  READY_TO_ACCEPT_ORDERS: "READY_TO_ACCEPT_ORDERS", //Ready to accept orders
  ORDER_IN_PROGRESS: "ORDER_IN_PROGRESS", //Order in progress
  PostImage: "PostImage",
  CHECK_PERMISSION: "CHECK_PERMISSION",
  MY_ORDER_ACCEPTED: "MY_ORDER_ACCEPTED",
  INIT_VALUE_FIREBASE: "INIT_VALUE_FIREBASE",
  DecryptString: "DecryptString",
};
export default mainTypes;
