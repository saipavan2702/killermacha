A technique to search in log(n) time over n elements by eliminating half of unwanted possibilities each time. We will observe the variant applications using this algorithm.

## Basic contains version
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

## First occurrence of key
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

## Last occurrence of key
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

## FirstOcc greater element 
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

## LastOcc least element
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



# Hands-on📜
[Maximum value at a given index](https://leetcode.com/problems/maximum-value-at-a-given-index-in-a-bounded-array/)



 