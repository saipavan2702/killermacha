> [!summary]
> Binary search repeatedly removes half of an ordered search space and can find exact values, boundaries, or feasible answers in logarithmic time.

Map: [[Upskill/DSA/DSA|DSA]]

Related: [[Upskill/DSA/Data Structures/Tree|Tree]] · [[Upskill/DSA/Data Structures/Segment Tree|Segment Tree]]

A technique to search in log(n) time over n elements by eliminating half of unwanted possibilities each time. We will observe the variant applications using this algorithm.

## Exact Match
```cpp
class Solution {
    public:
     int findKey(int nums[], int key) {
        int n = nums.length;
        int low = 0;
        int high = n - 1;

        while (low <= high) {
            int mid = low + (high - low) / 2;

            if (key < nums[mid])
                high = mid-1;
            else if (key > nums[mid])
                low = mid + 1;
            else if(nums[mid]==key)
	            return mid;
        }
        return -1;
    }
}
```

## First Occurrence
```cpp
class Solution {
    public:
     int findFirstOcc(int nums[], int key) {
        int n = nums.length;
        int low = 0;
        int high = n - 1;
        int ans=-1;

        while (low <= high) {
            int mid = low + (high - low + 1) / 2;

            if (nums[mid] > key)
                high = mid-1;
            else if (nums[mid] < key)
                low = mid + 1;
            else if(nums[mid]==key){
	            ans=mid;
	            high=mid-1;
            }
        }
        return ans;
    }
}
```

## Last Occurrence
```cpp
class Solution {
    public:
     int findLastOcc(int nums[], int key) {
        int n = nums.length;
        int low = 0;
        int high = n - 1;
        int ans=-1;

        while (low <= high) {
            int mid = low + (high - low + 1) / 2;

            if (nums[mid] > key)
                high = mid-1;
            else if (nums[mid] < key)
                low = mid + 1;
            else if(nums[mid]==key){
	            ans=mid;
	            low=mid+1;
            }
        }
        return ans;
    }
}
```

## First Greater Element
```cpp
class Solution {
    public:
     int findFirstGreatOcc(int nums[], int key) {
        int n = nums.length;
        int low = 0;
        int high = n - 1;
        int ans=-1;

        while (low <= high) {
            int mid = low + (high - low + 1) / 2;

            if (nums[mid] > key)
                ans=mid,high = mid-1;
            else if (nums[mid] < key)
                low = mid + 1;
            else if(nums[mid]==key)
	            low=mid+1;
        }
        return ans;
    }
}
```

## Last Smaller Element
```cpp
class Solution {
    public:
     int findFirstGreatOcc(int nums[], int key) {
        int n = nums.length;
        int low = 0;
        int high = n - 1;
        int ans=-1;

        while (low <= high) {
            int mid = low + (high - low + 1) / 2;

            if (nums[mid] > key)
                high = mid-1;
            else if (nums[mid] < key)
                ans=mid,low = mid + 1;
            else if(nums[mid]==key)
	            high=mid-1;
        }
        return ans;
    }
}
```



## Practice
[Maximum value at a given index](https://leetcode.com/problems/maximum-value-at-a-given-index-in-a-bounded-array/)

#dsa #binary-search
