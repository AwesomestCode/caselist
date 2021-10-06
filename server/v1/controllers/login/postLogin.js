import { authenticate } from 'ldap-authentication';
import crypto from 'crypto';
import SQL from 'sql-template-strings';
import { query } from '../../helpers/mysql';
import config from '../../../config';

const postLogin = {
    POST: async (req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        // TODO - figure out how to mock this
        let auth = authenticate;
        if (process.env.NODE_ENV !== 'production') {
            auth = () => {
                return {
                    dn: 'uid=test@test.com,ou=users,dc=tabroom,dc=com',
                    uidNumber: 1,
                    displayName: 'Test User',
                };
            };
        }
        // TODO - figure out error handling with correct codes
        let user;
        try {
            user = await auth({
                ldapOpts: { url: config.LDAP_URL },
                userDn: `uid=${username},ou=users,dc=tabroom,dc=com`,
                userPassword: password,
                userSearchBase: 'ou=users,dc=tabroom,dc=com',
                usernameAttribute: 'uid',
                username,
            });
        } catch (err) {
            console.log(`LDAP error: ${err}`);
            return res.status(401).json({ message: 'Invalid username or password' });
            // return res.status(500).json({ message: 'Failure with authentication service', error: err });
        }

        if (!user || !user.uidNumber) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const nonce = crypto.randomBytes(16).toString('hex');
        const hash = crypto.createHash('sha512').update(nonce).digest('hex');

        await query(SQL`
            INSERT INTO users (user_id, email, display_name)
            VALUES (${user.uidNumber}, ${username}, ${user.displayName})
            ON DUPLICATE KEY UPDATE email=${username}, display_name=${user.displayName}
        `);

        await query(SQL`
            INSERT INTO sessions (token, user_id, ip, expires_at)
            VALUES (${hash}, ${user.uidNumber}, ${req.ip}, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 MONTH))
        `);

        res.cookie('caselist_token', nonce, { maxAge: 900000, httpOnly: true, path: '/' });
        return res.status(201).json({ message: 'Successfully logged in', token: nonce });
    },
};

postLogin.POST.apiDoc = {
    summary: 'Logs in',
    operationId: 'postLogin',
    requestBody: {
        description: 'The username and password',
        required: true,
        content: { '*/*': { schema: { $ref: '#/components/schemas/Login' } } },
    },
    responses: {
        201: {
            description: 'Logged in',
            content: { '*/*': { schema: { $ref: '#/components/schemas/School' } } },
        },
        default: { $ref: '#/components/responses/ErrorResponse' },
    },
    security: [],
};

export default postLogin;
