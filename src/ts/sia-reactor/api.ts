export * from "./index";

export * as utils from "sia-reactor/utils";

export * as plugins from "sia-reactor/plugins";

import * as vanilla from "sia-reactor/adapters/vanilla";
// import * as react from "sia-reactor/adapters/react";
const adapters = { vanilla };
export { adapters };
