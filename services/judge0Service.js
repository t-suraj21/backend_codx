import axios from 'axios';

// Judge0 Language IDs
const LANGUAGE_IDS = {
  python: 71,  // Python 3.8.1
  cpp: 54,     // C++ (GCC 9.2.0)
  c: 50,       // C (GCC 9.2.0)
  javascript: 63, // JavaScript (Node.js 12.14.0)
  java: 62,    // Java (OpenJDK 13.0.1)
};

class Judge0Service {
  constructor() {
    this.baseURL = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
    this.apiKey = process.env.JUDGE0_API_KEY || '';
    this.apiHost = process.env.JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com';
  }

  /**
   * Submit code for execution
   * @param {string} code - Source code
   * @param {string} language - Language (python, cpp, c, etc.)
   * @param {string} stdin - Standard input
   * @param {string} expectedOutput - Expected output for comparison
   * @returns {Promise<Object>} Submission result
   */
  async submitCode(code, language, stdin = '', expectedOutput = '') {
    try {
      const languageId = LANGUAGE_IDS[language];
      
      if (!languageId) {
        throw new Error(`Unsupported language: ${language}`);
      }

      const options = {
        method: 'POST',
        url: `${this.baseURL}/submissions`,
        params: {
          base64_encoded: 'false',
          wait: 'true',
          fields: '*',
        },
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': this.apiHost,
        },
        data: {
          language_id: languageId,
          source_code: code,
          stdin: stdin,
          expected_output: expectedOutput,
          cpu_time_limit: 2, // 2 seconds
          memory_limit: 128000, // 128 MB
        },
      };

      const response = await axios.request(options);
      return this.formatResult(response.data);
    } catch (error) {
      console.error('Judge0 submission error:', error.response?.data || error.message);
      throw new Error('Code execution failed');
    }
  }

  /**
   * Run code against multiple test cases
   * @param {string} code - Source code
   * @param {string} language - Language
   * @param {Array} testCases - Array of {input, output} objects
   * @returns {Promise<Object>} Test results
   */
  async runTestCases(code, language, testCases) {
    try {
      const results = [];
      let passedCount = 0;
      let totalRuntime = 0;
      let totalMemory = 0;

      for (const testCase of testCases) {
        try {
          const result = await this.submitCode(
            code,
            language,
            testCase.input,
            testCase.output
          );

          const passed = result.status === 'Accepted' && 
                        result.stdout?.trim() === testCase.output?.trim();

          if (passed) {
            passedCount++;
          }

          results.push({
            input: testCase.input,
            expectedOutput: testCase.output,
            actualOutput: result.stdout || '',
            passed: passed,
            runtime: result.time ? parseFloat(result.time) * 1000 : 0,
            memory: result.memory || 0,
            error: result.stderr || result.compile_output || '',
            status: result.status,
          });

          if (result.time) {
            totalRuntime += parseFloat(result.time) * 1000;
          }
          if (result.memory) {
            totalMemory += result.memory;
          }

          // Stop if there's a compilation error or severely wrong code
          if (result.status === 'Compilation Error' || 
              result.status === 'Runtime Error') {
            break;
          }
        } catch (error) {
          results.push({
            input: testCase.input,
            expectedOutput: testCase.output,
            actualOutput: '',
            passed: false,
            runtime: 0,
            memory: 0,
            error: error.message,
            status: 'Error',
          });
        }
      }

      const accuracy = (passedCount / testCases.length) * 100;
      const avgRuntime = results.length > 0 ? totalRuntime / results.length : 0;
      const avgMemory = results.length > 0 ? totalMemory / results.length : 0;

      let finalStatus = 'Accepted';
      if (passedCount === 0) {
        finalStatus = results[0]?.status || 'Wrong Answer';
      } else if (passedCount < testCases.length) {
        finalStatus = 'Wrong Answer';
      }

      return {
        status: finalStatus,
        passedTestCases: passedCount,
        totalTestCases: testCases.length,
        accuracy: accuracy,
        runtime: avgRuntime,
        memory: avgMemory,
        testCaseResults: results,
      };
    } catch (error) {
      console.error('Test cases execution error:', error);
      throw error;
    }
  }

  /**
   * Format Judge0 API response
   * @param {Object} data - Judge0 response
   * @returns {Object} Formatted result
   */
  formatResult(data) {
    const statusMap = {
      1: 'In Queue',
      2: 'Processing',
      3: 'Accepted',
      4: 'Wrong Answer',
      5: 'Time Limit Exceeded',
      6: 'Compilation Error',
      7: 'Runtime Error (SIGSEGV)',
      8: 'Runtime Error (SIGXFSZ)',
      9: 'Runtime Error (SIGFPE)',
      10: 'Runtime Error (SIGABRT)',
      11: 'Runtime Error (NZEC)',
      12: 'Runtime Error (Other)',
      13: 'Internal Error',
      14: 'Exec Format Error',
    };

    return {
      token: data.token,
      status: statusMap[data.status?.id] || 'Unknown',
      statusId: data.status?.id,
      stdout: data.stdout,
      stderr: data.stderr,
      compile_output: data.compile_output,
      message: data.message,
      time: data.time,
      memory: data.memory,
    };
  }

  /**
   * Get submission status by token
   * @param {string} token - Submission token
   * @returns {Promise<Object>} Submission status
   */
  async getSubmissionStatus(token) {
    try {
      const options = {
        method: 'GET',
        url: `${this.baseURL}/submissions/${token}`,
        params: {
          base64_encoded: 'false',
          fields: '*',
        },
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': this.apiHost,
        },
      };

      const response = await axios.request(options);
      return this.formatResult(response.data);
    } catch (error) {
      console.error('Get submission status error:', error);
      throw error;
    }
  }
}

export default new Judge0Service();
