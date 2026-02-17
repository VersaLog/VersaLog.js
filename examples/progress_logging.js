const Versalog = require("versalog");

const logger = new Versalog();

logger.setConfig({
  show_file: false,
  show_tag: true,
  all: true,
  tag: "BATCH",
  mode: "detailed",
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processLine(lineNumber) {
  await sleep(100);

  if (Math.random() < 0.05) {
    logger.warning(`Line ${lineNumber} took longer than expected`);
  }
}

async function processFile(fileIndex, totalFiles) {
  logger.step(`Processing file_${fileIndex}.txt`, fileIndex, totalFiles);

  const totalLines = 20;
  const start = Date.now();

  for (let i = 1; i <= totalLines; i++) {
    await processLine(i);

    logger.progress({
      title: `file_${fileIndex}.txt`,
      current: i,
      total: totalLines,
    });
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(2);
  logger.info(`file_${fileIndex}.txt finished in ${elapsed}s`);
}

async function main() {
  const totalFiles = 5;

  logger.info("Batch Start");

  const start = Date.now();

  for (let i = 1; i <= totalFiles; i++) {
    await processFile(i, totalFiles);

    logger.progress("Overall Progress", i, totalFiles);
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(2);
  logger.info(`Total Batch finished in ${elapsed}s`);

  logger.info("Batch Finished");
}

main();
