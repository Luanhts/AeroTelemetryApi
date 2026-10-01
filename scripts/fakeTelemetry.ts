const API_URL = 'http://localhost:3000';

const SESSION_ID = 'c42c7a39-ffc4-41fc-a76e-6e8a4ec62d6b';

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIiLCJlbWFpbCI6Imx1YW5AZ21haWwuY29tIiwiaWF0IjoxNzkwODY3NDIxLCJleHAiOjE3OTA4NzEwMjF9.44lV_dIMKC6FNdAMXvsSpd6EIV_SFIKFbmsfrTFGgv8';

interface FakeTelemetry {
  recordedAt: string;

  speedMps: number;

  latitude: number;
  longitude: number;

  accelerationMps2: number;

  throttlePct: number;
}

let state = {
  speedMps: 0,

  latitude: -25.0945,
  longitude: -50.1633,

  accelerationMps2: 0,

  throttlePct: 0,
};

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function generateTelemetry(): FakeTelemetry {
  state.throttlePct += randomBetween(-3, 5);

  state.throttlePct = Math.max(0, Math.min(100, state.throttlePct));

  state.accelerationMps2 =
    (state.throttlePct / 100) * 3 - randomBetween(0.5, 1.5);

  state.speedMps += state.accelerationMps2;

  state.speedMps = Math.max(0, state.speedMps);

  state.latitude += randomBetween(-0.00005, 0.00005);

  state.longitude += randomBetween(-0.00005, 0.00005);

  return {
    recordedAt: new Date().toISOString(),

    speedMps: Number(state.speedMps.toFixed(2)),

    latitude: Number(state.latitude.toFixed(6)),

    longitude: Number(state.longitude.toFixed(6)),

    accelerationMps2: Number(state.accelerationMps2.toFixed(2)),

    throttlePct: Number(state.throttlePct.toFixed(2)),
  };
}

async function sendTelemetry(data: FakeTelemetry) {
  try {
    const response = await fetch(
      `${API_URL}/sessions/${SESSION_ID}/telemetry`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TOKEN}`,
        },

        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      const error = await response.text();

      console.error(`API error ${response.status}:`, error);

      return;
    }

    console.log(`[${new Date().toLocaleTimeString()}]`, data);
  } catch (error) {
    console.error('Failed to send telemetry:', error);
  }
}

console.log('🚗 Fake telemetry started');

setInterval(async () => {
  const telemetry = generateTelemetry();

  await sendTelemetry(telemetry);
}, 1000);
