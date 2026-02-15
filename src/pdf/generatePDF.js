import puppeteer from "puppeteer";
import Handlebars from "handlebars";
import fs from "fs/promises"
import path from "path";

export default async function generatePDF({url}) {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: {
            width: 750,
            height: 500,
            deviceScaleFactor: 1,
            isMobile: true,
            hasTouch: false,
            isLandscape: false,
        }
    })

    const page = await browser.newPage()

    await page.goto(url, {
        waitUntil: 'networkidle0',
    })

    await page.emulateMediaType("screen")

    const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
            left: "30mm",
            top: "30mm",
            right: "10mm",
            bottom: "10mm"
        },
        displayHeaderFooter: true,
        headerTemplate: `
            <div style="width: 100%; -webkit-print-color-adjust: exact; border: 2px solid red; padding: 0; margin: 0 10mm;">
                <h1 style="
                    font-size: 30px;
                    text-align: center;
                    background-color: teal;
                    padding: 10px;
                " >
                    Cotizaciones de compra
                </h1>
            </div>
        `,
        footerTemplate: `
            <div style="
                width: 100%;
                -webkit-print-color-adjust: exact;
                background-color: teal;
                font-size: 30px;
                text-align: right;
                margin-right: 10mm;
                margin-left: 10mm;
            " >
                <span class="pageNumber"></span> / <span class="totalPages"></span>
            </div>
        `
    })

    await browser.close()
    return pdf
}

export async function generateReportePDF(data) {
    const templatePath = path.resolve("./src/vistas/reporte.html")
    const htmlTemplate = await fs.readFile(templatePath, "utf-8")

    const cssPath = path.resolve("./src/estilos/styles.css")
    const cssContent = await fs.readFile(cssPath, "utf-8")


    const template = Handlebars.compile(htmlTemplate)
    const finalHtml = template({
        ...data,
        estilosExtra: cssContent
    });

    const headerRaw = `
            <div style="width: 100%; -webkit-print-color-adjust: exact; margin: 0 10mm;">
                <h1 style="
                    font-size: 20px;
                    text-align: center;
                    background-color: teal;
                    color: white;
                ">
                    Cotizacion #{{quoteId}}
                </h1>
            </div>
        `
    const templateHeader = Handlebars.compile(headerRaw)
    const finalHeader = templateHeader(data)

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage()

    await page.setContent(finalHtml, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
            top: "30mm",
            bottom: "20mm",
            left: "10mm",
            right: "10mm"
        },
        displayHeaderFooter: true,
        headerTemplate: finalHeader,
        footerTemplate: `
            <div style="
                width: 100%;
                font-size: 10px;
                text-align: right;
                margin-right: 10mm;
            ">
                Página <span class="pageNumber"></span> de <span class="totalPages"></span>
            </div>
        `
    })

    await browser.close()
    return pdf
}