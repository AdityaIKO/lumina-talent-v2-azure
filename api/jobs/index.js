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
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

module.exports = async function (context, req) {
  const { id } = context.bindingData;
  const method = req.method.toLowerCase();

  if (method === 'options') {
    context.res = { status: 204, headers: HEADERS };
    return;
  }

  try {
    const database = await connect();
    const jobs = database.collection('jobs');

    // GET /api/jobs — list all active jobs
    if (method === 'get' && !id) {
      const list = await jobs.find({ status: { $ne: 'deleted' } })
        .sort({ createdAt: -1 })
        .toArray();
      context.res = { headers: HEADERS, body: { success: true, jobs: list } };
    }

    // GET /api/jobs/{id} — single job
    else if (method === 'get' && id) {
      const job = await jobs.findOne({ id });
      if (job) {
        context.res = { headers: HEADERS, body: { success: true, job } };
      } else {
        context.res = { status: 404, headers: HEADERS, body: { success: false, message: 'Job not found' } };
      }
    }

    // POST /api/jobs — create job
    else if (method === 'post') {
      const jobData = {
        ...req.body,
        id: req.body.id || `job_${Date.now()}`,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      await jobs.insertOne(jobData);
      context.res = { headers: HEADERS, body: { success: true, job: jobData } };
    }

    // PATCH /api/jobs/{id} — update job (e.g. close, edit)
    else if (method === 'patch' && id) {
      const result = await jobs.updateOne(
        { id },
        { $set: { ...req.body, updatedAt: new Date().toISOString() } }
      );
      context.res = { headers: HEADERS, body: { success: true, result } };
    }

    else {
      context.res = { status: 400, headers: HEADERS, body: 'Invalid Request' };
    }
  } catch (error) {
    context.log.error('Jobs Error:', error);
    context.res = { status: 500, headers: HEADERS, body: error.message };
  }
};
