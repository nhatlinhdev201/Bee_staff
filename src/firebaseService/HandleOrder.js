import {firebase} from '@react-native-firebase/database';
import {useEffect, useState} from 'react';

export const databaseOrder = firebase
  .app()
  .database(
    'https://golden-bee-651eb-default-rtdb.asia-southeast1.firebasedatabase.app',
  )
  .ref('/order');

export const databaseOfficers = firebase
  .app()
  .database(
    'https://golden-bee-651eb-default-rtdb.asia-southeast1.firebasedatabase.app',
  )
  .ref('/officers');

export const OVG_FBRT_AddOfficer = async (OffcerId, Status) => {
  if (!OffcerId || !Status) {
    console.error('Invalid value for OffcerId or Status:', OffcerId, Status);
    return false;
  }
  try {
    const newOfficer = {
      OfficerId: OffcerId,
      Status: Status,
    };
    databaseOfficers.push(newOfficer);
    return true;
  } catch {
    return false;
  }
};

export const listenForAcceptedOrders = (
  staffId,
  acceptedOrder,
  setAcceptedOrders,
) => {
  if (
    staffId !== null &&
    staffId !== undefined &&
    typeof staffId !== 'string' &&
    typeof staffId !== 'number' &&
    typeof staffId !== 'boolean'
  ) {
    console.error('Invalid value for customerId:', staffId);
    return;
  }
  try {
    databaseOrder
      .orderByChild('StaffId')
      .equalTo(staffId)
      .on('value', snapshot => {
        const orders = snapshot.val();
        if (orders && orders !== acceptedOrder) {
          const acceptedOrders = [];
          Object.keys(orders).forEach(orderId => {
            const order = orders[orderId];
            acceptedOrders.push(order);
          });
          setAcceptedOrders(acceptedOrders); // Cập nhật danh sách đơn hàng đã nhận
        } else {
          setAcceptedOrders([]); // Nếu không có đơn hàng nào đã nhận
        }
      });
  } catch {
    // console.error("Error listening for accepted orders: ", error);
  }
};

export const fetchUnassignedOrders = async () => {
  // console.log("Fetching unassigned orders with StaffId equal to ''");
  try {
    const snapshot = await databaseOrder
      .orderByChild('StaffId')
      .equalTo('')
      .once('value');

    const orders = snapshot.val();
    // console.log("Unassigned orders snapshot received:", orders);

    const unassignedOrders = [];
    if (orders) {
      Object.keys(orders).forEach(orderId => {
        const order = orders[orderId];
        unassignedOrders.push(order);
      });
    }

    return unassignedOrders; // Trả về danh sách đơn hàng chưa có nhân viên nhận
  } catch {
    // console.error("Error fetching unassigned orders: ", error);
    return [];
  }
};
// Lắng nghe đơn hàng mới cho nhân viên
export const listenForNewOrders = (newOrders, setNewOrders) => {
  // console.log("Listening for new orders with StaffId equal to ''");
  try {
    databaseOrder
      .orderByChild('StaffId')
      .equalTo('')
      .on('value', snapshot => {
        const orders = snapshot.val();
        // console.log("New orders snapshot received:", orders);
        if (orders && orders !== newOrders) {
          const newOrders = [];
          Object.keys(orders).forEach(orderId => {
            const order = orders[orderId];
            newOrders.push(order);
          });
          setNewOrders(newOrders); // Cập nhật danh sách đơn hàng mới
        } else {
          setNewOrders([]); // Nếu không có đơn hàng nào mới
        }
      });
  } catch {
    // console.error("Error listening for new orders: ", error);
  }
};
// Nhận đơn hàng
export const acceptOrder = async (
  orderId,
  staffId,
  staffName,
  staffPhone,
  LatitudeStaff,
  LongitudeStaff,
  staffAvatar = '',
) => {
  if (
    typeof staffId !== 'string' &&
    typeof staffId !== 'number' &&
    typeof staffId !== 'boolean' &&
    orderId !== null
  ) {
    // console.error("Invalid value for customerId:", staffId);
    return;
  }
  try {
    await databaseOrder.child(orderId).update({
      StaffId: staffId,
      StaffName: staffName,
      StaffPhone: staffPhone,
      LatitudeStaff: LatitudeStaff,
      LongitudeStaff: LongitudeStaff,
      StaffAvatar: staffAvatar,
      StatusOrder: 1,
    });
    // console.log("Order accepted successfully:", { orderId, staffId });
    return true;
  } catch {
    // console.error("Error accepting order: ", error);
    return false;
  }
};

//CẬp nhật lat lng
export const OVG_FBRT_UpdateLocation = async (
  orderId,
  LatitudeStaff,
  LongitudeStaff,
) => {
  const location = {
    LatitudeStaff: LatitudeStaff,
    LongitudeStaff: LongitudeStaff,
  };

  if (
    typeof orderId !== 'string' &&
    typeof orderId !== 'number' &&
    typeof orderId !== 'boolean' &&
    orderId !== null
  ) {
    // console.error("Invalid value for customerId:", orderId);
    return;
  }
  try {
    await databaseOrder.child(orderId).update(location);
    // console.log("location updated successfully:", location);
    return location;
  } catch {
    // console.error("Error placing location: ", error);
    return false;
  }
};

