function log(msg, ...styles) {
  console.log(msg, ...styles);
  logger.append(Object.assign(document.createElement("p"), { textContent: msg.replaceAll("%c", ""), style: `margin-block: 0; ${styles[0]}` }));
}

const logger = document.createElement("pre");
logger.style.cssText = `    
  background: #1c1c1c;
  color: #ece9df;
  padding: 10px;
  max-height: 100%;
  overflow-y: auto;
`;

document.body.style.cssText = `
  background: #333;
  color: white;
  font-family: monospace;
  padding: 20px;
  margin: 0;
  height: 100%;
`;

window.addEventListener("load", () => document.body.appendChild(logger));

export default log;
