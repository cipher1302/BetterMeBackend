import { Op } from "sequelize";
import dayjs from "dayjs";

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

  if (filters.start_date || filters.end_date) {
    where.timestamp = {};

    if (filters.start_date) {
      const start = dayjs(filters.start_date);
      if (start.isValid()) {
        where.timestamp[Op.gte] = start.startOf("day").toDate();
      }
    }

    if (filters.end_date) {
      const end = dayjs(filters.end_date);
      if (end.isValid()) {
        where.timestamp[Op.lte] = end.endOf("day").toDate();
      }
    }
  }

  const hasSpecialFilter = filters.has_special_rates?.toString().toLowerCase();

  if (hasSpecialFilter === "true" || hasSpecialFilter === "false") {
    if (hasSpecialFilter === "true") {
      where.special_rates = { [Op.gt]: 0 };
    } else {
      where.special_rates = 0;
    }
  }
  return where;
}
