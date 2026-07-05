const Logger = require('../utils/logger');
const fs = require('fs').promises;
const path = require('path');
const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');

const logger = new Logger('ReportGenerator');

class ReportGenerator {
  constructor() {
    this.outputDir = './reports';
  }

  async generateReport(auditData, format = 'pdf') {
    try {
      logger.info(`Generating ${format.toUpperCase()} report...`);

      await this.ensureOutputDir();

      let reportPath;
      switch (format.toLowerCase()) {
        case 'pdf':
          reportPath = await this.generatePDFReport(auditData);
          break;
        case 'csv':
          reportPath = await this.generateCSVReport(auditData);
          break;
        case 'json':
          reportPath = await this.generateJSONReport(auditData);
          break;
        default:
          reportPath = await this.generateJSONReport(auditData);
      }

      logger.success(`Report generated: ${reportPath}`);
      return reportPath;
    } catch (error) {
      logger.error('Failed to generate report', error.message);
      throw error;
    }
  }

  async generatePDFReport(data) {
    return new Promise((resolve, reject) => {
      try {
        const fileName = `seo-report-${Date.now()}.pdf`;
        const filePath = path.join(this.outputDir, fileName);
        const doc = new PDFDocument();
        const stream = require('fs').createWriteStream(filePath);

        doc.pipe(stream);

        doc.fontSize(24).text('SEO Audit Report', { align: 'center' });
        doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
        doc.moveDown();

        doc.fontSize(14).text('Summary');
        doc.fontSize(10).text(`URL: ${data.url || 'N/A'}`);
        doc.text(`Score: ${data.score || 'N/A'}/100`);
        doc.moveDown();

        if (data.issues && data.issues.length > 0) {
          doc.fontSize(14).text('Issues Found');
          data.issues.slice(0, 10).forEach(issue => {
            doc.fontSize(10).text(`• [${issue.severity.toUpperCase()}] ${issue.message}`);
          });
          doc.moveDown();
        }

        if (data.recommendations && data.recommendations.length > 0) {
          doc.fontSize(14).text('Recommendations');
          data.recommendations.slice(0, 5).forEach(rec => {
            doc.fontSize(10).text(`• ${rec}`);
          });
        }

        doc.end();

        stream.on('finish', () => {
          resolve(filePath);
        });

        stream.on('error', (err) => {
          reject(err);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async generateCSVReport(data) {
    try {
      const fileName = `seo-report-${Date.now()}.csv`;
      const filePath = path.join(this.outputDir, fileName);

      const csvData = [];

      csvData.push({
        type: 'SUMMARY',
        url: data.url || '',
        score: data.score || '',
        timestamp: new Date().toISOString()
      });

      if (data.issues) {
        data.issues.forEach(issue => {
          csvData.push({
            type: 'ISSUE',
            code: issue.code,
            message: issue.message,
            severity: issue.severity
          });
        });
      }

      const parser = new Parser();
      const csv = parser.parse(csvData);

      await fs.writeFile(filePath, csv);
      return filePath;
    } catch (error) {
      logger.error('Failed to generate CSV report', error.message);
      throw error;
    }
  }

  async generateJSONReport(data) {
    try {
      const fileName = `seo-report-${Date.now()}.json`;
      const filePath = path.join(this.outputDir, fileName);

      const report = {
        generatedAt: new Date().toISOString(),
        ...data
      };

      await fs.writeFile(filePath, JSON.stringify(report, null, 2));
      return filePath;
    } catch (error) {
      logger.error('Failed to generate JSON report', error.message);
      throw error;
    }
  }

  async ensureOutputDir() {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
    } catch (error) {
      logger.warn('Failed to create output directory', error.message);
    }
  }
}

module.exports = new ReportGenerator();
