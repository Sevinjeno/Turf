import pool from "../configs/dbConfig.js"

export const getPlatformFee=async()=>{
   
    const result=await pool.query(
        `Select platform_fee_percent
         FROM platform_settings
         LIMIT 1`
    )

    return result.rows[0]

}