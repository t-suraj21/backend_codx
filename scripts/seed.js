import mongoose from "mongoose";
import Topic from "../models/Topic.js";
import Question from "../models/Question.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

mongoose
  .connect("mongodb://127.0.0.1:27017/coding_app")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Topic.deleteMany({});
    await Question.deleteMany({});
    await User.deleteMany({});

    console.log("🗑️  Cleared existing data");

    // Create Topics
    const pythonTopic = await Topic.create({
      name: "Python Basics",
      language: "python",
      description: "Learn fundamental Python programming concepts",
    });

    const dsTopic = await Topic.create({
      name: "Data Structures",
      language: "python",
      description: "Master arrays, linked lists, stacks, and queues",
    });

    const algoTopic = await Topic.create({
      name: "Algorithms",
      language: "python",
      description: "Practice sorting, searching, and dynamic programming",
    });

    console.log("✅ Topics created");

    // Create Questions
    await Question.create({
      title: "Two Sum",
      description:
        "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      topicId: pythonTopic._id,
      difficulty: "Easy",
      starterCode: {
        python: `def twoSum(nums, target):
    # Write your solution here
    pass

# Test
print(twoSum([2,7,11,15], 9))`,
        cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Write your solution here
}

int main() {
    vector<int> nums = {2,7,11,15};
    vector<int> result = twoSum(nums, 9);
    return 0;
}`,
        c: `#include <stdio.h>

void twoSum(int* nums, int size, int target) {
    // Write your solution here
}

int main() {
    int nums[] = {2,7,11,15};
    twoSum(nums, 4, 9);
    return 0;
}`,
      },
      testCases: [
        { input: "[2,7,11,15], 9", output: "[0,1]" },
        { input: "[3,2,4], 6", output: "[1,2]" },
        { input: "[3,3], 6", output: "[0,1]" },
      ],
    });

    await Question.create({
      title: "Reverse String",
      description:
        'Write a function that reverses a string. The input string is given as an array of characters s.',
      topicId: pythonTopic._id,
      difficulty: "Easy",
      starterCode: {
        python: `def reverseString(s):
    # Write your solution here
    pass

# Test
print(reverseString(["h","e","l","l","o"]))`,
        cpp: `#include <iostream>
#include <vector>
using namespace std;

void reverseString(vector<char>& s) {
    // Write your solution here
}

int main() {
    vector<char> s = {'h','e','l','l','o'};
    reverseString(s);
    return 0;
}`,
        c: `#include <stdio.h>

void reverseString(char* s, int size) {
    // Write your solution here
}

int main() {
    char s[] = {'h','e','l','l','o'};
    reverseString(s, 5);
    return 0;
}`,
      },
      testCases: [
        { input: '["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
        { input: '["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' },
      ],
    });

    await Question.create({
      title: "Valid Palindrome",
      description:
        "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
      topicId: algoTopic._id,
      difficulty: "Easy",
      starterCode: {
        python: `def isPalindrome(s):
    # Write your solution here
    pass

# Test
print(isPalindrome("A man, a plan, a canal: Panama"))`,
        cpp: `#include <iostream>
#include <string>
using namespace std;

bool isPalindrome(string s) {
    // Write your solution here
}

int main() {
    cout << isPalindrome("A man, a plan, a canal: Panama");
    return 0;
}`,
        c: `#include <stdio.h>
#include <stdbool.h>

bool isPalindrome(char* s) {
    // Write your solution here
}

int main() {
    printf("%d", isPalindrome("A man, a plan, a canal: Panama"));
    return 0;
}`,
      },
      testCases: [
        { input: '"A man, a plan, a canal: Panama"', output: "true" },
        { input: '"race a car"', output: "false" },
        { input: '" "', output: "true" },
      ],
    });

    await Question.create({
      title: "Maximum Subarray",
      description:
        "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
      topicId: dsTopic._id,
      difficulty: "Medium",
      starterCode: {
        python: `def maxSubArray(nums):
    # Write your solution here
    pass

# Test
print(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]))`,
        cpp: `#include <iostream>
#include <vector>
using namespace std;

int maxSubArray(vector<int>& nums) {
    // Write your solution here
}

int main() {
    vector<int> nums = {-2,1,-3,4,-1,2,1,-5,4};
    cout << maxSubArray(nums);
    return 0;
}`,
        c: `#include <stdio.h>

int maxSubArray(int* nums, int size) {
    // Write your solution here
}

int main() {
    int nums[] = {-2,1,-3,4,-1,2,1,-5,4};
    printf("%d", maxSubArray(nums, 9));
    return 0;
}`,
      },
      testCases: [
        { input: "[-2,1,-3,4,-1,2,1,-5,4]", output: "6" },
        { input: "[1]", output: "1" },
        { input: "[5,4,-1,7,8]", output: "23" },
      ],
    });

    console.log("✅ Questions created");

    // Create test users
    const hashedPassword = await bcrypt.hash("password123", 10);

    await User.create({
      name: "Alice Johnson",
      email: "alice@example.com",
      password: hashedPassword,
      points: 250,
      accuracy: 85,
    });

    await User.create({
      name: "Bob Smith",
      email: "bob@example.com",
      password: hashedPassword,
      points: 180,
      accuracy: 75,
    });

    await User.create({
      name: "Charlie Brown",
      email: "charlie@example.com",
      password: hashedPassword,
      points: 320,
      accuracy: 92,
    });

    console.log("✅ Users created");
    console.log("\n🎉 Database seeded successfully!");
    console.log("\n📝 Test credentials:");
    console.log("   Email: alice@example.com");
    console.log("   Password: password123\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
