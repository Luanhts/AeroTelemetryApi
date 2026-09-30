import pool from '../db/connection.js';

export class SessionRepository {
  async create(vehicleId: string) {
    const result = await pool.query(
      `
      INSERT INTO telemetry_sessions (
        vehicle_id,
        started_at
      )
      VALUES ($1, NOW())
      RETURNING *
      `,
      [vehicleId],
    );

    return result.rows[0];
  }

  async getAllSessions(userId: string) {
    const result = await pool.query(
      `SELECT * FROM telemetry_sessions WHERE user_id = $1`,
      [userId],
    );

    return result.rows;
  }

  async getSessionById(sessionId: string, userId: string) {
    const result = await pool.query(
      `SELECT * FROM telemetry_sessions WHERE id = $1 AND user_id = $2`,
      [sessionId, userId],
    );

    return result.rows[0];
  }

  async getByVehicleId(userId: string, vehicleId: string) {
    const result = await pool.query(
      `
      SELECT *
      FROM telemetry_sessions WHERE vehicle_id = $1 AND user_id = $2
      ORDER BY started_at DESC
      `,
      [vehicleId, userId],
    );

    return result.rows;
  }

  async deleteSession(userId: string, sessionId: string) {
    const result = await pool.query(
      `DELETE FROM telemetry_sessions WHERE id = $1 AND user_id = $2`,
      [sessionId, userId],
    );

    return result.rows[0];
  }

  async finishSession(userId: string, sessionId: string) {
    const result = await pool.query(
      `
    UPDATE telemetry_sessions ts

    SET ended_at = NOW()

    FROM vehicles v

    WHERE ts.id = $1
      AND ts.vehicle_id = v.id
      AND v.user_id = $2
      AND ts.ended_at IS NULL

    RETURNING ts.*
    `,
      [sessionId, userId],
    );

    return result.rows[0];
  }
}
