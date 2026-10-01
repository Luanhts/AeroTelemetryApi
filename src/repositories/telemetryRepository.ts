import pool from '../db/connection.js';

export class TelemetryRepository {
  async create(sessionId: string, userId: string) {
    const result = await pool.query(
      `
        `,
      [],
    );

    return result.rows[0];
  }

  async getAllTelelmetrys(sessionId: string) {
    const result = await pool.query(``, []);

    return result.rows;
  }

  async getTelemetryById(telemetryId: string) {
    const result = await pool.query(``, []);

    return result.rows[0];
  }

  async deleteTelemetry(telemetryId: string) {
    const result = await pool.query(``, []);

    return result.rows[0]
  }
}
