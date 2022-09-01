import PQueue from 'p-queue'
import puppeteer from 'puppeteer'

const queue = new PQueue({ concurrency: 1 })

const MAX_TOKEN_ID = 80
const BASE =
  'https://opensea.io/assets/matic/0x89904de861cded2567695271a511b3556659ffa2'
const SELECTOR = '#main button:first-child'

;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  })
  const page = await browser.newPage()
  console.log('browser prepared')

  const promises = new Array(MAX_TOKEN_ID)
    .fill(null)
    .map((_, i) => async () => {
      const id = i + 1
      await page.goto(`${BASE}/${id}`)
      console.log(id, 'page loaded')
      await page.waitForSelector(SELECTOR)
      console.log(id, 'refresh button found')
      page.click(SELECTOR), console.log(id, 'clicked the refresh button')
      await page.waitForSelector('[data-testid=toasts]')
      console.log(id, 'finished')
    })

  const results = await queue.addAll(promises)

  results.forEach((result, i) => console.log(i + 1, result))

  browser.close()
})()
