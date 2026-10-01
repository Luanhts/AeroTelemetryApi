import pool from '../db/connection.js';
import type { VehicleType } from '../types/VehicleType.js';
import type { AircraftTelemetryInput } from '../interfaces/telemetry/inputs/AircraftTelemetryInput.js';
import type { CarTelemetryInput } from '../interfaces/telemetry/inputs/CarTelemetryInput.js';

export type TelemetryInput = AircraftTelemetryInput & CarTelemetryInput;

export class TelemetryRepository {
  async findSessionWithVehicleType(sessionId: string, userId: string) {
    const result = await pool.query(
      `
      SELECT
        ts.id,
        ts.status,
        v.type AS vehicle_type
      FROM telemetry_sessions ts
      JOIN vehicles v ON v.id = ts.vehicle_id
      WHERE ts.id = $1
        AND v.user_id = $2
      `,
      [sessionId, userId],
    );

    return result.rows[0];
  }

  async create(
    sessionId: string,
    vehicleType: VehicleType,
    data: TelemetryInput,
  ) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const telemetryResult = await client.query(
        `
        INSERT INTO telemetry_data (
          session_id,
          recorded_at,
          speed_mps,
          acceleration_mps2,
          latitude,
          longitude,
          throttle_pct
        )
        VALUES ($1, COALESCE($2::timestamptz, NOW()), $3, $4, $5, $6, $7)
        RETURNING *
        `,
        [
          sessionId,
          data.recordedAt,
          data.speedMps,
          data.accelerationMps2,
          data.latitude,
          data.longitude,
          data.throttlePct,
        ],
      );

      const telemetry = telemetryResult.rows[0];

      if (vehicleType === 'CAR') {
        const carResult = await client.query(
          `
          INSERT INTO car_telemetry (
            telemetry_id,
            rpm,
            gear,
            engine_temperature_c,
            steering_angle_deg,
            brake_pct
          )
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *
          `,
          [
            telemetry.id,
            data.rpm,
            data.gear,
            data.engineTemperatureC,
            data.steeringAngleDeg,
            data.brakePct,
          ],
        );

        await client.query('COMMIT');

        return {
          ...telemetry,
          car_telemetry: carResult.rows[0],
        };
      }

      const aircraftResult = await client.query(
        `
        INSERT INTO aircraft_telemetry (
          telemetry_id,
          altitude_m,
          vertical_speed_mps,
          pitch_deg,
          roll_deg,
          yaw_deg,
          heading_deg
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
        `,
        [
          telemetry.id,
          data.altitudeM,
          data.verticalSpeedMps,
          data.pitchDeg,
          data.rollDeg,
          data.yawDeg,
          data.headingDeg,
        ],
      );

      await client.query('COMMIT');

      return {
        ...telemetry,
        aircraft_telemetry: aircraftResult.rows[0],
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getAllBySessionId(sessionId: string, userId: string) {
    const result = await pool.query(
      `
      SELECT
        td.*,
        ct.rpm,
        ct.gear,
        ct.engine_temperature_c,
        ct.steering_angle_deg,
        ct.brake_pct,
        aircraft.altitude_m,
        aircraft.vertical_speed_mps,
        aircraft.pitch_deg,
        aircraft.roll_deg,
        aircraft.yaw_deg,
        aircraft.heading_deg,
        v.type AS vehicle_type
      FROM telemetry_data td
      JOIN telemetry_sessions ts ON ts.id = td.session_id
      JOIN vehicles v ON v.id = ts.vehicle_id
      LEFT JOIN car_telemetry ct ON ct.telemetry_id = td.id
      LEFT JOIN aircraft_telemetry aircraft ON aircraft.telemetry_id = td.id
      WHERE td.session_id = $1
        AND v.user_id = $2
      ORDER BY td.recorded_at ASC
      `,
      [sessionId, userId],
    );

    return result.rows;
  }

  async getById(telemetryId: string, userId: string) {
    const result = await pool.query(
      `
      SELECT
        td.*,
        ct.rpm,
        ct.gear,
        ct.engine_temperature_c,
        ct.steering_angle_deg,
        ct.brake_pct,
        aircraft.altitude_m,
        aircraft.vertical_speed_mps,
        aircraft.pitch_deg,
        aircraft.roll_deg,
        aircraft.yaw_deg,
        aircraft.heading_deg,
        v.type AS vehicle_type
      FROM telemetry_data td
      JOIN telemetry_sessions ts ON ts.id = td.session_id
      JOIN vehicles v ON v.id = ts.vehicle_id
      LEFT JOIN car_telemetry ct ON ct.telemetry_id = td.id
      LEFT JOIN aircraft_telemetry aircraft ON aircraft.telemetry_id = td.id
      WHERE td.id = $1
        AND v.user_id = $2
      `,
      [telemetryId, userId],
    );

    return result.rows[0];
  }

  async delete(telemetryId: string, userId: string) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const telemetryResult = await client.query(
        `
        SELECT td.*
        FROM telemetry_data td
        JOIN telemetry_sessions ts ON ts.id = td.session_id
        JOIN vehicles v ON v.id = ts.vehicle_id
        WHERE td.id = $1
          AND v.user_id = $2
        FOR UPDATE OF td
        `,
        [telemetryId, userId],
      );

      const telemetry = telemetryResult.rows[0];

      if (!telemetry) {
        await client.query('ROLLBACK');
        return undefined;
      }

      await client.query('DELETE FROM car_telemetry WHERE telemetry_id = $1', [
        telemetryId,
      ]);
      await client.query(
        'DELETE FROM aircraft_telemetry WHERE telemetry_id = $1',
        [telemetryId],
      );
      await client.query('DELETE FROM telemetry_data WHERE id = $1', [
        telemetryId,
      ]);

      await client.query('COMMIT');

      return telemetry;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
