const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.VITE_AZURE_COSMOS_ENDPOINT);
let db;

async function connect() {
  if (!db) {
    await client.connect();
    db = client.db('lumina-talent'); // Nama database Anda
  }
  return db;
}

module.exports = async function (context, req) {
  const { id } = context.bindingData;
  const method = req.method.toLowerCase();

  // CORS Headers
  const headers = {
    'Access-Control-Allow-Origin': '*', // Anda bisa mengganti '*' dengan domain Hostinger Anda nanti demi keamanan
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };

  // Handle CORS Preflight
  if (method === 'options') {
    context.res = { status: 204, headers };
    return;
  }
  
  try {
    const database = await connect();
    const collection = database.collection('users');

    // GET /api/users/{id}
    if (method === 'get' && id) {
      const user = await collection.findOne({ id: id });
      if (user) {
        context.res = { headers, body: { success: true, user } };
      } else {
        context.res = { status: 404, headers, body: { success: false, message: 'User not found' } };
      }
    }

    // POST /api/users
    else if (method === 'post') {
      const userData = req.body;
      const result = await collection.updateOne(
        { id: userData.id },
        { $set: { ...userData, updatedAt: new Date().toISOString() } },
        { upsert: true }
      );
      context.res = { headers, body: { success: true, result } };
    }

    // PATCH /api/users/{id}
    else if (method === 'patch' && id) {
      const updateData = req.body;
      const result = await collection.updateOne(
        { id: id },
        { $set: { ...updateData, updatedAt: new Date().toISOString() } }
      );
      context.res = { headers, body: { success: true, result } };
    }

    else {
      context.res = { status: 400, headers, body: 'Invalid Request' };
    }
  } catch (error) {
    context.log.error('Database Error:', error);
    context.res = { status: 500, headers, body: error.message };
  }
};
