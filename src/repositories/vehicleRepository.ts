import pool from '../db/connection.js';

export class VehicleRepository {
  async create(name: string, type: string, userId: string) {
    const result = await pool.query(
      `
    INSERT INTO vehicles (name, type, user_id)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
      [name, type, userId],
    );

    return result.rows[0];
  }

  async getVehicles(userId: string) {
    const result = await pool.query(
      `
        SELECT * FROM vehicles WHERE user_id = $1
        `,
      [userId],
    );

    return result.rows;
  }

  async findById(vehicleId: string, userId: string) {
  const result = await pool.query(
    `
      SELECT *
      FROM vehicles
      WHERE id = $1
        AND user_id = $2
    `,
    [vehicleId, userId]
  );

  return result.rows[0];
}

  async updateVehicle(userId: string, vehicleId: string) {

  }

  async deleteVehicle(userId: string, vehicleId: string) {
    const result = await pool.query(
      `DELETE FROM vehicles WHERE id = $1 AND user_id = $2`, 
      [vehicleId, userId]
    )

    return result.rows[0];
  }
}
