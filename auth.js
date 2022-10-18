import http from 'k6/http';
import { Rate } from 'k6/metrics';
import { check, group, sleep, fail } from 'k6';

const payload = JSON.parse(open('./data/login.json'));

const BASE_URL = 'http://hr-apps-api.smtapps.net';
const LOGIN_SUFFIX = '/api/v1/auth/login';

const failures = new Rate('failed requests');


export const options = {
    // vus: 10,
    // duration: '10s',
    thresholds: {
        http_req_failed: ['rate<=0'],
        http_req_duration: ['avg<100', 'p(95)<500']
    },
};

export default function setup() {
    // inisial payload data
    let data = payload.loginPayload;

    // Using a JSON string as body
    let res = http.post(BASE_URL + LOGIN_SUFFIX, JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json', 'platform': 'web' },
    });

    // check result
    check(res, {
        'is status 200': (r) => r.status === 200
    });
    failures.add(res.status !== 200);
};