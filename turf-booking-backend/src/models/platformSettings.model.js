import pool from "../configs/dbConfig.js"

export const getPlatformFeePercent = async () => {
  const res = await pool.query(
    "SELECT platform_fee_percent FROM platform_settings WHERE id = 1"
  );
  return res.rows[0].platform_fee_percent;
};