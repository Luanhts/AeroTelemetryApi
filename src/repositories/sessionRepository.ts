import pool from '../db/connection.js';

export class SessionRepository {
  async create(vehicleId: string, userId: string) {
    const result = await pool.query(
      `
      INSERT INTO telemetry_sessions (
        vehicle_id,
        started_at
      )
      SELECT id, NOW()
      FROM vehicles
      WHERE id = $1
        AND user_id = $2
      RETURNING telemetry_sessions.*
      `,
      [vehicleId, userId],
    );

    return result.rows[0];
  }

  async getAllSessions(userId: string) {
    const result = await pool.query(
      `
      SELECT ts.*
      FROM telemetry_sessions ts
      JOIN vehicles v ON v.id = ts.vehicle_id
      WHERE v.user_id = $1
      ORDER BY ts.started_at DESC
      `,
      [userId],
    );

    return result.rows;
  }

  async getSessionById(sessionId: string, userId: string) {
    const result = await pool.query(
      `
      SELECT ts.*
      FROM telemetry_sessions ts
      JOIN vehicles v ON v.id = ts.vehicle_id
      WHERE ts.id = $1
        AND v.user_id = $2
      `,
      [sessionId, userId],
    );

    return result.rows[0];
  }

  async getByVehicleId(userId: string, vehicleId: string) {
    const result = await pool.query(
      `
      SELECT ts.*
      FROM telemetry_sessions ts
      JOIN vehicles v ON v.id = ts.vehicle_id
      WHERE ts.vehicle_id = $1
        AND v.user_id = $2
      ORDER BY ts.started_at DESC
      `,
      [vehicleId, userId],
    );

    return result.rows;
  }

  async deleteSession(userId: string, sessionId: string) {
    const result = await pool.query(
      `
      DELETE FROM telemetry_sessions ts
      USING vehicles v
      WHERE ts.id = $1
        AND ts.vehicle_id = v.id
        AND v.user_id = $2
      RETURNING ts.*
      `,
      [sessionId, userId],
    );

    return result.rows[0];
  }

  async finishSession(userId: string, sessionId: string) {
    const result = await pool.query(
      `
    UPDATE telemetry_sessions ts

    SET ended_at = NOW(),
        status = 'FINISHED'

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
