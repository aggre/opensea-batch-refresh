import puppeteer from 'puppeteer'

const MAX_TOKEN_ID = 3
const BASE =
  'https://opensea.io/assets/matic/0x89904de861cded2567695271a511b3556659ffa2'
const SELECTOR = '#main button:first-child'

;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  })
  const page = await browser.newPage()
  console.log('browser prepared')

  const promises = new Array(MAX_TOKEN_ID).fill(null).map(async (_, i) => {
    const id = i + 1
    await page.goto(`${BASE}/${id}`)
    console.log(id, 'page loaded')
    await page.waitForSelector(SELECTOR)
    console.log(id, 'refresh button found')
    page.click(SELECTOR), console.log(id, 'clicked the refresh button')
    await page.waitForSelector('[data-testid=toasts]')
    console.log(id, 'finished')
  })

  const results = await Promise.allSettled(promises)

  results.forEach((result, i) => console.log(i + 1, result.status))

  browser.close()
})()
