import { exec } from "child_process";
import fs from "fs";
import { v4 as uuid } from "uuid";

export const runPython = (code, input) => {
  return new Promise((resolve) => {
    const id = uuid();
    const file = `temp/${id}.py`;

    fs.writeFileSync(file, code);

    exec(`python3 ${file}`, (error, stdout, stderr) => {
      // Clean up the temp file
      fs.unlinkSync(file);

      if (error) return resolve(stderr);
      resolve(stdout);
    });
  });
};

export const runCpp = (code, input) => {
  return new Promise((resolve) => {
    const id = uuid();
    const file = `temp/${id}.cpp`;
    const output = `temp/${id}`;

    fs.writeFileSync(file, code);

    exec(`g++ ${file} -o ${output} && ${output}`, (error, stdout, stderr) => {
      // Clean up temp files
      try {
        fs.unlinkSync(file);
        fs.unlinkSync(output);
      } catch (e) {}

      if (error) return resolve(stderr);
      resolve(stdout);
    });
  });
};

export const runC = (code, input) => {
  return new Promise((resolve) => {
    const id = uuid();
    const file = `temp/${id}.c`;
    const output = `temp/${id}`;

    fs.writeFileSync(file, code);

    exec(`gcc ${file} -o ${output} && ${output}`, (error, stdout, stderr) => {
      // Clean up temp files
      try {
        fs.unlinkSync(file);
        fs.unlinkSync(output);
      } catch (e) {}

      if (error) return resolve(stderr);
      resolve(stdout);
    });
  });
};
