const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const HASURA_ENDPOINT = 'http://localhost:8080/v1/graphql';
const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET;

// Middleware to check balance and authorize transactions
const checkBalance = async (req, res, next) => {
    const { user_id, amount, type } = req.body;

    if (type === 'withdraw') {
        try {
            const response = await axios.post(HASURA_ENDPOINT, {
                query: `
                    query ($id: Int!) {
                        users_by_pk(id: $id) {
                            balance
                        }
                    }
                `,
                variables: { id: user_id },
            }, {
                headers: {
                    'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
                }
            });

            const balance = response.data.data.users_by_pk.balance;
            if (balance < amount) {
                return res.status(400).json({ error: 'Insufficient funds' });
            }
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    next();
};

// Route to handle transactions
app.post('/transaction', checkBalance, async (req, res) => {
    const { user_id, amount, type } = req.body;

    try {
        // Add transaction
        await axios.post(HASURA_ENDPOINT, {
            query: `
                mutation ($user_id: Int!, $amount: numeric!, $type: String!) {
                    insert_transactions_one(object: {user_id: $user_id, amount: $amount, type: $type}) {
                        id
                    }
                }
            `,
            variables: { user_id, amount, type },
        }, {
            headers: {
                'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
            }
        });

        // Update user balance
        const operation = type === 'deposit' ? '+' : '-';
        await axios.post(HASURA_ENDPOINT, {
            query: `
                mutation ($id: Int!, $amount: numeric!) {
                    update_users_by_pk(pk_columns: {id: $id}, _set: {balance: ${operation} $amount}) {
                        id
                        balance
                    }
                }
            `,
            variables: { id: user_id, amount },
        }, {
            headers: {
                'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
            }
        });

        res.status(200).json({ message: 'Transaction successful' });
    } catch (error) {
        res.status(500).
