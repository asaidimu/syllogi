import request from "supertest"
import {app} from "./mock.js"

import { Http2Server } from "http2"

suite('Example test suite.', () => {
    interface State {
        app: Http2Server
    }

    /* Called before each test is run */
    setUp(async (): Promise<State> => {
        return app()
    })


    /* defines a test case */
    test('Example route returns appropriate message', async ({ app }: State) => {
        await request(app)
        .get('/api/example')
        .expect(200)
        .then(response => assert.deepEqual(response.body.message, 'Hello, World!'))
    })
})
