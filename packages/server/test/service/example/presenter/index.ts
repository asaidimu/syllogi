import request from "supertest"
import {app} from "../../../mock/index.js"
import { Http2Server } from "http2"

interface State {
    app: Http2Server
}

let state: State | null = null

beforeEach(async () => {
    state = await app()
})

test('Example route returns appropriate message', async () => {
    const { app } = state!
    const response = await request(app).get('/api/example')
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Hello, World!')
})