// cập nhật Status
export const OVG_UpdateStatusOrder = async (orderId, statusOrder) => {
  const status = {
    StatusOrder: statusOrder,
  };
  if (
    typeof orderId !== 'string' &&
    typeof orderId !== 'number' &&
    typeof orderId !== 'boolean' &&
    orderId !== null
  ) {
    // console.error("Invalid value for customerId:", orderId);
    return;
  }
  try {
    await databaseOrder.child(orderId).update(status);
    // console.log("location updated successfully:", status);
    return status;
  } catch {
    // console.error("Error placing status: ", error);
    return false;
  }
};

// Hoàn thành đơn hàng
export const completeOrder = async orderId => {
  try {
    await databaseOrder.child(orderId).remove();
    // console.log("Order completed and removed successfully:", orderId);
    return true;
  } catch {
    // console.error("Error completing order: ", error);
    return false;
  }
};

// Kiểm tra và xóa đơn hàng chưa nhận sau 10 phút
export const checkAndDeleteExpiredOrders = () => {
  // console.log("Checking and deleting expired orders");
  databaseOrder.on('value', snapshot => {
    const orders = snapshot.val();
    // console.log("Orders snapshot received for deletion check:", orders);
    if (orders) {
      Object.keys(orders).forEach(orderId => {
        const order = orders[orderId];
        if (order.StaffId === '') {
          // deleteOrderIfNotAccepted(orderId, order.createAt);
        }
      });
    }
  });
};

// Hàm lắng nghe thay đổi và nhận đơn hàng cho nhân viên
export const listenNewOrders = setNewOrders => {
  // console.log("Listening for new orders with StaffId equal to ''");
  try {
    databaseOrder
      .orderByChild('StaffId')
      .equalTo('')
      .on('value', snapshot => {
        const orders = snapshot.val();
        // console.log("New orders snapshot received:", orders);
        if (orders) {
          const newOrdersArray = Object.keys(orders).map(
            orderId => orders[orderId],
          );
          setNewOrders(newOrdersArray);
        } else {
          setNewOrders([]); // Nếu không có đơn hàng nào mới
        }
      });
  } catch {
    // console.error("Error listening for new orders: ", error);
  }
};
// Hàm lắng nghe thay đổi và nhận đơn hàng cho nhân viên

// Hàm để so sánh hai mảng
export const arraysEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (JSON.stringify(arr1[i]) !== JSON.stringify(arr2[i])) return false;
  }
  return true;
};

export const useListenOrdersByStaffIdWithFlag = isStaff => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (typeof isStaff !== 'boolean') {
      // console.error("Invalid value for isStaff:", isStaff);
      return;
    }

    // console.log("Listening for orders with isStaff:", isStaff);

    const ordersRef = databaseOrder.orderByChild('isStaff').equalTo(isStaff);

    // Lấy dữ liệu ban đầu
    ordersRef.once('value', snapshot => {
      const initialOrders = snapshot.val()
        ? Object.keys(snapshot.val()).map(orderId => ({
            ...snapshot.val()[orderId],
            orderId,
          }))
        : [];
      setOrders(initialOrders);
    });

    const handleOrderChange = snapshot => {
      snapshot.forEach(childSnapshot => {
        const orderId = childSnapshot.key;

        // Kiểm tra loại thay đổi và log ra
        if (childSnapshot.exists()) {
          if (orders.some(order => order.orderId === orderId)) {
            // Đơn hàng đã tồn tại, đây là sự kiện sửa đổi
            // console.log(`Order modified: ${orderId}`, orderData);
          } else {
            // Đơn hàng mới được thêm vào
            // console.log(`Order added: ${orderId}`, orderData);
          }
        } else {
          // Đơn hàng bị xóa
          // console.log(`Order removed: ${orderId}`);
        }
      });

      // Cập nhật danh sách đơn hàng
      const updatedOrders = snapshot.val()
        ? Object.keys(snapshot.val()).map(orderId => ({
            ...snapshot.val()[orderId],
            orderId,
          }))
        : [];
      setOrders(updatedOrders);
    };

    // Bắt đầu lắng nghe khi mount component
    ordersRef.on('child_added', handleOrderChange);
    ordersRef.on('child_changed', handleOrderChange);
    ordersRef.on('child_removed', handleOrderChange);

    // Cleanup khi unmount component
    return () => {
      ordersRef.off('child_added', handleOrderChange);
      ordersRef.off('child_changed', handleOrderChange);
      ordersRef.off('child_removed', handleOrderChange);
    };
  }, [isStaff]);

  return orders;
};

// export const OVG_FBRT_UpdatingStaff = async (
//   orderId,
//   staffId,
//   staffAvatar,
//   staffName,
//   staffPhone,
//   latitudeStaff,
//   longitudeStaff
// ) => {
//   const db = getDatabase();
//   const ordersRef = ref(db, "order");

//   const newOrder = {
//     StaffId: staffId,
//     StaffAvatar: staffAvatar,
//     StaffName: staffName,
//     StaffPhone: staffPhone,
//     LatitudeStaff: latitudeStaff,
//     LongitudeStaff: longitudeStaff,
//     StatusOrder: 1,
//   };

//   try {
//     // Tạo truy vấn để tìm order có OrderId là orderId
//     const orderQuery = query(
//       ordersRef,
//       orderByChild("OrderId"),
//       equalTo(orderId)
//     );
//     const snapshot = await get(orderQuery);

//     if (snapshot.exists()) {
//       // Lấy key của order cần cập nhật
//       const orderKey = Object.keys(snapshot.val())[0];

//       // Cập nhật thông tin cho order
//       await update(ref(db, `order/${orderKey}`), newOrder);
//       return true;
//     } else {
//       console.log("Order not found");
//       return false;
//     }
//   } catch  {
//     console.log("error", error);
//     return false;
//   }
// };
