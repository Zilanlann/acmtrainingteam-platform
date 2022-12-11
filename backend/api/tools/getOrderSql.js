export default (order) => {
  if (!order?.order) {
    return "";
  }
  return `ORDER BY ${order.prop} ${
    order.order === "descending" ? "DESC" : "ASC"
  }`;
};
