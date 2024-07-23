const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const HASURA_ENDPOINT = 'http://localhost:8080/v1/graphql';
const HASURA_SECRET = 'youradminsecretkey';

const queryHasura = async (query, variables) => {
  try {
    const response = await axios.post(
      HASURA_ENDPOINT,
      { query, variables },
      { headers: { 'x-hasura-admin-secret': HASURA_SECRET } }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

app.post('/deposit', async (req, res) => {
  const { userId, amount } = req.body;

  const query = `
    mutation Deposit($userId: Int!, $amount: numeric!) {
      insert_transactions(objects: {user_id: $userId, amount: $amount, type: "deposit"}) {
        returning {
          id
        }
      }
      update_users(where: {id: {_eq: $userId}}, _inc: {balance: $amount}) {
        affected_rows
      }
    }
  `;

  try {
    const result = await queryHasura(query, { userId, amount });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/withdraw', async (req, res) => {
  const { userId, amount } = req.body;

  const query = `
    mutation Withdraw($userId: Int!, $amount: numeric!) {
      insert_transactions(objects: {user_id: $userId, amount: $amount, type: "withdrawal"}) {
        returning {
          id
        }
      }
      update_users(where: {id: {_eq: $userId}}, _inc: {balance: -$amount}) {
        affected_rows
      }
    }
  `;

  try {
    const result = await queryHasura(query, { userId, amount });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

