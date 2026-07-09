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
```

---

## References

> [!info] Source trail
> DSA maps, practice sets, snippets, and general study links that belong near the main DSA note.

### Roadmaps / Sheets

- [Striver A2Z DSA Sheet](https://takeuforward.org/dsa/strivers-a2z-sheet-learn-dsa-a-to-z)
- [Leetcode Patterns](https://seanprashad.com/leetcode-patterns/)
- [USACO Guide](https://usaco.guide/)
- [CSES Problem Set](https://cses.fi/problemset/)
- [CP Algorithms](https://cp-algorithms.com/index.html)
- [Lets Code Roadmap](https://www.lets-code.co.in/articles/roadmap/)
- [Coding Platform](https://coding-platform-uyo1.vercel.app/home)

### Practice / CP

- [Codeforces blog 57319](https://codeforces.com/blog/entry/57319)
- [Codeforces blog 18051](https://codeforces.com/blog/entry/18051)
- [Codeforces blog 18169](https://codeforces.com/blog/entry/18169)
- [Codeforces blog 81516](https://codeforces.com/blog/entry/81516)
- [Trie Practice](https://www.hackerearth.com/practice/data-structures/advanced-data-structures/trie-keyword-tree/practice-problems/)
- [Pseudo-Palindromic Paths](https://leetcode.com/problems/pseudo-palindromic-paths-in-a-binary-tree/)
- [A Code Daily](https://acodedaily.com/)
- [Ashhad's list](https://ashhad.in/list/)

### Collections / Snippets

- [DSA Bootcamp Java](https://github.com/kunal-kushwaha/DSA-Bootcamp-Java)
- [CP Notes](https://github.com/yash7xm/cp_notes)
- [Competitive Programming](https://github.com/Prakash-sa/Competitive-Programming)
- [The Algorithms](https://github.com/thealgorithms)
- [Daily Coding Problem Solutions](https://github.com/ruppysuppy/Daily-Coding-Problem-Solutions)
- [Pastebin snippet 1](https://pastebin.com/wabDfjKi)
- [Pastebin snippet 2](https://pastebin.com/bEEQsDr7)
- [Pastebin snippet 3](https://pastebin.com/UJhuFA3a)
- [Pastebin snippet 4](https://pastebin.com/jDMC5R2T)

### Mixed

- [DSA Google Doc](https://docs.google.com/document/d/181iDfp5IjOikFSL7bHNNaq-n99Rld9mJ-c-asKf4Bks/edit?pli=1&tab=t.0#heading=h.5ym0riqyzk)
- [Self Teaching Java Spring](https://www.notion.so/SELF-TEACHING-JAVA-SPRING-26f82d2afbac807f8edeed9b17f9b6b3#26f82d2afbac8097a98cfdc0d83763aa)
