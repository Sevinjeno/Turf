export const getUnitsForCourts=async(court_id)=>{

  const {rows}=await pool.query(
     `
    SELECT unit_id
    FROM court_units
    WHERE court_id = $1
    `,
    [court_id]
  )

   return rows.map(r=>r.unit_id)
   
}