import * as supertest from "supertest"
import { httpsApp } from "./api";

const request = supertest(httpsApp)

describe('API', () => {
  it.todo('POST interactive', async done => {
    const response = await request.post('/interactive')
    expect(response.status).toBe(200)
    done()
  })
  
  it.todo('POST thanks', async done => {
    const response = await request.post('/thanks')
    expect(response.status).toBe(200)
    done()
  })
  
  it.todo('POST coffeeRoulette', async done => {
    const response = await request.post('/coffeeRoulette')
    expect(response.status).toBe(200)
    done()
  })
})

