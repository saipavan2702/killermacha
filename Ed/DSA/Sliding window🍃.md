It's standard template involves two pointers which dictate the length/behavior of window/subarray we chose. 

```cpp
int function(){
	int i=0,j=0,ans=0;
	
	for (;j<N;++j) {
	    for (;invalid();++i) {}
	    ans=max(ans, j-i+1); 
	}
	return ans;
}
```

```cpp
//https://leetcode.com/problems/longest-substring-without-repeating-characters/

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        int i = 0, j = 0, N = s.size(), ans = 0, cnt[128] = {};
        for (; j < N; ++j) {
            cnt[s[j]]++;
            while (cnt[s[j]] > 1) cnt[s[i++]]--;
            ans = max(ans, j - i + 1);
        }
        return ans;
    }
};
```



