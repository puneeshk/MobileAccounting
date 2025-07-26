export const AccountAPIUrls = {
  GET_ALL: `/api/AccountMaster/list`,
  CREATE: `/api/AccountMaster/save`,
  UPDATE: `/api/AccountMaster/save`, 
  DELETE: (accountId) => `/api/AccountMaster/${accountId}`
};


export const voucherApiUrls = {
  GET_ALL: "/api/Voucher/summary",
  GET_SINGLE: "/api/Voucher/getvoucher-by-id",
  CREATE: "/api/Voucher/save",
  UPDATE: "/api/Voucher/save",
  DELETE: "/api/Voucher/delete",
}