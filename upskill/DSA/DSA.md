[[Binary search]] is not just a usual finding element it can be used to find 5 different types of occurrences or positions.

[[Sliding window]] is used to obtain results from a subarray or part of data structure.


### Hashing
[Longest Subsequence having min and max diff k](https://www.geeksforgeeks.org/longest-subsequence-having-difference-between-the-maximum-and-minimum-element-equal-to-k/)

### CP & General
-  Bit Manipulation
	[*Maximum Length of a Concatenated String with Unique Characters*](https://leetcode.com/problems/maximum-length-of-a-concatenated-string-with-unique-characters/)  
	[*Concatenation of Consecutive Binary Numbers*](https://leetcode.com/problems/concatenation-of-consecutive-binary-numbers/)  
	[*Minimize XOR*](https://leetcode.com/problems/minimize-xor/)  
-  Matrix
	[*Score After Flipping Matrix*](https://leetcode.com/problems/score-after-flipping-matrix/)
-  CP
	[*Sorted Permutation Rank*](https://www.interviewbit.com/problems/sorted-permutation-rank/)

### Stacks & Queues
[Nearest smaller values](https://cses.fi/problemset/task/1645/)
[Advertisement](https://cses.fi/problemset/task/1142/) <!---lookOut--->
[Stock Span](https://practice.geeksforgeeks.org/problems/stock-span-problem-1587115621/1#)
[Sum of Subarray Minimums](https://leetcode.com/problems/sum-of-subarray-minimums/description/)


#### Notes

priority_queue struct usage for 2nd element
```cpp
struct Compare{
	bool operator()(const pair<int,int>&a, const pair<int,int>&b){
		if(a.first==b.first){
			return a.second<b.second;
		}
		return a.first<b.first;
	}
};

int main(){
	priority_queue<pair<int,int>, vector<pair<int,int>>, Compare>pq;

	auto cmp=[](const pair<int,int>&a, const pair<int,int>&b){
		if(a.first==b.first){
			return a.second<b.second;
		}
		return a.first<b.first;
	};
	priority_queue<pair<int,int>, vector<pair<int,int>>,
	decltype(cmp)>pq(cmp);	
}