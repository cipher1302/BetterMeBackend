import { Op } from "sequelize";

export default function buildFilterQuery(filters) {
    const where = {};
    if (filters.county) {
        where.county_name = { [Op.iLike]: `%${filters.county}%` };
    }
    if (filters.min_total) {
        where.total_amount = { ...where.total_amount, [Op.gte]: parseFloat(filters.min_total) };
    }
    if (filters.max_total) {
        where.total_amount = { ...where.total_amount, [Op.lte]: parseFloat(filters.max_total) };
    }
    return where;
}