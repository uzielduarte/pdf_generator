import express from 'express'
import puppeteer from 'puppeteer'
import generatePDF, {generateReportePDF} from './pdf/generatePDF.js'

const app = express()
const PORT = 3000

const datosDePrueba = {
    quoteId: "2026-001",
    clientName: "Helados Bendición de Dios",
    date: "01 de febrero, 2026",
    items: [
        { name: "Barquillos de Chocolate", quantity: 50, price: 2, subtotal: 100 },
        { name: "Litro de Mantecado", quantity: 10, price: 5, subtotal: 50 },
        { name: "Barquillos de Chocolate", quantity: 50, price: 2, subtotal: 100 },
        { name: "Litro de Mantecado", quantity: 10, price: 5, subtotal: 50 },
        { name: "Barquillos de Chocolate", quantity: 50, price: 2, subtotal: 100 },
        { name: "Litro de Mantecado", quantity: 10, price: 5, subtotal: 50 },
        { name: "Barquillos de Chocolate", quantity: 50, price: 2, subtotal: 100 },
        { name: "Litro de Mantecado", quantity: 10, price: 5, subtotal: 50 },
        { name: "Barquillos de Chocolate", quantity: 50, price: 2, subtotal: 100 },
        { name: "Litro de Mantecado", quantity: 10, price: 5, subtotal: 50 },
        { name: "Barquillos de Chocolate", quantity: 50, price: 2, subtotal: 100 },
        { name: "Litro de Mantecado", quantity: 10, price: 5, subtotal: 50 },
        { name: "Barquillos de Chocolate", quantity: 50, price: 2, subtotal: 100 },
        { name: "Litro de Mantecado", quantity: 10, price: 5, subtotal: 50 },
        { name: "Barquillos de Chocolate", quantity: 50, price: 2, subtotal: 100 },
        { name: "Litro de Mantecado", quantity: 10, price: 5, subtotal: 50 },
        { name: "Barquillos de Chocolate", quantity: 50, price: 2, subtotal: 100 },
        { name: "Litro de Mantecado", quantity: 10, price: 5, subtotal: 50 },
        { name: "Barquillos de Chocolate", quantity: 50, price: 2, subtotal: 100 },
        { name: "Litro de Mantecado", quantity: 10, price: 5, subtotal: 50 },
        { name: "Barquillos de Chocolate", quantity: 50, price: 2, subtotal: 100 },
        { name: "Litro de Mantecado", quantity: 10, price: 5, subtotal: 50 },
        { name: "Barquillos de Chocolate", quantity: 50, price: 2, subtotal: 100 },
        { name: "Litro de Mantecado", quantity: 10, price: 5, subtotal: 50 },
        { name: "Barquillos de Chocolate", quantity: 50, price: 2, subtotal: 100 },
        { name: "Litro de Mantecado", quantity: 10, price: 5, subtotal: 50 },
        { name: "Barquillos de Chocolate", quantity: 50, price: 2, subtotal: 100 },
        { name: "Litro de Mantecado", quantity: 10, price: 5, subtotal: 50 },
        { name: "Barquillos de Chocolate", quantity: 50, price: 2, subtotal: 100 },
        { name: "Litro de Mantecado", quantity: 10, price: 5, subtotal: 50 },
        { name: "Barquillos de Chocolate", quantity: 50, price: 2, subtotal: 100 },
        { name: "Litro de Mantecado", quantity: 10, price: 5, subtotal: 50 },
        { name: "Barquillos de Chocolate", quantity: 50, price: 2, subtotal: 100 },
        { name: "Litro de Mantecado", quantity: 10, price: 5, subtotal: 50 },
        { name: "Barquillos de Chocolate", quantity: 50, price: 2, subtotal: 100 },
        { name: "Litro de Mantecado", quantity: 10, price: 5, subtotal: 50 },
        { name: "Barquillos de Chocolate", quantity: 50, price: 2, subtotal: 100 },
        { name: "Litro de Mantecado", quantity: 10, price: 5, subtotal: 50 },
        { name: "Barquillos de Chocolate", quantity: 50, price: 2, subtotal: 100 },
        { name: "Litro de Mantecado", quantity: 10, price: 5, subtotal: 50 },
        { name: "Barquillos de Chocolate", quantity: 50, price: 2, subtotal: 100 },
        { name: "Litro de Mantecado", quantity: 10, price: 5, subtotal: 50 }
    ],
    total: 150
};

app.use(express.json())

app.get('/', (request, response) => {
    response.send('Hello World!')
})

app.get('/pdf', async (request, response) => {
    try {
        const browser = await puppeteer.launch({
            headless: 'new'
        })
        
        const page = await browser.newPage()

        await page.setContent("<h1>Hello World</h1>", {waitUntil: 'networkidle0'})
        const pdfBuffer = await page.pdf();

        await browser.close()

        response.set({'Content-Type': 'application/pdf',
            'Content-Disposition': 'filename=helloworld.pdf'
        })
        response.send(pdfBuffer)
    } catch (error) {
        console.error(error)
        response.send('Failed to generate pdf.')
    }
})

app.use("/generate-pdf", async (req, res) => {
    const pdfBuffer = await generatePDF ({
        url: req.body.url
    })
    res
        .status(200)
        .set({
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
            "Content-Type": "application/pdf"
        })
        .end(pdfBuffer)
})

app.get('/pdf-reporte', async (request, response) => {
    try {
        const pdfBuffer = await generateReportePDF(datosDePrueba)
        response.set({'Content-Type': 'application/pdf',
            'Content-Disposition': 'filename=cotizaciones.pdf'
        })
        response.send(pdfBuffer)
    } catch (error) {
        console.error(error)
        response.send('Failed to generate pdf.')
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`)
})