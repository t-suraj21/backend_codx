import { exec } from "child_process";
import fs from "fs";
import { v4 as uuid } from "uuid";

// BUG FIX: previously the `input` param was accepted but never piped to stdin,
// so any program that reads from stdin would hang or produce wrong output.
// Fix: write input to a temp file and redirect it via shell stdin redirection.

export const runPython = (code, input = '') => {
  return new Promise((resolve) => {
    const id = uuid();
    const codeFile  = `temp/${id}.py`;
    const inputFile = `temp/${id}.txt`;

    fs.writeFileSync(codeFile, code);
    fs.writeFileSync(inputFile, input);

    exec(`python3 ${codeFile} < ${inputFile}`, (error, stdout, stderr) => {
      try { fs.unlinkSync(codeFile); fs.unlinkSync(inputFile); } catch (_) {}
      if (error) return resolve(stderr || error.message);
      resolve(stdout);
    });
  });
};

export const runCpp = (code, input = '') => {
  return new Promise((resolve) => {
    const id        = uuid();
    const codeFile  = `temp/${id}.cpp`;
    const binFile   = `temp/${id}`;
    const inputFile = `temp/${id}.txt`;

    fs.writeFileSync(codeFile, code);
    fs.writeFileSync(inputFile, input);

    exec(`g++ ${codeFile} -o ${binFile} && ${binFile} < ${inputFile}`, (error, stdout, stderr) => {
      try { fs.unlinkSync(codeFile); fs.unlinkSync(inputFile); } catch (_) {}
      try { fs.unlinkSync(binFile); } catch (_) {}
      if (error) return resolve(stderr || error.message);
      resolve(stdout);
    });
  });
};

export const runC = (code, input = '') => {
  return new Promise((resolve) => {
    const id        = uuid();
    const codeFile  = `temp/${id}.c`;
    const binFile   = `temp/${id}`;
    const inputFile = `temp/${id}.txt`;

    fs.writeFileSync(codeFile, code);
    fs.writeFileSync(inputFile, input);

    exec(`gcc ${codeFile} -o ${binFile} && ${binFile} < ${inputFile}`, (error, stdout, stderr) => {
      try { fs.unlinkSync(codeFile); fs.unlinkSync(inputFile); } catch (_) {}
      try { fs.unlinkSync(binFile); } catch (_) {}
      if (error) return resolve(stderr || error.message);
      resolve(stdout);
    });
  });
};
