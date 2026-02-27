import { Op } from "sequelize";

export default function buildFilterQuery(filters) {
    const where = {};
    if (filters.min_total) {
    where.total_amount = {
      ...where.total_amount,
      [Op.gte]: parseFloat(filters.min_total),
    };
  }

  if (filters.max_total) {
    where.total_amount = {
      ...where.total_amount,
      [Op.lte]: parseFloat(filters.max_total),
    };
  }

  if (filters.id) {
    where.id = filters.id;
  }

  if (filters.start_date) {
    where.timestamp = {
      ...where.timestamp,
      [Op.gte]: new Date(filters.start_date),
    };
  }

  if (filters.end_date) {
    const endDate = new Date(filters.end_date);
    endDate.setHours(23, 59, 59, 999);
    where.timestamp = { ...where.timestamp, [Op.lte]: endDate };
  }

  if (
    filters.has_special_rates === 'true' ||
    filters.has_special_rates === true
  ) {
    where.special_rates = { [Op.gt]: 0 };
  }
    return where;
}
