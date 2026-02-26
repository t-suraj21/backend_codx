import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Topic from './models/Topic.js';
import Question from './models/Question.js';

dotenv.config();

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ MongoDB Connected');
};

// ─── helpers ──────────────────────────────────────────────────────────────────
const py  = (code) => code.trim();
const cpp = (code) => code.trim();
const c   = (code) => code.trim();

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const seed = async () => {
  await connectDB();

  await Topic.deleteMany({});
  await Question.deleteMany({});
  console.log('🗑️  Cleared topics & questions');

  // ════════════════════════════════════════════════════════════════
  //  TOPICS
  // ════════════════════════════════════════════════════════════════
  const topicDefs = [
    { name: 'Arrays',               icon: '📊', order: 1,  difficulty: 'Beginner',     description: 'Single and multi-dimensional array problems — traversal, manipulation and sliding window.' },
    { name: 'Strings',              icon: '📝', order: 2,  difficulty: 'Beginner',     description: 'String manipulation, pattern matching and two-pointer string techniques.' },
    { name: 'Loops & Conditionals', icon: '🔄', order: 3,  difficulty: 'Beginner',     description: 'Control flow, nested loops and iteration patterns.' },
    { name: 'Mathematics',          icon: '🔢', order: 4,  difficulty: 'Beginner',     description: 'Number theory, GCD, LCM, primes, modular arithmetic.' },
    { name: 'Searching & Sorting',  icon: '🔍', order: 5,  difficulty: 'Intermediate', description: 'Binary search, merge sort, quick sort and custom comparators.' },
    { name: 'Recursion',            icon: '🔁', order: 6,  difficulty: 'Intermediate', description: 'Divide & conquer, backtracking, and recursive thinking.' },
    { name: 'Linked Lists',         icon: '🔗', order: 7,  difficulty: 'Intermediate', description: 'Singly/doubly linked list manipulation, fast-slow pointer patterns.' },
    { name: 'Stacks & Queues',      icon: '📚', order: 8,  difficulty: 'Intermediate', description: 'LIFO/FIFO data structures, monotonic stacks and queue-based BFS.' },
    { name: 'Hashing',              icon: '🗂️', order: 9,  difficulty: 'Intermediate', description: 'Hash maps, hash sets, frequency counting and grouping.' },
    { name: 'Trees',                icon: '🌳', order: 10, difficulty: 'Intermediate', description: 'Binary trees, BST, DFS/BFS traversal and tree construction.' },
    { name: 'Dynamic Programming',  icon: '💡', order: 11, difficulty: 'Advanced',     description: 'Memoization, tabulation, knapsack and classic DP patterns.' },
    { name: 'Graphs',               icon: '🕸️', order: 12, difficulty: 'Advanced',     description: 'BFS, DFS, shortest path (Dijkstra/Bellman-Ford), union-find.' },
  ];

  const topics = await Topic.insertMany(topicDefs);
  const t = {};
  topics.forEach(tp => { t[tp.name] = tp._id; });
  console.log('✅ Created 12 topics');

  const questions = [];

  // ════════════════════════════════════════════════════════════════
  //  1. ARRAYS
  // ════════════════════════════════════════════════════════════════
  questions.push({
    title: 'Two Sum',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
You may assume exactly one solution exists and you may not use the same element twice.`,
    difficulty: 'Easy', topic: t['Arrays'],
    companies: ['Google', 'Amazon', 'Microsoft', 'Facebook'],
    tags: ['array', 'hash-table'],
    inputFormat: 'Line 1: n (array size)\nLine 2: n space-separated integers\nLine 3: target',
    outputFormat: 'Two space-separated 0-based indices',
    constraints: '2 ≤ n ≤ 10^4\n-10^9 ≤ nums[i] ≤ 10^9',
    sampleTestCases: [
      { input: '4\n2 7 11 15\n9',  output: '0 1', explanation: 'nums[0]+nums[1]=9' },
      { input: '3\n3 2 4\n6',      output: '1 2', explanation: 'nums[1]+nums[2]=6' },
    ],
    hiddenTestCases: [
      { input: '2\n3 3\n6',          output: '0 1' },
      { input: '5\n1 5 3 7 8\n12',   output: '2 3' },
      { input: '6\n0 4 3 0 2 1\n0',  output: '0 3' },
    ],
    hints: ['Use a hash map: for each number check if target-num exists.'],
    starterCode: {
      python: py(`n = int(input())
nums = list(map(int, input().split()))
target = int(input())
# write your solution`),
      cpp: cpp(`#include<bits/stdc++.h>
using namespace std;
int main(){
    int n; cin>>n;
    vector<int> nums(n);
    for(auto &x:nums) cin>>x;
    int target; cin>>target;
    // write your solution
}`),
      c: c(`#include<stdio.h>
int main(){
    int n; scanf("%d",&n);
    int nums[n];
    for(int i=0;i<n;i++) scanf("%d",&nums[i]);
    int target; scanf("%d",&target);
    // write your solution
}`),
    },
    order: 1,
  });

  questions.push({
    title: 'Best Time to Buy and Sell Stock',
    description: `You are given an array prices where prices[i] is the price of a stock on day i.
You want to maximise your profit by choosing a single day to buy and a single day to sell (must sell after buy).
Return the maximum profit. If no profit is possible, return 0.`,
    difficulty: 'Easy', topic: t['Arrays'],
    companies: ['Amazon', 'Microsoft', 'Goldman Sachs'],
    tags: ['array', 'greedy'],
    inputFormat: 'Line 1: n\nLine 2: n space-separated integers (prices)',
    outputFormat: 'Single integer — maximum profit',
    constraints: '1 ≤ n ≤ 10^5\n0 ≤ prices[i] ≤ 10^4',
    sampleTestCases: [
      { input: '6\n7 1 5 3 6 4', output: '5', explanation: 'Buy day 2 (price=1), sell day 5 (price=6), profit=5' },
      { input: '5\n7 6 4 3 1',   output: '0', explanation: 'Prices always fall, no profit possible' },
    ],
    hiddenTestCases: [
      { input: '3\n2 4 1',      output: '2' },
      { input: '4\n3 3 3 3',   output: '0' },
      { input: '5\n1 2 3 4 5', output: '4' },
    ],
    hints: ['Track the minimum price seen so far. At each step compute profit.'],
    starterCode: {
      python: py(`n = int(input())
prices = list(map(int, input().split()))
# write your solution`),
      cpp: cpp(`#include<bits/stdc++.h>
using namespace std;
int main(){
    int n; cin>>n;
    vector<int> p(n);
    for(auto &x:p) cin>>x;
    // write your solution
}`),
      c: c(`#include<stdio.h>
int main(){
    int n; scanf("%d",&n);
    int p[n];
    for(int i=0;i<n;i++) scanf("%d",&p[i]);
    // write your solution
}`),
    },
    order: 2,
  });

  questions.push({
    title: 'Maximum Subarray (Kadane\'s Algorithm)',
    description: `Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.`,
    difficulty: 'Medium', topic: t['Arrays'],
    companies: ['Google', 'Microsoft', 'Adobe'],
    tags: ['array', 'dynamic-programming', 'divide-and-conquer'],
    inputFormat: 'Line 1: n\nLine 2: n space-separated integers',
    outputFormat: 'Maximum subarray sum',
    constraints: '1 ≤ n ≤ 10^5\n-10^4 ≤ nums[i] ≤ 10^4',
    sampleTestCases: [
      { input: '9\n-2 1 -3 4 -1 2 1 -5 4', output: '6', explanation: '[4,-1,2,1] has sum 6' },
      { input: '1\n1',                       output: '1' },
    ],
    hiddenTestCases: [
      { input: '3\n-2 -1 -3',    output: '-1' },
      { input: '5\n5 4 -1 7 8',  output: '23' },
    ],
    hints: ['Keep a running sum; reset to current element when sum drops below it.'],
    starterCode: {
      python: py(`n = int(input())
nums = list(map(int, input().split()))
# write your solution`),
      cpp: cpp(`#include<bits/stdc++.h>
using namespace std;
int main(){
    int n; cin>>n;
    vector<int> nums(n);
    for(auto &x:nums) cin>>x;
    // write your solution
}`),
      c: c(`#include<stdio.h>
int main(){
    int n; scanf("%d",&n);
    int nums[n];
    for(int i=0;i<n;i++) scanf("%d",&nums[i]);
    // write your solution
}`),
    },
    order: 3,
  });

  questions.push({
    title: 'Rotate Array',
    description: `Given an array, rotate the array to the right by k steps, where k is non-negative. Print the rotated array.`,
    difficulty: 'Medium', topic: t['Arrays'],
    companies: ['Microsoft', 'Bloomberg'],
    tags: ['array', 'math', 'two-pointers'],
    inputFormat: 'Line 1: n\nLine 2: n space-separated integers\nLine 3: k',
    outputFormat: 'n space-separated integers (rotated array)',
    constraints: '1 ≤ n ≤ 10^5\n0 ≤ k ≤ 10^5',
    sampleTestCases: [
      { input: '7\n1 2 3 4 5 6 7\n3', output: '5 6 7 1 2 3 4', explanation: 'Rotate 3 steps right' },
      { input: '3\n-1 -100 3\n2',     output: '3 -1 -100' },
    ],
    hiddenTestCases: [
      { input: '5\n1 2 3 4 5\n5',  output: '1 2 3 4 5' },
      { input: '4\n1 2 3 4\n6',    output: '3 4 1 2' },
    ],
    hints: ['Use k = k % n to avoid full rotations. Reverse the whole array, then reverse halves.'],
    starterCode: {
      python: py(`n = int(input())
nums = list(map(int, input().split()))
k = int(input())
# write your solution`),
      cpp: cpp(`#include<bits/stdc++.h>
using namespace std;
int main(){
    int n; cin>>n;
    vector<int> nums(n);
    for(auto &x:nums) cin>>x;
    int k; cin>>k;
    // write your solution
}`),
      c: c(`#include<stdio.h>
int main(){
    int n; scanf("%d",&n);
    int nums[n];
    for(int i=0;i<n;i++) scanf("%d",&nums[i]);
    int k; scanf("%d",&k);
    // write your solution
}`),
    },
    order: 4,
  });

  questions.push({
    title: 'Trapping Rain Water',
    description: `Given n non-negative integers representing elevation heights where width of each bar is 1, compute how much water it can trap after raining.`,
    difficulty: 'Hard', topic: t['Arrays'],
    companies: ['Amazon', 'Google', 'Microsoft', 'Goldman Sachs'],
    tags: ['array', 'two-pointers', 'stack'],
    inputFormat: 'Line 1: n\nLine 2: n space-separated non-negative integers',
    outputFormat: 'Total water trapped',
    constraints: '1 ≤ n ≤ 3×10^4\n0 ≤ height[i] ≤ 10^5',
    sampleTestCases: [
      { input: '12\n0 1 0 2 1 0 1 3 2 1 2 1', output: '6', explanation: '6 units of water' },
      { input: '6\n4 2 0 3 2 5',               output: '9' },
    ],
    hiddenTestCases: [
      { input: '1\n3',       output: '0' },
      { input: '4\n3 0 0 3', output: '6' },
    ],
    hints: ['Pre-compute maxLeft and maxRight arrays. Water at i = min(maxLeft[i], maxRight[i]) - height[i].'],
    starterCode: {
      python: py(`n = int(input())
h = list(map(int, input().split()))
# write your solution`),
      cpp: cpp(`#include<bits/stdc++.h>
using namespace std;
int main(){
    int n; cin>>n;
    vector<int> h(n);
    for(auto &x:h) cin>>x;
    // write your solution
}`),
      c: c(`#include<stdio.h>
int main(){
    int n; scanf("%d",&n);
    int h[n];
    for(int i=0;i<n;i++) scanf("%d",&h[i]);
    // write your solution
}`),
    },
    order: 5,
  });

  // ════════════════════════════════════════════════════════════════
  //  2. STRINGS
  // ════════════════════════════════════════════════════════════════
  questions.push({
    title: 'Reverse a String',
    description: 'Given a string, print the reversed string.',
    difficulty: 'Easy', topic: t['Strings'],
    companies: ['Amazon'],
    tags: ['string', 'two-pointers'],
    inputFormat: 'A single string on one line',
    outputFormat: 'Reversed string',
    constraints: '1 ≤ |s| ≤ 10^5',
    sampleTestCases: [
      { input: 'hello',   output: 'olleh' },
      { input: 'abcdef',  output: 'fedcba' },
    ],
    hiddenTestCases: [
      { input: 'a',        output: 'a' },
      { input: 'racecar',  output: 'racecar' },
    ],
    hints: ['Two-pointer swap from both ends.'],
    starterCode: {
      python: py(`s = input()
# write your solution`),
      cpp: cpp(`#include<bits/stdc++.h>
using namespace std;
int main(){
    string s; cin>>s;
    // write your solution
}`),
      c: c(`#include<stdio.h>
#include<string.h>
int main(){
    char s[100001]; scanf("%s",s);
    // write your solution
}`),
    },
    order: 1,
  });

  questions.push({
    title: 'Valid Anagram',
    description: 'Given two strings s and t, return "YES" if t is an anagram of s, and "NO" otherwise.',
    difficulty: 'Easy', topic: t['Strings'],
    companies: ['Facebook', 'Amazon'],
    tags: ['string', 'hash-table', 'sorting'],
    inputFormat: 'Line 1: string s\nLine 2: string t',
    outputFormat: '"YES" or "NO"',
    constraints: '1 ≤ |s|, |t| ≤ 5×10^4\nOnly lowercase English letters',
    sampleTestCases: [
      { input: 'anagram\nnagaram', output: 'YES' },
      { input: 'rat\ncar',        output: 'NO' },
    ],
    hiddenTestCases: [
      { input: 'a\na', output: 'YES' },
      { input: 'ab\nba', output: 'YES' },
      { input: 'abc\nabd', output: 'NO' },
    ],
    hints: ['Count character frequencies in both strings and compare.'],
    starterCode: {
      python: py(`s = input()
t = input()
# write your solution`),
      cpp: cpp(`#include<bits/stdc++.h>
using namespace std;
int main(){
    string s,t; cin>>s>>t;
    // write your solution
}`),
      c: c(`#include<stdio.h>
int main(){
    char s[50001],t[50001];
    scanf("%s%s",s,t);
    // write your solution
}`),
    },
    order: 2,
  });

  questions.push({
    title: 'Longest Substring Without Repeating Characters',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    difficulty: 'Medium', topic: t['Strings'],
    companies: ['Amazon', 'Google', 'Microsoft', 'Facebook'],
    tags: ['string', 'sliding-window', 'hash-table'],
    inputFormat: 'A single string on one line',
    outputFormat: 'Length of longest substring with no repeating characters',
    constraints: '0 ≤ |s| ≤ 5×10^4\nAscii characters',
    sampleTestCases: [
      { input: 'abcabcbb', output: '3', explanation: '"abc" is the answer' },
      { input: 'bbbbb',    output: '1', explanation: '"b"' },
      { input: 'pwwkew',   output: '3', explanation: '"wke"' },
    ],
    hiddenTestCases: [
      { input: '',          output: '0' },
      { input: 'dvdf',      output: '3' },
      { input: 'aab',       output: '2' },
    ],
    hints: ['Use a sliding window. Store the last seen index of each character.'],
    starterCode: {
      python: py(`s = input()
# write your solution`),
      cpp: cpp(`#include<bits/stdc++.h>
using namespace std;
int main(){
    string s; cin>>s;
    // write your solution
}`),
      c: c(`#include<stdio.h>
int main(){
    char s[50001]; scanf("%s",s);
    // write your solution
}`),
    },
    order: 3,
  });

  questions.push({
    title: 'Minimum Window Substring',
    description: `Given strings s and t, return the minimum window substring of s such that every character in t (including duplicates) is included in the window.
If no such window exists, print "".`,
    difficulty: 'Hard', topic: t['Strings'],
    companies: ['Facebook', 'Google', 'Uber'],
    tags: ['string', 'sliding-window', 'hash-table'],
    inputFormat: 'Line 1: string s\nLine 2: string t',
    outputFormat: 'Minimum window substring, or empty line if none',
    constraints: '1 ≤ |s|, |t| ≤ 10^5\nOnly uppercase and lowercase English letters',
    sampleTestCases: [
      { input: 'ADOBECODEBANC\nABC', output: 'BANC' },
      { input: 'a\na',              output: 'a' },
      { input: 'a\nb',             output: '' },
    ],
    hiddenTestCases: [
      { input: 'abc\ncba',    output: 'abc' },
      { input: 'aaflslflsldkalskaaa\naaa', output: 'aaa' },
    ],
    hints: ['Expand window to the right; once valid, shrink from the left.', 'Use two frequency maps.'],
    starterCode: {
      python: py(`s = input()
t = input()
# write your solution`),
      cpp: cpp(`#include<bits/stdc++.h>
using namespace std;
int main(){
    string s,t; cin>>s>>t;
    // write your solution
}`),
      c: c(`#include<stdio.h>
int main(){
    char s[100001],t[100001];
    scanf("%s%s",s,t);
    // write your solution
}`),
    },
    order: 4,
  });

  // ════════════════════════════════════════════════════════════════
  //  3. LOOPS & CONDITIONALS
  // ════════════════════════════════════════════════════════════════
  questions.push({
    title: 'FizzBuzz',
    description: `Print numbers from 1 to n.
For multiples of 3 print "Fizz", for multiples of 5 print "Buzz", for multiples of both print "FizzBuzz".`,
    difficulty: 'Easy', topic: t['Loops & Conditionals'],
    companies: ['Google', 'Microsoft'],
    tags: ['loops', 'conditionals', 'basics'],
    inputFormat: 'Single integer n',
    outputFormat: 'n lines',
    constraints: '1 ≤ n ≤ 10^4',
    sampleTestCases: [
      { input: '5', output: '1\n2\nFizz\n4\nBuzz' },
      { input: '3', output: '1\n2\nFizz' },
    ],
    hiddenTestCases: [
      { input: '15', output: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz' },
    ],
    hints: ['Check divisibility by 15 first, then 3, then 5.'],
    starterCode: {
      python: py(`n = int(input())
# write your solution`),
      cpp: cpp(`#include<bits/stdc++.h>
using namespace std;
int main(){
    int n; cin>>n;
    // write your solution
}`),
      c: c(`#include<stdio.h>
int main(){
    int n; scanf("%d",&n);
    // write your solution
}`),
    },
    order: 1,
  });

  questions.push({
    title: 'Number Pattern Triangle',
    description: `Print a right-angled triangle of n rows where row i contains numbers 1 to i.
Example n=4:
1
1 2
1 2 3
1 2 3 4`,
    difficulty: 'Easy', topic: t['Loops & Conditionals'],
    companies: ['TCS', 'Infosys'],
    tags: ['loops', 'pattern'],
    inputFormat: 'Single integer n',
    outputFormat: 'n lines, each space-separated',
    constraints: '1 ≤ n ≤ 50',
    sampleTestCases: [
      { input: '3', output: '1\n1 2\n1 2 3' },
      { input: '1', output: '1' },
    ],
    hiddenTestCases: [
      { input: '5', output: '1\n1 2\n1 2 3\n1 2 3 4\n1 2 3 4 5' },
    ],
    hints: ['Nested loop: outer for rows, inner for columns.'],
    starterCode: {
      python: py(`n = int(input())
# write your solution`),
      cpp: cpp(`#include<bits/stdc++.h>
using namespace std;
int main(){
    int n; cin>>n;
    // write your solution
}`),
      c: c(`#include<stdio.h>
int main(){
    int n; scanf("%d",&n);
    // write your solution
}`),
    },
    order: 2,
  });

  questions.push({
    title: 'Count Digits',
    description: `Given a number n, count how many of its digits evenly divide n. (Ignore any digit that is 0.)`,
    difficulty: 'Medium', topic: t['Loops & Conditionals'],
    companies: ['Amazon'],
    tags: ['loops', 'math'],
    inputFormat: 'Single integer n',
    outputFormat: 'Count of digits that divide n',
    constraints: '1 ≤ n ≤ 10^9',
    sampleTestCases: [
      { input: '1012', output: '3', explanation: '1 divides 1012, 1 divides 1012, 2 divides 1012' },
      { input: '7',    output: '1' },
    ],
    hiddenTestCases: [
      { input: '100',  output: '1' },
      { input: '121',  output: '2' },
    ],
    hints: ['Extract each digit with n%10, check if it divides the original n.'],
    starterCode: {
      python: py(`n = int(input())
# write your solution`),
      cpp: cpp(`#include<bits/stdc++.h>
using namespace std;
int main(){
    int n; cin>>n;
    // write your solution
}`),
      c: c(`#include<stdio.h>
int main(){
    int n; scanf("%d",&n);
    // write your solution
}`),
    },
    order: 3,
  });

  // ════════════════════════════════════════════════════════════════
  //  4. MATHEMATICS
  // ════════════════════════════════════════════════════════════════
  questions.push({
    title: 'GCD and LCM',
    description: 'Given two integers a and b, print their GCD and LCM on a single line separated by a space.',
    difficulty: 'Easy', topic: t['Mathematics'],
    companies: ['TCS', 'Wipro'],
    tags: ['math', 'gcd', 'lcm'],
    inputFormat: 'Two space-separated integers a and b',
    outputFormat: 'GCD and LCM separated by space',
    constraints: '1 ≤ a, b ≤ 10^9',
    sampleTestCases: [
      { input: '12 18', output: '6 36' },
      { input: '7 13',  output: '1 91' },
    ],
    hiddenTestCases: [
      { input: '100 75', output: '25 300' },
      { input: '1 1',    output: '1 1' },
    ],
    hints: ['GCD via Euclidean algorithm. LCM = a*b/GCD.'],
    starterCode: {
      python: py(`a, b = map(int, input().split())
# write your solution`),
      cpp: cpp(`#include<bits/stdc++.h>
using namespace std;
int main(){
    long long a,b; cin>>a>>b;
    // write your solution
}`),
      c: c(`#include<stdio.h>
int main(){
    long long a,b; scanf("%lld %lld",&a,&b);
    // write your solution
}`),
    },
    order: 1,
  });

  questions.push({
    title: 'Count Primes',
    description: 'Given n, count the number of prime numbers strictly less than n.',
    difficulty: 'Medium', topic: t['Mathematics'],
    companies: ['Google', 'Amazon'],
    tags: ['math', 'sieve', 'prime'],
    inputFormat: 'Single integer n',
    outputFormat: 'Count of primes less than n',
    constraints: '0 ≤ n ≤ 5×10^6',
    sampleTestCases: [
      { input: '10', output: '4', explanation: 'Primes: 2,3,5,7' },
      { input: '0',  output: '0' },
      { input: '1',  output: '0' },
    ],
    hiddenTestCases: [
      { input: '100',   output: '25' },
      { input: '1000',  output: '168' },
    ],
    hints: ['Use the Sieve of Eratosthenes for O(n log log n) time.'],
    starterCode: {
      python: py(`n = int(input())
# write your solution`),
      cpp: cpp(`#include<bits/stdc++.h>
using namespace std;
int main(){
    int n; cin>>n;
    // write your solution
}`),
      c: c(`#include<stdio.h>
int main(){
    int n; scanf("%d",&n);
    // write your solution
}`),
    },
    order: 2,
  });

  questions.push({
    title: 'Power Function (Fast Exponentiation)',
    description: 'Compute (base^exp) % (10^9+7). Do not use built-in power functions.',
    difficulty: 'Medium', topic: t['Mathematics'],
    companies: ['Google', 'Codeforces'],
    tags: ['math', 'binary-exponentiation'],
    inputFormat: 'Two integers on one line: base exp',
    outputFormat: 'Result modulo 10^9+7',
    constraints: '0 ≤ base ≤ 10^9\n0 ≤ exp ≤ 10^18',
    sampleTestCases: [
      { input: '2 10',  output: '1024' },
      { input: '3 100', output: '981453966' },
    ],
    hiddenTestCases: [
      { input: '0 0',             output: '1' },
      { input: '1000000000 1000000000', output: '0' },
    ],
    hints: ['Binary exponentiation: if exp is odd, multiply once and halve.'],
    starterCode: {
      python: py(`base, exp = map(int, input().split())
MOD = 10**9 + 7
# write your solution`),
      cpp: cpp(`#include<bits/stdc++.h>
using namespace std;
const long long MOD=1e9+7;
int main(){
    long long base,exp; cin>>base>>exp;
    // write your solution
}`),
      c: c(`#include<stdio.h>
#define MOD 1000000007LL
int main(){
    long long base,exp; scanf("%lld %lld",&base,&exp);
    // write your solution
}`),
    },
    order: 3,
  });

  // ════════════════════════════════════════════════════════════════
  //  5. SEARCHING & SORTING
  // ════════════════════════════════════════════════════════════════
  questions.push({
    title: 'Binary Search',
    description: 'Given a sorted array of distinct integers and a target, return the index of target or -1 if not found.',
    difficulty: 'Easy', topic: t['Searching & Sorting'],
    companies: ['Google', 'Amazon', 'Microsoft'],
    tags: ['binary-search', 'array'],
    inputFormat: 'Line 1: n\nLine 2: n sorted space-separated integers\nLine 3: target',
    outputFormat: '0-based index, or -1',
    constraints: '1 ≤ n ≤ 10^5\n-10^9 ≤ nums[i], target ≤ 10^9',
    sampleTestCases: [
      { input: '6\n-1 0 3 5 9 12\n9', output: '4' },
      { input: '6\n-1 0 3 5 9 12\n2', output: '-1' },
    ],
    hiddenTestCases: [
      { input: '1\n5\n5',  output: '0' },
      { input: '3\n1 3 5\n3', output: '1' },
    ],
    hints: ['Classic binary search: mid = (lo+hi)/2; compare and halve.'],
    starterCode: {
      python: py(`n = int(input())
nums = list(map(int, input().split()))
target = int(input())
# write your solution`),
      cpp: cpp(`#include<bits/stdc++.h>
using namespace std;
int main(){
    int n; cin>>n;
    vector<int> nums(n);
    for(auto &x:nums) cin>>x;
    int target; cin>>target;
    // write your solution
}`),
      c: c(`#include<stdio.h>
int main(){
    int n; scanf("%d",&n);
    int nums[n];
    for(int i=0;i<n;i++) scanf("%d",&nums[i]);
    int target; scanf("%d",&target);
    // write your solution
}`),
    },
    order: 1,
  });

  questions.push({
    title: 'Sort Colors (Dutch National Flag)',
    description: `Given an array nums with n objects coloured red(0), white(1), or blue(2), sort them in-place so that same colours are adjacent, in the order 0,1,2.`,
    difficulty: 'Medium', topic: t['Searching & Sorting'],
    companies: ['Microsoft', 'Facebook'],
    tags: ['sorting', 'two-pointers'],
    inputFormat: 'Line 1: n\nLine 2: n space-separated integers (0,1, or 2)',
    outputFormat: 'n space-separated sorted integers',
    constraints: '1 ≤ n ≤ 300\nnums[i] ∈ {0,1,2}',
    sampleTestCases: [
      { input: '6\n2 0 2 1 1 0', output: '0 0 1 1 2 2' },
      { input: '3\n2 0 1',       output: '0 1 2' },
    ],
    hiddenTestCases: [
      { input: '4\n0 0 0 0', output: '0 0 0 0' },
      { input: '5\n2 2 2 1 0', output: '0 1 2 2 2' },
    ],
    hints: ['Use three pointers: lo, mid, hi.'],
    starterCode: {
      python: py(`n = int(input())
nums = list(map(int, input().split()))
# write your solution`),
      cpp: cpp(`#include<bits/stdc++.h>
using namespace std;
int main(){
    int n; cin>>n;
    vector<int> nums(n);
    for(auto &x:nums) cin>>x;
    // write your solution
}`),
      c: c(`#include<stdio.h>
int main(){
    int n; scanf("%d",&n);
    int nums[n];
    for(int i=0;i<n;i++) scanf("%d",&nums[i]);
    // write your solution
}`),
    },
    order: 2,
  });

  questions.push({
    title: 'Find Median of Two Sorted Arrays',
    description: `Given two sorted arrays nums1 of size m and nums2 of size n, return the median of the two sorted arrays. Use at most O(log(m+n)) time.`,
    difficulty: 'Hard', topic: t['Searching & Sorting'],
    companies: ['Google', 'Amazon', 'Microsoft'],
    tags: ['binary-search', 'array', 'divide-and-conquer'],
    inputFormat: 'Line 1: m\nLine 2: m sorted integers\nLine 3: n\nLine 4: n sorted integers',
    outputFormat: 'Median as a decimal (e.g. 2.0 or 2.5)',
    constraints: '0 ≤ m, n ≤ 1000\n-10^6 ≤ nums[i] ≤ 10^6',
    sampleTestCases: [
      { input: '2\n1 3\n1\n2',     output: '2.0' },
      { input: '2\n1 2\n2\n3 4',   output: '2.5' },
    ],
    hiddenTestCases: [
      { input: '0\n\n1\n1',        output: '1.0' },
      { input: '3\n1 3 8\n3\n7 9 10', output: '7.5' },
    ],
    hints: ['Binary search on the smaller array to find the correct partition.'],
    starterCode: {
      python: py(`m = int(input())
nums1 = list(map(int, input().split())) if m > 0 else []
n = int(input())
nums2 = list(map(int, input().split())) if n > 0 else []
# write your solution`),
      cpp: cpp(`#include<bits/stdc++.h>
using namespace std;
int main(){
    int m; cin>>m;
    vector<int> a(m);
    for(auto &x:a) cin>>x;
    int n; cin>>n;
    vector<int> b(n);
    for(auto &x:b) cin>>x;
    // write your solution
}`),
      c: c(`#include<stdio.h>
int main(){
    int m; scanf("%d",&m);
    int a[m];
    for(int i=0;i<m;i++) scanf("%d",&a[i]);
    int n; scanf("%d",&n);
    int b[n];
    for(int i=0;i<n;i++) scanf("%d",&b[i]);
    // write your solution
}`),
    },
    order: 3,
  });

  // ════════════════════════════════════════════════════════════════
  //  6. RECURSION
  // ════════════════════════════════════════════════════════════════
  questions.push({
    title: 'Fibonacci Number',
    description: 'Calculate the n-th Fibonacci number. F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2).',
    difficulty: 'Easy', topic: t['Recursion'],
    companies: ['Amazon', 'Microsoft'],
    tags: ['recursion', 'memoization'],
    inputFormat: 'Single integer n',
    outputFormat: 'F(n)',
    constraints: '0 ≤ n ≤ 30',
    sampleTestCases: [
      { input: '4',  output: '3' },
      { input: '10', output: '55' },
    ],
    hiddenTestCases: [
      { input: '0',  output: '0' },
      { input: '1',  output: '1' },
      { input: '20', output: '6765' },
    ],
    hints: ['Use memoization or iteration to avoid exponential recursion.'],
    starterCode: {
      python: py(`n = int(input())
# write your solution`),
      cpp: cpp(`#include<bits/stdc++.h>
using namespace std;
int main(){
    int n; cin>>n;
    // write your solution
}`),
      c: c(`#include<stdio.h>
int main(){
    int n; scanf("%d",&n);
    // write your solution
}`),
    },
    order: 1,
  });

  questions.push({
    title: 'Tower of Hanoi',
    description: `Print the sequence of moves to solve Tower of Hanoi with n disks.
Move all disks from rod A to rod C using rod B.
Format each move as: "Move disk X from A to C"`,
    difficulty: 'Medium', topic: t['Recursion'],
    companies: ['TCS'],
    tags: ['recursion'],
    inputFormat: 'Single integer n',
    outputFormat: '2^n - 1 lines of moves',
    constraints: '1 ≤ n ≤ 10',
    sampleTestCases: [
      { input: '2', output: 'Move disk 1 from A to B\nMove disk 2 from A to C\nMove disk 1 from B to C' },
    ],
    hiddenTestCases: [
      { input: '1', output: 'Move disk 1 from A to C' },
    ],
    hints: ['Recurse: move n-1 disks to intermediate, move nth to target, move n-1 from intermediate to target.'],
    starterCode: {
      python: py(`n = int(input())
def hanoi(n, src, dest, aux):
    pass  # write your solution
hanoi(n, 'A', 'C', 'B')`),
      cpp: cpp(`#include<bits/stdc++.h>
using namespace std;
void hanoi(int n, char src, char dest, char aux){
    // write your solution
}
int main(){
    int n; cin>>n;
    hanoi(n,'A','C','B');
}`),
      c: c(`#include<stdio.h>
void hanoi(int n, char src, char dest, char aux){
    // write your solution
}
int main(){
    int n; scanf("%d",&n);
    hanoi(n,'A','C','B');
}`),
    },
    order: 2,
  });

  questions.push({
    title: 'Subsets (Power Set)',
    description: `Given a set of distinct integers, print all 2^n subsets, one per line, elements space-separated and sorted. Print subsets in lexicographic order. Empty subset prints as empty line.`,
    difficulty: 'Medium', topic: t['Recursion'],
    companies: ['Facebook', 'Amazon'],
    tags: ['recursion', 'backtracking', 'bit-manipulation'],
    inputFormat: 'Line 1: n\nLine 2: n space-separated distinct integers',
    outputFormat: '2^n lines (subsets)',
    constraints: '1 ≤ n ≤ 10\n-10 ≤ nums[i] ≤ 10',
    sampleTestCases: [
      { input: '2\n1 2', output: '\n1\n1 2\n2' },
    ],
    hiddenTestCases: [
      { input: '1\n5', output: '\n5' },
    ],
    hints: ['Recursively include or exclude each element.'],
    starterCode: {
      python: py(`n = int(input())
nums = list(map(int, input().split()))
# write your solution`),
      cpp: cpp(`#include<bits/stdc++.h>
using namespace std;
int main(){
    int n; cin>>n;
    vector<int> nums(n);
    for(auto &x:nums) cin>>x;
    // write your solution
}`),
      c: c(`#include<stdio.h>
int main(){
    int n; scanf("%d",&n);
    int nums[n];
    for(int i=0;i<n;i++) scanf("%d",&nums[i]);
    // write your solution
}`),
    },
    order: 3,
  });

  // ════════════════════════════════════════════════════════════════
  //  7. LINKED LISTS
  // ════════════════════════════════════════════════════════════════
  questions.push({
    title: 'Reverse a Linked List',
    description: `Given the head of a singly linked list represented as space-separated values (terminated by -1), reverse it and print the reversed list.`,
    difficulty: 'Easy', topic: t['Linked Lists'],
    companies: ['Amazon', 'Microsoft', 'Adobe'],
    tags: ['linked-list'],
    inputFormat: 'Space-separated integers ending with -1',
    outputFormat: 'Reversed list space-separated (no -1)',
    constraints: '0 ≤ nodes ≤ 10^4\n-10^5 ≤ val ≤ 10^5',
    sampleTestCases: [
      { input: '1 2 3 4 5 -1', output: '5 4 3 2 1' },
      { input: '1 2 -1',       output: '2 1' },
    ],
    hiddenTestCases: [
      { input: '-1',           output: '' },
      { input: '1 -1',         output: '1' },
    ],
    hints: ['Use three pointers: prev, curr, next. Or store in array and reverse.'],
    starterCode: {
      python: py(`vals = list(map(int, input().split()))
nodes = vals[:-1]  # remove -1
# write your solution`),
      cpp: cpp(`#include<bits/stdc++.h>
using namespace std;
int main(){
    vector<int> nodes;
    int x;
    while(cin>>x && x!=-1) nodes.push_back(x);
    // write your solution
}`),
      c: c(`#include<stdio.h>
int main(){
    int nodes[10001],n=0,x;
    while(scanf("%d",&x)==1 && x!=-1) nodes[n++]=x;
    // write your solution
}`),
    },
    order: 1,
  });

  questions.push({
    title: 'Detect Cycle in Linked List',
    description: `Given a linked list, determine if it has a cycle.
Input: list values followed by "cycle X" where X is the 0-based index the tail connects to, or "no cycle".
Output: "YES" or "NO".`,
    difficulty: 'Medium', topic: t['Linked Lists'],
    companies: ['Amazon', 'Microsoft', 'Google'],
    tags: ['linked-list', 'two-pointers', 'fast-slow-pointer'],
    inputFormat: 'Line 1: n\nLine 2: n values\nLine 3: "cycle X" or "no cycle"',
    outputFormat: '"YES" or "NO"',
    constraints: '0 ≤ n ≤ 10^4',
    sampleTestCases: [
      { input: '4\n3 2 0 -4\ncycle 1', output: 'YES' },
      { input: '2\n1 2\nno cycle',     output: 'NO' },
    ],
    hiddenTestCases: [
      { input: '1\n1\ncycle 0', output: 'YES' },
      { input: '0\n\nno cycle', output: 'NO' },
    ],
    hints: ['Floyd\'s cycle detection: fast pointer moves 2 steps, slow moves 1.'],
    starterCode: {
      python: py(`n = int(input())
vals = list(map(int, input().split())) if n > 0 else []
info = input()
has_cycle = info.startswith('cycle')
# write your solution`),
      cpp: cpp(`#include<bits/stdc++.h>
using namespace std;
int main(){
    int n; cin>>n;
    vector<int> vals(n);
    for(auto &x:vals) cin>>x;
    string info; getline(cin>>ws, info);
    bool has_cycle = (info.find("cycle") != string::npos);
    // write your solution
}`),
      c: c(`#include<stdio.h>
#include<string.h>
int main(){
    int n; scanf("%d",&n);
    int vals[n];
    for(int i=0;i<n;i++) scanf("%d",&vals[i]);
    char info[50]; scanf(" %[^\n]",info);
    int has_cycle = strstr(info,"cycle") != NULL;
    // write your solution
}`),
    },
    order: 2,
  });

  // ════════════════════════════════════════════════════════════════
  //  8. STACKS & QUEUES
  // ════════════════════════════════════════════════════════════════
  questions.push({
    title: 'Valid Parentheses',
    description: `Given a string s containing only '(', ')', '{', '}', '[' and ']', determine if the sequence is valid.
Valid: brackets close in correct order.`,
    difficulty: 'Easy', topic: t['Stacks & Queues'],
    companies: ['Google', 'Amazon', 'Microsoft', 'Facebook'],
    tags: ['stack', 'string'],
    inputFormat: 'A single string',
    outputFormat: '"YES" or "NO"',
    constraints: '1 ≤ |s| ≤ 10^4\nOnly bracket characters',
    sampleTestCases: [
      { input: '()',     output: 'YES' },
      { input: '()[]{)', output: 'NO' },
      { input: '{[]}',  output: 'YES' },
    ],
    hiddenTestCases: [
      { input: '(((',   output: 'NO' },
      { input: '',      output: 'YES' },
    ],
    hints: ['Push open brackets; on close bracket check top of stack.'],
    starterCode: {
      python: py(`s = input()
# write your solution`),
      cpp: cpp(`#include<bits/stdc++.h>
using namespace std;
int main(){
    string s; cin>>s;
    // write your solution
}`),
      c: c(`#include<stdio.h>
int main(){
    char s[10001]; scanf("%s",s);
    // write your solution
}`),
    },
    order: 1,
  });

  questions.push({
    title: 'Next Greater Element',
    description: `Given an array, for each element find the next greater element to its right. If none exists, output -1 for that element.`,
    difficulty: 'Medium', topic: t['Stacks & Queues'],
    companies: ['Amazon', 'Microsoft'],
    tags: ['stack', 'array', 'monotonic-stack'],
    inputFormat: 'Line 1: n\nLine 2: n space-separated integers',
    outputFormat: 'n space-separated integers (next greater for each)',
    constraints: '1 ≤ n ≤ 10^5\n-10^9 ≤ nums[i] ≤ 10^9',
    sampleTestCases: [
      { input: '4\n4 1 2 3',  output: '-1 2 3 -1' },
      { input: '4\n2 7 4 3',  output: '7 -1 -1 -1' },
    ],
    hiddenTestCases: [
      { input: '1\n5',        output: '-1' },
      { input: '5\n1 2 3 4 5', output: '2 3 4 5 -1' },
    ],
    hints: ['Use a monotonic decreasing stack. Process left to right.'],
    starterCode: {
      python: py(`n = int(input())
nums = list(map(int, input().split()))
# write your solution`),
      cpp: cpp(`#include<bits/stdc++.h>
using namespace std;
int main(){
    int n; cin>>n;
    vector<int> nums(n);
    for(auto &x:nums) cin>>x;
    // write your solution
}`),
      c: c(`#include<stdio.h>
int main(){
    int n; scanf("%d",&n);
    int nums[n];
    for(int i=0;i<n;i++) scanf("%d",&nums[i]);
    // write your solution
}`),
    },
    order: 2,
  });

  questions.push({
    title: 'Largest Rectangle in Histogram',
    description: `Given n non-negative integers representing histogram bar heights where each bar width is 1, find the area of the largest rectangle in the histogram.`,
    difficulty: 'Hard', topic: t['Stacks & Queues'],
    companies: ['Amazon', 'Google', 'Microsoft'],
    tags: ['stack', 'array', 'monotonic-stack'],
    inputFormat: 'Line 1: n\nLine 2: n space-separated non-negative integers',
    outputFormat: 'Largest rectangle area',
    constraints: '1 ≤ n ≤ 10^5\n0 ≤ heights[i] ≤ 10^4',
    sampleTestCases: [
      { input: '6\n2 1 5 6 2 3', output: '10', explanation: 'bars 5,6 give area 10' },
      { input: '2\n2 4',          output: '4' },
    ],
    hiddenTestCases: [
      { input: '1\n5',                output: '5' },
      { input: '5\n1 1 1 1 1',        output: '5' },
    ],
    hints: ['Maintain a monotonic increasing stack. On pop, calculate area using current index as right boundary.'],
    starterCode: {
      python: py(`n = int(input())
h = list(map(int, input().split()))
# write your solution`),
      cpp: cpp(`#include<bits/stdc++.h>
using namespace std;
int main(){
    int n; cin>>n;
    vector<int> h(n);
    for(auto &x:h) cin>>x;
    // write your solution
}`),
      c: c(`#include<stdio.h>
int main(){
    int n; scanf("%d",&n);
    int h[n];
    for(int i=0;i<n;i++) scanf("%d",&h[i]);
    // write your solution
}`),
    },
    order: 3,
  });

  // ════════════════════════════════════════════════════════════════
  //  9. HASHING
  // ════════════════════════════════════════════════════════════════
  questions.push({
    title: 'Find All Duplicates in Array',
    description: 'Given an integer array of size n where 1 ≤ a[i] ≤ n, find all elements that appear twice. Print them in any order.',
    difficulty: 'Medium', topic: t['Hashing'],
    companies: ['Google'],
    tags: ['hash-table', 'array'],
    inputFormat: 'Line 1: n\nLine 2: n integers',
    outputFormat: 'Space-separated duplicate elements, or "NONE"',
    constraints: '1 ≤ n ≤ 10^5\n1 ≤ a[i] ≤ n',
    sampleTestCases: [
      { input: '8\n4 3 2 7 8 2 3 1', output: '2 3' },
      { input: '3\n1 2 3',          output: 'NONE' },
    ],
    hiddenTestCases: [
      { input: '2\n1 1', output: '1' },
    ],
    hints: ['Use the sign trick: negate nums[abs(nums[i])-1]; if already negative, it\'s a duplicate.'],
    starterCode: {
      python: py(`n = int(input())
nums = list(map(int, input().split()))
# write your solution`),
      cpp: cpp(`#include<bits/stdc++.h>
using namespace std;
int main(){
    int n; cin>>n;
    vector<int> nums(n);
    for(auto &x:nums) cin>>x;
    // write your solution
}`),
      c: c(`#include<stdio.h>
int main(){
    int n; scanf("%d",&n);
    int nums[n];
    for(int i=0;i<n;i++) scanf("%d",&nums[i]);
    // write your solution
}`),
    },
    order: 1,
  });

  questions.push({
    title: 'Group Anagrams',
    description: `Given an array of strings, group the anagrams together. Print each group on one line (strings within group joined by space), groups separated by newline. Sort groups and strings within group lexicographically.`,
    difficulty: 'Medium', topic: t['Hashing'],
    companies: ['Facebook', 'Amazon', 'Microsoft'],
    tags: ['hash-table', 'string', 'sorting'],
    inputFormat: 'Line 1: n\nNext n lines: one string each',
    outputFormat: 'Groups of anagrams, sorted',
    constraints: '1 ≤ n ≤ 10^4\n0 ≤ |s| ≤ 100\nOnly lowercase letters',
    sampleTestCases: [
      { input: '6\neat\ntea\ntan\nate\nnat\nbat', output: 'ate eat tea\nbat\nnat tan' },
    ],
    hiddenTestCases: [
      { input: '1\na', output: 'a' },
    ],
    hints: ['Sort each string to get its key; group strings by key.'],
    starterCode: {
      python: py(`n = int(input())
words = [input() for _ in range(n)]
# write your solution`),
      cpp: cpp(`#include<bits/stdc++.h>
using namespace std;
int main(){
    int n; cin>>n;
    vector<string> words(n);
    for(auto &s:words) cin>>s;
    // write your solution
}`),
      c: c(`#include<stdio.h>
int main(){
    int n; scanf("%d",&n);
    char words[10000][101];
    for(int i=0;i<n;i++) scanf("%s",words[i]);
    // write your solution
}`),
    },
    order: 2,
  });

  // ════════════════════════════════════════════════════════════════
  //  10. TREES
  // ════════════════════════════════════════════════════════════════
  questions.push({
    title: 'Inorder Traversal of Binary Tree',
    description: `Given a binary tree in level-order (null represented as -1), print its inorder traversal (left-root-right) space-separated.`,
    difficulty: 'Easy', topic: t['Trees'],
    companies: ['Amazon', 'Microsoft'],
    tags: ['tree', 'dfs', 'recursion'],
    inputFormat: 'Space-separated level-order values (-1 = null), all on one line',
    outputFormat: 'Inorder traversal space-separated',
    constraints: '0 ≤ nodes ≤ 10^3\n-100 ≤ val ≤ 100',
    sampleTestCases: [
      { input: '1 2 3 4 5 -1 -1', output: '4 2 5 1 3', explanation: 'Left subtree, root, right subtree' },
      { input: '1 -1 2 -1 -1 -1 3', output: '1 2 3' },
    ],
    hiddenTestCases: [
      { input: '-1',    output: '' },
      { input: '5 -1 -1', output: '5' },
    ],
    hints: ['Build tree from level-order array using a queue; then DFS inorder.'],
    starterCode: {
      python: py(`vals = list(map(int, input().split()))
# vals[0] is root; left child of i is at 2i+1, right at 2i+2
# write your solution`),
      cpp: cpp(`#include<bits/stdc++.h>
using namespace std;
int main(){
    vector<int> vals;
    int x;
    while(cin>>x) vals.push_back(x);
    // write your solution
}`),
      c: c(`#include<stdio.h>
int main(){
    int vals[1001],n=0;
    while(scanf("%d",&vals[n])==1) n++;
    // write your solution
}`),
    },
    order: 1,
  });

  questions.push({
    title: 'Maximum Depth of Binary Tree',
    description: 'Given a binary tree in level-order, return its maximum depth (number of nodes along the longest root-to-leaf path).',
    difficulty: 'Easy', topic: t['Trees'],
    companies: ['Amazon', 'LinkedIn'],
    tags: ['tree', 'dfs', 'bfs'],
    inputFormat: 'Space-separated level-order values (-1 = null)',
    outputFormat: 'Integer depth',
    constraints: '0 ≤ nodes ≤ 10^4',
    sampleTestCases: [
      { input: '3 9 20 -1 -1 15 7', output: '3' },
      { input: '1 -1 2',            output: '2' },
    ],
    hiddenTestCases: [
      { input: '-1', output: '0' },
      { input: '1',  output: '1' },
    ],
    hints: ['max_depth(node) = 1 + max(max_depth(left), max_depth(right))'],
    starterCode: {
      python: py(`vals = list(map(int, input().split()))
# write your solution`),
      cpp: cpp(`#include<bits/stdc++.h>
using namespace std;
int main(){
    vector<int> vals;
    int x;
    while(cin>>x) vals.push_back(x);
    // write your solution
}`),
      c: c(`#include<stdio.h>
int main(){
    int vals[10001],n=0;
    while(scanf("%d",&vals[n])==1) n++;
    // write your solution
}`),
    },
    order: 2,
  });

  questions.push({
    title: 'Lowest Common Ancestor of a BST',
    description: `Given a BST (values as level-order, -1=null) and two values p and q, find their Lowest Common Ancestor and print its value.`,
    difficulty: 'Medium', topic: t['Trees'],
    companies: ['Amazon', 'Facebook', 'Microsoft'],
    tags: ['tree', 'bst', 'recursion'],
    inputFormat: 'Line 1: level-order tree values\nLine 2: p q',
    outputFormat: 'LCA value',
    constraints: '2 ≤ nodes ≤ 10^5\nAll values unique',
    sampleTestCases: [
      { input: '6 2 8 0 4 7 9 -1 -1 3 5\n2 8', output: '6' },
      { input: '6 2 8 0 4 7 9 -1 -1 3 5\n2 4', output: '2' },
    ],
    hiddenTestCases: [
      { input: '2 1 3\n1 3', output: '2' },
    ],
    hints: ['In BST: if both p and q < root, go left; if both > root, go right; else root is LCA.'],
    starterCode: {
      python: py(`vals = list(map(int, input().split()))
p, q = map(int, input().split())
# write your solution`),
      cpp: cpp(`#include<bits/stdc++.h>
using namespace std;
int main(){
    vector<int> vals;
    int x;
    string line; getline(cin,line);
    istringstream ss(line);
    while(ss>>x) vals.push_back(x);
    int p,q; cin>>p>>q;
    // write your solution
}`),
      c: c(`#include<stdio.h>
int main(){
    int vals[100001],n=0,p,q;
    // read values then p q
    // write your solution
}`),
    },
    order: 3,
  });

  // ════════════════════════════════════════════════════════════════
  //  11. DYNAMIC PROGRAMMING
  // ════════════════════════════════════════════════════════════════
  questions.push({
    title: 'Climbing Stairs',
    description: 'You can climb 1 or 2 steps at a time. How many distinct ways can you climb n stairs?',
    difficulty: 'Easy', topic: t['Dynamic Programming'],
    companies: ['Amazon', 'Apple', 'Google'],
    tags: ['dynamic-programming', 'math'],
    inputFormat: 'Single integer n',
    outputFormat: 'Number of distinct ways',
    constraints: '1 ≤ n ≤ 45',
    sampleTestCases: [
      { input: '2', output: '2', explanation: '1+1 or 2' },
      { input: '3', output: '3', explanation: '1+1+1, 1+2, 2+1' },
    ],
    hiddenTestCases: [
      { input: '1',  output: '1' },
      { input: '10', output: '89' },
      { input: '45', output: '1836311903' },
    ],
    hints: ['dp[i] = dp[i-1] + dp[i-2]. Same as Fibonacci!'],
    starterCode: {
      python: py(`n = int(input())
# write your solution`),
      cpp: cpp(`#include<bits/stdc++.h>
using namespace std;
int main(){
    int n; cin>>n;
    // write your solution
}`),
      c: c(`#include<stdio.h>
int main(){
    int n; scanf("%d",&n);
    // write your solution
}`),
    },
    order: 1,
  });

  questions.push({
    title: '0/1 Knapsack Problem',
    description: `Given n items with weights and values, and a knapsack of capacity W, find the maximum total value you can carry. Each item can be taken at most once.`,
    difficulty: 'Medium', topic: t['Dynamic Programming'],
    companies: ['Amazon', 'Adobe', 'Flipkart'],
    tags: ['dynamic-programming', 'knapsack'],
    inputFormat: 'Line 1: n W (items, capacity)\nLine 2: n weights\nLine 3: n values',
    outputFormat: 'Maximum value',
    constraints: '1 ≤ n ≤ 1000\n1 ≤ W ≤ 1000\n1 ≤ weight[i], value[i] ≤ 1000',
    sampleTestCases: [
      { input: '3 50\n10 20 30\n60 100 120', output: '220', explanation: 'Take items 2 and 3' },
      { input: '4 8\n2 3 4 5\n3 4 5 6',     output: '10' },
    ],
    hiddenTestCases: [
      { input: '1 0\n1\n1', output: '0' },
      { input: '2 3\n1 2\n2 3', output: '5' },
    ],
    hints: ['dp[i][w] = max value using first i items with capacity w.'],
    starterCode: {
      python: py(`n, W = map(int, input().split())
weights = list(map(int, input().split()))
values = list(map(int, input().split()))
# write your solution`),
      cpp: cpp(`#include<bits/stdc++.h>
using namespace std;
int main(){
    int n,W; cin>>n>>W;
    vector<int> w(n),v(n);
    for(auto &x:w) cin>>x;
    for(auto &x:v) cin>>x;
    // write your solution
}`),
      c: c(`#include<stdio.h>
int main(){
    int n,W; scanf("%d %d",&n,&W);
    int w[n],v[n];
    for(int i=0;i<n;i++) scanf("%d",&w[i]);
    for(int i=0;i<n;i++) scanf("%d",&v[i]);
    // write your solution
}`),
    },
    order: 2,
  });

  questions.push({
    title: 'Longest Common Subsequence',
    description: 'Given two strings s1 and s2, find the length of their longest common subsequence.',
    difficulty: 'Medium', topic: t['Dynamic Programming'],
    companies: ['Google', 'Amazon', 'Microsoft', 'Oracle'],
    tags: ['dynamic-programming', 'string'],
    inputFormat: 'Line 1: string s1\nLine 2: string s2',
    outputFormat: 'LCS length',
    constraints: '1 ≤ |s1|, |s2| ≤ 1000',
    sampleTestCases: [
      { input: 'abcde\nace', output: '3', explanation: '"ace"' },
      { input: 'abc\nabc',   output: '3' },
      { input: 'abc\ndef',   output: '0' },
    ],
    hiddenTestCases: [
      { input: 'AGGTAB\nGXTXAYB', output: '4' },
      { input: 'a\nb', output: '0' },
    ],
    hints: ['dp[i][j] = LCS length of s1[0..i-1] and s2[0..j-1].'],
    starterCode: {
      python: py(`s1 = input()
s2 = input()
# write your solution`),
      cpp: cpp(`#include<bits/stdc++.h>
using namespace std;
int main(){
    string s1,s2; cin>>s1>>s2;
    // write your solution
}`),
      c: c(`#include<stdio.h>
int main(){
    char s1[1001],s2[1001];
    scanf("%s%s",s1,s2);
    // write your solution
}`),
    },
    order: 3,
  });

  questions.push({
    title: 'Coin Change',
    description: 'Given an array of coin denominations and an amount, find the fewest number of coins needed to make up that amount. If impossible, print -1.',
    difficulty: 'Medium', topic: t['Dynamic Programming'],
    companies: ['Amazon', 'Google', 'Microsoft'],
    tags: ['dynamic-programming', 'bfs'],
    inputFormat: 'Line 1: n amount\nLine 2: n coin values',
    outputFormat: 'Minimum coins, or -1',
    constraints: '1 ≤ n ≤ 12\n1 ≤ coins[i] ≤ 2^31-1\n0 ≤ amount ≤ 10^4',
    sampleTestCases: [
      { input: '3 11\n1 5 6', output: '2', explanation: '6+5=11' },
      { input: '3 3\n2 5 10', output: '-1' },
    ],
    hiddenTestCases: [
      { input: '1 0\n1',   output: '0' },
      { input: '3 100\n1 5 25', output: '8' },
    ],
    hints: ['Bottom-up DP: dp[i] = min coins to make amount i.'],
    starterCode: {
      python: py(`n, amount = map(int, input().split())
coins = list(map(int, input().split()))
# write your solution`),
      cpp: cpp(`#include<bits/stdc++.h>
using namespace std;
int main(){
    int n,amount; cin>>n>>amount;
    vector<int> coins(n);
    for(auto &x:coins) cin>>x;
    // write your solution
}`),
      c: c(`#include<stdio.h>
int main(){
    int n,amount; scanf("%d %d",&n,&amount);
    int coins[n];
    for(int i=0;i<n;i++) scanf("%d",&coins[i]);
    // write your solution
}`),
    },
    order: 4,
  });

  questions.push({
    title: 'Edit Distance',
    description: 'Given two strings word1 and word2, return the minimum number of operations (insert, delete, replace) to convert word1 into word2.',
    difficulty: 'Hard', topic: t['Dynamic Programming'],
    companies: ['Google', 'Amazon', 'Microsoft', 'Dropbox'],
    tags: ['dynamic-programming', 'string'],
    inputFormat: 'Line 1: word1\nLine 2: word2',
    outputFormat: 'Edit distance integer',
    constraints: '0 ≤ |word1|, |word2| ≤ 500',
    sampleTestCases: [
      { input: 'horse\nros',       output: '3' },
      { input: 'intention\nexecution', output: '5' },
    ],
    hiddenTestCases: [
      { input: 'a\na', output: '0' },
      { input: 'a\nb', output: '1' },
      { input: '\nabc', output: '3' },
    ],
    hints: ['dp[i][j] = edit distance between word1[0..i-1] and word2[0..j-1].'],
    starterCode: {
      python: py(`word1 = input()
word2 = input()
# write your solution`),
      cpp: cpp(`#include<bits/stdc++.h>
using namespace std;
int main(){
    string a,b; cin>>a>>b;
    // write your solution
}`),
      c: c(`#include<stdio.h>
int main(){
    char a[501],b[501];
    scanf("%s%s",a,b);
    // write your solution
}`),
    },
    order: 5,
  });

  // ════════════════════════════════════════════════════════════════
  //  12. GRAPHS
  // ════════════════════════════════════════════════════════════════
  questions.push({
    title: 'Number of Islands',
    description: `Given an m×n binary grid where '1' is land and '0' is water, count the number of islands (groups of adjacent 1s, 4-directional).`,
    difficulty: 'Medium', topic: t['Graphs'],
    companies: ['Amazon', 'Google', 'Microsoft', 'Facebook'],
    tags: ['graph', 'bfs', 'dfs', 'union-find'],
    inputFormat: 'Line 1: m n\nNext m lines: n characters (0 or 1) space-separated',
    outputFormat: 'Number of islands',
    constraints: '1 ≤ m, n ≤ 300',
    sampleTestCases: [
      { input: '4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0', output: '1' },
      { input: '4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1', output: '3' },
    ],
    hiddenTestCases: [
      { input: '1 1\n1', output: '1' },
      { input: '1 1\n0', output: '0' },
    ],
    hints: ['For each unvisited land cell, run BFS/DFS to mark the whole island.'],
    starterCode: {
      python: py(`m, n = map(int, input().split())
grid = [list(map(int, input().split())) for _ in range(m)]
# write your solution`),
      cpp: cpp(`#include<bits/stdc++.h>
using namespace std;
int main(){
    int m,n; cin>>m>>n;
    vector<vector<int>> g(m,vector<int>(n));
    for(auto &row:g) for(auto &x:row) cin>>x;
    // write your solution
}`),
      c: c(`#include<stdio.h>
int main(){
    int m,n; scanf("%d %d",&m,&n);
    int g[300][300];
    for(int i=0;i<m;i++) for(int j=0;j<n;j++) scanf("%d",&g[i][j]);
    // write your solution
}`),
    },
    order: 1,
  });

  questions.push({
    title: 'Shortest Path in Unweighted Graph (BFS)',
    description: `Given an undirected unweighted graph with n vertices (0-indexed) and e edges, find the shortest path distance from source s to destination d. If unreachable, print -1.`,
    difficulty: 'Medium', topic: t['Graphs'],
    companies: ['Google', 'Amazon'],
    tags: ['graph', 'bfs', 'shortest-path'],
    inputFormat: 'Line 1: n e\nNext e lines: u v (edge)\nLast line: s d',
    outputFormat: 'Shortest distance, or -1',
    constraints: '1 ≤ n ≤ 10^4\n0 ≤ e ≤ 10^5',
    sampleTestCases: [
      { input: '6 7\n0 1\n0 2\n1 3\n1 4\n2 4\n3 5\n4 5\n0 5', output: '3' },
      { input: '4 2\n0 1\n2 3\n0 3', output: '-1' },
    ],
    hiddenTestCases: [
      { input: '2 1\n0 1\n0 1', output: '1' },
      { input: '3 2\n0 1\n1 2\n0 2', output: '2' },
    ],
    hints: ['BFS from source; level = distance.'],
    starterCode: {
      python: py(`n, e = map(int, input().split())
adj = [[] for _ in range(n)]
for _ in range(e):
    u, v = map(int, input().split())
    adj[u].append(v); adj[v].append(u)
s, d = map(int, input().split())
# write your solution`),
      cpp: cpp(`#include<bits/stdc++.h>
using namespace std;
int main(){
    int n,e; cin>>n>>e;
    vector<vector<int>> adj(n);
    for(int i=0;i<e;i++){
        int u,v; cin>>u>>v;
        adj[u].push_back(v); adj[v].push_back(u);
    }
    int s,d; cin>>s>>d;
    // write your solution
}`),
      c: c(`#include<stdio.h>
int main(){
    int n,e; scanf("%d %d",&n,&e);
    // build adjacency list then BFS
    // write your solution
}`),
    },
    order: 2,
  });

  questions.push({
    title: 'Detect Cycle in Directed Graph',
    description: `Given a directed graph with n vertices and e edges, determine if it contains a cycle. Print "YES" or "NO".`,
    difficulty: 'Hard', topic: t['Graphs'],
    companies: ['Amazon', 'Microsoft'],
    tags: ['graph', 'dfs', 'topological-sort'],
    inputFormat: 'Line 1: n e\nNext e lines: u v (directed edge u→v)',
    outputFormat: '"YES" or "NO"',
    constraints: '1 ≤ n ≤ 10^5\n0 ≤ e ≤ 10^5',
    sampleTestCases: [
      { input: '4 4\n0 1\n1 2\n2 3\n3 1', output: 'YES' },
      { input: '4 3\n0 1\n1 2\n2 3',      output: 'NO' },
    ],
    hiddenTestCases: [
      { input: '1 1\n0 0', output: 'YES' },
      { input: '2 1\n0 1', output: 'NO' },
    ],
    hints: ['DFS with 3-color marking: white(unvisited), gray(in-stack), black(done). Edge to gray node = cycle.'],
    starterCode: {
      python: py(`n, e = map(int, input().split())
adj = [[] for _ in range(n)]
for _ in range(e):
    u, v = map(int, input().split())
    adj[u].append(v)
# write your solution`),
      cpp: cpp(`#include<bits/stdc++.h>
using namespace std;
int main(){
    int n,e; cin>>n>>e;
    vector<vector<int>> adj(n);
    for(int i=0;i<e;i++){
        int u,v; cin>>u>>v;
        adj[u].push_back(v);
    }
    // write your solution
}`),
      c: c(`#include<stdio.h>
int main(){
    int n,e; scanf("%d %d",&n,&e);
    // write your solution
}`),
    },
    order: 3,
  });

  await Question.insertMany(questions);
  console.log(`✅ Created ${questions.length} questions across 12 topics`);

  // Summary
  console.log('\n📊 Summary:');
  for (const tp of topics) {
    const count = questions.filter(q => q.topic.toString() === tp._id.toString()).length;
    const easy   = questions.filter(q => q.topic.toString() === tp._id.toString() && q.difficulty === 'Easy').length;
    const medium = questions.filter(q => q.topic.toString() === tp._id.toString() && q.difficulty === 'Medium').length;
    const hard   = questions.filter(q => q.topic.toString() === tp._id.toString() && q.difficulty === 'Hard').length;
    console.log(`  ${tp.name.padEnd(23)} ${count} questions  [E:${easy} M:${medium} H:${hard}]`);
  }

  mongoose.connection.close();
  console.log('\n🎉 Seeding complete!');
};

seed().catch(err => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
