const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.VITE_AZURE_COSMOS_ENDPOINT);
let db;

async function connect() {
  if (!db) {
    await client.connect();
    db = client.db('lumina-talent');
  }
  return db;
}

const HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

module.exports = async function (context, req) {
  const method = req.method.toLowerCase();
  const { freelancerId, jobId } = req.query;

  if (method === 'options') {
    context.res = { status: 204, headers: HEADERS };
    return;
  }

  try {
    const database = await connect();
    const applications = database.collection('applications');

    // GET /api/applications?freelancerId=xxx — user's applications
    if (method === 'get' && freelancerId) {
      const list = await applications.find({ freelancerId })
        .sort({ appliedAt: -1 })
        .toArray();
      context.res = { headers: HEADERS, body: { success: true, applications: list } };
    }

    // GET /api/applications?jobId=xxx — applicants for a job (employer view)
    else if (method === 'get' && jobId) {
      const list = await applications.find({ jobId })
        .sort({ appliedAt: -1 })
        .toArray();
      context.res = { headers: HEADERS, body: { success: true, applications: list } };
    }

    // POST /api/applications — apply to a job
    else if (method === 'post') {
      const data = req.body;
      // Prevent duplicate applications
      const existing = await applications.findOne({
        freelancerId: data.freelancerId,
        jobId: data.jobId,
      });
      if (existing) {
        context.res = { status: 409, headers: HEADERS, body: { success: false, message: 'Already applied' } };
        return;
      }
      const app = {
        ...data,
        id: `app_${Date.now()}`,
        status: 'pending',
        appliedAt: new Date().toISOString(),
      };
      await applications.insertOne(app);
      context.res = { headers: HEADERS, body: { success: true, application: app } };
    }

    // PATCH /api/applications — update status (employer accepts/rejects)
    else if (method === 'patch') {
      const { id, status } = req.body;
      const result = await applications.updateOne(
        { id },
        { $set: { status, updatedAt: new Date().toISOString() } }
      );
      context.res = { headers: HEADERS, body: { success: true, result } };
    }

    else {
      context.res = { status: 400, headers: HEADERS, body: 'Invalid Request' };
    }
  } catch (error) {
    context.log.error('Applications Error:', error);
    context.res = { status: 500, headers: HEADERS, body: error.message };
  }
};
