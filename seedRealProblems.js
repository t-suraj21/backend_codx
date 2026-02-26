import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Language from './models/Language.js';
import Topic from './models/Topic.js';
import Question from './models/Question.js';
import User from './models/User.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

const realWorldProblems = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Language.deleteMany({});
    await Topic.deleteMany({});
    await Question.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Languages
    const languages = await Language.insertMany([
      {
        name: 'C',
        code: 'c',
        judge0Id: 50,
        icon: '🔷',
        extension: '.c',
        template: `#include <stdio.h>\n\nint main() {\n    // Your code here\n    return 0;\n}`,
      },
      {
        name: 'C++',
        code: 'cpp',
        judge0Id: 54,
        icon: '⚡',
        extension: '.cpp',
        template: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}`,
      },
      {
        name: 'Python',
        code: 'python',
        judge0Id: 71,
        icon: '🐍',
        extension: '.py',
        template: `# Your code here\n`,
      },
    ]);

    console.log('✅ Created languages');

    // Create Topics
    const topics = await Topic.insertMany([
      {
        name: 'Arrays',
        description: 'Master array manipulation and algorithms',
        icon: '📊',
        order: 1,
        difficulty: 'Beginner',
      },
      {
        name: 'Strings',
        description: 'String manipulation and pattern matching',
        icon: '📝',
        order: 2,
        difficulty: 'Beginner',
      },
      {
        name: 'Loops & Conditionals',
        description: 'Control flow and iteration',
        icon: '🔄',
        order: 3,
        difficulty: 'Beginner',
      },
      {
        name: 'Searching & Sorting',
        description: 'Binary search, linear search, sorting algorithms',
        icon: '🔍',
        order: 4,
        difficulty: 'Intermediate',
      },
      {
        name: 'Recursion',
        description: 'Recursive problem solving techniques',
        icon: '🔁',
        order: 5,
        difficulty: 'Intermediate',
      },
      {
        name: 'Linked Lists',
        description: 'Linked list operations',
        icon: '🔗',
        order: 6,
        difficulty: 'Intermediate',
      },
      {
        name: 'Stacks & Queues',
        description: 'LIFO and FIFO data structures',
        icon: '📚',
        order: 7,
        difficulty: 'Intermediate',
      },
      {
        name: 'Dynamic Programming',
        description: 'Optimization through memoization',
        icon: '💡',
        order: 8,
        difficulty: 'Advanced',
      },
    ]);

    console.log('✅ Created topics');

    // Real-World Coding Problems
    const questions = [];

    // ========== ARRAYS PROBLEMS ==========
    questions.push({
      title: 'Two Sum',
      description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
      difficulty: 'Easy',
      topic: topics[0]._id,
      companies: ['Google', 'Amazon', 'Microsoft', 'Facebook'],
      tags: ['array', 'hash-table'],
      inputFormat: 'First line contains n (size of array)\nSecond line contains n space-separated integers\nThird line contains target integer',
      outputFormat: 'Two space-separated indices (0-indexed)',
      constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9',
      sampleTestCases: [
        {
          input: '4\\n2 7 11 15\\n9',
          output: '0 1',
          explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1]',
        },
        {
          input: '3\\n3 2 4\\n6',
          output: '1 2',
          explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2]',
        },
      ],
      hiddenTestCases: [
        { input: '2\\n3 3\\n6', output: '0 1' },
        { input: '5\\n1 5 3 7 8\\n12', output: '2 3' },
      ],
      hints: ['Use a hash map to store seen numbers', 'Check if target - current exists in hash map'],
      starterCode: {
        python: `n = int(input())\\nnums = list(map(int, input().split()))\\ntarget = int(input())\\n\\n# Your code here`,
        cpp: `#include <iostream>\\n#include <vector>\\nusing namespace std;\\n\\nint main() {\\n    int n, target;\\n    cin >> n;\\n    vector<int> nums(n);\\n    for(int i = 0; i < n; i++) {\\n        cin >> nums[i];\\n    }\\n    cin >> target;\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
        c: `#include <stdio.h>\\n\\nint main() {\\n    int n, target;\\n    scanf("%d", &n);\\n    int nums[n];\\n    for(int i = 0; i < n; i++) {\\n        scanf("%d", &nums[i]);\\n    }\\n    scanf("%d", &target);\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
      },
      order: 1,
    });

    questions.push({
      title: 'Find Maximum in Array',
      description: `Given an array of integers, find and return the maximum element.`,
      difficulty: 'Easy',
      topic: topics[0]._id,
      companies: ['Amazon'],
      tags: ['array', 'basics'],
      inputFormat: 'First line contains n (size of array)\nSecond line contains n space-separated integers',
      outputFormat: 'Single integer - the maximum element',
      constraints: '1 <= n <= 10^5\n-10^9 <= nums[i] <= 10^9',
      sampleTestCases: [
        { input: '5\\n3 7 2 9 4', output: '9', explanation: '9 is the largest element' },
        { input: '4\\n-5 -2 -8 -1', output: '-1', explanation: '-1 is the largest' },
      ],
      hiddenTestCases: [
        { input: '3\\n100 200 150', output: '200' },
        { input: '1\\n42', output: '42' },
      ],
      hints: ['Initialize max with first element', 'Iterate and update max if current > max'],
      starterCode: {
        python: `n = int(input())\\nnums = list(map(int, input().split()))\\n\\n# Your code here`,
        cpp: `#include <iostream>\\nusing namespace std;\\n\\nint main() {\\n    int n;\\n    cin >> n;\\n    int nums[n];\\n    for(int i = 0; i < n; i++) {\\n        cin >> nums[i];\\n    }\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
        c: `#include <stdio.h>\\n\\nint main() {\\n    int n;\\n    scanf("%d", &n);\\n    int nums[n];\\n    for(int i = 0; i < n; i++) {\\n        scanf("%d", &nums[i]);\\n    }\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
      },
      order: 2,
    });

    questions.push({
      title: 'Reverse Array',
      description: `Given an array of integers, reverse it in-place and print the reversed array.`,
      difficulty: 'Easy',
      topic: topics[0]._id,
      companies: ['Google', 'Microsoft'],
      tags: ['array', 'two-pointers'],
      inputFormat: 'First line contains n\nSecond line contains n space-separated integers',
      outputFormat: 'n space-separated integers in reversed order',
      constraints: '1 <= n <= 10^5',
      sampleTestCases: [
        { input: '5\\n1 2 3 4 5', output: '5 4 3 2 1', explanation: 'Reversed array' },
        { input: '3\\n10 20 30', output: '30 20 10', explanation: 'Reversed array' },
      ],
      hiddenTestCases: [
        { input: '4\\n7 8 9 10', output: '10 9 8 7' },
        { input: '1\\n100', output: '100' },
      ],
      hints: ['Use two pointers from start and end', 'Swap elements and move pointers'],
      starterCode: {
        python: `n = int(input())\\nnums = list(map(int, input().split()))\\n\\n# Your code here`,
        cpp: `#include <iostream>\\nusing namespace std;\\n\\nint main() {\\n    int n;\\n    cin >> n;\\n    int nums[n];\\n    for(int i = 0; i < n; i++) {\\n        cin >> nums[i];\\n    }\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
        c: `#include <stdio.h>\\n\\nint main() {\\n    int n;\\n    scanf("%d", &n);\\n    int nums[n];\\n    for(int i = 0; i < n; i++) {\\n        scanf("%d", &nums[i]);\\n    }\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
      },
      order: 3,
    });

    // ========== STRINGS PROBLEMS ==========
    questions.push({
      title: 'Valid Palindrome',
      description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.

Given a string s, return true if it is a palindrome, or false otherwise.`,
      difficulty: 'Easy',
      topic: topics[1]._id,
      companies: ['Facebook', 'Amazon'],
      tags: ['string', 'two-pointers'],
      inputFormat: 'Single line containing the string',
      outputFormat: 'true or false',
      constraints: '1 <= s.length <= 2 * 10^5',
      sampleTestCases: [
        { input: 'racecar', output: 'true', explanation: 'racecar is a palindrome' },
        { input: 'hello', output: 'false', explanation: 'hello is not a palindrome' },
      ],
      hiddenTestCases: [
        { input: 'madam', output: 'true' },
        { input: 'python', output: 'false' },
      ],
      hints: ['Compare characters from both ends', 'Use two pointers approach'],
      starterCode: {
        python: `s = input().strip()\\n\\n# Your code here`,
        cpp: `#include <iostream>\\n#include <string>\\nusing namespace std;\\n\\nint main() {\\n    string s;\\n    cin >> s;\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
        c: `#include <stdio.h>\\n#include <string.h>\\n\\nint main() {\\n    char s[1000];\\n    scanf("%s", s);\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
      },
      order: 4,
    });

    questions.push({
      title: 'Reverse String',
      description: `Write a function that reverses a string.`,
      difficulty: 'Easy',
      topic: topics[1]._id,
      companies: ['Google', 'Amazon'],
      tags: ['string'],
      inputFormat: 'Single line containing the string',
      outputFormat: 'Reversed string',
      constraints: '1 <= s.length <= 10^5',
      sampleTestCases: [
        { input: 'hello', output: 'olleh', explanation: 'Reversed string' },
        { input: 'world', output: 'dlrow', explanation: 'Reversed string' },
      ],
      hiddenTestCases: [
        { input: 'python', output: 'nohtyp' },
        { input: 'a', output: 'a' },
      ],
      hints: ['Use built-in reverse or manual swap'],
      starterCode: {
        python: `s = input().strip()\\n\\n# Your code here`,
        cpp: `#include <iostream>\\n#include <string>\\nusing namespace std;\\n\\nint main() {\\n    string s;\\n    cin >> s;\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
        c: `#include <stdio.h>\\n#include <string.h>\\n\\nint main() {\\n    char s[1000];\\n    scanf("%s", s);\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
      },
      order: 5,
    });

    // ========== LOOPS & CONDITIONALS ==========
    questions.push({
      title: 'Fizz Buzz',
      description: `Given an integer n, print numbers from 1 to n, but:
- Print "Fizz" for multiples of 3
- Print "Buzz" for multiples of 5
- Print "FizzBuzz" for multiples of both 3 and 5
- Print the number itself otherwise`,
      difficulty: 'Easy',
      topic: topics[2]._id,
      companies: ['Amazon', 'Microsoft'],
      tags: ['loops', 'conditionals'],
      inputFormat: 'Single integer n',
      outputFormat: 'n lines with Fizz, Buzz, FizzBuzz, or numbers',
      constraints: '1 <= n <= 100',
      sampleTestCases: [
        { input: '15', output: '1\\n2\\nFizz\\n4\\nBuzz\\nFizz\\n7\\n8\\nFizz\\nBuzz\\n11\\nFizz\\n13\\n14\\nFizzBuzz', explanation: 'FizzBuzz for 1 to 15' },
      ],
      hiddenTestCases: [
        { input: '5', output: '1\\n2\\nFizz\\n4\\nBuzz' },
      ],
      hints: ['Check divisibility by 15 first', 'Then check 3 and 5'],
      starterCode: {
        python: `n = int(input())\\n\\n# Your code here`,
        cpp: `#include <iostream>\\nusing namespace std;\\n\\nint main() {\\n    int n;\\n    cin >> n;\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
        c: `#include <stdio.h>\\n\\nint main() {\\n    int n;\\n    scanf("%d", &n);\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
      },
      order: 6,
    });

    questions.push({
      title: 'Sum of N Natural Numbers',
      description: `Calculate and print the sum of first n natural numbers (1 to n).`,
      difficulty: 'Easy',
      topic: topics[2]._id,
      companies: ['Amazon'],
      tags: ['loops', 'math'],
      inputFormat: 'Single integer n',
      outputFormat: 'Sum of 1 to n',
      constraints: '1 <= n <= 10^6',
      sampleTestCases: [
        { input: '5', output: '15', explanation: '1+2+3+4+5 = 15' },
        { input: '10', output: '55', explanation: '1+2+...+10 = 55' },
      ],
      hiddenTestCases: [
        { input: '100', output: '5050' },
        { input: '1', output: '1' },
      ],
      hints: ['Use formula: n*(n+1)/2', 'Or use a loop'],
      starterCode: {
        python: `n = int(input())\\n\\n# Your code here`,
        cpp: `#include <iostream>\\nusing namespace std;\\n\\nint main() {\\n    int n;\\n    cin >> n;\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
        c: `#include <stdio.h>\\n\\nint main() {\\n    int n;\\n    scanf("%d", &n);\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
      },
      order: 7,
    });

    // ========== SEARCHING & SORTING ==========
    questions.push({
      title: 'Binary Search',
      description: `Given a sorted array of integers and a target value, return the index if the target is found. If not, return -1.`,
      difficulty: 'Easy',
      topic: topics[3]._id,
      companies: ['Google', 'Facebook', 'Amazon'],
      tags: ['binary-search', 'array'],
      inputFormat: 'First line: n (size)\nSecond line: n sorted integers\nThird line: target',
      outputFormat: 'Index of target or -1',
      constraints: '1 <= n <= 10^4\nArray is sorted in ascending order',
      sampleTestCases: [
        { input: '5\\n1 3 5 7 9\\n5', output: '2', explanation: '5 is at index 2' },
        { input: '4\\n2 4 6 8\\n10', output: '-1', explanation: '10 not found' },
      ],
      hiddenTestCases: [
        { input: '6\\n10 20 30 40 50 60\\n40', output: '3' },
        { input: '3\\n1 2 3\\n5', output: '-1' },
      ],
      hints: ['Use divide and conquer', 'Compare with mid element'],
      starterCode: {
        python: `n = int(input())\\nnums = list(map(int, input().split()))\\ntarget = int(input())\\n\\n# Your code here`,
        cpp: `#include <iostream>\\nusing namespace std;\\n\\nint main() {\\n    int n, target;\\n    cin >> n;\\n    int nums[n];\\n    for(int i = 0; i < n; i++) {\\n        cin >> nums[i];\\n    }\\n    cin >> target;\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
        c: `#include <stdio.h>\\n\\nint main() {\\n    int n, target;\\n    scanf("%d", &n);\\n    int nums[n];\\n    for(int i = 0; i < n; i++) {\\n        scanf("%d", &nums[i]);\\n    }\\n    scanf("%d", &target);\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
      },
      order: 8,
    });

    questions.push({
      title: 'Bubble Sort',
      description: `Implement bubble sort to sort an array in ascending order.`,
      difficulty: 'Medium',
      topic: topics[3]._id,
      companies: ['Microsoft'],
      tags: ['sorting', 'array'],
      inputFormat: 'First line: n\nSecond line: n integers',
      outputFormat: 'n sorted integers separated by space',
      constraints: '1 <= n <= 1000',
      sampleTestCases: [
        { input: '5\\n64 34 25 12 22', output: '12 22 25 34 64', explanation: 'Sorted array' },
        { input: '4\\n5 1 4 2', output: '1 2 4 5', explanation: 'Sorted array' },
      ],
      hiddenTestCases: [
        { input: '3\\n3 2 1', output: '1 2 3' },
        { input: '6\\n9 7 5 3 1 0', output: '0 1 3 5 7 9' },
      ],
      hints: ['Compare adjacent elements', 'Swap if in wrong order', 'Repeat n times'],
      starterCode: {
        python: `n = int(input())\\nnums = list(map(int, input().split()))\\n\\n# Your code here`,
        cpp: `#include <iostream>\\nusing namespace std;\\n\\nint main() {\\n    int n;\\n    cin >> n;\\n    int nums[n];\\n    for(int i = 0; i < n; i++) {\\n        cin >> nums[i];\\n    }\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
        c: `#include <stdio.h>\\n\\nint main() {\\n    int n;\\n    scanf("%d", &n);\\n    int nums[n];\\n    for(int i = 0; i < n; i++) {\\n        scanf("%d", &nums[i]);\\n    }\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
      },
      order: 9,
    });

    // ========== RECURSION ==========
    questions.push({
      title: 'Factorial',
      description: `Calculate factorial of a number n using recursion or iteration.

Factorial of n (n!) = n * (n-1) * (n-2) * ... * 1
factorial(0) = 1`,
      difficulty: 'Easy',
      topic: topics[4]._id,
      companies: ['Adobe'],
      tags: ['recursion', 'math'],
      inputFormat: 'Single integer n',
      outputFormat: 'Factorial of n',
      constraints: '0 <= n <= 20',
      sampleTestCases: [
        { input: '5', output: '120', explanation: '5! = 5*4*3*2*1 = 120' },
        { input: '0', output: '1', explanation: '0! = 1' },
      ],
      hiddenTestCases: [
        { input: '10', output: '3628800' },
        { input: '3', output: '6' },
      ],
      hints: ['Base case: factorial(0) = 1', 'Recursive: n * factorial(n-1)'],
      starterCode: {
        python: `n = int(input())\\n\\n# Your code here`,
        cpp: `#include <iostream>\\nusing namespace std;\\n\\nint main() {\\n    int n;\\n    cin >> n;\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
        c: `#include <stdio.h>\\n\\nint main() {\\n    int n;\\n    scanf("%d", &n);\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
      },
      order: 10,
    });

    questions.push({
      title: 'Fibonacci Number',
      description: `The Fibonacci numbers form a sequence where each number is the sum of the two preceding ones, starting from 0 and 1.

F(0) = 0, F(1) = 1
F(n) = F(n-1) + F(n-2) for n > 1

Calculate F(n).`,
      difficulty: 'Easy',
      topic: topics[4]._id,
      companies: ['Apple', 'Goldman Sachs'],
      tags: ['recursion', 'dynamic-programming'],
      inputFormat: 'Single integer n',
      outputFormat: 'nth Fibonacci number',
      constraints: '0 <= n <= 30',
      sampleTestCases: [
        { input: '5', output: '5', explanation: 'F(5) = 0,1,1,2,3,5' },
        { input: '10', output: '55', explanation: 'F(10) = 55' },
      ],
      hiddenTestCases: [
        { input: '0', output: '0' },
        { input: '15', output: '610' },
      ],
      hints: ['Use recursion with base cases', 'Or use iteration for efficiency'],
      starterCode: {
        python: `n = int(input())\\n\\n# Your code here`,
        cpp: `#include <iostream>\\nusing namespace std;\\n\\nint main() {\\n    int n;\\n    cin >> n;\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
        c: `#include <stdio.h>\\n\\nint main() {\\n    int n;\\n    scanf("%d", &n);\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
      },
      order: 11,
    });

    questions.push({
      title: 'Power Function',
      description: `Implement pow(x, n), which calculates x raised to the power n.`,
      difficulty: 'Medium',
      topic: topics[4]._id,
      companies: ['LinkedIn', 'Amazon'],
      tags: ['recursion', 'math'],
      inputFormat: 'Two integers: x and n',
      outputFormat: 'x^n',
      constraints: '-100 <= x <= 100\n0 <= n <= 20',
      sampleTestCases: [
        { input: '2 10', output: '1024', explanation: '2^10 = 1024' },
        { input: '3 3', output: '27', explanation: '3^3 = 27' },
      ],
      hiddenTestCases: [
        { input: '5 0', output: '1' },
        { input: '2 5', output: '32' },
      ],
      hints: ['Base case: x^0 = 1', 'Use recursion: x^n = x * x^(n-1)'],
      starterCode: {
        python: `x, n = map(int, input().split())\\n\\n# Your code here`,
        cpp: `#include <iostream>\\nusing namespace std;\\n\\nint main() {\\n    int x, n;\\n    cin >> x >> n;\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
        c: `#include <stdio.h>\\n\\nint main() {\\n    int x, n;\\n    scanf("%d %d", &x, &n);\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
      },
      order: 12,
    });

    // ========== DYNAMIC PROGRAMMING ==========
    questions.push({
      title: 'Climbing Stairs',
      description: `You are climbing a staircase. It takes n steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
      difficulty: 'Easy',
      topic: topics[7]._id,
      companies: ['Adobe', 'Amazon'],
      tags: ['dynamic-programming', 'recursion'],
      inputFormat: 'Single integer n',
      outputFormat: 'Number of ways',
      constraints: '1 <= n <= 45',
      sampleTestCases: [
        { input: '2', output: '2', explanation: 'Two ways: 1+1, 2' },
        { input: '3', output: '3', explanation: 'Three ways: 1+1+1, 1+2, 2+1' },
      ],
      hiddenTestCases: [
        { input: '5', output: '8' },
        { input: '10', output: '89' },
      ],
      hints: ['Similar to Fibonacci', 'ways(n) = ways(n-1) + ways(n-2)'],
      starterCode: {
        python: `n = int(input())\\n\\n# Your code here`,
        cpp: `#include <iostream>\\nusing namespace std;\\n\\nint main() {\\n    int n;\\n    cin >> n;\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
        c: `#include <stdio.h>\\n\\nint main() {\\n    int n;\\n    scanf("%d", &n);\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
      },
      order: 13,
    });

    questions.push({
      title: 'Coin Change Problem',
      description: `Given an amount and an array of coin denominations, find the minimum number of coins needed to make that amount. If impossible, return -1.`,
      difficulty: 'Medium',
      topic: topics[7]._id,
      companies: ['Google', 'Amazon', 'Microsoft'],
      tags: ['dynamic-programming'],
      inputFormat: 'First line: n (number of coins)\nSecond line: n coin values\nThird line: amount',
      outputFormat: 'Minimum coins needed or -1',
      constraints: '1 <= n <= 12\n1 <= coins[i] <= 2^31 - 1\n0 <= amount <= 10^4',
      sampleTestCases: [
        { input: '3\\n1 2 5\\n11', output: '3', explanation: '11 = 5+5+1 (3 coins)' },
        { input: '2\\n2 5\\n3', output: '-1', explanation: 'Cannot make 3' },
      ],
      hiddenTestCases: [
        { input: '4\\n1 5 10 25\\n30', output: '2' },
        { input: '3\\n2 5 10\\n1', output: '-1' },
      ],
      hints: ['Use dynamic programming', 'dp[amount] = min coins for that amount'],
      starterCode: {
        python: `n = int(input())\\ncoins = list(map(int, input().split()))\\namount = int(input())\\n\\n# Your code here`,
        cpp: `#include <iostream>\\n#include <vector>\\nusing namespace std;\\n\\nint main() {\\n    int n, amount;\\n    cin >> n;\\n    vector<int> coins(n);\\n    for(int i = 0; i < n; i++) {\\n        cin >> coins[i];\\n    }\\n    cin >> amount;\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
        c: `#include <stdio.h>\\n\\nint main() {\\n    int n, amount;\\n    scanf("%d", &n);\\n    int coins[n];\\n    for(int i = 0; i < n; i++) {\\n        scanf("%d", &coins[i]);\\n    }\\n    scanf("%d", &amount);\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
      },
      order: 14,
    });

    // ========== MORE ARRAY PROBLEMS ==========
    questions.push({
      title: 'Best Time to Buy and Sell Stock',
      description: `You are given an array prices where prices[i] is the price of a given stock on the ith day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve. If you cannot achieve any profit, return 0.`,
      difficulty: 'Easy',
      topic: topics[0]._id,
      companies: ['Amazon', 'Facebook', 'Microsoft'],
      tags: ['array', 'dynamic-programming'],
      inputFormat: 'First line: n\nSecond line: n prices',
      outputFormat: 'Maximum profit',
      constraints: '1 <= prices.length <= 10^5',
      sampleTestCases: [
        { input: '6\\n7 1 5 3 6 4', output: '5', explanation: 'Buy at 1, sell at 6, profit = 5' },
        { input: '5\\n7 6 4 3 1', output: '0', explanation: 'No profit possible' },
      ],
      hiddenTestCases: [
        { input: '4\\n2 4 1 7', output: '6' },
        { input: '2\\n1 2', output: '1' },
      ],
      hints: ['Track minimum price seen so far', 'Calculate max profit at each step'],
      starterCode: {
        python: `n = int(input())\\nprices = list(map(int, input().split()))\\n\\n# Your code here`,
        cpp: `#include <iostream>\\nusing namespace std;\\n\\nint main() {\\n    int n;\\n    cin >> n;\\n    int prices[n];\\n    for(int i = 0; i < n; i++) {\\n        cin >> prices[i];\\n    }\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
        c: `#include <stdio.h>\\n\\nint main() {\\n    int n;\\n    scanf("%d", &n);\\n    int prices[n];\\n    for(int i = 0; i < n; i++) {\\n        scanf("%d", &prices[i]);\\n    }\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
      },
      order: 15,
    });

    questions.push({
      title: 'Contains Duplicate',
      description: `Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.`,
      difficulty: 'Easy',
      topic: topics[0]._id,
      companies: ['Apple', 'Amazon'],
      tags: ['array', 'hash-table'],
      inputFormat: 'First line: n\nSecond line: n integers',
      outputFormat: 'true or false',
      constraints: '1 <= nums.length <= 10^5',
      sampleTestCases: [
        { input: '4\\n1 2 3 1', output: 'true', explanation: '1 appears twice' },
        { input: '4\\n1 2 3 4', output: 'false', explanation: 'All distinct' },
      ],
      hiddenTestCases: [
        { input: '3\\n1 1 1', output: 'true' },
        { input: '5\\n1 2 3 4 5', output: 'false' },
      ],
      hints: ['Use a set to track seen elements', 'Check if element already in set'],
      starterCode: {
        python: `n = int(input())\\nnums = list(map(int, input().split()))\\n\\n# Your code here`,
        cpp: `#include <iostream>\\nusing namespace std;\\n\\nint main() {\\n    int n;\\n    cin >> n;\\n    int nums[n];\\n    for(int i = 0; i < n; i++) {\\n        cin >> nums[i];\\n    }\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
        c: `#include <stdio.h>\\n\\nint main() {\\n    int n;\\n    scanf("%d", &n);\\n    int nums[n];\\n    for(int i = 0; i < n; i++) {\\n        scanf("%d", &nums[i]);\\n    }\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
      },
      order: 16,
    });

    questions.push({
      title: 'Product of Array Except Self',
      description: `Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].

You must solve it in O(n) time without using division.`,
      difficulty: 'Medium',
      topic: topics[0]._id,
      companies: ['Amazon', 'Apple', 'Microsoft'],
      tags: ['array', 'prefix-sum'],
      inputFormat: 'First line: n\nSecond line: n integers',
      outputFormat: 'n integers separated by space',
      constraints: '2 <= nums.length <= 10^5',
      sampleTestCases: [
        { input: '4\\n1 2 3 4', output: '24 12 8 6', explanation: '[2*3*4, 1*3*4, 1*2*4, 1*2*3]' },
        { input: '5\\n-1 1 0 -3 3', output: '0 0 9 0 0', explanation: 'Product except self' },
      ],
      hiddenTestCases: [
        { input: '3\\n2 3 4', output: '12 8 6' },
        { input: '2\\n5 2', output: '2 5' },
      ],
      hints: ['Use prefix and suffix products', 'Calculate left products, then right products'],
      starterCode: {
        python: `n = int(input())\\nnums = list(map(int, input().split()))\\n\\n# Your code here`,
        cpp: `#include <iostream>\\nusing namespace std;\\n\\nint main() {\\n    int n;\\n    cin >> n;\\n    int nums[n];\\n    for(int i = 0; i < n; i++) {\\n        cin >> nums[i];\\n    }\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
        c: `#include <stdio.h>\\n\\nint main() {\\n    int n;\\n    scanf("%d", &n);\\n    int nums[n];\\n    for(int i = 0; i < n; i++) {\\n        scanf("%d", &nums[i]);\\n    }\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
      },
      order: 17,
    });

    // Add more questions for remaining topics...
    questions.push({
      title: 'Valid Parentheses',
      description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.`,
      difficulty: 'Easy',
      topic: topics[6]._id, // Stacks & Queues
      companies: ['Amazon', 'Google', 'Facebook'],
      tags: ['stack', 'string'],
      inputFormat: 'Single string',
      outputFormat: 'true or false',
      constraints: '1 <= s.length <= 10^4',
      sampleTestCases: [
        { input: '()', output: 'true', explanation: 'Valid parentheses' },
        { input: '()[]{}', output: 'true', explanation: 'All valid' },
        { input: '(]', output: 'false', explanation: 'Mismatched' },
      ],
      hiddenTestCases: [
        { input: '([)]', output: 'false' },
        { input: '{[]}', output: 'true' },
      ],
      hints: ['Use a stack', 'Push opening brackets, pop for closing'],
      starterCode: {
        python: `s = input().strip()\\n\\n# Your code here`,
        cpp: `#include <iostream>\\n#include <string>\\nusing namespace std;\\n\\nint main() {\\n    string s;\\n    cin >> s;\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
        c: `#include <stdio.h>\\n#include <string.h>\\n\\nint main() {\\n    char s[10000];\\n    scanf("%s", s);\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
      },
      order: 18,
    });

    questions.push({
      title: 'Prime Number Check',
      description: `Check if a given number n is prime.

A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.`,
      difficulty: 'Easy',
      topic: topics[2]._id, // Loops & Conditionals
      companies: ['Infosys', 'TCS'],
      tags: ['math', 'loops'],
      inputFormat: 'Single integer n',
      outputFormat: 'true or false',
      constraints: '2 <= n <= 10^6',
      sampleTestCases: [
        { input: '7', output: 'true', explanation: '7 is prime' },
        { input: '10', output: 'false', explanation: '10 = 2*5' },
      ],
      hiddenTestCases: [
        { input: '2', output: 'true' },
        { input: '100', output: 'false' },
      ],
      hints: ['Check divisibility from 2 to sqrt(n)', 'If any divides, not prime'],
      starterCode: {
        python: `n = int(input())\\n\\n# Your code here`,
        cpp: `#include <iostream>\\nusing namespace std;\\n\\nint main() {\\n    int n;\\n    cin >> n;\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
        c: `#include <stdio.h>\\n\\nint main() {\\n    int n;\\n    scanf("%d", &n);\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
      },
      order: 19,
    });

    questions.push({
      title: 'GCD of Two Numbers',
      description: `Find the Greatest Common Divisor (GCD) of two integers a and b.

The GCD is the largest positive integer that divides both numbers without a remainder.`,
      difficulty: 'Easy',
      topic: topics[4]._id, // Recursion
      companies: ['Microsoft'],
      tags: ['math', 'recursion'],
      inputFormat: 'Two integers a and b',
      outputFormat: 'GCD of a and b',
      constraints: '1 <= a, b <= 10^9',
      sampleTestCases: [
        { input: '48 18', output: '6', explanation: 'GCD(48, 18) = 6' },
        { input: '100 50', output: '50', explanation: 'GCD(100, 50) = 50' },
      ],
      hiddenTestCases: [
        { input: '7 13', output: '1' },
        { input: '1071 462', output: '21' },
      ],
      hints: ['Use Euclidean algorithm', 'GCD(a, b) = GCD(b, a % b)'],
      starterCode: {
        python: `a, b = map(int, input().split())\\n\\n# Your code here`,
        cpp: `#include <iostream>\\nusing namespace std;\\n\\nint main() {\\n    int a, b;\\n    cin >> a >> b;\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
        c: `#include <stdio.h>\\n\\nint main() {\\n    int a, b;\\n    scanf("%d %d", &a, &b);\\n    \\n    // Your code here\\n    \\n    return 0;\\n}`,
      },
      order: 20,
    });

    // Insert all questions
    const insertedQuestions = await Question.insertMany(questions);
    console.log(`✅ Created ${insertedQuestions.length} real-world problems`);

    console.log('\\n🎉 Seed data created successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Languages: ${languages.length}`);
    console.log(`   - Topics: ${topics.length}`);
    console.log(`   - Problems: ${insertedQuestions.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

realWorldProblems();
